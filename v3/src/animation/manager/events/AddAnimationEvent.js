var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var AddAnimationEvent = new Class({

    Extends: Event,

    initialize:

    function AddAnimationEvent (key, animation)
    {
        Event.call(this, 'ADD_ANIMATION_EVENT');

        this.key = key;
        this.animation = animation;
    }

});

module.exports = AddAnimationEvent;
