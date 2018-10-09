/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Calibrate = function (coords, cushion)
{
    if (cushion === undefined) { cushion = 0; }

    var output = {
        width: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    };

    output.width = (output.right = coords.right + cushion) - (output.left = coords.left - cushion);
    output.height = (output.bottom = coords.bottom + cushion) - (output.top = coords.top - cushion);

    return output;
};

module.exports = Calibrate;
