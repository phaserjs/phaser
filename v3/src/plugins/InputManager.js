var Class = require('../utils/Class');
var InputEvent = require('../input/events');

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

        //  All interactive objects
        this._list = [];

        //  Only those which are currently below a pointer (any pointer)
        this._over = [];

        //  Objects waiting to be inserted or removed from the active list
        this._pendingInsertion = [];
        this._pendingRemoval = [];
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
        var over = this._over;

        if (pointer.justDown)
        {
            for (i = 0; i < over.length; i++)
            {
                this.events.dispatch(new InputEvent.DOWN(pointer, over[i]));
            }
        }
        else if (pointer.justUp)
        {
            for (i = 0; i < over.length; i++)
            {
                this.events.dispatch(new InputEvent.UP(pointer, over[i]));
            }
        }
    },

    add: function (child)
    {
        if (this._pendingInsertion.indexOf(child) === -1 && this._list.indexOf(child) === -1)
        {
            this._pendingInsertion.push(child);
        }
    },

    setHitArea: function (gameObject, shape, callback)
    {
        if (Array.isArray(gameObject))
        {
            for (var i = 0; i < gameObject.length; i++)
            {
                gameObject[i].hitArea = shape;
                gameObject[i].hitAreaCallback = callback;

                this.add(gameObject[i]);
            }
        }
        else
        {
            gameObject.hitArea = shape;
            gameObject.hitAreaCallback = callback;

            this.add(gameObject);
        }

        return this;
    },


});

module.exports = InputManager;
