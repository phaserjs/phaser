/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var DegToRad: any;
declare var DynamicTilemapLayer: any;
declare var Extend: any;
declare var Formats: any;
declare var LayerData: any;
declare var Rotate: (items: any, value: any, step: any, index: any, direction: any) => any;
declare var StaticTilemapLayer: any;
declare var Tile: any;
declare var TilemapComponents: any;
declare var Tileset: any;
/**
 * @callback TilemapFilterCallback
 *
 * @param {Phaser.GameObjects.GameObject} value - [description]
 * @param {number} index - [description]
 * @param {Phaser.GameObjects.GameObject[]} array - [description]
 *
 * @return {Phaser.GameObjects.GameObject} [description]
 */
/**
 * @callback TilemapFindCallback
 *
 * @param {Phaser.GameObjects.GameObject} value - [description]
 * @param {number} index - [description]
 * @param {Phaser.GameObjects.GameObject[]} array - [description]
 *
 * @return {boolean} [description]
 */
/**
 * @classdesc
 * A Tilemap is a container for Tilemap data. This isn't a display object, rather, it holds data
 * about the map and allows you to add tilesets and tilemap layers to it. A map can have one or
 * more tilemap layers (StaticTilemapLayer or DynamicTilemapLayer), which are the display
 * objects that actually render tiles.
 *
 * The Tilemap data be parsed from a Tiled JSON file, a CSV file or a 2D array. Tiled is a free
 * software package specifically for creating tile maps, and is available from:
 * http://www.mapeditor.org
 *
 * A Tilemap has handy methods for getting & manipulating the tiles within a layer. You can only
 * use the methods that change tiles (e.g. removeTileAt) on a DynamicTilemapLayer.
 *
 * Note that all Tilemaps use a base tile size to calculate dimensions from, but that a
 * StaticTilemapLayer or DynamicTilemapLayer may have its own unique tile size that overrides
 * it.
 *
 * @class Tilemap
 * @memberOf Phaser.Tilemaps
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Tilemap belongs.
 * @param {Phaser.Tilemaps.MapData} mapData - A MapData instance containing Tilemap data.
 */
declare var Tilemap: any;
