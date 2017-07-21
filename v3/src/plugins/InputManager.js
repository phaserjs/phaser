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
    }

    /*
    childOnDragStart: function (index, pointer, interactiveObject)
    {
        interactiveObject.isDragged = true;

        interactiveObject.dragX = interactiveObject.localX - interactiveObject.gameObject.displayOriginX;
        interactiveObject.dragY = interactiveObject.localY - interactiveObject.gameObject.displayOriginY;

        this.events.dispatch(new InputEvent.DRAG_START(pointer, gameObject));

        gameObject.input.onDragStart(gameObject, pointer);
    },

    childOnDrag: function (index, pointer, interactiveObject)
    {
        this.events.dispatch(new InputEvent.DRAG(pointer, gameObject));

        gameObject.input.onDrag(gameObject, pointer);
    },

    childOnDragEnd: function (index, pointer, interactiveObject)
    {
        var input = gameObject.input;

        input.isDragged = false;

        this.events.dispatch(new InputEvent.DRAG_END(pointer, gameObject));

        gameObject.input.onDragEnd(gameObject, pointer);
    },
    */
});

module.exports = InputManager;
