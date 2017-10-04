/**
 * Load an Animation into a Game Objects Animation Component.
 *
 * @method Phaser.Animations.AnimationManager#load
 * @since 3.0.0
 * 
 * @param {Phaser.GameObjects.GameObject} child - [description]
 * @param {string} key - [description]
 * @param {string|integer} [startFrame] - [description]
 * 
 * @return {Phaser.GameObjects.GameObject} [description]
 */
var LoadAnimationToGameObject = function (child, key, startFrame)
{
    var anim = this.get(key);

    if (anim)
    {
        anim.load(child, startFrame);
    }

    return child;
};

module.exports = LoadAnimationToGameObject;
