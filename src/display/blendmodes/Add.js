/**
* Adds the source and backdrop colors together and returns the value, up to a maximum of 255.
*/
var Add = function (a, b)
{
    return Math.min(255, a + b);
};

module.exports = Add;
