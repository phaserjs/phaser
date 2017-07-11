var Start = function (key, data)
{
    if (data === undefined) { data = {}; }

    // console.log('start:', key);
    // console.dir(data);

    //  if not booted, then put state into a holding pattern
    if (!this.game.isBooted)
    {
        // console.log('GlobalStateManager not yet booted, setting autoStart on pending list');

        for (var i = 0; i < this._pending.length; i++)
        {
            var entry = this._pending[i];

            if (entry.key === key)
            {
                entry.autoStart = true;
                entry.data = data;
            }
        }

        return;
    }

    var state = this.getState(key);

    // console.log(state);

    if (state)
    {
        //  Already started? Nothing more to do here ...
        if (this.isActive(key))
        {
            return;
        }

        state.sys.start(data);

        var loader = state.sys.load;

        //  Files payload?
        if (loader && Array.isArray(state.sys.settings.files))
        {
            loader.reset();

            if (loader.loadArray(state.sys.settings.files))
            {
                loader.events.once('LOADER_COMPLETE_EVENT', this.payloadComplete.bind(this));

                loader.start();
            }
            else
            {
                this.bootState(state);
            }
        }
        else
        {
            this.bootState(state);
        }
    }
};

module.exports = Start;
