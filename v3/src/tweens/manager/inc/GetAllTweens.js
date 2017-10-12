/**
 * [description]
 *
 * @method Phaser.Tweens.TweenManager#getAllTweens
 * @since 3.0.0
 *
 * @return {Phaser.Tweens.Tween[]} [description]
 */
var GetAllTweens = function ()
{
    var list = this._active;
    var output = [];

    for (var i = 0; i < list.length; i++)
    {
        output.push(list[i]);
    }

    return output;
};

module.exports = GetAllTweens;
