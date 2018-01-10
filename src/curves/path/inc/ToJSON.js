/**
 * [description]
 *
 * @method Phaser.Curves.Path#toJSON
 * @since 3.0.0
 *
 * @return {object} [description]
 */
var ToJSON = function ()
{
    var out = [];

    for (var i = 0; i < this.curves.length; i++)
    {
        out.push(this.curves[i].toJSON());
    }

    return {
        type: 'Path',
        x: this.startPoint.x,
        y: this.startPoint.y,
        autoClose: this.autoClose,
        curves: out
    };
};

module.exports = ToJSON;
