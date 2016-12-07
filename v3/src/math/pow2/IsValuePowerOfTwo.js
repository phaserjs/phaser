//  Is value a power of 2?

var IsValuePowerOfTwo (value)
{
    return (value > 0 && (value & (value - 1)) === 0);
};

module.exports = IsValuePowerOfTwo;
