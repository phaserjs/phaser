var Update = function (time, delta)
{
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
        this._temp = this.hitTestPointer(pointer);

        this.sortGameObjects(this._temp);

        this.processDragEvents(pointer, time);

        this.processOverOutEvents(pointer);

        if (pointer.justDown)
        {
            this.processDownEvents(pointer);
        }

        if (pointer.justUp)
        {
            this.processUpEvents(pointer);
        }

        if (pointer.justMoved)
        {
            this.processMoveEvents(pointer);
        }
    }
};

module.exports = Update;
