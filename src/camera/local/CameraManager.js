var Class = require('../../utils/Class');
var PluginManager = require('../../plugins/PluginManager');

var CameraManager = new Class({

    initialize:

    function CameraManager (scene)
    {
        //  The Scene that owns this plugin
        this.scene = scene;

        this.systems = scene.sys;

        this.mapping = 'cameras';

        this.systems.events.on('boot', this.boot, this);

        this.currentCameraId = 1;

        this.cameras = [];
        this.cameraPool = [];

        if (scene.sys.settings.cameras)
        {
            //  We have cameras to create
            this.fromJSON(scene.sys.settings.cameras);
        }
        else
        {
            //  Make one
            this.add();
        }

        //  Set the default camera
        this.main = this.cameras[0];
    },

    boot: function ()
    {
        this.systems.inject(this);

        this.systems.events.on('update', this.update, this);
        this.systems.events.on('shutdown', this.shutdown, this);
        this.systems.events.on('destroy', this.destroy, this);
    },

    add3D: require('./inc/AddPerspectiveCamera'),
    add: require('./inc/Add2DCamera'),
    addExisting: require('./inc/AddExisting'),
    addKeyControl: require('./inc/AddKeyControl'),
    addOrthographicCamera: require('./inc/AddOrthographicCamera'),
    addPerspectiveCamera: require('./inc/AddPerspectiveCamera'),
    addSmoothedKeyControl: require('./inc/AddSmoothedKeyControl'),
    destroy: require('./inc/Destroy'),
    fromJSON: require('./inc/FromJSON'),
    getCamera: require('./inc/GetCamera'),
    getCameraBelowPointer: require('./inc/GetCameraBelowPointer'),
    remove: require('./inc/RemoveCamera'),
    render: require('./inc/Render'),
    resetAll: require('./inc/ResetAll'),
    update: require('./inc/Update'),

    shutdown: function ()
    {

    }

});

PluginManager.register('cameras', CameraManager);

module.exports = CameraManager;
