var Event = require('../events/');

var ResumeAll = function ()
{
    if (this.paused)
    {
        this.paused = false;

        this.events.dispatch(new Event.RESUME_ALL_ANIMATION_EVENT());
    }

    return this;
};

module.exports = ResumeAll;
