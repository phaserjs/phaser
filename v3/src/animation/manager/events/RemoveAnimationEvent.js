var Event = require('../../../events/Event');

var RemoveAnimationEvent = function (key, animation)
{
    Event.call(this, 'REMOVE_ANIMATION_EVENT');

    this.key = key;
    this.animation = animation;
};

RemoveAnimationEvent.prototype = Object.create(Event.prototype);
RemoveAnimationEvent.prototype.constructor = RemoveAnimationEvent;

module.exports = RemoveAnimationEvent;
