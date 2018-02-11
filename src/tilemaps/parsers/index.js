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
