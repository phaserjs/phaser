/**
 * [description]
 *
 * @method Phaser.Tweens.TweenManager#pauseAll
 * @since 3.0.0
 *
 * @return {Phaser.Tweens.TweenManager} [description]
 */
var PauseAll = function ()
{
    var list = this._active;

    for (var i = 0; i < list.length; i++)
    {
        list[i].pause();
    }

    return this;
};

module.exports = PauseAll;
