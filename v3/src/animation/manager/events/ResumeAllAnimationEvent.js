var Event = require('../../../events/Event');

var ResumeAllAnimationEvent = function ()
{
    Event.call(this, 'RESUME_ALL_ANIMATION_EVENT');
};

ResumeAllAnimationEvent.prototype = Object.create(Event.prototype);
ResumeAllAnimationEvent.prototype.constructor = ResumeAllAnimationEvent;

module.exports = ResumeAllAnimationEvent;
