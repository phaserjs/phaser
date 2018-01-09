/**
 * [description]
 *
 * @method Phaser.Tweens.TweenManager#setGlobalTimeScale
 * @since 3.0.0
 *
 * @param {float} value - [description]
 *
 * @return {Phaser.Tweens.TweenManager} [description]
 */
var SetGlobalTimeScale = function (value)
{
    this.timeScale = value;

    return this;
};

module.exports = SetGlobalTimeScale;
