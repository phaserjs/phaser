var Event = require('../events/');

var PauseAll = function ()
{
    if (!this.paused)
    {
        this.paused = true;

        this.events.dispatch(new Event.PAUSE_ALL_ANIMATION_EVENT());
    }

    return this;
};

module.exports = PauseAll;
