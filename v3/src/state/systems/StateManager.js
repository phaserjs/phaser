//  A proxy class to the Global State Manager

var StateManager = function (state, game)
{
    //  The State that owns this StateManager
    this.state = state;

    this.key = state.sys.settings.key;

    //  GlobalStateManager
    this.manager = game.state;
};

StateManager.prototype.constructor = StateManager;

StateManager.prototype = {

    //  Start this State (or the one given via key)
    start: function (key, data)
    {
        if (key === undefined) { key = this.key; }

        this.manager.start(key, data);
    },

    //  Pause this State (or the one given via key)
    pause: function (key)
    {
        if (key === undefined) { key = this.key; }

        this.manager.pause(key);
    },

    //  Stop this State and start the one given
    swap: function (key)
    {
        this.manager.pause(this.key);

        this.manager.start(key);
    },

    moveUp: function ()
    {

    },

    moveDown: function ()
    {

    },

    bringToTop: function ()
    {

    },

    sendToBack: function ()
    {

    },

    //  TODO
    transitionTo: function (key, duration)
    {
        this.manager.pause(this.key);

        this.manager.start(key);
    },

    isActive: function (key)
    {
        if (key === undefined) { key = this.key; }

        return this.manager.isActive(key);
    }

};

module.exports = StateManager;
