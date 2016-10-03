/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Camera is your view into the game world. It has a position and size and renders only those objects within its field of view.
* The game automatically creates a single Stage sized camera on boot. Move the camera around the world with Phaser.Camera.x/y
*
* @class Phaser.Camera
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
*/
Phaser.Renderer.Canvas = function (game)
{
    console.log('CanvasRenderer Alive');

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    this.type = Phaser.CANVAS;

    // this.resolution = game.resolution;

    /**
     * This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
     * If the Stage is NOT transparent Pixi will use a canvas sized fillRect operation every frame to set the canvas background color.
     * If the Stage is transparent Pixi will use clearRect to clear the canvas every frame.
     * Disable this by setting this to false. For example if your game has a canvas filling background image you often don't need this set.
     *
     * @property clearBeforeRender
     * @type Boolean
     * @default
     */
    this.clearBeforeRender = game.clearBeforeRender;

    /**
     * Whether the render view is transparent
     *
     * @property transparent
     * @type Boolean
     */
    this.transparent = game.transparent;

    /**
     * Whether the render view should be resized automatically
     *
     * @property autoResize
     * @type Boolean
     */
    this.autoResize = false;

    /**
     * The width of the canvas view
     *
     * @property width
     * @type Number
     * @default 800
     */
    this.width = game.width * game.resolution;

    /**
     * The height of the canvas view
     *
     * @property height
     * @type Number
     * @default 600
     */
    this.height = game.height * game.resolution;

    /**
     * The canvas element that everything is drawn to.
     *
     * @property view
     * @type HTMLCanvasElement
     */
    this.view = game.canvas;

    /**
     * The canvas 2d context that everything is drawn with
     * @property context
     * @type CanvasRenderingContext2D
     */
    this.context = this.view.getContext('2d', {
        alpha: this.transparent
    });

    this.smoothProperty = Phaser.Canvas.getSmoothingPrefix(this.context);

    this.roundPixels = false;

    var so = 'source-over';

    this.blendModes = [ so, 'lighter', so, so, so, so, so, so, so, so, so, so, so, so, so, so, so ];

    this.currentBlendMode = 0;
    this.currentScaleMode = 0;

    if (this.game.device.canUseMultiply)
    {
        this.mapBlendModes();
    }

    this.resize(this.width, this.height);

    // this.renderTypes = [];
    // this.renderTypes[Phaser.GROUP] = Phaser.Renderer.Canvas.GameObjects.Container;
    // this.renderTypes[Phaser.SPRITE] = Phaser.Renderer.Canvas.GameObjects.Sprite;

};

Phaser.Renderer.Canvas.GameObjects = {
    //  Populated by the GameObjects classes
};

Phaser.Renderer.Canvas.prototype.constructor = Phaser.Renderer.Canvas;

Phaser.Renderer.Canvas.prototype = {

    /**
     * Maps Blend modes to Canvas blend modes.
     *
     * @method mapBlendModes
     * @private
     */
    mapBlendModes: function ()
    {
        var modes = Phaser.blendModes;

        this.blendModes[modes.MULTIPLY] = 'multiply';
        this.blendModes[modes.SCREEN] = 'screen';
        this.blendModes[modes.OVERLAY] = 'overlay';
        this.blendModes[modes.DARKEN] = 'darken';
        this.blendModes[modes.LIGHTEN] = 'lighten';
        this.blendModes[modes.COLOR_DODGE] = 'color-dodge';
        this.blendModes[modes.COLOR_BURN] = 'color-burn';
        this.blendModes[modes.HARD_LIGHT] = 'hard-light';
        this.blendModes[modes.SOFT_LIGHT] = 'soft-light';
        this.blendModes[modes.DIFFERENCE] = 'difference';
        this.blendModes[modes.EXCLUSION] = 'exclusion';
        this.blendModes[modes.HUE] = 'hue';
        this.blendModes[modes.SATURATION] = 'saturation';
        this.blendModes[modes.COLOR] = 'color';
        this.blendModes[modes.LUMINOSITY] = 'luminosity';

    },

    resize: function (width, height)
    {
        this.width = width * this.game.resolution;
        this.height = height * this.game.resolution;

        this.view.width = this.width;
        this.view.height = this.height;

        if (this.autoResize)
        {
            this.view.style.width = (this.width / this.game.resolution) + 'px';
            this.view.style.height = (this.height / this.game.resolution) + 'px';
        }

        if (this.smoothProperty)
        {
            this.context[this.smoothProperty] = (this.scaleMode === Phaser.scaleModes.LINEAR);
        }

    },

    /**
     * Renders the Phaser.Stage to the canvas view, then iterates through its children.
     *
     * @method render
     * @param stage {Phaser.Stage}
     */
    render: function (stage)
    {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.globalAlpha = 1;
        this.context.globalCompositeOperation = 'source-over';

        this.currentBlendMode = 0;
        this.currentScaleMode = 0;

        //  Add Pre-render hook

        // this.renderSession.currentBlendMode = 0;
        // this.renderSession.shakeX = this.game.camera._shake.x;
        // this.renderSession.shakeY = this.game.camera._shake.y;

        //  Is this needed any longer?
        /*
        if (navigator.isCocoonJS && this.view.screencanvas)
        {
            this.context.fillStyle = "black";
            this.context.clear();
        }
        */
        
        if (this.clearBeforeRender)
        {
            if (this.transparent)
            {
                this.context.clearRect(0, 0, this.width, this.height);
            }
            else if (stage._bgColor)
            {
                this.context.fillStyle = stage._bgColor.rgba;
                this.context.fillRect(0, 0, this.width , this.height);
            }
        }

        stage.render(this, stage);

        //  Add Post-render hook

    },

    /**
     * This method adds it to the current stack of masks.
     *
     * @method pushMask
     * @param maskData {Object} the maskData that will be pushed
     * @param renderSession {Object} The renderSession whose context will be used for this mask manager.
     */
    pushMask: function (maskData)
    {
        this.context.save();
        
        var cacheAlpha = maskData.alpha;
        var transform = maskData.worldTransform;

        var resolution = this.game.resolution;

        this.context.setTransform(
            transform.a * resolution,
            transform.b * resolution,
            transform.c * resolution,
            transform.d * resolution,
            transform.tx * resolution,
            transform.ty * resolution
        );

        // PIXI.CanvasGraphics.renderGraphicsMask(maskData, context);

        this.context.clip();

        maskData.worldAlpha = cacheAlpha;

    },

    popMask: function ()
    {
        this.context.restore();
    },

    /**
     * Removes everything from the renderer and optionally removes the Canvas DOM element.
     *
     * @method destroy
     * @param [removeView=true] {boolean} Removes the Canvas element from the DOM.
     */
    destroy: function ()
    {
        //  CanvasPool

        this.view = null;
        this.context = null;
        this.maskManager = null;

    }

};

