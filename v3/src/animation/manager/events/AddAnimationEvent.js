var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var AddAnimationEvent = new Class({

    Extends: Event,

    initialize:

    /**
     * [description]
     *
     * @event AddAnimationEvent
     * @type {Phaser.Event}
     *
     * @param {string} key - [description]
     * @param {Phaser.Animations.Animation} animation - [description]
     */
    function AddAnimationEvent (key, animation)
    {
        Event.call(this, 'ADD_ANIMATION_EVENT');

        this.key = key;
        this.animation = animation;
    }

});

module.exports = AddAnimationEvent;
