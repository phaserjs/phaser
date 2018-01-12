var ProcessDownEvents = function (pointer)
{
    var currentlyOver = this._temp;

    //  Contains ALL Game Objects currently over in the array
    this.emit('pointerdown', pointer, currentlyOver);

    //  Go through all objects the pointer was over and fire their events / callbacks
    for (var i = 0; i < currentlyOver.length; i++)
    {
        var gameObject = currentlyOver[i];

        if (!gameObject.input)
        {
            continue;
        }

        gameObject.emit('pointerdown', pointer, gameObject.input.localX, gameObject.input.localY, pointer.camera);

        this.emit('gameobjectdown', pointer, gameObject);
    }
};

module.exports = ProcessDownEvents;
