/**
 * [description]
 *
 * @function Phaser.Math.Between
 * @since 3.0.0
 *
 * @param {integer} min - [description]
 * @param {integer} max - [description]
 *
 * @return {integer} [description]
 */
var Between = function (min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports = Between;
