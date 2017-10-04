var Event = require('../events/');
var Animation = require('../../frame/Animation');

/**
 * [description]
 *
 * @method Phaser.Animations.AnimationManager#create
 * @fires AddAnimationEvent
 * @since 3.0.0
 * 
 * @param {object} config - [description]
 * @return {Phaser.Animations.Animation} The Animation that was created.
 */
var CreateFrameAnimation = function (config)
{
    var key = config.key;

    if (!key || this.anims.has(key))
    {
        console.warn('Invalid Animation Key, or Key already in use: ' + key);
        return;
    }

    var anim = new Animation(this, key, config);

    this.anims.set(key, anim);

    this.events.dispatch(new Event.ADD_ANIMATION_EVENT(key, anim));

    return anim;
};

module.exports = CreateFrameAnimation;
