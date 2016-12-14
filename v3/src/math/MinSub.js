var MinSub = function (value, amount, min)
{
    return Math.max(value - amount, min);
};

module.exports = MinSub;
