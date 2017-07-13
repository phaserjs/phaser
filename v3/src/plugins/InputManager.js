var Class = require('../utils/Class');

var InputManager = new Class({

    initialize:

    function InputManager (state, game)
    {
        //  The State that owns this plugin
        this.state = state;

        this.cameras = state.cameras.cameras;

        //  GlobalInputManager
        this.manager = game.input;

        //  Should use State event dispatcher?
        this.events = this.manager.events;

        this.keyboard = this.manager.keyboard;
        this.mouse = this.manager.mouse;

        this._size = 0;
        this._list = [];
        this._pendingInsertion = [];
        this._pendingRemoval = [];
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

        //  Move pending to active
        for (i = 0; i < toInsert; i++)
        {
            gameObject = this._pendingInsertion[i];

            //  Swap for Input Enabled Object
            this._list.push({ gameObject: gameObject, over: false, down: false, localX: 0, localY: 0 });
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
        if (this.manager.activePointer.hasMoved)
        {
            this.processPointer(this.manager.activePointer);
        }
    },

    processPointer: function (pointer)
    {
        var over = [];

        //  Returns an array of objects the pointer is over

        for (var i = 0; i < this.cameras.length; i++)
        {
            var camera = this.cameras[i];

            if (camera.inputEnabled)
            {
                over = over.concat(this.manager.hitTest(this._list, pointer.x, pointer.y, camera));
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
