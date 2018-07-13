/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Formats: any;
declare var Parse2DArray: any;
declare var ParseCSV: any;
declare var ParseJSONTiled: any;
declare var ParseWeltmeister: any;
/**
 * Parses raw data of a given Tilemap format into a new MapData object. If no recognized data format
 * is found, returns `null`. When loading from CSV or a 2D array, you should specify the tileWidth &
 * tileHeight. When parsing from a map from Tiled, the tileWidth & tileHeight will be pulled from
 * the map data.
 *
 * @function Phaser.Tilemaps.Parsers.Parse
 * @since 3.0.0
 *
 * @param {string} name - The name of the tilemap, used to set the name on the MapData.
 * @param {integer} mapFormat - See ../Formats.js.
 * @param {(integer[][]|string|object)} data - 2D array, CSV string or Tiled JSON object.
 * @param {integer} tileWidth - The width of a tile in pixels. Required for 2D array and CSV, but
 * ignored for Tiled JSON.
 * @param {integer} tileHeight - The height of a tile in pixels. Required for 2D array and CSV, but
 * ignored for Tiled JSON.
 * @param {boolean} insertNull - Controls how empty tiles, tiles with an index of -1, in the map
 * data are handled. If `true`, empty locations will get a value of `null`. If `false`, empty
 * location will get a Tile object with an index of -1. If you've a large sparsely populated map and
 * the tile data doesn't need to change then setting this value to `true` will help with memory
 * consumption. However if your map is small or you need to update the tiles dynamically, then leave
 * the default value set.
 *
 * @return {Phaser.Tilemaps.MapData} [description]
 */
declare var Parse: any;
