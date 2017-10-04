var Event = require('../events/');

/**
 * [description]
 *
 * @method Phaser.Animations.AnimationManager#add
 * @since 3.0.0
 * 
 * @param {string} key - [description]
 * @param {Phaser.Animations.Animation} animation - [description]
 * @return {Phaser.Animations.AnimationManager} The Animation Manager for method chaining.
 */
var AddAnimation = function (key, animation)
{
    if (this.anims.has(key))
    {
        console.error('Animation with key', key, 'already exists');
        return;
    }

    animation.key = key;

    this.anims.set(key, animation);

    this.events.dispatch(new Event.ADD_ANIMATION_EVENT(key, animation));

    return this;
};

module.exports = AddAnimation;
