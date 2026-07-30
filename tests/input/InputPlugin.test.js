var EventEmitter3 = require('eventemitter3');
var InputPlugin = require('../../src/input/InputPlugin');

describe('InputPlugin', function ()
{
    var plugin;
    var manager;
    var scene;

    function createMockManager ()
    {
        var events = new EventEmitter3();

        return {
            mouse: null,
            pointers: [],
            enabled: true,
            globalTopOnly: true,
            events: events,
            _tempSkip: false,
            setCursor: vi.fn(),
            resetCursor: vi.fn(),
            setDefaultCursor: vi.fn(),
            addPointer: vi.fn().mockReturnValue([]),
            canvas: { style: { cursor: '' } },
            defaultCursor: ''
        };
    }

    function createMockScene (mgr)
    {
        var events = new EventEmitter3();

        return {
            sys: {
                settings: {
                    transitionAllowInput: true,
                    input: {}
                },
                events: events,
                game: {
                    input: mgr,
                    config: {}
                },
                canInput: vi.fn().mockReturnValue(true),
                displayList: { getIndex: vi.fn().mockReturnValue(0) },
                depthSort: vi.fn()
            }
        };
    }

    beforeEach(function ()
    {
        manager = createMockManager();
        scene = createMockScene(manager);
        plugin = new InputPlugin(scene);
    });

    afterEach(function ()
    {
        vi.clearAllMocks();
    });

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    describe('constructor', function ()
    {
        it('should set enabled to true by default', function ()
        {
            expect(plugin.enabled).toBe(true);
        });

        it('should set topOnly to true by default', function ()
        {
            expect(plugin.topOnly).toBe(true);
        });

        it('should set pollRate to -1 by default', function ()
        {
            expect(plugin.pollRate).toBe(-1);
        });

        it('should set dragDistanceThreshold to 0 by default', function ()
        {
            expect(plugin.dragDistanceThreshold).toBe(0);
        });

        it('should set dragTimeThreshold to 0 by default', function ()
        {
            expect(plugin.dragTimeThreshold).toBe(0);
        });

        it('should initialise _list as an empty array', function ()
        {
            expect(Array.isArray(plugin._list)).toBe(true);
            expect(plugin._list.length).toBe(0);
        });

        it('should initialise _draggable as an empty array', function ()
        {
            expect(Array.isArray(plugin._draggable)).toBe(true);
            expect(plugin._draggable.length).toBe(0);
        });

        it('should store a reference to the scene', function ()
        {
            expect(plugin.scene).toBe(scene);
        });

        it('should store a reference to the input manager', function ()
        {
            expect(plugin.manager).toBe(manager);
        });

        it('should expose stopPropagation on the _eventContainer', function ()
        {
            expect(typeof plugin._eventContainer.stopPropagation).toBe('function');
        });

        it('should set _eventData.cancelled to false by default', function ()
        {
            expect(plugin._eventData.cancelled).toBe(false);
        });

        it('should wire _eventContainer.stopPropagation to cancel _eventData', function ()
        {
            plugin._eventContainer.stopPropagation();

            expect(plugin._eventData.cancelled).toBe(true);
        });
    });

    // -------------------------------------------------------------------------
    // isActive
    // -------------------------------------------------------------------------

    describe('isActive', function ()
    {
        it('should return true when manager is enabled, plugin is enabled and scene can accept input', function ()
        {
            manager.enabled = true;
            plugin.enabled = true;
            scene.sys.canInput.mockReturnValue(true);

            expect(plugin.isActive()).toBe(true);
        });

        it('should return false when the manager is disabled', function ()
        {
            manager.enabled = false;

            expect(plugin.isActive()).toBe(false);
        });

        it('should return false when the plugin itself is disabled', function ()
        {
            plugin.enabled = false;

            expect(plugin.isActive()).toBe(false);
        });

        it('should return false when the scene cannot accept input', function ()
        {
            scene.sys.canInput.mockReturnValue(false);

            expect(plugin.isActive()).toBe(false);
        });

        it('should return falsy when manager is null', function ()
        {
            plugin.manager = null;

            expect(plugin.isActive()).toBeFalsy();
        });
    });

    // -------------------------------------------------------------------------
    // setPollRate / setPollAlways / setPollOnMove
    // -------------------------------------------------------------------------

    describe('setPollRate', function ()
    {
        it('should set the pollRate to the given value', function ()
        {
            plugin.setPollRate(100);

            expect(plugin.pollRate).toBe(100);
        });

        it('should reset _pollTimer to 0', function ()
        {
            plugin._pollTimer = 500;
            plugin.setPollRate(100);

            expect(plugin._pollTimer).toBe(0);
        });

        it('should return the InputPlugin instance', function ()
        {
            var result = plugin.setPollRate(50);

            expect(result).toBe(plugin);
        });
    });

    describe('setPollAlways', function ()
    {
        it('should set pollRate to 0', function ()
        {
            plugin.setPollAlways();

            expect(plugin.pollRate).toBe(0);
        });

        it('should return the InputPlugin instance', function ()
        {
            expect(plugin.setPollAlways()).toBe(plugin);
        });
    });

    describe('setPollOnMove', function ()
    {
        it('should set pollRate to -1', function ()
        {
            plugin.pollRate = 0;
            plugin.setPollOnMove();

            expect(plugin.pollRate).toBe(-1);
        });

        it('should return the InputPlugin instance', function ()
        {
            expect(plugin.setPollOnMove()).toBe(plugin);
        });
    });

    // -------------------------------------------------------------------------
    // setTopOnly / setGlobalTopOnly
    // -------------------------------------------------------------------------

    describe('setTopOnly', function ()
    {
        it('should set topOnly to the given value', function ()
        {
            plugin.setTopOnly(false);

            expect(plugin.topOnly).toBe(false);
        });

        it('should return the InputPlugin instance', function ()
        {
            expect(plugin.setTopOnly(true)).toBe(plugin);
        });
    });

    describe('setGlobalTopOnly', function ()
    {
        it('should set globalTopOnly on the manager', function ()
        {
            plugin.setGlobalTopOnly(false);

            expect(manager.globalTopOnly).toBe(false);
        });

        it('should return the InputPlugin instance', function ()
        {
            expect(plugin.setGlobalTopOnly(true)).toBe(plugin);
        });
    });

    // -------------------------------------------------------------------------
    // getDragState / setDragState
    // -------------------------------------------------------------------------

    describe('getDragState / setDragState', function ()
    {
        it('should set and get drag state for a pointer', function ()
        {
            var pointer = { id: 0 };

            plugin.setDragState(pointer, 3);

            expect(plugin.getDragState(pointer)).toBe(3);
        });

        it('should store drag state independently per pointer id', function ()
        {
            var pointerA = { id: 0 };
            var pointerB = { id: 1 };

            plugin.setDragState(pointerA, 4);
            plugin.setDragState(pointerB, 2);

            expect(plugin.getDragState(pointerA)).toBe(4);
            expect(plugin.getDragState(pointerB)).toBe(2);
        });
    });

    // -------------------------------------------------------------------------
    // setDraggable
    // -------------------------------------------------------------------------

    describe('setDraggable', function ()
    {
        it('should add a game object to the _draggable list when value is true', function ()
        {
            var gameObject = { input: { draggable: false } };

            plugin.setDraggable(gameObject, true);

            expect(plugin._draggable).toContain(gameObject);
            expect(gameObject.input.draggable).toBe(true);
        });

        it('should remove a game object from the _draggable list when value is false', function ()
        {
            var gameObject = { input: { draggable: true } };
            plugin._draggable.push(gameObject);

            plugin.setDraggable(gameObject, false);

            expect(plugin._draggable).not.toContain(gameObject);
            expect(gameObject.input.draggable).toBe(false);
        });

        it('should default value to true when not provided', function ()
        {
            var gameObject = { input: { draggable: false } };

            plugin.setDraggable(gameObject);

            expect(gameObject.input.draggable).toBe(true);
        });

        it('should accept an array of game objects', function ()
        {
            var goA = { input: { draggable: false } };
            var goB = { input: { draggable: false } };

            plugin.setDraggable([ goA, goB ], true);

            expect(plugin._draggable).toContain(goA);
            expect(plugin._draggable).toContain(goB);
        });

        it('should not add a game object to _draggable twice', function ()
        {
            var gameObject = { input: { draggable: false } };

            plugin.setDraggable(gameObject, true);
            plugin.setDraggable(gameObject, true);

            var count = plugin._draggable.filter(function (g) { return g === gameObject; }).length;

            expect(count).toBe(1);
        });

        it('should return the InputPlugin instance', function ()
        {
            var gameObject = { input: { draggable: false } };

            expect(plugin.setDraggable(gameObject)).toBe(plugin);
        });
    });

    // -------------------------------------------------------------------------
    // stopPropagation
    // -------------------------------------------------------------------------

    describe('stopPropagation', function ()
    {
        it('should set _tempSkip on the manager to true', function ()
        {
            plugin.stopPropagation();

            expect(manager._tempSkip).toBe(true);
        });

        it('should return the InputPlugin instance', function ()
        {
            expect(plugin.stopPropagation()).toBe(plugin);
        });
    });

    // -------------------------------------------------------------------------
    // onGameOver / onGameOut
    // -------------------------------------------------------------------------

    describe('onGameOver', function ()
    {
        it('should emit GAME_OVER when the plugin is active', function ()
        {
            var emitted = false;

            plugin.on('gameover', function () { emitted = true; });

            plugin.onGameOver({ timeStamp: 0 });

            expect(emitted).toBe(true);
        });

        it('should not emit GAME_OVER when the plugin is inactive', function ()
        {
            plugin.enabled = false;

            var emitted = false;

            plugin.on('gameover', function () { emitted = true; });

            plugin.onGameOver({ timeStamp: 0 });

            expect(emitted).toBe(false);
        });
    });

    describe('onGameOut', function ()
    {
        it('should emit GAME_OUT when the plugin is active', function ()
        {
            var emitted = false;

            plugin.on('gameout', function () { emitted = true; });

            plugin.onGameOut({ timeStamp: 0 });

            expect(emitted).toBe(true);
        });

        it('should not emit GAME_OUT when the plugin is inactive', function ()
        {
            plugin.enabled = false;

            var emitted = false;

            plugin.on('gameout', function () { emitted = true; });

            plugin.onGameOut({ timeStamp: 0 });

            expect(emitted).toBe(false);
        });
    });

    // -------------------------------------------------------------------------
    // sortGameObjects
    // -------------------------------------------------------------------------

    describe('sortGameObjects', function ()
    {
        it('should return the array unchanged when it has fewer than 2 items', function ()
        {
            var arr = [ {} ];
            var pointer = { camera: null };

            var result = plugin.sortGameObjects(arr, pointer);

            expect(result).toBe(arr);
        });

        it('should return the array unchanged when the pointer has no camera', function ()
        {
            var arr = [ {}, {} ];
            var pointer = { camera: null };

            var result = plugin.sortGameObjects(arr, pointer);

            expect(result).toBe(arr);
        });

        it('should return an empty array unchanged', function ()
        {
            var arr = [];
            var pointer = { camera: null };

            var result = plugin.sortGameObjects(arr, pointer);

            expect(result).toBe(arr);
        });
    });

    // -------------------------------------------------------------------------
    // sortDropZones
    // -------------------------------------------------------------------------

    describe('sortDropZones', function ()
    {
        it('should return the array unchanged when it has fewer than 2 items', function ()
        {
            var arr = [ {} ];

            var result = plugin.sortDropZones(arr);

            expect(result).toBe(arr);
        });

        it('should return an empty array unchanged', function ()
        {
            var arr = [];

            var result = plugin.sortDropZones(arr);

            expect(result).toBe(arr);
        });
    });

    // -------------------------------------------------------------------------
    // enable / disable
    // -------------------------------------------------------------------------

    describe('enable', function ()
    {
        it('should re-enable a game object that already has an input component', function ()
        {
            var gameObject = { input: { enabled: false } };

            plugin.enable(gameObject);

            expect(gameObject.input.enabled).toBe(true);
        });

        it('should return the InputPlugin instance', function ()
        {
            var gameObject = { input: { enabled: false } };

            expect(plugin.enable(gameObject)).toBe(plugin);
        });
    });

    describe('disable', function ()
    {
        it('should set input.enabled to false', function ()
        {
            var gameObject = { input: { enabled: true, dragState: 0 } };

            plugin.disable(gameObject);

            expect(gameObject.input.enabled).toBe(false);
        });

        it('should reset input.dragState to 0', function ()
        {
            var gameObject = { input: { enabled: true, dragState: 4 } };

            plugin.disable(gameObject);

            expect(gameObject.input.dragState).toBe(0);
        });

        it('should return the InputPlugin instance', function ()
        {
            var gameObject = { input: { enabled: true, dragState: 0 } };

            expect(plugin.disable(gameObject)).toBe(plugin);
        });

        it('should handle a game object with no input gracefully', function ()
        {
            var gameObject = { input: null };

            expect(function () { plugin.disable(gameObject); }).not.toThrow();
        });
    });

    // -------------------------------------------------------------------------
    // processDragUpEvent
    // -------------------------------------------------------------------------

    describe('processDragUpEvent', function ()
    {
        it('should reset drag state to 0 for the given pointer', function ()
        {
            var pointer = { id: 0 };

            plugin._dragState[0] = 4;
            plugin._drag[0] = [];

            plugin.processDragUpEvent(pointer);

            expect(plugin.getDragState(pointer)).toBe(0);
        });

        it('should clear the drag list for the pointer', function ()
        {
            var pointer = { id: 1 };

            plugin._drag[1] = [];

            plugin.processDragUpEvent(pointer);

            expect(plugin._drag[1].length).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // addPointer
    // -------------------------------------------------------------------------

    describe('addPointer', function ()
    {
        it('should delegate to the manager addPointer method', function ()
        {
            plugin.addPointer(2);

            expect(manager.addPointer).toHaveBeenCalledWith(2);
        });
    });

    // -------------------------------------------------------------------------
    // setDefaultCursor
    // -------------------------------------------------------------------------

    describe('setDefaultCursor', function ()
    {
        it('should call setDefaultCursor on the manager', function ()
        {
            plugin.setDefaultCursor('crosshair');

            expect(manager.setDefaultCursor).toHaveBeenCalledWith('crosshair');
        });

        it('should return the InputPlugin instance', function ()
        {
            expect(plugin.setDefaultCursor('pointer')).toBe(plugin);
        });
    });

    // -------------------------------------------------------------------------
    // setCursor / resetCursor
    // -------------------------------------------------------------------------

    describe('setCursor', function ()
    {
        it('should call setCursor on the manager with the interactive object', function ()
        {
            var interactiveObject = { cursor: 'pointer' };

            plugin.setCursor(interactiveObject);

            expect(manager.setCursor).toHaveBeenCalledWith(interactiveObject);
        });
    });

    describe('resetCursor', function ()
    {
        it('should call resetCursor on the manager', function ()
        {
            plugin.resetCursor();

            expect(manager.resetCursor).toHaveBeenCalledWith(null, true);
        });
    });

    // -------------------------------------------------------------------------
    // setHitAreaCircle / setHitAreaEllipse / setHitAreaRectangle / setHitAreaTriangle
    // -------------------------------------------------------------------------

    describe('setHitAreaCircle', function ()
    {
        it('should queue the game object for insertion with a circle hit area', function ()
        {
            var gameObject = { input: null, type: 'Sprite' };

            plugin.setHitAreaCircle(gameObject, 50, 50, 30);

            expect(gameObject.input).not.toBeNull();
            expect(plugin._pendingInsertion).toContain(gameObject);
        });

        it('should return the InputPlugin instance', function ()
        {
            var gameObject = { input: null, type: 'Sprite' };

            expect(plugin.setHitAreaCircle(gameObject, 0, 0, 10)).toBe(plugin);
        });
    });

    describe('setHitAreaEllipse', function ()
    {
        it('should queue the game object for insertion with an ellipse hit area', function ()
        {
            var gameObject = { input: null, type: 'Sprite' };

            plugin.setHitAreaEllipse(gameObject, 50, 50, 80, 40);

            expect(gameObject.input).not.toBeNull();
            expect(plugin._pendingInsertion).toContain(gameObject);
        });
    });

    describe('setHitAreaRectangle', function ()
    {
        it('should queue the game object for insertion with a rectangle hit area', function ()
        {
            var gameObject = { input: null, type: 'Sprite' };

            plugin.setHitAreaRectangle(gameObject, 0, 0, 100, 50);

            expect(gameObject.input).not.toBeNull();
            expect(plugin._pendingInsertion).toContain(gameObject);
        });
    });

    describe('setHitAreaTriangle', function ()
    {
        it('should queue the game object for insertion with a triangle hit area', function ()
        {
            var gameObject = { input: null, type: 'Sprite' };

            plugin.setHitAreaTriangle(gameObject, 0, 0, 100, 0, 50, 100);

            expect(gameObject.input).not.toBeNull();
            expect(plugin._pendingInsertion).toContain(gameObject);
        });
    });

    // -------------------------------------------------------------------------
    // removeDebug
    // -------------------------------------------------------------------------

    describe('removeDebug', function ()
    {
        it('should destroy the debug shape and clear hitAreaDebug', function ()
        {
            var destroyed = false;
            var gameObject = {
                input: {
                    hitAreaDebug: {
                        destroy: function () { destroyed = true; }
                    }
                }
            };

            plugin.removeDebug(gameObject);

            expect(destroyed).toBe(true);
            expect(gameObject.input.hitAreaDebug).toBeNull();
        });

        it('should do nothing when there is no hitAreaDebug', function ()
        {
            var gameObject = { input: { hitAreaDebug: null } };

            expect(function () { plugin.removeDebug(gameObject); }).not.toThrow();
        });

        it('should return the InputPlugin instance', function ()
        {
            var gameObject = { input: { hitAreaDebug: null } };

            expect(plugin.removeDebug(gameObject)).toBe(plugin);
        });
    });
});
