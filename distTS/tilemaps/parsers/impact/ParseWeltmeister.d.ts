/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Formats: any;
declare var MapData: any;
declare var ParseTileLayers: (json: any, insertNull: any) => any[];
declare var ParseTilesets: (json: any) => any[];
/**
 * @namespace Phaser.Tilemaps.Parsers.Impact
 */
/**
 * Parses a Weltmeister JSON object into a new MapData object.
 *
 * @function Phaser.Tilemaps.Parsers.Impact.ParseWeltmeister
 * @since 3.0.0
 *
 * @param {string} name - The name of the tilemap, used to set the name on the MapData.
 * @param {object} json - The Weltmeister JSON object.
 * @param {boolean} insertNull - Controls how empty tiles, tiles with an index of -1, in the map
 * data are handled. If `true`, empty locations will get a value of `null`. If `false`, empty
 * location will get a Tile object with an index of -1. If you've a large sparsely populated map and
 * the tile data doesn't need to change then setting this value to `true` will help with memory
 * consumption. However if your map is small or you need to update the tiles dynamically, then leave
 * the default value set.
 *
 * @return {?object} [description]
 */
declare var ParseWeltmeister: any;
