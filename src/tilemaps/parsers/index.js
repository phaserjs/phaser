/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Tilemaps.Parsers
 */

module.exports = {

    FromOrientationString: require('./FromOrientationString'),
    Parse: require('./Parse'),
    Parse2DArray: require('./Parse2DArray'),
    ParseCSV: require('./ParseCSV'),

    Impact: require('./impact/'),
    Tiled: require('./tiled/')

};
