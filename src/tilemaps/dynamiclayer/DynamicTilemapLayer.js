/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../../gameobjects/components');
var DynamicTilemapLayerRender = require('./DynamicTilemapLayerRender');
var GameObject = require('../../gameobjects/GameObject');
var TilemapComponents = require('../components');

/**
 * @classdesc
 * A DynamicTilemapLayer is a game object that renders LayerData from a Tilemap. A
 * DynamicTilemapLayer can only render tiles from a single tileset.
 *
 * A DynamicTilemapLayer trades some speed for being able to apply powerful effects. Unlike a
 * StaticTilemapLayer, you can apply per-tile effects like tint or alpha, and you can change the
 * tiles in a DynamicTilemapLayer. Use this over a StaticTilemapLayer when you need those
 * features.
 *
 * @class DynamicTilemapLayer
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.Tilemaps
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScaleMode
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * @extends Phaser.GameObjects.Components.ScrollFactor
 *
 * @param {Phaser.Scene} scene - [description]
 * @param {Phaser.Tilemaps.Tilemap} tilemap - The Tilemap this layer is a part of.
 * @param {integer} layerIndex - The index of the LayerData associated with this layer.
 * @param {Phaser.Tilemaps.Tileset} tileset - The tileset used to render the tiles in this layer.
 * @param {number} [x=0] - The world x position where the top left of this layer will be placed.
 * @param {number} [y=0] - The world y position where the top left of this layer will be placed.
 */
