var Circle = require('../geom/circle/Circle');
var CircleContains = require('../geom/circle/Contains');
var Class = require('../utils/Class');
var CONST = require('../input/const');
var Ellipse = require('../geom/ellipse/Ellipse');
var EllipseContains = require('../geom/ellipse/Contains');
var InputEvent = require('../input/events');
var InteractiveObject = require('../input/InteractiveObject');
var Rectangle = require('../geom/rectangle/Rectangle');
var RectangleContains = require('../geom/rectangle/Contains');
var Triangle = require('../geom/triangle/Triangle');
var TriangleContains = require('../geom/triangle/Contains');

var InputManager = new Class({

    initialize:

    function InputManager (scene, game)
    {
        //  The Scene that owns this plugin
        this.scene = scene;

        //  A reference to this.scene.sys.displayList (set in boot)
        this.displayList;

        //  A reference to the this.scene.sys.cameras.cameras array (set in boot)
        this.cameras;

        //  GlobalInputManager
        this.manager = game.input;

        //  Should use Scene event dispatcher?
        this.events = this.manager.events;

        this.keyboard = this.manager.keyboard;
        this.mouse = this.manager.mouse;

        //  Only fire *callbacks* on the top-most Game Object in the display list (emulating DOM behavior)
        //  and ignoring any GOs below it, or call them all? (TODO: Set via Input config)

        this.processOptions = {
            up: CONST.TOP,
            down: CONST.TOP,
            over: CONST.TOP,
            out: CONST.TOP
        };

        //  How often should the pointer input be checked?
        //  Time given in ms
        //  Pointer will *always* be checked if it has been moved by the user.
        //  This controls how often it will be polled if it hasn't been moved.
        //  Set to 0 to poll constantly. Set to -1 to only poll on user movement.
        this.pollRate = -1;

        this._pollTimer = 0;

        this._size = 0;

        //  All list of all Game Objects that have been input enabled
        this._list = [];

        //  Only those which are currently below a pointer (any pointer)
        this._over = [];

        //  Only Game Objects which have been flagged as draggable are added to this array
        this._draggable = [];

        //  Objects waiting to be inserted or removed from the active list
        this._pendingInsertion = [];
        this._pendingRemoval = [];

        this._validTypes = [ 'onDown', 'onUp', 'onOver', 'onOut' ];
    },

    boot: function ()
    {
        this.cameras = this.scene.sys.cameras.cameras;

        this.displayList = this.scene.sys.displayList;
    },

    begin: function ()
    {
        var toRemove = this._pendingRemoval.length;
        var toInsert = this._pendingInsertion.length;

        if (toRemove === 0 && toInsert === 0)
        {
            //  Quick bail
            return;
        }

        var i;
        var gameObject;

        //  Delete old gameObjects
        for (i = 0; i < toRemove; i++)
        {
            gameObject = this._pendingRemoval[i];

            var index = this._list.indexOf(gameObject);

            if (index > -1)
            {
                this._list.splice(index, 1);

                gameObject.input = null;
            }
        }

        //  Move pending to active (can swap for concat splice if we don't need anything extra here)

        for (i = 0; i < toInsert; i++)
        {
            gameObject = this._pendingInsertion[i];

            //  Swap for Input Enabled Object
            this._list.push(gameObject);
        }

        this._size = this._list.length;

        //  Clear the lists
        this._pendingRemoval.length = 0;
        this._pendingInsertion.length = 0;
    },

    setPollAlways: function ()
    {
        this.pollRate = 0;
        this._pollTimer = 0;

        return this;
    },

    setPollOnMove: function ()
    {
        this.pollRate = -1;
        this._pollTimer = 0;

        return this;
    },

    setPoll: function (value)
    {
        this.pollRate = value;
        this._pollTimer = 0;

        return this;
    },

    update: function (time, delta)
    {
        if (this._size === 0)
        {
            return;
        }

        var pointer = this.manager.activePointer;

        var runUpdate = (pointer.dirty || this.pollRate === 0);

        if (this.pollRate > -1)
        {
            this._pollTimer -= delta;

            if (this._pollTimer < 0)
            {
                runUpdate = true;

                //  Discard timer diff
                this._pollTimer = this.pollRate;
            }
        }

        if (runUpdate)
        {
            this.hitTestPointer(pointer);

            this.processUpDownEvents(pointer);

            if (pointer.justMoved)
            {
                this.processMovementEvents(pointer);
            }
        }
    },

    hitTestPointer: function (pointer)
    {
        var i;
        var tested = [];
        var justOut = [];
        var justOver = [];
        var stillOver = [];
        var currentlyOver = this._over;
        var gameObject;

        //  Get a list of all objects that can be seen by all the cameras in the scene and store in 'tested' array.
        //  All objects in this array are input enabled, as checked by the hitTest function, so we don't need to check later on as well.
        for (i = 0; i < this.cameras.length; i++)
        {
            var camera = this.cameras[i];

            if (camera.inputEnabled)
            {
                tested = tested.concat(this.manager.hitTest(this._list, pointer.x, pointer.y, camera));
            }
        }

        //   Loop through the tested array and work out which game objects were 'over' previously and which are 'just over' (brand new)
        for (i = 0; i < tested.length; i++)
        {
            gameObject = tested[i];

            if (currentlyOver.indexOf(gameObject) !== -1)
            {
                stillOver.push(gameObject);
            }
            else
            {
                justOver.push(gameObject);
            }
        }

        //  Loop through the list of 'currently over' objects (from the previous frame) and any missing are now 'just out'
        for (i = 0; i < currentlyOver.length; i++)
        {
            gameObject = currentlyOver[i];

            if (tested.indexOf(gameObject) === -1)
            {
                justOut.push(gameObject);
            }
        }

        //  Now we can process what has happened.

        //  Fire a global onOut event that contains all objects that have moved to 'out' status this update

        gameObject = this.getTopInteractiveObject(justOut);

        this.events.dispatch(new InputEvent.OUT(pointer, gameObject, justOut));

        //  Call onOut for everything in the justOut array
        for (i = 0; i < justOut.length; i++)
        {
            gameObject = justOut[i];

            this.gameObjectOnOut(pointer, gameObject);

            if (this.processOptions.out === CONST.TOP)
            {
                break;
            }
        }

        //  Fire a global onOut event that contains all objects that have moved to 'over' status this update

        gameObject = this.getTopInteractiveObject(justOver);

        this.events.dispatch(new InputEvent.OVER(pointer, gameObject, justOver));

        //  Call onOver for everything in the justOver array
        for (i = 0; i < justOver.length; i++)
        {
            gameObject = justOver[i];

            this.gameObjectOnOver(pointer, gameObject);

            if (this.processOptions.over === CONST.TOP)
            {
                break;
            }
        }

        //  Add the contents of justOver to the persistent 'over' array
        this._over = stillOver.concat(justOver);

        //  Then sort it into display list order
        this.sortInteractiveObjects(this._over);
    },

    //  Given an array of Game Objects, sort the array and return it,
    //  so that the objects are in index order with the lowest at the bottom.
    sortInteractiveObjects: function (interactiveObjects)
    {
        this.displayList.depthSort();

        return interactiveObjects.sort(this.sortIndexHandler.bind(this));
    },

    //  Note that the given array is sorted in place, even though it isn't returned directly it will still be updated.
    getTopInteractiveObject: function (interactiveObjects)
    {
        this.sortInteractiveObjects(interactiveObjects);

        return interactiveObjects[0];
    },

    //  Return the child lowest down the display list (with the smallest index)
    sortIndexHandler: function (childA, childB)
    {
        //  The higher the index, the lower down the display list they are.
        //  So entry 0 will be the top-most item (visually)
        var indexA = this.displayList.getIndex(childA.gameObject);
        var indexB = this.displayList.getIndex(childB.gameObject);

        if (indexA < indexB)
        {
            return 1;
        }
        else if (indexA > indexB)
        {
            return -1;
        }

        //  Technically this shouldn't happen, but if the GO wasn't part of this display list then it'll
        //  have an index of -1, so in some cases it can
        return 0;
    },

    //  Has it been pressed down or released in this update?
    processUpDownEvents: function (pointer)
    {
        //  _over is now in display list order, top to bottom

        var i;
        var gameObject = this.getTopInteractiveObject(this._over);

        if (pointer.justDown)
        {
            this.events.dispatch(new InputEvent.DOWN(pointer, gameObject, this._over));

            if (this.processOptions.down === CONST.TOP)
            {
                this.gameObjectOnDown(pointer, gameObject);
            }
            else
            {
                for (i = 0; i < this._over.length; i++)
                {
                    gameObject = this._over[i];

                    this.gameObjectOnDown(pointer, gameObject);
                }
            }
        }
        else if (pointer.justUp)
        {
            this.events.dispatch(new InputEvent.UP(pointer, gameObject, this._over));

            if (this.processOptions.up === CONST.TOP)
            {
                this.gameObjectOnUp(pointer, gameObject);
            }
            else
            {
                for (i = 0; i < this._over.length; i++)
                {
                    gameObject = this._over[i];

                    this.gameObjectOnUp(pointer, gameObject);
                }
            }
        }
    },

    //  Has the pointer moved in this update?
    processMovementEvents: function (pointer)
    {
        //  Check the list of Draggable Items
        for (var i = 0; i < this._draggable.length; i++)
        {
            var gameObject = this._draggable[i];
            var input = gameObject.input;

            if (!input.enabled)
            {
                continue;
            }

            if (pointer.justUp && input.isDragged)
            {
                //  Drag End
                this.gameObjectOnDragEnd(pointer, gameObject);
            }
            else if (input.isDragged)
            {
                //  Drag
                this.gameObjectOnDrag(pointer, gameObject);
            }
        }
    },

    gameObjectOnDragStart: function (pointer, gameObject)
    {
        var input = gameObject.input;

        input.isDragged = true;

        input.dragX = input.localX - gameObject.displayOriginX;
        input.dragY = input.localY - gameObject.displayOriginY;

        this.events.dispatch(new InputEvent.DRAG_START(pointer, gameObject));

        gameObject.input.onDragStart(gameObject, pointer);
    },

    gameObjectOnDrag: function (pointer, gameObject)
    {
        this.events.dispatch(new InputEvent.DRAG(pointer, gameObject));

        gameObject.input.onDrag(gameObject, pointer);
    },

    gameObjectOnDragEnd: function (pointer, gameObject)
    {
        var input = gameObject.input;

        input.isDragged = false;

        this.events.dispatch(new InputEvent.DRAG_END(pointer, gameObject));

        gameObject.input.onDragEnd(gameObject, pointer);
    },

    gameObjectOnDown: function (pointer, gameObject)
    {
        var input = gameObject.input;

        input.isDown = true;

        input.onDown(gameObject, pointer, input.localX, input.localY);

        if (input.draggable && !input.isDragged)
        {
            //  Drag Start
            this.gameObjectOnDragStart(pointer, gameObject);
        }
    },

    gameObjectOnUp: function (pointer, gameObject)
    {
        gameObject.input.isDown = false;

        gameObject.input.onUp(gameObject, pointer, gameObject.input.localX, gameObject.input.localY);
    },

    gameObjectOnOut: function (pointer, gameObject)
    {
        var input = gameObject.input;

        input.isOver = false;

        //  Don't dispatch if we're dragging the gameObject, as the pointer often gets away from it
        if (!input.isDragged)
        {
            // this.events.dispatch(new InputEvent.OUT(pointer, gameObject));

            input.onOut(gameObject, pointer);
        }
    },

    gameObjectOnOver: function (pointer, gameObject)
    {
        var input = gameObject.input;

        input.isOver = true;

        //  Don't dispatch if we're dragging the gameObject, as the pointer often gets away from it
        if (!input.isDragged)
        {
            // this.events.dispatch(new InputEvent.OVER(pointer, gameObject));

            input.onOver(gameObject, pointer, input.localX, input.localY);
        }
    },

    enable: function (gameObject, shape, callback)
    {
        if (gameObject.input)
        {
            //  If it is already has an InteractiveObject then just enable it and return
            gameObject.input.enabled = true;
        }
        else
        {
            //  Create an InteractiveObject and enable it
            this.setHitArea(gameObject, shape, callback);
        }

        return this;
    },

    disable: function (gameObject)
    {
        gameObject.input.enabled = false;
    },

    //  Queues a Game Object for insertion into this Input Manager on the next update.
    queueForInsertion: function (child)
    {
        if (this._pendingInsertion.indexOf(child) === -1 && this._list.indexOf(child) === -1)
        {
            this._pendingInsertion.push(child);
        }

        return this;
    },

    //  Queues a Game Object for removal from this Input Manager on the next update.
    queueForRemoval: function (child)
    {
        this._pendingRemoval.push(child);

        return this;
    },

    //  Set Hit Areas

    setHitArea: function (gameObjects, shape, callback)
    {
        if (shape === undefined)
        {
            return this.setHitAreaFromTexture(gameObjects);
        }

        if (!Array.isArray(gameObjects))
        {
            gameObjects = [ gameObjects ];
        }

        for (var i = 0; i < gameObjects.length; i++)
        {
            var gameObject = gameObjects[i];

            gameObject.input = InteractiveObject(gameObject, shape, callback);

            this.queueForInsertion(gameObject);
        }

        return this;
    },

    setHitAreaFromTexture: function (gameObjects, callback)
    {
        if (callback === undefined) { callback = RectangleContains; }

        if (!Array.isArray(gameObjects))
        {
            gameObjects = [ gameObjects ];
        }

        for (var i = 0; i < gameObjects.length; i++)
        {
            var gameObject = gameObjects[i];

            if (gameObject.frame)
            {
                gameObject.input = InteractiveObject(gameObject, new Rectangle(0, 0, gameObject.frame.width, gameObject.frame.height), callback);

                this.queueForInsertion(gameObject);
            }
        }

        return this;
    },

    setHitAreaRectangle: function (gameObjects, x, y, width, height, callback)
    {
        if (callback === undefined) { callback = RectangleContains; }

        var shape = new Rectangle(x, y, width, height);

        return this.setHitArea(gameObjects, shape, callback);
    },

    setHitAreaCircle: function (gameObjects, x, y, radius, callback)
    {
        if (callback === undefined) { callback = CircleContains; }

        var shape = new Circle(x, y, radius);

        return this.setHitArea(gameObjects, shape, callback);
    },

    setHitAreaEllipse: function (gameObjects, x, y, width, height, callback)
    {
        if (callback === undefined) { callback = EllipseContains; }

        var shape = new Ellipse(x, y, width, height);

        return this.setHitArea(gameObjects, shape, callback);
    },

    setHitAreaTriangle: function (gameObjects, x1, y1, x2, y2, x3, y3, callback)
    {
        if (callback === undefined) { callback = TriangleContains; }

        var shape = new Triangle(x1, y1, x2, y2, x3, y3);

        return this.setHitArea(gameObjects, shape, callback);
    },

    //  type = onDown, onUp, onOver, onOut

    setOnDownCallback: function (gameObjects, callback, context)
    {
        return this.setCallback(gameObjects, 'onDown', callback, context);
    },

    setOnUpCallback: function (gameObjects, callback, context)
    {
        return this.setCallback(gameObjects, 'onUp', callback, context);
    },

    setOnOverCallback: function (gameObjects, callback, context)
    {
        return this.setCallback(gameObjects, 'onOver', callback, context);
    },

    setOnOutCallback: function (gameObjects, callback, context)
    {
        return this.setCallback(gameObjects, 'onOut', callback, context);
    },

    setCallbacks: function (gameObjects, onDown, onUp, onOver, onOut, context)
    {
        if (onDown)
        {
            this.setOnDownCallback(gameObjects, onDown, context);
        }

        if (onUp)
        {
            this.setOnDownCallback(gameObjects, onUp, context);
        }

        if (onOver)
        {
            this.setOnDownCallback(gameObjects, onOver, context);
        }

        if (onOut)
        {
            this.setOnDownCallback(gameObjects, onOut, context);
        }

        return this;
    },

    setCallback: function (gameObjects, type, callback, context)
    {
        if (this._validTypes.indexOf(type) === -1)
        {
            return this;
        }

        if (!Array.isArray(gameObjects))
        {
            gameObjects = [ gameObjects ];
        }

        for (var i = 0; i < gameObjects.length; i++)
        {
            var gameObject = gameObjects[i];

            if (gameObject.input)
            {
                gameObject.input[type] = callback;

                if (context)
                {
                    gameObject.input.callbackContext = context;
                }
            }
        }

        return this;
    },

    //  Drag Events
    //  https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

    setDraggable: function (gameObjects, value)
    {
        if (value === undefined) { value = true; }

        if (!Array.isArray(gameObjects))
        {
            gameObjects = [ gameObjects ];
        }

        for (var i = 0; i < gameObjects.length; i++)
        {
            var gameObject = gameObjects[i];
            var index = this._draggable.indexOf(gameObject);

            if (value)
            {
                //  Make draggable
                gameObject.input.draggable = true;

                if (index === -1)
                {
                    this._draggable.push(gameObject);
                }
            }
            else
            {
                //  Disable drag
                gameObject.input.draggable = false;

                if (index === -1)
                {
                    this._draggable.splice(index, 1);
                }
            }
        }

        return true;
    },

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
        this.events =  undefined;
        this.keyboard = undefined;
        this.mouse = undefined;
    }

});

module.exports = InputManager;
