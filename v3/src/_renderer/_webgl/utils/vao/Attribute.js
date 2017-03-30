var Attribute = function (location, size, type, normalized, stride, offset)
{
    this.location = location;
    this.size = size;
    this.type = type;
    this.normalized = normalized;
    this.stride = stride;
    this.offset = offset;
};

module.exports = Attribute;
