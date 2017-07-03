var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var ResumeAllAnimationEvent = new Class({

    Extends: Event,

    initialize:

    function ResumeAllAnimationEvent ()
    {
        Event.call(this, 'RESUME_ALL_ANIMATION_EVENT');
    }

});

module.exports = ResumeAllAnimationEvent;
