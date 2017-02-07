var CONST = require('../../const');
var DrawImage = require('./utils/DrawImage');
var BlitImage = require('./utils/BlitImage');
var GetBlendModes = require('./utils/GetBlendModes');
var GetContext = require('../../canvas/GetContext');

var CanvasRenderer = function (game)
{
    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    //  Needed?
    this.type = CONST.CANVAS;

    this.drawCount = 0;

    //  Read all the following from game config (or State config?)
    // this.clearBeforeRender = true;
    // this.transparent = false;
    // this.autoResize = false;
    // this.smoothProperty = Phaser.Canvas.getSmoothingPrefix(this.context);
    // this.roundPixels = false;

    this.width = game.config.width * game.config.resolution;
    this.height = game.config.height * game.config.resolution;
    this.resolution = game.config.resolution;

    this.gameCanvas = game.canvas;

    /**
     * The canvas 2d context that everything is drawn with
     * @property context
     * @type CanvasRenderingContext2D
     */
    this.gameContext = GetContext(this.gameCanvas);

    this.gameConfig = game.config;

    this.currentContext = this.gameContext;

    //  Map to the required function
    this.drawImage = DrawImage;
    this.blitImage = BlitImage;

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

        this.gameCanvas.width = this.width;
        this.gameCanvas.height = this.height;

        if (this.autoResize)
        {
            this.gameCanvas.style.width = (this.width / res) + 'px';
            this.gameCanvas.style.height = (this.height / res) + 'px';
        }

        // if (this.smoothProperty)
        // {
        //     this.gameContext[this.smoothProperty] = (this.scaleMode === ScaleModes.LINEAR);
        // }
    },

    resetTransform: function ()
    {
        this.currentContext.setTransform(1, 0, 0, 1, 0, 0);
    },

    setBlendMode: function (blendMode)
    {
        if (this.currentBlendMode !== blendMode)
        {
            this.currentContext.globalCompositeOperation = blendMode;
            this.currentBlendMode = blendMode;
        }
    },

    setAlpha: function (alpha)
    {
        if (this.currentAlpha !== alpha)
        {
            this.currentContext.globalAlpha = alpha;
            this.currentAlpha = alpha;
        }
    },

    //  Call at the start of the render loop
    preRender: function ()
    {
        // console.log('%c render start ', 'color: #ffffff; background: #00ff00;');

        var ctx = this.gameContext;
        var config = this.gameConfig;

        if (config.clearBeforeRender)
        {
            ctx.clearRect(0, 0, this.width, this.height);
        }

        if (!config.transparent)
        {
            ctx.fillStyle = config.backgroundColor;
            ctx.fillRect(0, 0, this.width, this.height);
        }

        //  Add Pre-render hook

        this.drawCount = 0;
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
    render: function (state, list, interpolationPercentage, camera)
    {
        if (window.d === 1)
        {
            console.log('render', state.sys.settings.key);
        }

        var w = state.sys.width;
        var h = state.sys.height;
        var ctx = state.sys.context;
        var settings = state.sys.settings;
        var scissor = (camera.x !== 0 || camera.y !== 0 || camera.width !== ctx.canvas.width || camera.height !== ctx.canvas.height);
        this.currentContext = ctx;

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        //  If the alpha or blend mode didn't change since the last render, then don't set them again (saves 2 ops)

        if (scissor)
        {
            if (window.d === 1)
            {
                console.log('scissor');
            }

            ctx.beginPath();
            ctx.rect(camera.x, camera.y, camera.width, camera.height);
            ctx.clip();
            ctx.closePath();
        }

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

        if (settings.renderToTexture)
        {
            if (window.d === 1)
            {
                console.log('renderToTexture');
            }

            if (settings.clearBeforeRender)
            {
                ctx.clearRect(0, 0, w, h);
            }

            if (settings.backgroundColor)
            {
                ctx.fillStyle = settings.backgroundColor;
                ctx.fillRect(0, 0, w, h);
            }
        }

        this.drawCount += list.length;

        for (var c = 0; c < list.length; c++)
        {
            var child = list[c].gameObject;

            if (window.d === 1)
            {
                console.log('render child', state.sys.settings.key, child.frame.cutWidth);
            }

            child.renderCanvas(this, child, interpolationPercentage);
        }

        //  Reset the transform so going into the devs render function the context is ready for use
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        //  Call the State.render function
        state.render.call(state, ctx, interpolationPercentage);

        //  Blast it to the Game Canvas (if needed)
        if (settings.renderToTexture)
        {
            this.gameContext.drawImage(state.sys.canvas, 0, 0, w, h, settings.x, settings.y, w, h);
        }

        if (window.d === 1)
        {
            console.log('render end', state.sys.settings.key);
        }
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
     * @param [removegameCanvas=true] {boolean} Removes the Canvas element from the DOM.
     */
    destroy: function ()
    {
        //  CanvasPool

        this.gameCanvas = null;
        this.gameContext = null;
    }

};

module.exports = CanvasRenderer;
