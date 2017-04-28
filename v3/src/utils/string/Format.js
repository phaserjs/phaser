/**
 * Replaces %1, %2, %3 etc in the String with the values
 * given in the array. Values are cast to strings.
 * If no value exists an empty string is inserted.
 * 
 * @param {string} string - The string containing the markers
 * @param {array} values - An array containing the values to replace the markers with
*/
var Format = function (string, values)
{
    string.replace(/%([0-9]+)/g, function (s, n)
    {
        return values[Number(n) - 1];
    });

    return string;
};

module.exports = Format;
