/**
 * [description]
 *
 * @function Phaser.Utils.Object.HasValue
 * @since 3.0.0
 *
 * @param {object} source - [description]
 * @param {string} key - [description]
 *
 * @return {boolean} [description]
 */
var HasValue = function (source, key)
{
    return (source.hasOwnProperty(key));
};

module.exports = HasValue;
