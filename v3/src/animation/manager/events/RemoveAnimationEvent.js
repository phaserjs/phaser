var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var RemoveAnimationEvent = new Class({

    Extends: Event,

    initialize:

    function RemoveAnimationEvent (key, animation)
    {
        Event.call(this, 'REMOVE_ANIMATION_EVENT');

        this.key = key;
        this.animation = animation;
    }

});

module.exports = RemoveAnimationEvent;
