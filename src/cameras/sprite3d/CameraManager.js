var Class = require('../../utils/Class');
var GetFastValue = require('../../utils/object/GetFastValue');
var OrthographicCamera = require('./OrthographicCamera');
var PerspectiveCamera = require('./PerspectiveCamera');
var PluginManager = require('../../plugins/PluginManager');

//  Phaser.Cameras.Sprite3D.CameraManager

var CameraManager = new Class({

    initialize:

    function CameraManager (scene)
    {
        //  The Scene that owns this plugin
        this.scene = scene;

        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }
    },

    boot: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('update', this.update, this);
        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    add: function (fieldOfView, width, height)
    {
        return this.addPerspectiveCamera(fieldOfView, width, height);
    },

    addOrthographicCamera: function (width, height)
    {
        var config = this.scene.sys.game.config;

        if (width === undefined) { width = config.width; }
        if (height === undefined) { height = config.height; }

        var camera = new OrthographicCamera(this.scene, width, height);

        return camera;
    },

    addPerspectiveCamera: function (fieldOfView, width, height)
    {
        var config = this.scene.sys.game.config;

        if (fieldOfView === undefined) { fieldOfView = 80; }
        if (width === undefined) { width = config.width; }
        if (height === undefined) { height = config.height; }

        var camera = new PerspectiveCamera(this.scene, fieldOfView, width, height);

        return camera;
    },

    destroy: function ()
    {
        this.scene = undefined;
    },

    getCamera: function (name)
    {
        this.cameras.forEach(function (camera)
        {
            if (camera.name === name)
            {
                return camera;
            }
        });

        return null;
    },

    removeCamera: function (camera)
    {
        var cameraIndex = this.cameras.indexOf(camera);

        if (cameraIndex >= 0 && this.cameras.length > 1)
        {
            this.cameraPool.push(this.cameras[cameraIndex]);
            this.cameras.splice(cameraIndex, 1);

            if (this.main === camera)
            {
                this.main = this.cameras[0];
            }
        }
    },

    render: function (renderer, children, interpolation)
    {
        var cameras = this.cameras;

        for (var i = 0, l = cameras.length; i < l; ++i)
        {
            var camera = cameras[i];

            camera.preRender();

            renderer.render(this.scene, children, interpolation, camera);
        }
    },

    resetAll: function ()
    {
        while (this.cameras.length > 0)
        {
            this.cameraPool.push(this.cameras.pop());
        }

        this.main = this.add();

        return this.main;
    },

    update: function (timestep, delta)
    {
        for (var i = 0, l = this.cameras.length; i < l; ++i)
        {
            this.cameras[i].update(timestep, delta);
        }
    },

    shutdown: function ()
    {
    }

});

PluginManager.register('CameraManager3D', CameraManager, 'cameras3d');

module.exports = CameraManager;
