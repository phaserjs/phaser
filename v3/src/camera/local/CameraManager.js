var Class = require('../../utils/Class');

var CameraManager = new Class({

    initialize:

    function CameraManager (scene)
    {
        //  The Scene that owns this plugin
        this.currentCameraId = 1;
        this.scene = scene;

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
    update: require('./inc/Update')

});

module.exports = CameraManager;
