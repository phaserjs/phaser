var Update = function (time, delta)
{
    if (this._size === 0)
    {
        return;
    }

    var pointer = this.manager.activePointer;

    var runUpdate = (pointer.dirty || this.pollRate === 0);

    if (this.pollRate > -1)
    {
        this._pollTimer -= delta;

        if (this._pollTimer < 0)
        {
            runUpdate = true;

            //  Discard timer diff
            this._pollTimer = this.pollRate;
        }
    }

    if (runUpdate)
    {
        var results = this.hitTestPointer(pointer);

        this.processOverOutEvents(pointer, results);

        if (pointer.justUp || pointer.justDown)
        {
            this.processUpDownEvents(pointer, results);
        }

        if (pointer.justMoved)
        {
            this.processMovementEvents(pointer, results);
        }
    }
};

module.exports = Update;
