var ProcessMoveEvents = function (pointer)
{
    var currentlyOver = this._temp;

    this.emit('pointermove', pointer, currentlyOver);

    //  Go through all objects the pointer was over and fire their events / callbacks
    for (var i = 0; i < currentlyOver.length; i++)
    {
        var gameObject = currentlyOver[i];

        if (!gameObject.input)
        {
            continue;
        }

        gameObject.emit('pointermove', pointer, gameObject.input.localX, gameObject.input.localY);

        this.emit('gameobjectmove', pointer, gameObject);

        if (this.topOnly)
        {
            break;
        }
    }
};

module.exports = ProcessMoveEvents;