var DynamicTilemapLayer = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
        Components.Origin,
        Components.Pipeline,
        Components.ScaleMode,
        Components.Size,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        DynamicTilemapLayerRender
    ],

    initialize:

    function DynamicTilemapLayer (scene, tilemap, layerIndex, tileset, x, y)
    {
        GameObject.call(this, scene, 'DynamicTilemapLayer');

        /**
         * Used internally by physics system to perform fast type checks.
         *
         * @name Phaser.Tilemaps.DynamicTilemapLayer#isTilemap
         * @type {boolean}
         * @readOnly
         * @since 3.0.0
         */
        this.isTilemap = true;

        /**
         * The Tilemap that this layer is a part of.
         *
         * @name Phaser.Tilemaps.DynamicTilemapLayer#tilemap
         * @type {Phaser.Tilemaps.Tilemap}
         * @since 3.0.0
         */
        this.tilemap = tilemap;

        /**
         * The index of the LayerData associated with this layer.
         *
         * @name Phaser.Tilemaps.DynamicTilemapLayer#layerIndex
         * @type {integer}
         * @since 3.0.0
         */
        this.layerIndex = layerIndex;

        /**
         * The LayerData associated with this layer. LayerData can only be associated with one
         * tilemap layer.
         *
         * @name Phaser.Tilemaps.DynamicTilemapLayer#layer
         * @type {Phaser.Tilemaps.LayerData}
         * @since 3.0.0
         */
        this.layer = tilemap.layers[layerIndex];

        this.layer.tilemapLayer = this; // Link the LayerData with this static tilemap layer

        /**
         * The Tileset associated with this layer. A tilemap layer can only render from one Tileset.
         *
         * @name Phaser.Tilemaps.DynamicTilemapLayer#tileset
         * @type {Phaser.Tilemaps.Tileset}
         * @since 3.0.0
         */
        this.tileset = tileset;

        /**
         * Used internally with the canvas render. This holds the tiles that are visible within the
         * camera.
         *
         * @name Phaser.Tilemaps.DynamicTilemapLayer#culledTiles
         * @type {array}
         * @since 3.0.0
         */
        this.culledTiles = [];

        this.setAlpha(this.layer.alpha);
        this.setPosition(x, y);
        this.setOrigin();
        this.setSize(this.layer.tileWidth * this.layer.width, this.layer.tileHeight * this.layer.height);

        this.initPipeline('TextureTintPipeline');
    },

    /**
     * Calculates interesting faces at the given tile coordinates of the specified layer. Interesting
     * faces are used internally for optimizing collisions against tiles. This method is mostly used
     * internally to optimize recalculating faces when only one tile has been changed.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#calculateFacesAt
     * @since 3.0.0
     *
     * @param {integer} tileX - The x coordinate.
     * @param {integer} tileY - The y coordinate.
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    calculateFacesAt: function (tileX, tileY)
    {
        TilemapComponents.CalculateFacesAt(tileX, tileY, this.layer);

        return this;
    },

    /**
     * Calculates interesting faces within the rectangular area specified (in tile coordinates) of the
     * layer. Interesting faces are used internally for optimizing collisions against tiles. This method
     * is mostly used internally.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#calculateFacesWithin
     * @since 3.0.0
     *
     * @param {integer} [tileX=0] - [description]
     * @param {integer} [tileY=0] - [description]
     * @param {integer} [width=max width based on tileX] - [description]
     * @param {integer} [height=max height based on tileY] - [description]
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    calculateFacesWithin: function (tileX, tileY, width, height)
    {
        TilemapComponents.CalculateFacesWithin(tileX, tileY, width, height, this.layer);

        return this;
    },

    /**
     * Creates a Sprite for every object matching the given tile indexes in the layer. You can
     * optionally specify if each tile will be replaced with a new tile after the Sprite has been
     * created. This is useful if you want to lay down special tiles in a level that are converted to
     * Sprites, but want to replace the tile itself with a floor tile or similar once converted.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#createFromTiles
     * @since 3.0.0
     *
     * @param {(integer|array)} indexes - The tile index, or array of indexes, to create Sprites from.
     * @param {(integer|array)} replacements - The tile index, or array of indexes, to change a converted
     * tile to. Set to `null` to leave the tiles unchanged. If an array is given, it is assumed to be a
     * one-to-one mapping with the indexes array.
     * @param {object} spriteConfig - The config object to pass into the Sprite creator (i.e.
     * scene.make.sprite).
     * @param {Phaser.Scene} [scene=scene the map is within] - The Scene to create the Sprites within.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when determining the world XY
     *
     * @return {Phaser.GameObjects.Sprite[]} An array of the Sprites that were created.
     */
    createFromTiles: function (indexes, replacements, spriteConfig, scene, camera)
    {
        return TilemapComponents.CreateFromTiles(indexes, replacements, spriteConfig, scene, camera, this.layer);
    },

    /**
     * Returns the tiles in the given layer that are within the cameras viewport.
     * This is used internally.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#cull
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to run the cull check against.
     *
     * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
     */
    cull: function (camera)
    {
        return TilemapComponents.CullTiles(this.layer, camera, this.culledTiles);
    },

    /**
     * Copies the tiles in the source rectangular area to a new destination (all specified in tile
     * coordinates) within the layer. This copies all tile properties & recalculates collision
     * information in the destination region.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#copy
     * @since 3.0.0
     *
     * @param {integer} srcTileX - [description]
     * @param {integer} srcTileY - [description]
     * @param {integer} width - [description]
     * @param {integer} height - [description]
     * @param {integer} destTileX - [description]
     * @param {integer} destTileY - [description]
     * @param {boolean} [recalculateFaces=true] - [description]
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    copy: function (srcTileX, srcTileY, width, height, destTileX, destTileY, recalculateFaces)
    {
        TilemapComponents.Copy(srcTileX, srcTileY, width, height, destTileX, destTileY, recalculateFaces, this.layer);

        return this;
    },

    /**
     * Destroys this DynamicTilemapLayer and removes its link to the associated LayerData.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        // Uninstall this layer only if it is still installed on the LayerData object
        if (this.layer.tilemapLayer === this)
        {
            this.layer.tilemapLayer = undefined;
        }

        this.tilemap = undefined;
        this.layer = undefined;
        this.tileset = undefined;
        this.culledTiles.length = 0;

        GameObject.prototype.destroy.call(this);
    },

    /**
     * Sets the tiles in the given rectangular area (in tile coordinates) of the layer with the
     * specified index. Tiles will be set to collide if the given index is a colliding index.
     * Collision information in the region will be recalculated.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#fill
     * @since 3.0.0
     *
     * @param {integer} index - [description]
     * @param {integer} [tileX=0] - [description]
     * @param {integer} [tileY=0] - [description]
     * @param {integer} [width=max width based on tileX] - [description]
     * @param {integer} [height=max height based on tileY] - [description]
     * @param {boolean} [recalculateFaces=true] - [description]
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    fill: function (index, tileX, tileY, width, height, recalculateFaces)
    {
        TilemapComponents.Fill(index, tileX, tileY, width, height, recalculateFaces, this.layer);

        return this;
    },

    /**
     * For each tile in the given rectangular area (in tile coordinates) of the layer, run the given
     * filter callback function. Any tiles that pass the filter test (i.e. where the callback returns
     * true) will returned as a new array. Similar to Array.prototype.Filter in vanilla JS.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#filterTiles
     * @since 3.0.0
     *
     * @param {function} callback - The callback. Each tile in the given area will be passed to this
     * callback as the first and only parameter. The callback should return true for tiles that pass the
     * filter.
     * @param {object} [context] - The context under which the callback should be run.
     * @param {integer} [tileX=0] - [description]
     * @param {integer} [tileY=0] - [description]
     * @param {integer} [width=max width based on tileX] - [description]
     * @param {integer} [height=max height based on tileY] - [description]
     * @param {object} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {boolean} [filteringOptions.isNotEmpty=false] - If true, only return tiles that don't have
     * -1 for an index.
     * @param {boolean} [filteringOptions.isColliding=false] - If true, only return tiles that collide
     * on at least one side.
     * @param {boolean} [filteringOptions.hasInterestingFace=false] - If true, only return tiles that
     * have at least one interesting face.
     *
     * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
     */
    filterTiles: function (callback, context, tileX, tileY, width, height, filteringOptions)
    {
        return TilemapComponents.FilterTiles(callback, context, tileX, tileY, width, height, filteringOptions, this.layer);
    },

    /**
     * Searches the entire map layer for the first tile matching the given index, then returns that Tile
     * object. If no match is found, it returns null. The search starts from the top-left tile and
     * continues horizontally until it hits the end of the row, then it drops down to the next column.
     * If the reverse boolean is true, it scans starting from the bottom-right corner traveling up to
     * the top-left.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#findByIndex
     * @since 3.0.0
     *
     * @param {integer} index - The tile index value to search for.
     * @param {integer} [skip=0] - The number of times to skip a matching tile before returning.
     * @param {boolean} [reverse=false] - If true it will scan the layer in reverse, starting at the
     * bottom-right. Otherwise it scans from the top-left.
     *
     * @return {Phaser.Tilemaps.Tile} A Tile object.
     */
    findByIndex: function (findIndex, skip, reverse)
    {
        return TilemapComponents.FindByIndex(findIndex, skip, reverse, this.layer);
    },

    /**
     * Find the first tile in the given rectangular area (in tile coordinates) of the layer that
     * satisfies the provided testing function. I.e. finds the first tile for which `callback` returns
     * true. Similar to Array.prototype.find in vanilla JS.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#findTile
     * @since 3.0.0
     *
     * @param {function} callback - The callback. Each tile in the given area will be passed to this
     * callback as the first and only parameter.
     * @param {object} [context] - The context under which the callback should be run.
     * @param {integer} [tileX=0] - [description]
     * @param {integer} [tileY=0] - [description]
     * @param {integer} [width=max width based on tileX] - [description]
     * @param {integer} [height=max height based on tileY] - [description]
     * @param {object} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {boolean} [filteringOptions.isNotEmpty=false] - If true, only return tiles that don't have
     * -1 for an index.
     * @param {boolean} [filteringOptions.isColliding=false] - If true, only return tiles that collide
     * on at least one side.
     * @param {boolean} [filteringOptions.hasInterestingFace=false] - If true, only return tiles that
     * have at least one interesting face.
     *
     * @return {?Phaser.Tilemaps.Tile}
     */
    findTile: function (callback, context, tileX, tileY, width, height, filteringOptions)
    {
        return TilemapComponents.FindTile(callback, context, tileX, tileY, width, height, filteringOptions, this.layer);
    },

    /**
     * For each tile in the given rectangular area (in tile coordinates) of the layer, run the given
     * callback. Similar to Array.prototype.forEach in vanilla JS.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#forEachTile
     * @since 3.0.0
     *
     * @param {function} callback - The callback. Each tile in the given area will be passed to this
     * callback as the first and only parameter.
     * @param {object} [context] - The context under which the callback should be run.
     * @param {integer} [tileX=0] - [description]
     * @param {integer} [tileY=0] - [description]
     * @param {integer} [width=max width based on tileX] - [description]
     * @param {integer} [height=max height based on tileY] - [description]
     * @param {object} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {boolean} [filteringOptions.isNotEmpty=false] - If true, only return tiles that don't have
     * -1 for an index.
     * @param {boolean} [filteringOptions.isColliding=false] - If true, only return tiles that collide
     * on at least one side.
     * @param {boolean} [filteringOptions.hasInterestingFace=false] - If true, only return tiles that
     * have at least one interesting face.
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    forEachTile: function (callback, context, tileX, tileY, width, height, filteringOptions)
    {
        TilemapComponents.ForEachTile(callback, context, tileX, tileY, width, height, filteringOptions, this.layer);

        return this;
    },

    /**
     * Gets a tile at the given tile coordinates from the given layer.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#getTileAt
     * @since 3.0.0
     *
     * @param {integer} tileX - X position to get the tile from (given in tile units, not pixels).
     * @param {integer} tileY - Y position to get the tile from (given in tile units, not pixels).
     * @param {boolean} [nonNull=false] - If true getTile won't return null for empty tiles, but a Tile
     * object with an index of -1.
     *
     * @return {Phaser.Tilemaps.Tile} The tile at the given coordinates or null if no tile was found or the coordinates were invalid.
     */
    getTileAt: function (tileX, tileY, nonNull)
    {
        return TilemapComponents.GetTileAt(tileX, tileY, nonNull, this.layer);
    },

    /**
     * Gets a tile at the given world coordinates from the given layer.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#getTileAtWorldXY
     * @since 3.0.0
     *
     * @param {number} worldX - X position to get the tile from (given in pixels)
     * @param {number} worldY - Y position to get the tile from (given in pixels)
     * @param {boolean} [nonNull=false] - If true, function won't return null for empty tiles, but a Tile
     * object with an index of -1.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {Phaser.Tilemaps.Tile} The tile at the given coordinates or null if no tile was found or the coordinates
     * were invalid.
     */
    getTileAtWorldXY: function (worldX, worldY, nonNull, camera)
    {
        return TilemapComponents.GetTileAtWorldXY(worldX, worldY, nonNull, camera, this.layer);
    },

    /**
     * Gets the tiles in the given rectangular area (in tile coordinates) of the layer.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#getTilesWithin
     * @since 3.0.0
     *
     * @param {integer} [tileX=0] - [description]
     * @param {integer} [tileY=0] - [description]
     * @param {integer} [width=max width based on tileX] - [description]
     * @param {integer} [height=max height based on tileY] - [description]
     * @param {object} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {boolean} [filteringOptions.isNotEmpty=false] - If true, only return tiles that don't have
     * -1 for an index.
     * @param {boolean} [filteringOptions.isColliding=false] - If true, only return tiles that collide on
     * at least one side.
     * @param {boolean} [filteringOptions.hasInterestingFace=false] - If true, only return tiles that
     * have at least one interesting face.
     *
     * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
     */
    getTilesWithin: function (tileX, tileY, width, height, filteringOptions)
    {
        return TilemapComponents.GetTilesWithin(tileX, tileY, width, height, filteringOptions, this.layer);
    },

    /**
     * Gets the tiles that overlap with the given shape in the given layer. The shape must be a Circle,
     * Line, Rectangle or Triangle. The shape should be in world coordinates.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#getTilesWithinShape
     * @since 3.0.0
     *
     * @param {(Phaser.Geom.Circle|Phaser.Geom.Line|Phaser.Geom.Rectangle|Phaser.Geom.Triangle)} shape - A shape in world (pixel) coordinates
     * @param {object} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {boolean} [filteringOptions.isNotEmpty=false] - If true, only return tiles that don't have
     * -1 for an index.
     * @param {boolean} [filteringOptions.isColliding=false] - If true, only return tiles that collide on
     * at least one side.
     * @param {boolean} [filteringOptions.hasInterestingFace=false] - If true, only return tiles that
     * have at least one interesting face.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
     */
    getTilesWithinShape: function (shape, filteringOptions, camera)
    {
        return TilemapComponents.GetTilesWithinShape(shape, filteringOptions, camera, this.layer);
    },

    /**
     * Gets the tiles in the given rectangular area (in world coordinates) of the layer.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#getTilesWithinWorldXY
     * @since 3.0.0
     *
     * @param {number} worldX - [description]
     * @param {number} worldY - [description]
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {object} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {boolean} [filteringOptions.isNotEmpty=false] - If true, only return tiles that don't have
     * -1 for an index.
     * @param {boolean} [filteringOptions.isColliding=false] - If true, only return tiles that collide on
     * at least one side.
     * @param {boolean} [filteringOptions.hasInterestingFace=false] - If true, only return tiles that
     * have at least one interesting face.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
     */
    getTilesWithinWorldXY: function (worldX, worldY, width, height, filteringOptions, camera)
    {
        return TilemapComponents.GetTilesWithinWorldXY(worldX, worldY, width, height, filteringOptions, camera, this.layer);
    },

    /**
     * Checks if there is a tile at the given location (in tile coordinates) in the given layer. Returns
     * false if there is no tile or if the tile at that location has an index of -1.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#hasTileAt
     * @since 3.0.0
     *
     * @param {integer} tileX - [description]
     * @param {integer} tileY - [description]
     *
     * @return {boolean}
     */
    hasTileAt: function (tileX, tileY)
    {
        return TilemapComponents.HasTileAt(tileX, tileY, this.layer);
    },

    /**
     * Checks if there is a tile at the given location (in world coordinates) in the given layer. Returns
     * false if there is no tile or if the tile at that location has an index of -1.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#hasTileAtWorldXY
     * @since 3.0.0
     *
     * @param {number} worldX - [description]
     * @param {number} worldY - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {boolean}
     */
    hasTileAtWorldXY: function (worldX, worldY, camera)
    {
        return TilemapComponents.HasTileAtWorldXY(worldX, worldY, camera, this.layer);
    },

    /**
     * Puts a tile at the given tile coordinates in the specified layer. You can pass in either an index
     * or a Tile object. If you pass in a Tile, all attributes will be copied over to the specified
     * location. If you pass in an index, only the index at the specified location will be changed.
     * Collision information will be recalculated at the specified location.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#putTileAt
     * @since 3.0.0
     *
     * @param {(integer|Phaser.Tilemaps.Tile)} tile - The index of this tile to set or a Tile object.
     * @param {integer} tileX - [description]
     * @param {integer} tileY - [description]
     * @param {boolean} [recalculateFaces=true] - [description]
     *
     * @return {Phaser.Tilemaps.Tile} A Tile object.
     */
    putTileAt: function (tile, tileX, tileY, recalculateFaces)
    {
        return TilemapComponents.PutTileAt(tile, tileX, tileY, recalculateFaces, this.layer);
    },

    /**
     * Puts a tile at the given world coordinates (pixels) in the specified layer. You can pass in either
     * an index or a Tile object. If you pass in a Tile, all attributes will be copied over to the
     * specified location. If you pass in an index, only the index at the specified location will be
     * changed. Collision information will be recalculated at the specified location.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#putTileAtWorldXY
     * @since 3.0.0
     *
     * @param {(integer|Phaser.Tilemaps.Tile)} tile - The index of this tile to set or a Tile object.
     * @param {integer} worldX - [description]
     * @param {integer} worldY - [description]
     * @param {boolean} [recalculateFaces=true] - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - [description]
     *
     * @return {Phaser.Tilemaps.Tile} A Tile object.
     */
    putTileAtWorldXY: function (tile, worldX, worldY, recalculateFaces, camera)
    {
        return TilemapComponents.PutTileAtWorldXY(tile, worldX, worldY, recalculateFaces, camera, this.layer);
    },

    /**
     * Puts an array of tiles or a 2D array of tiles at the given tile coordinates in the specified
     * layer. The array can be composed of either tile indexes or Tile objects. If you pass in a Tile,
     * all attributes will be copied over to the specified location. If you pass in an index, only the
     * index at the specified location will be changed. Collision information will be recalculated
     * within the region tiles were changed.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#putTilesAt
     * @since 3.0.0
     *
     * @param {(integer[]|integer[][]|Phaser.Tilemaps.Tile[]|Phaser.Tilemaps.Tile[][])} tile - A row (array) or grid (2D array) of Tiles
     * or tile indexes to place.
     * @param {integer} tileX - [description]
     * @param {integer} tileY - [description]
     * @param {boolean} [recalculateFaces=true] - [description]
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    putTilesAt: function (tilesArray, tileX, tileY, recalculateFaces)
    {
        TilemapComponents.PutTilesAt(tilesArray, tileX, tileY, recalculateFaces, this.layer);

        return this;
    },

    /**
     * Randomizes the indexes of a rectangular region of tiles (in tile coordinates) within the
     * specified layer. Each tile will receive a new index. If an array of indexes is passed in, then
     * those will be used for randomly assigning new tile indexes. If an array is not provided, the
     * indexes found within the region (excluding -1) will be used for randomly assigning new tile
     * indexes. This method only modifies tile indexes and does not change collision information.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#randomize
     * @since 3.0.0
     *
     * @param {integer} [tileX=0] - [description]
     * @param {integer} [tileY=0] - [description]
     * @param {integer} [width=max width based on tileX] - [description]
     * @param {integer} [height=max height based on tileY] - [description]
     * @param {integer[]} [indexes] - An array of indexes to randomly draw from during randomization.
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    randomize: function (tileX, tileY, width, height, indexes)
    {
        TilemapComponents.Randomize(tileX, tileY, width, height, indexes, this.layer);

        return this;
    },

    /**
     * Removes the tile at the given tile coordinates in the specified layer and updates the layer's
     * collision information.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#removeTileAt
     * @since 3.0.0
     *
     * @param {(integer|Phaser.Tilemaps.Tile)} tile - The index of this tile to set or a Tile object.
     * @param {integer} tileX - [description]
     * @param {integer} tileY - [description]
     * @param {boolean} [replaceWithNull=true] - If true, this will replace the tile at the specified
     * location with null instead of a Tile with an index of -1.
     * @param {boolean} [recalculateFaces=true] - [description]
     *
     * @return {Phaser.Tilemaps.Tile} A Tile object.
     */
    removeTileAt: function (tileX, tileY, replaceWithNull, recalculateFaces)
    {
        return TilemapComponents.RemoveTileAt(tileX, tileY, replaceWithNull, recalculateFaces, this.layer);
    },

    /**
     * Removes the tile at the given world coordinates in the specified layer and updates the layer's
     * collision information.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#removeTileAtWorldXY
     * @since 3.0.0
     *
     * @param {(integer|Phaser.Tilemaps.Tile)} tile - The index of this tile to set or a Tile object.
     * @param {number} worldX - [description]
     * @param {number} worldY - [description]
     * @param {boolean} [replaceWithNull=true] - If true, this will replace the tile at the specified
     * location with null instead of a Tile with an index of -1.
     * @param {boolean} [recalculateFaces=true] - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {Phaser.Tilemaps.Tile} A Tile object.
     */
    removeTileAtWorldXY: function (worldX, worldY, replaceWithNull, recalculateFaces, camera)
    {
        return TilemapComponents.RemoveTileAtWorldXY(worldX, worldY, replaceWithNull, recalculateFaces, camera, this.layer);
    },

    /**
     * Draws a debug representation of the layer to the given Graphics. This is helpful when you want to
     * get a quick idea of which of your tiles are colliding and which have interesting faces. The tiles
     * are drawn starting at (0, 0) in the Graphics, allowing you to place the debug representation
     * wherever you want on the screen.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#renderDebug
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Graphics} graphics - The target Graphics object to draw upon.
     * @param {object} styleConfig - An object specifying the colors to use for the debug drawing.
     * @param {?Color} [styleConfig.tileColor=blue] - Color to use for drawing a filled rectangle at
     * non-colliding tile locations. If set to null, non-colliding tiles will not be drawn.
     * @param {?Color} [styleConfig.collidingTileColor=orange] - Color to use for drawing a filled
     * rectangle at colliding tile locations. If set to null, colliding tiles will not be drawn.
     * @param {?Color} [styleConfig.faceColor=grey] - Color to use for drawing a line at interesting
     * tile faces. If set to null, interesting tile faces will not be drawn.
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    renderDebug: function (graphics, styleConfig)
    {
        TilemapComponents.RenderDebug(graphics, styleConfig, this.layer);

        return this;
    },

    /**
     * Scans the given rectangular area (given in tile coordinates) for tiles with an index matching
     * `findIndex` and updates their index to match `newIndex`. This only modifies the index and does
     * not change collision information.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#replaceByIndex
     * @since 3.0.0
     *
     * @param {integer} findIndex - [description]
     * @param {integer} newIndex - [description]
     * @param {integer} [tileX=0] - [description]
     * @param {integer} [tileY=0] - [description]
     * @param {integer} [width=max width based on tileX] - [description]
     * @param {integer} [height=max height based on tileY] - [description]
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    replaceByIndex: function (findIndex, newIndex, tileX, tileY, width, height)
    {
        TilemapComponents.ReplaceByIndex(findIndex, newIndex, tileX, tileY, width, height, this.layer);

        return this;
    },

    /**
     * Sets collision on the given tile or tiles within a layer by index. You can pass in either a
     * single numeric index or an array of indexes: [2, 3, 15, 20]. The `collides` parameter controls if
     * collision will be enabled (true) or disabled (false).
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#setCollision
     * @since 3.0.0
     *
     * @param {(integer|array)} indexes - Either a single tile index, or an array of tile indexes.
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear
     * collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the
     * update.
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    setCollision: function (indexes, collides, recalculateFaces)
    {
        TilemapComponents.SetCollision(indexes, collides, recalculateFaces, this.layer);

        return this;
    },

    /**
     * Sets collision on a range of tiles in a layer whose index is between the specified `start` and
     * `stop` (inclusive). Calling this with a start value of 10 and a stop value of 14 would set
     * collision for tiles 10, 11, 12, 13 and 14. The `collides` parameter controls if collision will be
     * enabled (true) or disabled (false).
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#setCollisionBetween
     * @since 3.0.0
     *
     * @param {integer} start - The first index of the tile to be set for collision.
     * @param {integer} stop - The last index of the tile to be set for collision.
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear
     * collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the
     * update.
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    setCollisionBetween: function (start, stop, collides, recalculateFaces)
    {
        TilemapComponents.SetCollisionBetween(start, stop, collides, recalculateFaces, this.layer);

        return this;
    },

    /**
     * Sets collision on the tiles within a layer by checking tile properties. If a tile has a property
     * that matches the given properties object, its collision flag will be set. The `collides`
     * parameter controls if collision will be enabled (true) or disabled (false). Passing in
     * `{ collides: true }` would update the collision flag on any tiles with a "collides" property that
     * has a value of true. Any tile that doesn't have "collides" set to true will be ignored. You can
     * also use an array of values, e.g. `{ types: ["stone", "lava", "sand" ] }`. If a tile has a
     * "types" property that matches any of those values, its collision flag will be updated.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#setCollisionByProperty
     * @since 3.0.0
     *
     * @param {object} properties - An object with tile properties and corresponding values that should
     * be checked.
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear
     * collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the
     * update.
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    setCollisionByProperty: function (properties, collides, recalculateFaces)
    {
        TilemapComponents.SetCollisionByProperty(properties, collides, recalculateFaces, this.layer);

        return this;
    },

    /**
     * Sets collision on all tiles in the given layer, except for tiles that have an index specified in
     * the given array. The `collides` parameter controls if collision will be enabled (true) or
     * disabled (false).
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#setCollisionByExclusion
     * @since 3.0.0
     *
     * @param {integer[]} indexes - An array of the tile indexes to not be counted for collision.
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear
     * collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the
     * update.
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    setCollisionByExclusion: function (indexes, collides, recalculateFaces)
    {
        TilemapComponents.SetCollisionByExclusion(indexes, collides, recalculateFaces, this.layer);

        return this;
    },

    /**
     * Sets collision on the tiles within a layer by checking each tiles collision group data
     * (typically defined in Tiled within the tileset collision editor). If any objects are found within
     * a tiles collision group, the tile's colliding information will be set. The `collides` parameter
     * controls if collision will be enabled (true) or disabled (false).
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#setCollisionFromCollisionGroup
     * @since 3.0.0
     *
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear
     * collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the
     * update.
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    setCollisionFromCollisionGroup: function (collides, recalculateFaces)
    {
        TilemapComponents.SetCollisionFromCollisionGroup(collides, recalculateFaces, this.layer);

        return this;
    },

    /**
     * Sets a global collision callback for the given tile index within the layer. This will affect all
     * tiles on this layer that have the same index. If a callback is already set for the tile index it
     * will be replaced. Set the callback to null to remove it. If you want to set a callback for a tile
     * at a specific location on the map then see setTileLocationCallback.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#setTileIndexCallback
     * @since 3.0.0
     *
     * @param {(integer|array)} indexes - Either a single tile index, or an array of tile indexes to have a
     * collision callback set for.
     * @param {function} callback - The callback that will be invoked when the tile is collided with.
     * @param {object} callbackContext - The context under which the callback is called.
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    setTileIndexCallback: function (indexes, callback, callbackContext)
    {
        TilemapComponents.SetTileIndexCallback(indexes, callback, callbackContext, this.layer);

        return this;
    },

    /**
     * Sets a collision callback for the given rectangular area (in tile coordinates) within the layer.
     * If a callback is already set for the tile index it will be replaced. Set the callback to null to
     * remove it.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#setTileLocationCallback
     * @since 3.0.0
     *
     * @param {integer} [tileX=0] - [description]
     * @param {integer} [tileY=0] - [description]
     * @param {integer} [width=max width based on tileX] - [description]
     * @param {integer} [height=max height based on tileY] - [description]
     * @param {function} callback - The callback that will be invoked when the tile is collided with.
     * @param {object} callbackContext - The context under which the callback is called.
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    setTileLocationCallback: function (tileX, tileY, width, height, callback, callbackContext)
    {
        TilemapComponents.SetTileLocationCallback(tileX, tileY, width, height, callback, callbackContext, this.layer);

        return this;
    },

    /**
     * Shuffles the tiles in a rectangular region (specified in tile coordinates) within the given
     * layer. It will only randomize the tiles in that area, so if they're all the same nothing will
     * appear to have changed! This method only modifies tile indexes and does not change collision
     * information.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#shuffle
     * @since 3.0.0
     *
     * @param {integer} [tileX=0] - [description]
     * @param {integer} [tileY=0] - [description]
     * @param {integer} [width=max width based on tileX] - [description]
     * @param {integer} [height=max height based on tileY] - [description]
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    shuffle: function (tileX, tileY, width, height)
    {
        TilemapComponents.Shuffle(tileX, tileY, width, height, this.layer);

        return this;
    },

    /**
     * Scans the given rectangular area (given in tile coordinates) for tiles with an index matching
     * `indexA` and swaps then with `indexB`. This only modifies the index and does not change collision
     * information.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#swapByIndex
     * @since 3.0.0
     *
     * @param {integer} tileA - First tile index.
     * @param {integer} tileB - Second tile index.
     * @param {integer} [tileX=0] - [description]
     * @param {integer} [tileY=0] - [description]
     * @param {integer} [width=max width based on tileX] - [description]
     * @param {integer} [height=max height based on tileY] - [description]
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    swapByIndex: function (indexA, indexB, tileX, tileY, width, height)
    {
        TilemapComponents.SwapByIndex(indexA, indexB, tileX, tileY, width, height, this.layer);

        return this;
    },

    /**
     * Converts from tile X coordinates (tile units) to world X coordinates (pixels), factoring in the
     * layers position, scale and scroll.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#tileToWorldX
     * @since 3.0.0
     *
     * @param {integer} tileX - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {number}
     */
    tileToWorldX: function (tileX, camera)
    {
        return TilemapComponents.TileToWorldX(tileX, camera, this.layer);
    },

    /**
     * Converts from tile Y coordinates (tile units) to world Y coordinates (pixels), factoring in the
     * layers position, scale and scroll.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#tileToWorldY
     * @since 3.0.0
     *
     * @param {integer} tileY - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {number}
     */
    tileToWorldY: function (tileY, camera)
    {
        return TilemapComponents.TileToWorldY(tileY, camera, this.layer);
    },

    /**
     * Converts from tile XY coordinates (tile units) to world XY coordinates (pixels), factoring in the
     * layers position, scale and scroll. This will return a new Vector2 object or update the given
     * `point` object.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#tileToWorldXY
     * @since 3.0.0
     *
     * @param {integer} tileX - [description]
     * @param {integer} tileY - [description]
     * @param {Phaser.Math.Vector2} [point] - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {Phaser.Math.Vector2}
     */
    tileToWorldXY: function (tileX, tileY, point, camera)
    {
        return TilemapComponents.TileToWorldXY(tileX, tileY, point, camera, this.layer);
    },

    /**
     * Randomizes the indexes of a rectangular region of tiles (in tile coordinates) within the
     * specified layer. Each tile will recieve a new index. New indexes are drawn from the given
     * weightedIndexes array. An example weighted array:
     *
     * [
     *  { index: 6, weight: 4 },    // Probability of index 6 is 4 / 8
     *  { index: 7, weight: 2 },    // Probability of index 7 would be 2 / 8
     *  { index: 8, weight: 1.5 },  // Probability of index 8 would be 1.5 / 8
     *  { index: 26, weight: 0.5 }  // Probability of index 27 would be 0.5 / 8
     * ]
     *
     * The probability of any index being choose is (the index's weight) / (sum of all weights). This
     * method only modifies tile indexes and does not change collision information.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#weightedRandomize
     * @since 3.0.0
     *
     * @param {integer} [tileX=0] - [description]
     * @param {integer} [tileY=0] - [description]
     * @param {integer} [width=max width based on tileX] - [description]
     * @param {integer} [height=max height based on tileY] - [description]
     * @param {object[]} [weightedIndexes] - An array of objects to randomly draw from during
     * randomization. They should be in the form: { index: 0, weight: 4 } or
     * { index: [0, 1], weight: 4 } if you wish to draw from multiple tile indexes.
     *
     * @return {Phaser.Tilemaps.DynamicTilemapLayer} This Tilemap Layer object.
     */
    weightedRandomize: function (tileX, tileY, width, height, weightedIndexes)
    {
        TilemapComponents.WeightedRandomize(tileX, tileY, width, height, weightedIndexes, this.layer);

        return this;
    },

    /**
     * Converts from world X coordinates (pixels) to tile X coordinates (tile units), factoring in the
     * layers position, scale and scroll.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#worldToTileX
     * @since 3.0.0
     *
     * @param {number} worldX - [description]
     * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the
     * nearest integer.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {number}
     */
    worldToTileX: function (worldX, snapToFloor, camera)
    {
        return TilemapComponents.WorldToTileX(worldX, snapToFloor, camera, this.layer);
    },

    /**
     * Converts from world Y coordinates (pixels) to tile Y coordinates (tile units), factoring in the
     * layers position, scale and scroll.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#worldToTileXY
     * @since 3.0.0
     *
     * @param {number} worldY - [description]
     * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the
     * nearest integer.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {number}
     */
    worldToTileY: function (worldY, snapToFloor, camera)
    {
        return TilemapComponents.WorldToTileY(worldY, snapToFloor, camera, this.layer);
    },

    /**
     * Converts from world XY coordinates (pixels) to tile XY coordinates (tile units), factoring in the
     * layers position, scale and scroll. This will return a new Vector2 object or update the given
     * `point` object.
     *
     * @method Phaser.Tilemaps.DynamicTilemapLayer#worldToTileXY
     * @since 3.0.0
     *
     * @param {number} worldX - [description]
     * @param {number} worldY - [description]
     * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the
     * nearest integer.
     * @param {Phaser.Math.Vector2} [point] - [description]
     * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
     *
     * @return {Phaser.Math.Vector2}
     */
    worldToTileXY: function (worldX, worldY, snapToFloor, point, camera)
    {
        return TilemapComponents.WorldToTileXY(worldX, worldY, snapToFloor, point, camera, this.layer);
    }

});

module.exports = DynamicTilemapLayer;
