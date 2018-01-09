var Class = require('../../utils/Class');

//  Drag Events
//  https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
//  Mouse Events
//  https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent

var SceneInputManager = new Class({

    initialize:

    function SceneInputManager (scene)
    {
        //  The Scene that owns this plugin
        this.scene = scene;

        //  GlobalInputManager
        this.manager = scene.sys.game.input;

        //  A reference to this.scene.sys.displayList (set in boot)
        this.displayList;

        //  A reference to the this.scene.sys.cameras (set in boot)
        this.cameras;

        //  The Scene event dispatcher
        this.events = scene.sys.events;

        //  Proxy references available via the Scene
        this.keyboard = this.manager.keyboard;
        this.mouse = this.manager.mouse;
        this.gamepad = this.manager.gamepad;

        //  Only fire callbacks and events on the top-most Game Object in the display list (emulating DOM behavior)
        //  and ignore any GOs below it, or call them all?
        this.topOnly = true;

        //  How often should the pointer input be checked?
        //  Time given in ms
        //  Pointer will *always* be checked if it has been moved by the user.
        //  This controls how often it will be polled if it hasn't been moved.
        //  Set to 0 to poll constantly. Set to -1 to only poll on user movement.
        this.pollRate = -1;

        //  Internal counter
        this._pollTimer = 0;

        //  The distance, in pixels, the pointer has to move while being held down, before it thinks it is being dragged.
        this.dragDistanceThreshold = 0;

        //  The amount of time, in ms, the pointer has to be held down before it thinks it is dragging.
        this.dragTimeThreshold = 0;

        //  Used to temporarily store the results of the Hit Test
        this._temp = [];

        //  list: A list of all Game Objects that have been set to be interactive
        this._list = [];

        //  pendingInsertion: Objects waiting to be inserted to the list on the next call to 'begin'
        this._pendingInsertion = [];

        //  pendingRemoval: Objects waiting to be removed from the list on the next call to 'begin'
        this._pendingRemoval = [];

        //  draggable: A list of all Game Objects that have been enabled for dragging
        this._draggable = [];

        //  drag: A list of all Interactive Objects currently considered as being 'draggable' by any pointer, indexed by pointer ID
        this._drag = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] };

        //  over: A list of all Interactive Objects currently considered as being 'over' by any pointer, indexed by pointer ID
        this._over = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] };

        this._validTypes = [ 'onDown', 'onUp', 'onOver', 'onOut', 'onMove', 'onDragStart', 'onDrag', 'onDragEnd', 'onDragEnter', 'onDragLeave', 'onDragOver', 'onDrop' ];
    },

    //  Add option to get all IOs within a Rect or Circle

    boot: require('./inc/Boot'),
    begin: require('./inc/Begin'),
    clear: require('./inc/Clear'),
    update: require('./inc/Update'),
    hitTestPointer: require('./inc/HitTestPointer'),
    disable: require('./inc/Disable'),
    enable: require('./inc/Enable'),
    queueForInsertion: require('./inc/QueueForInsertion'),
    queueForRemoval: require('./inc/QueueForRemoval'),

    setPollRate: require('./inc/SetPollRate'),
    setPollAlways: require('./inc/SetPollAlways'),
    setPollOnMove: require('./inc/SetPollOnMove'),

    setTopOnly: require('./inc/SetTopOnly'),

    setHitArea: require('./inc/SetHitArea'),
    setHitAreaCircle: require('./inc/SetHitAreaCircle'),
    setHitAreaEllipse: require('./inc/SetHitAreaEllipse'),
    setHitAreaFromTexture: require('./inc/SetHitAreaFromTexture'),
    setHitAreaRectangle: require('./inc/SetHitAreaRectangle'),
    setHitAreaTriangle: require('./inc/SetHitAreaTriangle'),

    setDraggable: require('./inc/SetDraggable'),

    setCallback: require('./inc/SetCallback'),
    setCallbacks: require('./inc/SetCallbacks'),
    setOnDownCallback: require('./inc/SetOnDownCallback'),
    setOnOutCallback: require('./inc/SetOnOutCallback'),
    setOnOverCallback: require('./inc/SetOnOverCallback'),
    setOnUpCallback: require('./inc/SetOnUpCallback'),
    setOnMoveCallback: require('./inc/SetOnMoveCallback'),
    setOnDragStartCallback: require('./inc/SetOnDragStartCallback'),
    setOnDragCallback: require('./inc/SetOnDragCallback'),
    setOnDragEndCallback: require('./inc/SetOnDragEndCallback'),

    processOverOutEvents: require('./inc/ProcessOverOutEvents'),
    processDownEvents: require('./inc/ProcessDownEvents'),
    processDragEvents: require('./inc/ProcessDragEvents'),
    processUpEvents: require('./inc/ProcessUpEvents'),
    processMoveEvents: require('./inc/ProcessMoveEvents'),
    sortGameObjects: require('./inc/SortGameObjects'),
    sortInteractiveObjects: require('./inc/SortInteractiveObjects'),
    sortHandlerGO: require('./inc/SortHandlerGO'),
    sortHandlerIO: require('./inc/SortHandlerIO'),

    activePointer: {

        get: function ()
        {
            return this.manager.activePointer;
        }

    },

    //  The x/y coordinates of the ActivePointer based on the first camera in the camera list.
    //  This is only safe to use if your game has just 1 non-transformed camera and doesn't use multi-touch.
    x: {

        get: function ()
        {
            return this.manager.activePointer.x;
        }

    },

    y: {

        get: function ()
        {
            return this.manager.activePointer.y;
        }

    },

    //  Scene that owns this is shutting down
    shutdown: function ()
    {
        this._temp.length = 0;
        this._list.length = 0;
        this._draggable.length = 0;
        this._pendingRemoval.length = 0;
        this._pendingInsertion.length = 0;

        for (var i = 0; i < 10; i++)
        {
            this._drag[i] = [];
            this._over[i] = [];
        }
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
        this.gamepad = undefined;
    }

});

module.exports = SceneInputManager;
