/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.Tilemaps.Parsers
 */

module.exports = {

    Parse: require('./Parse'),
    Parse2DArray: require('./Parse2DArray'),
    ParseCSV: require('./ParseCSV'),

    Impact: require('./impact/ParseWeltmeister'),
    Tiled: require('./tiled/ParseJSONTiled')

};
