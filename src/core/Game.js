/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/


Phaser.Game = function (width, height, renderType, parent, stateConfig)
{
    this.width = width;
    this.height = height;
    this.resolution = 1;

    this.renderType = renderType;
    this.renderer = null;
    this.canvas = null;
    this.context = null;

    /**
    * @property {string|HTMLElement} parent - The Games DOM parent.
    * @default
    */
    this.parent = parent;

    this.isBooted = false;
    this.isRunning = false;

    /**
    * @property {Phaser.RequestAnimationFrame} raf - Automatically handles the core game loop via requestAnimationFrame or setTimeout
    * @protected
    */
    this.raf = null;

    /**
    * @property {Phaser.TextureManager} textures - Reference to the Phaser Texture Manager.
    */
    this.textures = null;

    /**
    * @property {Phaser.UpdateManager} updates - Reference to the Phaser Update Manager.
    */
    this.updates = null;

    /**
    * @property {Phaser.Cache} cache - Reference to the assets cache.
    */
    this.cache = null;

    /**
    * @property {Phaser.Input} input - Reference to the input manager
    */
    this.input = null;

    /**
    * @property {Phaser.StateManager} state - The StateManager.
    */
    this.state = new Phaser.StateManager(this, stateConfig);

    /**
    * @property {Phaser.Device} device - Contains device information and capabilities.
    */
    this.device = Phaser.Device;

    this.rnd = new Phaser.RandomDataGenerator([ (Date.now() * Math.random()).toString() ]);

    this.device.whenReady(this.boot, this);

};

Phaser.Game.prototype.constructor = Phaser.Game;

Phaser.Game.prototype = {

    boot: function ()
    {
        if (this.isBooted)
        {
            return;
        }

        //  Inject any new Factory helpers that exist in the build
        for (var gameobject in Phaser.GameObject)
        {
            if (Phaser.GameObject[gameobject].hasOwnProperty('FACTORY_KEY'))
            {
                var key = Phaser.GameObject[gameobject]['FACTORY_KEY'];

                Phaser.GameObject.Factory.prototype[key] = Phaser.GameObject[gameobject]['FACTORY_ADD'];
            }
        }

        this.isBooted = true;

        this.setUpRenderer();
        this.showDebugHeader();

        //  Global
        // this.scale = new Phaser.ScaleManager(this, this.width, this.height);

        this.scale = { offset: { x: 0, y: 0 } };
        this.time = { time: function () { return Date.now(); } };

        this.textures = new Phaser.TextureManager(this);
        this.cache = new Phaser.Cache(this);
        this.input = new Phaser.Input(this);

        this.input.boot();

        this.state.boot();

        this.isRunning = true;

        this.rafHandle = window.requestAnimationFrame(this.step.bind(this));
    },

    //  timestamp = DOMHighResTimeStamp
    step: function (timestamp)
    {
        this.input.update();

        this.state.step(timestamp);

        this.rafHandle = window.requestAnimationFrame(this.step.bind(this));
    },

    /**
    * Displays a Phaser version debug header in the console.
    *
    * @method Phaser.Game#showDebugHeader
    * @protected
    */
    showDebugHeader: function ()
    {
        if (Phaser.hideBanner)
        {
            return;
        }

        var c = (this.renderType === Phaser.CANVAS) ? 'Canvas' : 'WebGL';

        if (!this.device.ie)
        {
            var args = [
                '%c %c %c %c %c Phaser v' + Phaser.VERSION + ' / ' + c + '  %c http://phaser.io',
                'background: #ff0000',
                'background: #ffff00',
                'background: #00ff00',
                'background: #00ffff',
                'color: #ffffff; background: #000;',
                'background: #fff'
            ];

            console.log.apply(console, args);
        }
        else if (window['console'])
        {
            console.log('Phaser v' + Phaser.VERSION + ' / http://phaser.io');
        }

    },

    /**
    * Checks if the device is capable of using the requested renderer and sets it up or an alternative if not.
    *
    * @method Phaser.Game#setUpRenderer
    * @protected
    */
    setUpRenderer: function ()
    {
        // if (this.config['canvas'])
        // {
        //     this.canvas = this.config['canvas'];
        // }
        // else
        // {
            this.canvas = Phaser.Canvas.create(this, this.width, this.height, '', true);
        // }

        // if (this.config['canvasStyle'])
        // {
        //     this.canvas.style = this.config['canvasStyle'];
        // }
        // else
        // {
        //     this.canvas.style['-webkit-full-screen'] = 'width: 100%; height: 100%';
        // }

        if (this.renderType === Phaser.HEADLESS || this.renderType === Phaser.CANVAS || (this.renderType === Phaser.AUTO && !this.device.webGL))
        {
            if (this.device.canvas)
            {
                //  They requested Canvas and their browser supports it
                this.renderType = Phaser.CANVAS;

                this.renderer = new Phaser.Renderer.Canvas(this);

                this.context = this.renderer.context;
            }
            else
            {
                throw new Error('Phaser.Game - Cannot create Canvas or WebGL context, aborting.');
            }
        }
        else
        {
            //  They requested WebGL and their browser supports it

            this.renderType = Phaser.WEBGL;

            this.renderer = new Phaser.Renderer.WebGL(this);

            this.context = null;

            //  Move to renderer class
            // this.canvas.addEventListener('webglcontextlost', this.contextLost.bind(this), false);
            // this.canvas.addEventListener('webglcontextrestored', this.contextRestored.bind(this), false);
        }

        if (this.renderType !== Phaser.HEADLESS)
        {
            Phaser.Canvas.addToDOM(this.canvas, this.parent, false);
            Phaser.Canvas.setTouchAction(this.canvas);
        }

    }

};
