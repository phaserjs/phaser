var MathWrap from '../Wrap';

var WrapDegrees (angle)
{
    return MathWrap(angle, -180, 180);
};

module.exports = WrapDegrees;
