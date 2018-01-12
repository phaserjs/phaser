var ProcessUpEvents = function (pointer)
{
    var currentlyOver = this._temp;

    //  Contains ALL Game Objects currently up in the array
    this.emit('pointerup', pointer, currentlyOver);

    //  Go through all objects the pointer was over and fire their events / callbacks
    for (var i = 0; i < currentlyOver.length; i++)
    {
        var gameObject = currentlyOver[i];

        if (!gameObject.input)
        {
            continue;
        }

        gameObject.emit('pointerup', pointer, gameObject.input.localX, gameObject.input.localY);

        this.emit('gameobjectup', pointer, gameObject);
    }
};

module.exports = ProcessUpEvents;
