//  A proxy class to the Global State Manager

var StateManager = function (state, game)
{
    //  The State that owns this StateManager
    this.state = state;

    this.settings = state.sys.settings;

    this.key = state.sys.settings.key;

    //  GlobalStateManager
    this.manager = game.state;

    //  Private
    this._queue = [];
};

StateManager.prototype = {

    update: function ()
    {
        var len = this._queue.length;

        if (len === 0)
        {
            return;
        }

        var manager = this.manager;

        //  Process the queue
        for (var i = 0; i < len; i++)
        {
            var action = this._queue[i];

            switch (action.type)
            {
                case 'start':
                    manager.stop(this.key);
                    manager.start(action.key, action.data);
                    break;

                case 'launch':
                    manager.start(action.key, action.data);
                    break;

                case 'pause':
                    manager.pause(action.key);
                    break;

                case 'resume':
                    manager.resume(action.key);
                    break;

                case 'stop':
                    manager.stop(action.key);
                    break;

                case 'swap':
                    manager.swap(this.key, action.key);
                    break;

                case 'sleep':
                    manager.sleep(action.key);
                    break;

                case 'wake':
                    manager.wake(action.key);
                    break;
            }
        }

        this._queue.length = 0;
    },

    //  Shutdown this State and run the given one
    start: function (key, data)
    {
        if (key === undefined) { key = this.key; }

        this._queue.push({ type: 'start', key: key, data: data });

        return this;
    },

    //  Launch the given State and run it in parallel with this one
    launch: function (key, data)
    {
        if (key === undefined) { key = this.key; }

        this._queue.push({ type: 'launch', key: key, data: data });

        return this;
    },

    //  Pause the State - this stops the update step from happening but it still renders
    pause: function (key)
    {
        if (key === undefined) { key = this.key; }

        this._queue.push({ type: 'pause', key: key });

        return this;
    },

    //  Resume the State - starts the update loop again
    resume: function (key)
    {
        if (key === undefined) { key = this.key; }

        this._queue.push({ type: 'resume', key: key });

        return this;
    },

    //  Makes the State sleep (no update, no render) but doesn't shutdown
    sleep: function (key)
    {
        this._queue.push({ type: 'sleep', key: key });

        return this;
    },

    //  Makes the State wake-up (starts update and render)
    wake: function (key)
    {
        this._queue.push({ type: 'wake', key: key });

        return this;
    },

    //  Makes this State sleep then starts the State given
    swap: function (key)
    {
        this._queue.push({ type: 'swap', key: key });

        return this;
    },

    //  Shutdown the State, clearing display list, timers, etc
    stop: function (key)
    {
        if (key === undefined) { key = this.key; }

        this._queue.push({ type: 'stop', key: key });

        return this;
    },

    setVisible: function (value)
    {
        this.settings.visible = value;

        return this;
    },

    moveUp: function ()
    {
        this._queue.push({ type: 'moveUp' });
    },

    moveDown: function ()
    {
        this._queue.push({ type: 'moveDown' });
    },

    bringToTop: function ()
    {
        this._queue.push({ type: 'bringToTop' });
    },

    sendToBack: function ()
    {
        this._queue.push({ type: 'sendToBack' });
    },

    transitionTo: function (key, duration)
    {
    },

    isActive: function (key)
    {
        if (key === undefined) { key = this.key; }

        return this.manager.isActive(key);
    }

};

StateManager.prototype.constructor = StateManager;

module.exports = StateManager;
