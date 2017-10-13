/**
 * [description]
 *
 * @method Phaser.Curves.Path#destroy
 * @since 3.0.0
 */
var Destroy = function ()
{
    this.curves.length = 0;
    this.cacheLengths.length = 0;
    this.startPoint = undefined;
};

module.exports = Destroy;
