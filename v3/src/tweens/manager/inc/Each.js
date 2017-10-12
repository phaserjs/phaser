/**
* Passes all Tweens to the given callback.
*
* @method each
* @param {function} callback - The function to call.
* @param {object} [thisArg] - Value to use as `this` when executing callback.
* @param {...*} [arguments] - Additional arguments that will be passed to the callback, after the child.
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
