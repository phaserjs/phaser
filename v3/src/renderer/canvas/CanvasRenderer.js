var CONST = require('../../const');
var DrawImage = require('./utils/DrawImage');
var GetBlendModes = require('./utils/GetBlendModes');

var CanvasRenderer = function (game)
{
    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    //  Needed?
    this.game = game;

    //  Needed?
    this.type = CONST.CANVAS;

    //  Read all the following from game config (or State config?)
    this.clearBeforeRender = true;

    this.transparent = false;

    this.autoResize = false;

    this.drawCount = 0;

    // this.smoothProperty = Phaser.Canvas.getSmoothingPrefix(this.context);

    this.roundPixels = false;

    this.width = game.config.width * game.config.resolution;

    this.height = game.config.height * game.config.resolution;

    this.resolution = game.config.resolution;

    this.view = game.canvas;

    /**
     * The canvas 2d context that everything is drawn with
     * @property context
     * @type CanvasRenderingContext2D
     */
    this.context = this.view.getContext('2d', { alpha: true });

    //  Map to the required function
    this.drawImage = DrawImage;

    this.blendModes = GetBlendModes();

    this.currentAlpha = 1;
    this.currentBlendMode = 0;
    this.currentScaleMode = 0;

    // this.tintMethod = this.tintWithPerPixel;

    this.init();
};

CanvasRenderer.prototype.constructor = CanvasRenderer;

CanvasRenderer.prototype = {

    init: function ()
    {
        this.resize(this.width, this.height);
    },

    resize: function (width, height)
    {
        var res = this.game.config.resolution;

        this.width = width * res;
        this.height = height * res;

        this.view.width = this.width;
        this.view.height = this.height;

        if (this.autoResize)
        {
            this.view.style.width = (this.width / res) + 'px';
            this.view.style.height = (this.height / res) + 'px';
        }

        // if (this.smoothProperty)
        // {
        //     this.context[this.smoothProperty] = (this.scaleMode === ScaleModes.LINEAR);
        // }
    },

    //  Call at the start of the render loop
    preRender: function ()
    {
        // console.log('%c render start ', 'color: #ffffff; background: #00ff00;');

        //  Add Pre-render hook

        this.drawCount = 0;

        var ctx = this.context;

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        //  If the alpha or blend mode didn't change since the last render, then don't set them again (saves 2 ops)

        if (this.currentAlpha !== 1)
        {
            ctx.globalAlpha = 1;
            this.currentAlpha = 1;
        }

        if (this.currentBlendMode !== 0)
        {
            ctx.globalCompositeOperation = 'source-over';
            this.currentBlendMode = 0;
        }

        this.currentScaleMode = 0;

        if (this.clearBeforeRender)
        {
            ctx.clearRect(0, 0, this.width, this.height);
        }

        //  TEMP
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, this.width, this.height);
    },

    /**
     * Renders the State.
     *
     * @method render
     * @param {Phaser.State} state - The State to be rendered.
     * @param {number} interpolationPercentage - The cumulative amount of time that hasn't been simulated yet, divided
     *   by the amount of time that will be simulated the next time update()
     *   runs. Useful for interpolating frames.
     */
    render: function (state, list, interpolationPercentage)
    {
        this.drawCount = list.length;

        // console.log(this.drawCount);

        for (var c = 0; c < list.length; c++)
        {
            var child = list[c].gameObject;

            child.renderCanvas(this, child, interpolationPercentage);
        }

        //  Reset the transform so going into the devs render function the context is ready for use
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    },

    postRender: function ()
    {
        // console.log('%c render end ', 'color: #ffffff; background: #ff0000;');

        //  Add Post-render hook
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
    }

};

module.exports = CanvasRenderer;
