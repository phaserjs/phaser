var Normalize = require('./Normalize');
var Multiply = require('./Multiply');

/**
 * [description]
 *
 * @function Phaser.Geom.Point.SetMagnitude
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} point - [description]
 * @param {number} magnitude - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var SetMagnitude = function (point, magnitude)
{
    Normalize(point);

    return Multiply(point, magnitude, magnitude);
};

module.exports = SetMagnitude;
