var FloatBetween = function (min, max)
{
    return Math.random() * (max - min) + min;
};

module.exports = FloatBetween;
