/**
 * [description]
 *
 * @method Phaser.Animations.AnimationManager#add
 * @fires AddAnimationEvent
 * @since 3.0.0
 * 
 * @param {string} key - [description]
 * @param {Phaser.Animations.Animation} animation - [description]
 * 
 * @return {Phaser.Animations.AnimationManager} The Animation Manager for method chaining.
 */
var AddAnimation = function (key, animation)
{
    if (this.anims.has(key))
    {
        console.warn('Animation with key', key, 'already exists');
        return;
    }

    animation.key = key;

    this.anims.set(key, animation);

    this.emit('add', key, animation);

    return this;
};

module.exports = AddAnimation;
