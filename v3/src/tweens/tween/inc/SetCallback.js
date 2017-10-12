/**
 * [description]
 *
 * @method Phaser.Tweens.Tween#setCallback
 * @since 3.0.0
 *
 * @param {string} type - [description]
 * @param {function} callback - [description]
 * @param {array} params - [description]
 * @param {object} scope - [description]
 *
 * @return {Phaser.Tweens.Tween} [description]
 */
var SetCallback = function (type, callback, params, scope)
{
    this.callbacks[type] = { func: callback, scope: scope, params: params };

    return this;
};

module.exports = SetCallback;
