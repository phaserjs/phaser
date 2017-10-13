var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var ResumeAllAnimationEvent = new Class({

    Extends: Event,

    initialize:

    /**
     * [description]
     *
     * @event ResumeAllAnimationEvent
     * @type {Phaser.Event}
     */
    function ResumeAllAnimationEvent ()
    {
        Event.call(this, 'RESUME_ALL_ANIMATION_EVENT');
    }

});

module.exports = ResumeAllAnimationEvent;
