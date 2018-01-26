/**
 * [description]
 *
 * @function Phaser.Utils.String.UppercaseFirst
 * @since 3.0.0
 *
 * @param {string} str - [description]
 *
 * @return {string} [description]
 */
var UppercaseFirst = function (str)
{
    return str && str[0].toUpperCase() + str.slice(1);
};

module.exports = UppercaseFirst;
