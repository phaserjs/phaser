var RoundAwayFromZero = function (value)
{
    // "Opposite" of truncate.
    return (value > 0) ? Math.ceil(value) : Math.floor(value);
};

module.exports = RoundAwayFromZero;
