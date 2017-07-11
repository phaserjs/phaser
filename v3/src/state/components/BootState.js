var BootState = function (state)
{
    // console.log('bootState', state.sys.settings.key);

    if (state.init)
    {
        state.init.call(state, state.sys.settings.data);
    }

    var loader = state.sys.load;
        
    loader.reset();

    if (state.preload)
    {
        state.preload(this.game);

        //  Is the loader empty?
        if (loader.list.size === 0)
        {
            this.create(state);
        }
        else
        {
            //  Start the loader going as we have something in the queue

            loader.events.once('LOADER_COMPLETE_EVENT', this.loadComplete.bind(this));

            loader.start();
        }
    }
    else
    {
        //  No preload? Then there was nothing to load either
        this.create(state);
    }
};

module.exports = BootState;
