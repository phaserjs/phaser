var Event = require('../../../events/Event');

var PauseAllAnimationEvent = function ()
{
    Event.call(this, 'PAUSE_ALL_ANIMATION_EVENT');
};

PauseAllAnimationEvent.prototype = Object.create(Event.prototype);
PauseAllAnimationEvent.prototype.constructor = PauseAllAnimationEvent;

module.exports = PauseAllAnimationEvent;
