var Class = require('../utils/Class');
var InputEvent = require('../input/local/events');
var SceneInputManager = require('../input/local/SceneInputManager');

var InputManager = new Class({

    Extends: SceneInputManager,

    initialize:

    function InputManager (scene, game)
    {
        SceneInputManager.call(this, scene, game);
    },

    /*
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
    */

});

module.exports = InputManager;
