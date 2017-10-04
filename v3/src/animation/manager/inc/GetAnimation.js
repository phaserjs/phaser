/**
 * [description]
 *
 * @method Phaser.Animations.AnimationManager#get
 * @since 3.0.0
 * 
 * @param {string} key - [description]
 * 
 * @return {Phaser.Animations.Animation} [description]
 */
var GetAnimation = function (key)
{
    return this.anims.get(key);
};

module.exports = GetAnimation;
