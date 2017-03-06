var Camera = require('../../camera/Camera');

var CameraManager = function (state)
{
    this.state = state;

    this.cameras = [];
    this.cameraPool = [];

    this.main = this.add();
};

CameraManager.prototype.constructor = CameraManager;

CameraManager.prototype = {

    add: function (x, y, width, height)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = this.state.sys.width; }
        if (height === undefined) { height = this.state.sys.height; }

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

    update: function (timestep)
    {
        for (var i = 0, l = this.cameras.length; i < l; ++i)
        {
            this.cameras[i].update(timestep);
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
