/**
 * [description]
 *
 * @method Phaser.Tweens.TweenManager#killAll
 * @since 3.0.0
 *
 * @return {Phaser.Tweens.TweenManager} [description]
 */
var KillAll = function ()
{
    var tweens = this.getAllTweens();

    for (var i = 0; i < tweens.length; i++)
    {
        tweens[i].stop();
    }

    return this;
};

module.exports = KillAll;
