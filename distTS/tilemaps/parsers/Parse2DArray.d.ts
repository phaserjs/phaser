/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Formats: any;
declare var LayerData: any;
declare var MapData: any;
declare var Tile: any;
/**
 * Parses a 2D array of tile indexes into a new MapData object with a single layer.
 *
 * @function Phaser.Tilemaps.Parsers.Parse2DArray
 * @since 3.0.0
 *
 * @param {string} name - The name of the tilemap, used to set the name on the MapData.
 * @param {integer[][]} data - 2D array, CSV string or Tiled JSON object.
 * @param {integer} tileWidth - The width of a tile in pixels.
 * @param {integer} tileHeight - The height of a tile in pixels.
 * @param {boolean} insertNull - Controls how empty tiles, tiles with an index of -1, in the map
 * data are handled. If `true`, empty locations will get a value of `null`. If `false`, empty
 * location will get a Tile object with an index of -1. If you've a large sparsely populated map and
 * the tile data doesn't need to change then setting this value to `true` will help with memory
 * consumption. However if your map is small or you need to update the tiles dynamically, then leave
 * the default value set.
 *
 * @return {Phaser.Tilemaps.MapData} [description]
 */
declare var Parse2DArray: any;
