/**
 * [description]
 *
 * @method Phaser.Curves.Path#add
 * @since 3.0.0
 *
 * @param {Phaser.Curves.Curve} curve - [description]
 *
 * @return {Phaser.Curves.Path} [description]
 */
var Add = function (curve)
{
    this.curves.push(curve);

    return this;
};

module.exports = Add;
