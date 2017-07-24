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
        var results = this.hitTestPointer(pointer);

        if (this.topOnly && results.length > 0)
        {
            this.sortInteractiveObjects(results);

            var top = results[0];

            results = [ top ];
        }

        this.processOverOutEvents(pointer, results);

        if (pointer.justUp)
        {
            this.processUpEvents(pointer, results);
        }

        if (pointer.justDown)
        {
            this.processDownEvents(pointer, results);
        }

        if (pointer.justMoved)
        {
            this.processMoveEvents(pointer, results);
        }
    }
};

module.exports = Update;
