/**
 * [description]
 *
 * @method Phaser.Tweens.TweenManager#killTweensOf
 * @since 3.0.0
 *
 * @param {object|array} target - [description]
 *
 * @return {Phaser.Tweens.TweenManager} [description]
 */
var KillTweensOf = function (target)
{
    var tweens = this.getTweensOf(target);

    for (var i = 0; i < tweens.length; i++)
    {
        tweens[i].stop();
    }

    return this;
};

module.exports = KillTweensOf;
