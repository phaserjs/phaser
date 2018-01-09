/**
 * [description]
 *
 * @method Phaser.Scenes.GlobalSceneManager#swap
 * @since 3.0.0
 *
 * @param {string} from - [description]
 * @param {string} to - [description]
 */
var Swap = function (from, to)
{
    this.sleep(from);

    if (this.isSleeping(to))
    {
        this.wake(to);
    }
    else
    {
        this.start(to);
    }
};

module.exports = Swap;
