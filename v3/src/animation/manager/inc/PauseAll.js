var Event = require('../events/');

/**
 * [description]
 *
 * @method Phaser.Animations.AnimationManager#pauseAll
 * @fires PauseAllAnimationEvent
 * @since 3.0.0
 * 
 * @return {Phaser.Animations.AnimationManager} The Animation Manager for method chaining.
 */
var PauseAll = function ()
{
    if (!this.paused)
    {
        this.paused = true;

        this.events.dispatch(new Event.PAUSE_ALL_ANIMATION_EVENT());
    }

    return this;
};

module.exports = PauseAll;
