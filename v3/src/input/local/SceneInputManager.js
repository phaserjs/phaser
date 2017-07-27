var Class = require('../../utils/Class');

//  Drag Events
//  https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
//  Mouse Events
//  https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent

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

        //  Proxy references available via the Scene
        this.keyboard = this.manager.keyboard;
        this.mouse = this.manager.mouse;

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

        //  draggable: A list of all Game Objects that has been enabled for dragging
        this._draggable = [];

        //  drag: A list of all Interactive Objects currently considered as being 'draggable' by any pointer, indexed by pointer ID
        this._drag = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] };

        //  over: A list of all Interactive Objects currently considered as being 'over' by any pointer, indexed by pointer ID
        this._over = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] };

        this._validTypes = [ 'onDown', 'onUp', 'onOver', 'onOut', 'onMove' ];
    },

    //  Add option to get all IOs within a Rect or Circle

    boot: require('./components/Boot'),
    begin: require('./components/Begin'),
    update: require('./components/Update'),
    hitTestPointer: require('./components/HitTestPointer'),
    disable: require('./components/Disable'),
    enable: require('./components/Enable'),
    queueForInsertion: require('./components/QueueForInsertion'),
    queueForRemoval: require('./components/QueueForRemoval'),

    setpollRate: require('./components/SetPollRate'),
    setpollAlways: require('./components/SetPollAlways'),
    setpollOnMove: require('./components/SetPollOnMove'),

    setHitArea: require('./components/SetHitArea'),
    setHitAreaCircle: require('./components/SetHitAreaCircle'),
    setHitAreaEllipse: require('./components/SetHitAreaEllipse'),
    setHitAreaFromTexture: require('./components/SetHitAreaFromTexture'),
    setHitAreaRectangle: require('./components/SetHitAreaRectangle'),
    setHitAreaTriangle: require('./components/SetHitAreaTriangle'),

    setDraggable: require('./components/SetDraggable'),

    setCallback: require('./components/SetCallback'),
    setCallbacks: require('./components/SetCallbacks'),
    setOnDownCallback: require('./components/SetOnDownCallback'),
    setOnOutCallback: require('./components/SetOnOutCallback'),
    setOnOverCallback: require('./components/SetOnOverCallback'),
    setOnUpCallback: require('./components/SetOnUpCallback'),
    setOnMoveCallback: require('./components/SetOnMoveCallback'),

    processOverOutEvents: require('./components/ProcessOverOutEvents'),
    processDownEvents: require('./components/ProcessDownEvents'),
    processDragEvents: require('./components/ProcessDragEvents'),
    processUpEvents: require('./components/ProcessUpEvents'),
    processMoveEvents: require('./components/ProcessMoveEvents'),
    sortGameObjects: require('./components/SortGameObjects'),
    sortInteractiveObjects: require('./components/SortInteractiveObjects'),
    sortHandlerGO: require('./components/SortHandlerGO'),
    sortHandlerIO: require('./components/SortHandlerIO'),

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
    }

});

module.exports = SceneInputManager;
