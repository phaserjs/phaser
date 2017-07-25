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
        this.hitTestPointer(pointer, this._tempIO);

        this.sortInteractiveObjects(this._tempIO);

        if (this.topOnly && this._tempIO.length > 1)
        {
            this._tempIO = this._tempIO.splice(1);
        }

        this._tempGO.length = 0;

        for (var i = 0; i < this._tempIO.length; i++)
        {
            this._tempGO.push(this._tempIO[i].gameObject);
        }

        //  tempIO and tempGO now contain the sorted lists of InteractiveObjects
        //  and their corresponding GameObjects

        this.processOverOutEvents(pointer);

        if (pointer.justUp)
        {
            this.processUpEvents(pointer);
        }

        if (pointer.justDown)
        {
            this.processDownEvents(pointer);
        }

        if (pointer.justMoved)
        {
            this.processMoveEvents(pointer);
        }
    }
};

module.exports = Update;
