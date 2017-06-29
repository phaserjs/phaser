var Camera = require('../../camera/Camera');
var KeyControl = require('../../camera/KeyControl');
var SmoothedKeyControl = require('../../camera/SmoothedKeyControl');
var GetFastValue = require('../../utils/object/GetFastValue');

var CameraManager = function (state)
{
    this.state = state;

    this.cameras = [];
    this.cameraPool = [];

    if (state.sys.settings.cameras)
    {
        //  We have cameras to create
        this.fromJSON(state.sys.settings.cameras);
    }
    else
    {
        //  Make one
        this.add();
    }

    //  Set the default camera
    this.main = this.cameras[0];
};

CameraManager.prototype.constructor = CameraManager;

CameraManager.prototype = {

    /*
    {
        cameras: [
            {
                name: string
                x: int
                y: int
                width: int
                height: int
                zoom: float
                rotation: float
                roundPixels: bool
                scrollX: float
                scrollY: float
                backgroundColor: string
                bounds: {
                    x: int
                    y: int
                    width: int
                    height: int
                }
            }
        ]
    }
    */
    fromJSON: function (config)
    {
        if (!Array.isArray(config))
        {
            config = [ config ];
        }

        var gameWidth = this.state.sys.game.config.width;
        var gameHeight = this.state.sys.game.config.height;

        for (var i = 0; i < config.length; i++)
        {
            var cameraConfig = config[i];

            var x = GetFastValue(cameraConfig, 'x', 0);
            var y = GetFastValue(cameraConfig, 'y', 0);
            var width = GetFastValue(cameraConfig, 'width', gameWidth);
            var height = GetFastValue(cameraConfig, 'height', gameHeight);

            var camera = this.add(x, y, width, height);

            //  Direct properties
            camera.name = GetFastValue(cameraConfig, 'name', '');
            camera.zoom = GetFastValue(cameraConfig, 'zoom', 1);
            camera.rotation = GetFastValue(cameraConfig, 'rotation', 0);
            camera.scrollX = GetFastValue(cameraConfig, 'scrollX', 0);
            camera.scrollY = GetFastValue(cameraConfig, 'scrollY', 0);
            camera.roundPixels = GetFastValue(cameraConfig, 'roundPixels', false);

            // Background Color

            var backgroundColor = GetFastValue(cameraConfig, 'backgroundColor', false);

            if (backgroundColor)
            {
                camera.setBackgroundColor(backgroundColor);
            }

            //  Bounds

            var boundsConfig = GetFastValue(cameraConfig, 'bounds', null);

            if (boundsConfig)
            {
                var bx = GetFastValue(boundsConfig, 'x', 0);
                var by = GetFastValue(boundsConfig, 'y', 0);
                var bwidth = GetFastValue(boundsConfig, 'width', gameWidth);
                var bheight = GetFastValue(boundsConfig, 'height', gameHeight);

                camera.setBounds(bx, by, bwidth, bheight);
            }
        }

        return this;
    },

    add: function (x, y, width, height)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = this.state.sys.game.config.width; }
        if (height === undefined) { height = this.state.sys.game.config.height; }

        var camera = null;

        if (this.cameraPool.length > 0)
        {
            camera = this.cameraPool.pop();
            camera.setViewport(x, y, width, height);
        }
        else
        {
            camera = new Camera(x, y, width, height);
        }

        camera.setState(this.state);

        this.cameras.push(camera);

        return camera;
    },

    addKeyControl: function (config)
    {
        return new KeyControl(config);
    },

    addSmoothedKeyControl: function (config)
    {
        return new SmoothedKeyControl(config);
    },

    addReference: function (camera)
    {
        var index = this.cameras.indexOf(camera);
        var poolIndex = this.cameraPool.indexOf(camera);

        if (index < 0 && poolIndex >= 0)
        {
            this.cameras.push(camera);
            this.cameraPool.slice(poolIndex, 1);
            return camera;
        }
        
        return null;
    },

    remove: function (camera)
    {
        var cameraIndex = this.cameras.indexOf(camera);

        if (cameraIndex >= 0)
        {
            this.cameraPool.push(this.cameras[cameraIndex]);
            this.cameras.splice(cameraIndex, 1);
        }
    },

    resetAll: function ()
    {
        while (this.cameras.length > 0)
        {
            this.cameraPool.push(this.cameras.pop());
        }

        this.main = this.add();
    },

    update: function (timestep, delta)
    {
        for (var i = 0, l = this.cameras.length; i < l; ++i)
        {
            this.cameras[i].update(timestep, delta);
        }
    },

    render: function (renderer, children, interpolation)
    {
        var cameras = this.cameras;

        for (var i = 0, l = cameras.length; i < l; ++i)
        {
            var camera = cameras[i];

            camera.preRender();

            renderer.render(this.state, children, interpolation, camera);
        }
    },

    destroy: function ()
    {
        this.main = undefined;

        for (var i = 0; i < this.cameras.length; i++)
        {
            this.cameras[i].destroy();
        }

        for (i = 0; i < this.cameraPool.length; i++)
        {
            this.cameraPool[i].destroy();
        }

        this.cameras = [];
        this.cameraPool = [];
        this.state = undefined;
    }

};

module.exports = CameraManager;
