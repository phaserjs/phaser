var Class = require('../utils/Class');
var InputEvent = require('../input/events');

var InputManager = new Class({

    initialize:

    function InputManager (state, game)
    {
        //  The State that owns this plugin
        this.state = state;

        this.cameras;

        //  GlobalInputManager
        this.manager = game.input;

        //  Should use State event dispatcher?
        this.events = this.manager.events;

        this.keyboard = this.manager.keyboard;
        this.mouse = this.manager.mouse;

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
        this.cameras = this.state.sys.cameras.cameras;
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

    update: function (time, delta)
    {
        if (this._size === 0)
        {
            return;
        }

        //  Has the pointer moved? If so we need to re-check the interactive objects per camera in this State
        if (this.manager.activePointer.dirty)
        {
            this.hitTestPointer(this.manager.activePointer);

            this.processPointer(this.manager.activePointer);
        }
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

        this._over.forEach(function(item) {

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
