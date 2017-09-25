var InputEvent = require('../events');

var ProcessDownEvents = function (pointer)
{
    var currentlyOver = this._temp;

    this.events.dispatch(new InputEvent.POINTER_DOWN(pointer, currentlyOver));

    //  Go through all objects the pointer was over and fire their events / callbacks
    for (var i = 0; i < currentlyOver.length; i++)
    {
        var gameObject = currentlyOver[i];

        if (!gameObject.input)
        {
            continue;
        }

        this.events.dispatch(new InputEvent.GAME_OBJECT_DOWN(pointer, gameObject));

        if (gameObject.input)
        {
            gameObject.input.onDown(gameObject, pointer, gameObject.input.localX, gameObject.input.localY);
        }

        if (this.topOnly)
        {
            break;
        }
    }
};

module.exports = ProcessDownEvents;
