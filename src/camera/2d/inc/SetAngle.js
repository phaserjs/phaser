var DegToRad = require('../../../math/DegToRad');

var SetAngle = function (value)
{
    if (value === undefined) { value = 0; }

    this.rotation = DegToRad(value);

    return this;
};

module.exports = SetAngle;
