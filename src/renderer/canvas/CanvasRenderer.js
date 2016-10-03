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

        this.applyMask(maskData);

        this.context.clip();

        maskData.worldAlpha = cacheAlpha;

    },

    /*
     * Renders a graphics mask
     *
     * @static
     * @private
     * @method renderGraphicsMask
     * @param graphics {Graphics} the graphics which will be used as a mask
     * @param context {CanvasRenderingContext2D} the context 2d method of the canvas
     */
    applyMask: function (graphics)
    {
        var len = graphics.graphicsData.length;

        if (len === 0)
        {
            return;
        }

        var context = this.context;

        context.beginPath();

        for (var i = 0; i < len; i++)
        {
            var data = graphics.graphicsData[i];
            var shape = data.shape;

            switch (data.type)
            {
                case Phaser.RECTANGLE:

                    context.rect(shape.x, shape.y, shape.width, shape.height);
                    context.closePath();
                    break;

                case Phaser.CIRCLE:

                    context.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
                    context.closePath();
                    break;

                case Phaser.POLYGON:

                    var points = shape.points;
                
                    context.moveTo(points[0], points[1]);

                    for (var j = 1; j < points.length / 2; j++)
                    {
                        context.lineTo(points[j * 2], points[j * 2 + 1]);
                    }

                    //  If the first and last point are the same close the path - much neater :)
                    if (points[0] === points[points.length - 2] && points[1] === points[points.length - 1])
                    {
                        context.closePath();
                    }

                    break;

                case Phaser.ELLIPSE:

                    // ellipse code taken from: http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas

                    var w = shape.width * 2;
                    var h = shape.height * 2;
                    var x = shape.x - (w / 2);
                    var y = shape.y - (h / 2);

                    var kappa = 0.5522848;
                    var ox = (w / 2) * kappa;   // control point offset horizontal
                    var oy = (h / 2) * kappa;   // control point offset vertical
                    var xe = x + w;             // x-end
                    var ye = y + h;             // y-end
                    var xm = x + (w / 2);       // x-middle
                    var ym = y + (h / 2);       // y-middle

                    context.moveTo(x, ym);
                    context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
                    context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
                    context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
                    context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
                    context.closePath();

                    break;

                case Phaser.ROUNDEDRECTANGLE:

                    var rx = shape.x;
                    var ry = shape.y;
                    var width = shape.width;
                    var height = shape.height;
                    var radius = shape.radius;

                    var maxRadius = Math.min(width, height) / 2 | 0;
                    radius = radius > maxRadius ? maxRadius : radius;

                    context.moveTo(rx, ry + radius);
                    context.lineTo(rx, ry + height - radius);
                    context.quadraticCurveTo(rx, ry + height, rx + radius, ry + height);
                    context.lineTo(rx + width - radius, ry + height);
                    context.quadraticCurveTo(rx + width, ry + height, rx + width, ry + height - radius);
                    context.lineTo(rx + width, ry + radius);
                    context.quadraticCurveTo(rx + width, ry, rx + width - radius, ry);
                    context.lineTo(rx + radius, ry);
                    context.quadraticCurveTo(rx, ry, rx, ry + radius);
                    context.closePath();

                    break;
            }

        }

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

