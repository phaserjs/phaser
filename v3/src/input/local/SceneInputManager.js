var Class = require('../../utils/Class');

//  Drag Events
//  https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

var SceneInputManager = new Class({

    initialize:

    function SceneInputManager (scene, game)
    {
        //  The Scene that owns this plugin
        this.scene = scene;

        //  GlobalInputManager
        this.manager = game.input;

        //  A reference to this.scene.sys.displayList (set in boot)
        this.displayList;

        //  A reference to the this.scene.sys.cameras.cameras array (set in boot)
        this.cameras;

        //  Should use Scene event dispatcher?
        this.events = this.manager.events;

        // this.keyboard = this.manager.keyboard;
        // this.mouse = this.manager.mouse;

        //  Only fire *callbacks* on the top-most Game Object in the display list (emulating DOM behavior)
        //  and ignoring any GOs below it, or call them all?

        this.topOnly = true;

        //  How often should the pointer input be checked?
        //  Time given in ms
        //  Pointer will *always* be checked if it has been moved by the user.
        //  This controls how often it will be polled if it hasn't been moved.
        //  Set to 0 to poll constantly. Set to -1 to only poll on user movement.
        this.pollRate = -1;

        this._pollTimer = 0;

        this._size = 0;

        //  All list of all Interactive Objects
        this._list = [];

        //  Objects waiting to be inserted or removed from the active list
        this._pendingInsertion = [];
        this._pendingRemoval = [];

        //  A list of Interactive Objects which are *currently* below a pointer (any pointer) during the previous frame
        this._over = [];

        //  Only Game Objects which have been flagged as draggable are added to this array
        this._draggable = [];

        this._validTypes = [ 'onDown', 'onUp', 'onOver', 'onOut' ];
    },

    boot: require('./components/Boot'),
    begin: require('./components/Begin'),
    update: require('./components/Update'),
    hitTestPointer: require('./components/HitTestPointer'),

    setpollRate: require('./components/SetPollRate'),
    setpollAlways: require('./components/SetPollAlways'),
    setpollOnMove: require('./components/SetPollOnMove'),

    setHitArea: require('./components/SetHitArea'),
    setHitAreaCircle: require('./components/SetHitAreaCircle'),
    setHitAreaEllipse: require('./components/SetHitAreaEllipse'),
    setHitAreaFromTexture: require('./components/SetHitAreaFromTexture'),
    setHitAreaRectangle: require('./components/SetHitAreaRectangle'),
    setHitAreaTriangle: require('./components/SetHitAreaTriangle'),

    setCallback: require('./components/SetCallback'),
    setCallbacks: require('./components/SetCallbacks'),
    setOnDownCallback: require('./components/SetOnDownCallback'),
    setOnOutCallback: require('./components/SetOnOutCallback'),
    setOnOverCallback: require('./components/SetOnOverCallback'),
    setOnUpCallback: require('./components/SetOnUpCallback'),

    queueForInsertion: require('./components/QueueForInsertion'),
    queueForRemoval: require('./components/QueueForRemoval'),

    //  Scene that owns this is shutting down
    shutdown: function ()
    {
        this._list = [];
        this._over = [];
        this._draggable = [];
        this._pendingRemoval = [];
        this._pendingInsertion = [];
    },

    //  Game level nuke
    destroy: function ()
    {
        this.shutdown();

        this.scene = undefined;
        this.cameras = undefined;
        this.manager = undefined;
        this.events = undefined;
        this.keyboard = undefined;
        this.mouse = undefined;
    }

});

module.exports = SceneInputManager;
