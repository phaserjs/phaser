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

    childOnMove: function (pointer, interactiveObject)
    {
        interactiveObject.onMove(interactiveObject.gameObject, pointer);
    },

    childOnDragStart: function (pointer, interactiveObject)
    {
        var gameObject = interactiveObject.gameObject;

        var dragX = interactiveObject.localX - gameObject.displayOriginX;
        var dragY = interactiveObject.localY - gameObject.displayOriginY;

        var result = interactiveObject.onDragStart(gameObject, pointer, dragX, dragY);

        if (result !== false)
        {
            interactiveObject.isDragged = true;

            interactiveObject.dragX = dragX;
            interactiveObject.dragY = dragY;

            this.events.dispatch(new InputEvent.DRAG_START(pointer, gameObject));
        }
    },

    childOnDrag: function (index, pointer, interactiveObject)
    {
        this.events.dispatch(new InputEvent.DRAG(pointer, interactiveObject.gameObject));

        interactiveObject.onDrag(interactiveObject.gameObject, pointer);
    },

    childOnDragEnd: function (index, pointer, interactiveObject)
    {
        interactiveObject.isDragged = false;

        this.events.dispatch(new InputEvent.DRAG_END(pointer, interactiveObject.gameObject));

        interactiveObject.onDragEnd(interactiveObject.gameObject, pointer);
    }

});

module.exports = InputManager;
