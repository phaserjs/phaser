var IsEvenStrict = function (value)
{
    // Use strict equality === for "is number" test
    return (value === parseFloat(value)) ? !(value % 2) : void 0;
};

module.exports = IsEvenStrict;
