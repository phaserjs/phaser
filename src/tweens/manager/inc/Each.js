// Passes all Tweens to the given callback.

/**
 * [description]
 *
 * @method Phaser.Tweens.TweenManager#each
 * @since 3.0.0
 *
 * @param {function} callback - [description]
 * @param {object} [thisArg] - [description]
 * @param {...*} [arguments] - [description]
 */
var Each = function (callback, thisArg)
{
    var args = [ null ];

    for (var i = 1; i < arguments.length; i++)
    {
        args.push(arguments[i]);
    }

    for (var texture in this.list)
    {
        args[0] = this.list[texture];

        callback.apply(thisArg, args);
    }
};

module.exports = Each;
