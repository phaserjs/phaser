/**
 * [description]
 *
 * @method Phaser.Tweens.TweenManager#resumeAll
 * @since 3.0.0
 *
 * @return {Phaser.Tweens.TweenManager} [description]
 */
var ResumeAll = function ()
{
    var list = this._active;

    for (var i = 0; i < list.length; i++)
    {
        list[i].resume();
    }

    return this;
};

module.exports = ResumeAll;
