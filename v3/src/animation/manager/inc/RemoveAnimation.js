var Event = require('../events/');

/**
 * [description]
 *
 * @method Phaser.Animations.AnimationManager#remove
 * @fires RemoveAnimationEvent
 * @since 3.0.0
 * 
 * @param {string} key - [description]
 * 
 * @return {Phaser.Animations.Animation} [description]
 */
var RemoveAnimation = function (key)
{
    var anim = this.get(key);

    if (anim)
    {
        this.events.dispatch(new Event.REMOVE_ANIMATION_EVENT(key, anim));

        this.anims.delete(key);
    }

    return anim;
};

module.exports = RemoveAnimation;
