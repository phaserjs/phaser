var Circle = require('../geom/circle/Circle');
var CircleContains = require('../geom/circle/Contains');
var Class = require('../utils/Class');
var Ellipse = require('../geom/ellipse/Ellipse');
var EllipseContains = require('../geom/ellipse/Contains');
var InputEvent = require('../input/events');
var InteractiveObject = require('../input/InteractiveObject');
var NOOP = require('../utils/NOOP');
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

        this.cameras;

        //  GlobalInputManager
        this.manager = game.input;

        //  Should use Scene event dispatcher?
        this.events = this.manager.events;

        this.keyboard = this.manager.keyboard;
        this.mouse = this.manager.mouse;

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

        //  Objects waiting to be inserted or removed from the active list
        this._pendingInsertion = [];
        this._pendingRemoval = [];

        this._validTypes = [ 'onDown', 'onUp', 'onOver', 'onOut' ];
    },

    boot: function ()
    {
        this.cameras = this.scene.sys.cameras.cameras;
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

        var runUpdate = (this.manager.activePointer.dirty || this.pollRate === 0);

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
            this.hitTestPointer(this.manager.activePointer);

            this.processPointer(this.manager.activePointer);
        }
    },

    hitTestPointer: function (pointer)
    {
        var i;
        var tested = [];
        var justOut = [];
        var justOver = [];
        var stillOver = [];

        //  Returns an array of objects the pointer is over

        for (i = 0; i < this.cameras.length; i++)
        {
            var camera = this.cameras[i];

            if (camera.inputEnabled)
            {
                tested = tested.concat(this.manager.hitTest(this._list, pointer.x, pointer.y, camera));
            }
        }

        for (i = 0; i < tested.length; i++)
        {
            var item = tested[i];

            if (this._over.indexOf(item) !== -1)
            {
                stillOver.push(item);
            }
            else
            {
                justOver.push(item);
            }
        }

        this._over.forEach(function (item)
        {
            if (tested.indexOf(item) === -1)
            {
                justOut.push(item);
            }

        });

        //  Now we can process what has happened
        for (i = 0; i < justOut.length; i++)
        {
            this.events.dispatch(new InputEvent.OUT(pointer, justOut[i]));
        }

        for (i = 0; i < justOver.length; i++)
        {
            this.events.dispatch(new InputEvent.OVER(pointer, justOver[i]));
        }

        //  Store everything that is currently over
        this._over = stillOver.concat(justOver);
    },

    //  Has it been pressed down or released in this update?
    processPointer: function (pointer)
    {
        var i;
        var gameObject;
        var over = this._over;

        if (pointer.justDown)
        {
            for (i = 0; i < over.length; i++)
            {
                gameObject = over[i];

                //   Maybe this should contain ALL game objects it hit in one single event?
                this.events.dispatch(new InputEvent.DOWN(pointer, gameObject));

                gameObject.input.onDown(gameObject, pointer, gameObject.input.localX, gameObject.input.localY);
            }
        }
        else if (pointer.justUp)
        {
            for (i = 0; i < over.length; i++)
            {
                gameObject = over[i];

                this.events.dispatch(new InputEvent.UP(pointer, gameObject));

                gameObject.input.onUp(gameObject, pointer, gameObject.input.localX, gameObject.input.localY);
            }
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

    //  DRAG_START, DRAG (mouse move), DRAG_END


    //  Scene that owns this is shutting down
    shutdown: function ()
    {
        this._list = [];
        this._over = [];
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
