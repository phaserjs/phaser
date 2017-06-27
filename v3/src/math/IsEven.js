var IsEven = function (value)
{
    // Use abstract equality == for "is number" test
    return (value == parseFloat(value)) ? !(value % 2) : void 0;
};

module.exports = IsEven;
