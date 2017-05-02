var Event = require('../../../events/Event');

var AddAnimationEvent = function (key, animation)
{
    Event.call(this, 'ADD_ANIMATION_EVENT');

    this.key = key;
    this.animation = animation;
};

AddAnimationEvent.prototype = Object.create(Event.prototype);
AddAnimationEvent.prototype.constructor = AddAnimationEvent;

module.exports = AddAnimationEvent;
