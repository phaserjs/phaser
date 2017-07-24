var InputEvent = require('../events');

var ProcessDownEvents = function (pointer, currentlyOver)
{
    this.events.dispatch(new InputEvent.POINTER_DOWN(pointer, currentlyOver));

    //  Go through all objects the pointer was over and fire their events / callbacks
    for (var i = 0; i < currentlyOver.length; i++)
    {
        var interactiveObject = currentlyOver[i];

        this.events.dispatch(new InputEvent.GAME_OBJECT_DOWN(pointer, interactiveObject));

        interactiveObject.onDown(interactiveObject.gameObject, pointer, interactiveObject.localX, interactiveObject.localY);
    }
};

module.exports = ProcessDownEvents;
