/**
* Copies the x, y and diameter properties from any given object to this Circle.
*/
var CopyFrom = function (source, dest)
{
    return dest.setTo(source.x, source.y, source.radius);
};

module.exports = CopyFrom;
