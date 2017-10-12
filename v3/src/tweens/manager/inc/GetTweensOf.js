/**
 * [description]
 *
 * @method Phaser.Tweens.TweenManager#getTweensOf
 * @since 3.0.0
 *
 * @param {object|array} target - [description]
 *
 * @return {Phaser.Tweens.Tween[]} [description]
 */
var GetTweensOf = function (target)
{
    var list = this._active;
    var tween;
    var output = [];
    var i;

    if (Array.isArray(target))
    {
        for (i = 0; i < list.length; i++)
        {
            tween = list[i];

            for (var t = 0; t < target.length; i++)
            {
                if (tween.hasTarget(target[t]))
                {
                    output.push(tween);
                }
            }
        }
    }
    else
    {
        for (i = 0; i < list.length; i++)
        {
            tween = list[i];

            if (tween.hasTarget(target))
            {
                output.push(tween);
            }
        }
    }

    return output;
};

module.exports = GetTweensOf;
