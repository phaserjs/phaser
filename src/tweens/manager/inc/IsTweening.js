/**
 * [description]
 *
 * @method Phaser.Tweens.TweenManager#isTweening
 * @since 3.0.0
 *
 * @param {any} target - [description]
 *
 * @return {boolean} [description]
 */
var IsTweening = function (target)
{
    var list = this._active;
    var tween;

    for (var i = 0; i < list.length; i++)
    {
        tween = list[i];

        if (tween.hasTarget(target) && tween.isPlaying())
        {
            return true;
        }
    }

    return false;
};

module.exports = IsTweening;
