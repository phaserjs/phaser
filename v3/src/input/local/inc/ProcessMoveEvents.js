var InputEvent = require('../events');

var ProcessMoveEvents = function (pointer)
{
    var currentlyOver = this._temp;

    this.events.dispatch(new InputEvent.POINTER_MOVE(pointer, currentlyOver));

    //  Go through all objects the pointer was over and fire their events / callbacks
    for (var i = 0; i < currentlyOver.length; i++)
    {
        var gameObject = currentlyOver[i];

        if (!gameObject.input)
        {
            continue;
        }

        this.events.dispatch(new InputEvent.GAME_OBJECT_MOVE(pointer, gameObject));

        if (gameObject.input)
        {
            gameObject.input.onMove(gameObject, pointer, gameObject.input.localX, gameObject.input.localY);
        }

        if (this.topOnly)
        {
            break;
        }
    }
};

module.exports = ProcessMoveEvents;
