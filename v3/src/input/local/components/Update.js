var Update = function (time, delta)
{
    //  If nothing is input enabled we can abort now
    if (this.children.size === 0)
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
        //  Update Process:

        //  1) Get all objects currently under the pointer
        //  2) Process Over and Out Events for both objects now under the pointer, and those that previously were
        //  3) Process Up and Down Events for new objects and old ones (i.e. pointer has moved outside object and then gone up)
        //  4) Process Movement Events

        var results = this.hitTestPointer(pointer);

        if (this.topOnly && results.length > 0)
        {
            this.sortInteractiveObjects(results);

            var top = results[0];

            results = [ top ];
        }

        //  This is run regardless if the pointer has moved so we capture moving Game Objects
        this.processOverOutEvents(pointer, results);

        // if (pointer.justUp || pointer.justDown)
        // {
        //     this.processUpDownEvents(pointer, results);
        // }

        // if (pointer.justMoved)
        // {
        //     this.processMovementEvents(pointer, results);
        // }
    }
};

module.exports = Update;
