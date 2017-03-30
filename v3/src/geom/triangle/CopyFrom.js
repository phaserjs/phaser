/**
* Copies the x1, y1 - x3, y3 properties from any given object to this Triangle.
* @method Phaser.Line#copyFrom
* @param {any} source - The object to copy from.
* @return {Line} This Line object.
*/
var CopyFrom = function (source, dest)
{
    return dest.setTo(source.x1, source.y1, source.x2, source.y2, source.x3, source.y3);
};

module.exports = CopyFrom;
