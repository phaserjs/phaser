/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var CollisionComponent = require('../physics/arcade/components/Collision');
var Components = require('../gameobjects/components');
var GameObject = require('../gameobjects/GameObject');
var TilemapComponents = require('./components');
var Vector2 = require('../math/Vector2');

/**
 * @classdesc
 * A TilemapLayer is a Game Object that renders LayerData from a Tilemap
 * when used in combination with one, or more, Tilesets.
 * This is a generic base class that is extended by the TilemapLayer classes.
 * It is not used directly and should not be instantiated.
 *
 * @see Phaser.Tilemaps.TilemapLayer
 * @see Phaser.Tilemaps.TilemapGPULayer
 *
 * @class TilemapLayerBase
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.Tilemaps
 * @constructor
 * @since 4.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.ElapseTimer
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Lighting
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.RenderNodes
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * @extends Phaser.Physics.Arcade.Components.Collision
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {Phaser.Tilemaps.Tilemap} tilemap - The Tilemap this layer is a part of.
 * @param {number} layerIndex - The index of the LayerData associated with this layer.
 * @param {number} [x=0] - The world x position where the top left of this layer will be placed.
 * @param {number} [y=0] - The world y position where the top left of this layer will be placed.
 */
var TilemapLayerBase = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.ComputedSize,
        Components.Depth,
        Components.ElapseTimer,
        Components.Flip,
        Components.GetBounds,
        Components.Lighting,
        Components.Mask,
        Components.Origin,
        Components.RenderNodes,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        CollisionComponent
    ],

    initialize:

    function TilemapLayerBase (type, scene, tilemap, layerIndex, x, y)
    {
        GameObject.call(this, scene, type);

        /**
         * Used internally by physics system to perform fast type checks.
         *
         * @name Phaser.Tilemaps.TilemapLayerBase#isTilemap
         * @type {boolean}
         * @readonly
         * @since 3.50.0
         */
        this.isTilemap = true;

        /**
         * The Tilemap that this layer is a part of.
         *
         * @name Phaser.Tilemaps.TilemapLayerBase#tilemap
         * @type {Phaser.Tilemaps.Tilemap}
         * @since 3.50.0
         */
        this.tilemap = tilemap;

        /**
         * The index of the LayerData associated with this layer.
         *
         * @name Phaser.Tilemaps.TilemapLayerBase#layerIndex
         * @type {number}
         * @since 3.50.0
         */
        this.layerIndex = layerIndex;

        /**
         * The LayerData associated with this layer. LayerData can only be associated with one
         * tilemap layer.
         *
         * @name Phaser.Tilemaps.TilemapLayerBase#layer
         * @type {Phaser.Tilemaps.LayerData}
         * @since 3.50.0
         */
        this.layer = tilemap.layers[layerIndex];

        // Link the LayerData with this static tilemap layer
        this.layer.tilemapLayer = this;

        /**
         * An array holding the mapping between the tile indexes and the tileset they belong to.
         *
         * @name Phaser.Tilemaps.TilemapLayerBase#gidMap
         * @type {Phaser.Tilemaps.Tileset[]}
         * @since 3.50.0
         */
        this.gidMap = [];

        /**
         * A temporary Vector2 used in the tile coordinate methods.
         *
         * @name Phaser.Tilemaps.TilemapLayerBase#tempVec
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.60.0
         */
        this.tempVec = new Vector2();

        /**
         * The Tilemap Layer Collision Category.
         *
         * This is exclusively used by the Arcade Physics system.
         *
         * This can be set to any valid collision bitfield value.
         *
         * See the `setCollisionCategory` method for more details.
         *
         * @name Phaser.Tilemaps.TilemapLayerBase#collisionCategory
         * @type {number}
         * @since 3.70.0
         */
        this.collisionCategory = 0x0001;

        /**
         * The Tilemap Layer Collision Mask.
         *
         * This is exclusively used by the Arcade Physics system.
         *
         * See the `setCollidesWith` method for more details.
         *
         * @name Phaser.Tilemaps.TilemapLayerBase#collisionMask
         * @type {number}
         * @since 3.70.0
         */
        this.collisionMask = 1;

        /**
         * The horizontal origin of this Tilemap Layer.
         *
         * @name Phaser.Tilemaps.TilemapLayerBase#originX
         * @type {number}
         * @default 0
         * @readOnly
         * @since 3.0.0
         */

        /**
         * The vertical origin of this Tilemap Layer.
         *
         * @name Phaser.Tilemaps.TilemapLayerBase#originY
         * @type {number}
         * @default 0
         * @readOnly
         * @since 3.0.0
         */

        /**
         * The horizontal display origin of this Tilemap Layer.
         *
         * @name Phaser.Tilemaps.TilemapLayerBase#displayOriginX
         * @type {number}
         * @default 0
         * @readOnly
         * @since 3.0.0
         */

        /**
         * The vertical display origin of this Tilemap Layer.
         *
         * @name Phaser.Tilemaps.TilemapLayerBase#displayOriginY
         * @type {number}
         * @default 0
         * @readOnly
         * @since 3.0.0
         */

        this.setAlpha(this.layer.alpha);
        this.setPosition(x, y);
        this.setOrigin(0, 0);
        this.setSize(tilemap.tileWidth * this.layer.width, tilemap.tileHeight * this.layer.height);
    },

    //  Overrides Game Object method
    addedToScene: function ()
    {
        this.scene.sys.updateList.add(this);
    },

    //  Overrides Game Object method
    removedFromScene: function ()
    {
        this.scene.sys.updateList.remove(this);
    },

    preUpdate: function (time, delta)
    {
        this.updateTimer(time, delta);
    },

    /**
     * Calculates interesting faces at the given tile coordinates of the specified layer. Interesting
     * faces are used internally for optimizing collisions against tiles. This method is mostly used
     * internally to optimize recalculating faces when only one tile has been changed.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#calculateFacesAt
     * @since 3.50.0
     *
     * @param {number} tileX - The x coordinate.
     * @param {number} tileY - The y coordinate.
     *
     * @return {this} This Tilemap Layer object.
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
     * @method Phaser.Tilemaps.TilemapLayerBase#calculateFacesWithin
     * @since 3.50.0
     *
     * @param {number} [tileX] - The left most tile index (in tile coordinates) to use as the origin of the area.
     * @param {number} [tileY] - The top most tile index (in tile coordinates) to use as the origin of the area.
     * @param {number} [width] - How many tiles wide from the `tileX` index the area will be.
     * @param {number} [height] - How many tiles tall from the `tileY` index the area will be.
     *
     * @return {this} This Tilemap Layer object.
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
     * @method Phaser.Tilemaps.TilemapLayerBase#createFromTiles
     * @since 3.50.0
     *
     * @param {(number|array)} indexes - The tile index, or array of indexes, to create Sprites from.
     * @param {?(number|array)} replacements - The tile index, or array of indexes, to change a converted
     * tile to. Set to `null` to leave the tiles unchanged. If an array is given, it is assumed to be a
     * one-to-one mapping with the indexes array.
     * @param {Phaser.Types.GameObjects.Sprite.SpriteConfig} [spriteConfig] - The config object to pass into the Sprite creator (i.e.
     * scene.make.sprite).
     * @param {Phaser.Scene} [scene] - The Scene to create the Sprites within.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use when determining the world XY
     *
     * @return {Phaser.GameObjects.Sprite[]} An array of the Sprites that were created.
     */
    createFromTiles: function (indexes, replacements, spriteConfig, scene, camera)
    {
        return TilemapComponents.CreateFromTiles(indexes, replacements, spriteConfig, scene, camera, this.layer);
    },

    /**
     * Copies the tiles in the source rectangular area to a new destination (all specified in tile
     * coordinates) within the layer. This copies all tile properties & recalculates collision
     * information in the destination region.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#copy
     * @since 3.50.0
     *
     * @param {number} srcTileX - The x coordinate of the area to copy from, in tiles, not pixels.
     * @param {number} srcTileY - The y coordinate of the area to copy from, in tiles, not pixels.
     * @param {number} width - The width of the area to copy, in tiles, not pixels.
     * @param {number} height - The height of the area to copy, in tiles, not pixels.
     * @param {number} destTileX - The x coordinate of the area to copy to, in tiles, not pixels.
     * @param {number} destTileY - The y coordinate of the area to copy to, in tiles, not pixels.
     * @param {boolean} [recalculateFaces=true] - `true` if the faces data should be recalculated.
     *
     * @return {this} This Tilemap Layer object.
     */
    copy: function (srcTileX, srcTileY, width, height, destTileX, destTileY, recalculateFaces)
    {
        TilemapComponents.Copy(srcTileX, srcTileY, width, height, destTileX, destTileY, recalculateFaces, this.layer);

        return this;
    },

    /**
     * Sets the tiles in the given rectangular area (in tile coordinates) of the layer with the
     * specified index. Tiles will be set to collide if the given index is a colliding index.
     * Collision information in the region will be recalculated.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#fill
     * @since 3.50.0
     *
     * @param {number} index - The tile index to fill the area with.
     * @param {number} [tileX] - The left most tile index (in tile coordinates) to use as the origin of the area.
     * @param {number} [tileY] - The top most tile index (in tile coordinates) to use as the origin of the area.
     * @param {number} [width] - How many tiles wide from the `tileX` index the area will be.
     * @param {number} [height] - How many tiles tall from the `tileY` index the area will be.
     * @param {boolean} [recalculateFaces=true] - `true` if the faces data should be recalculated.
     *
     * @return {this} This Tilemap Layer object.
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
     * @method Phaser.Tilemaps.TilemapLayerBase#filterTiles
     * @since 3.50.0
     *
     * @param {function} callback - The callback. Each tile in the given area will be passed to this
     * callback as the first and only parameter. The callback should return true for tiles that pass the
     * filter.
     * @param {object} [context] - The context under which the callback should be run.
     * @param {number} [tileX] - The left most tile index (in tile coordinates) to use as the origin of the area to filter.
     * @param {number} [tileY] - The top most tile index (in tile coordinates) to use as the origin of the area to filter.
     * @param {number} [width] - How many tiles wide from the `tileX` index the area will be.
     * @param {number} [height] - How many tiles tall from the `tileY` index the area will be.
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
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
     * @method Phaser.Tilemaps.TilemapLayerBase#findByIndex
     * @since 3.50.0
     *
     * @param {number} index - The tile index value to search for.
     * @param {number} [skip=0] - The number of times to skip a matching tile before returning.
     * @param {boolean} [reverse=false] - If true it will scan the layer in reverse, starting at the bottom-right. Otherwise it scans from the top-left.
     *
     * @return {Phaser.Tilemaps.Tile} The first matching Tile object.
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
     * @method Phaser.Tilemaps.TilemapLayerBase#findTile
     * @since 3.50.0
     *
     * @param {FindTileCallback} callback - The callback. Each tile in the given area will be passed to this callback as the first and only parameter.
     * @param {object} [context] - The context under which the callback should be run.
     * @param {number} [tileX] - The left most tile index (in tile coordinates) to use as the origin of the area to search.
     * @param {number} [tileY] - The top most tile index (in tile coordinates) to use as the origin of the area to search.
     * @param {number} [width] - How many tiles wide from the `tileX` index the area will be.
     * @param {number} [height] - How many tiles tall from the `tileY` index the area will be.
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
     *
     * @return {?Phaser.Tilemaps.Tile} The first Tile found at the given location.
     */
    findTile: function (callback, context, tileX, tileY, width, height, filteringOptions)
    {
        return TilemapComponents.FindTile(callback, context, tileX, tileY, width, height, filteringOptions, this.layer);
    },

    /**
     * For each tile in the given rectangular area (in tile coordinates) of the layer, run the given
     * callback. Similar to Array.prototype.forEach in vanilla JS.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#forEachTile
     * @since 3.50.0
     *
     * @param {EachTileCallback} callback - The callback. Each tile in the given area will be passed to this callback as the first and only parameter.
     * @param {object} [context] - The context, or scope, under which the callback should be run.
     * @param {number} [tileX] - The left most tile index (in tile coordinates) to use as the origin of the area to search.
     * @param {number} [tileY] - The top most tile index (in tile coordinates) to use as the origin of the area to search.
     * @param {number} [width] - How many tiles wide from the `tileX` index the area will be.
     * @param {number} [height] - How many tiles tall from the `tileY` index the area will be.
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
     *
     * @return {this} This Tilemap Layer object.
     */
    forEachTile: function (callback, context, tileX, tileY, width, height, filteringOptions)
    {
        TilemapComponents.ForEachTile(callback, context, tileX, tileY, width, height, filteringOptions, this.layer);

        return this;
    },

    /**
     * Gets a tile at the given tile coordinates from the given layer.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#getTileAt
     * @since 3.50.0
     *
     * @param {number} tileX - X position to get the tile from (given in tile units, not pixels).
     * @param {number} tileY - Y position to get the tile from (given in tile units, not pixels).
     * @param {boolean} [nonNull=false] - For empty tiles, return a Tile object with an index of -1 instead of null.
     *
     * @return {Phaser.Tilemaps.Tile} The Tile at the given coordinates or null if no tile was found or the coordinates were invalid.
     */
    getTileAt: function (tileX, tileY, nonNull)
    {
        return TilemapComponents.GetTileAt(tileX, tileY, nonNull, this.layer);
    },

    /**
     * Gets a tile at the given world coordinates from the given layer.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#getTileAtWorldXY
     * @since 3.50.0
     *
     * @param {number} worldX - X position to get the tile from (given in pixels)
     * @param {number} worldY - Y position to get the tile from (given in pixels)
     * @param {boolean} [nonNull=false] - For empty tiles, return a Tile object with an index of -1 instead of null.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use when calculating the tile index from the world values.
     *
     * @return {Phaser.Tilemaps.Tile} The tile at the given coordinates or null if no tile was found or the coordinates were invalid.
     */
    getTileAtWorldXY: function (worldX, worldY, nonNull, camera)
    {
        return TilemapComponents.GetTileAtWorldXY(worldX, worldY, nonNull, camera, this.layer);
    },

    /**
     * Gets a tile at the given world coordinates from the given isometric layer.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#getIsoTileAtWorldXY
     * @since 3.60.0
     *
     * @param {number} worldX - X position to get the tile from (given in pixels)
     * @param {number} worldY - Y position to get the tile from (given in pixels)
     * @param {boolean} [originTop=true] - Which is the active face of the isometric tile? The top (default, true), or the base? (false)
     * @param {boolean} [nonNull=false] - For empty tiles, return a Tile object with an index of -1 instead of null.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use when calculating the tile index from the world values.
     *
     * @return {Phaser.Tilemaps.Tile} The tile at the given coordinates or null if no tile was found or the coordinates were invalid.
     */
    getIsoTileAtWorldXY: function (worldX, worldY, originTop, nonNull, camera)
    {
        if (originTop === undefined) { originTop = true; }

        var point = this.tempVec;

        TilemapComponents.IsometricWorldToTileXY(worldX, worldY, true, point, camera, this.layer, originTop);

        return this.getTileAt(point.x, point.y, nonNull);
    },

    /**
     * Gets the tiles in the given rectangular area (in tile coordinates) of the layer.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#getTilesWithin
     * @since 3.50.0
     *
     * @param {number} [tileX] - The left most tile index (in tile coordinates) to use as the origin of the area.
     * @param {number} [tileY] - The top most tile index (in tile coordinates) to use as the origin of the area.
     * @param {number} [width] - How many tiles wide from the `tileX` index the area will be.
     * @param {number} [height] - How many tiles tall from the `tileY` index the area will be.
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
     *
     * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects found within the area.
     */
    getTilesWithin: function (tileX, tileY, width, height, filteringOptions)
    {
        return TilemapComponents.GetTilesWithin(tileX, tileY, width, height, filteringOptions, this.layer);
    },

    /**
     * Gets the tiles that overlap with the given shape in the given layer. The shape must be a Circle,
     * Line, Rectangle or Triangle. The shape should be in world coordinates.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#getTilesWithinShape
     * @since 3.50.0
     *
     * @param {(Phaser.Geom.Circle|Phaser.Geom.Line|Phaser.Geom.Rectangle|Phaser.Geom.Triangle)} shape - A shape in world (pixel) coordinates
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use when factoring in which tiles to return.
     *
     * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects found within the shape.
     */
    getTilesWithinShape: function (shape, filteringOptions, camera)
    {
        return TilemapComponents.GetTilesWithinShape(shape, filteringOptions, camera, this.layer);
    },

    /**
     * Gets the tiles in the given rectangular area (in world coordinates) of the layer.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#getTilesWithinWorldXY
     * @since 3.50.0
     *
     * @param {number} worldX - The world x coordinate for the top-left of the area.
     * @param {number} worldY - The world y coordinate for the top-left of the area.
     * @param {number} width - The width of the area.
     * @param {number} height - The height of the area.
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use when factoring in which tiles to return.
     *
     * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects found within the area.
     */
    getTilesWithinWorldXY: function (worldX, worldY, width, height, filteringOptions, camera)
    {
        return TilemapComponents.GetTilesWithinWorldXY(worldX, worldY, width, height, filteringOptions, camera, this.layer);
    },

    /**
     * Checks if there is a tile at the given location (in tile coordinates) in the given layer. Returns
     * false if there is no tile or if the tile at that location has an index of -1.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#hasTileAt
     * @since 3.50.0
     *
     * @param {number} tileX - The x coordinate, in tiles, not pixels.
     * @param {number} tileY - The y coordinate, in tiles, not pixels.
     *
     * @return {boolean} `true` if a tile was found at the given location, otherwise `false`.
     */
    hasTileAt: function (tileX, tileY)
    {
        return TilemapComponents.HasTileAt(tileX, tileY, this.layer);
    },

    /**
     * Checks if there is a tile at the given location (in world coordinates) in the given layer. Returns
     * false if there is no tile or if the tile at that location has an index of -1.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#hasTileAtWorldXY
     * @since 3.50.0
     *
     * @param {number} worldX - The x coordinate, in pixels.
     * @param {number} worldY - The y coordinate, in pixels.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use when factoring in which tiles to return.
     *
     * @return {boolean} `true` if a tile was found at the given location, otherwise `false`.
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
     * @method Phaser.Tilemaps.TilemapLayerBase#putTileAt
     * @since 3.50.0
     *
     * @param {(number|Phaser.Tilemaps.Tile)} tile - The index of this tile to set or a Tile object.
     * @param {number} tileX - The x coordinate, in tiles, not pixels.
     * @param {number} tileY - The y coordinate, in tiles, not pixels.
     * @param {boolean} [recalculateFaces=true] - `true` if the faces data should be recalculated.
     *
     * @return {Phaser.Tilemaps.Tile} The Tile object that was inserted at the given coordinates.
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
     * @method Phaser.Tilemaps.TilemapLayerBase#putTileAtWorldXY
     * @since 3.50.0
     *
     * @param {(number|Phaser.Tilemaps.Tile)} tile - The index of this tile to set or a Tile object.
     * @param {number} worldX - The x coordinate, in pixels.
     * @param {number} worldY - The y coordinate, in pixels.
     * @param {boolean} [recalculateFaces] - `true` if the faces data should be recalculated.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use when calculating the tile index from the world values.
     *
     * @return {Phaser.Tilemaps.Tile} The Tile object that was inserted at the given coordinates.
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
     * @method Phaser.Tilemaps.TilemapLayerBase#putTilesAt
     * @since 3.50.0
     *
     * @param {(number[]|number[][]|Phaser.Tilemaps.Tile[]|Phaser.Tilemaps.Tile[][])} tile - A row (array) or grid (2D array) of Tiles or tile indexes to place.
     * @param {number} tileX - The x coordinate, in tiles, not pixels.
     * @param {number} tileY - The y coordinate, in tiles, not pixels.
     * @param {boolean} [recalculateFaces=true] - `true` if the faces data should be recalculated.
     *
     * @return {this} This Tilemap Layer object.
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
     * @method Phaser.Tilemaps.TilemapLayerBase#randomize
     * @since 3.50.0
     *
     * @param {number} [tileX] - The left most tile index (in tile coordinates) to use as the origin of the area.
     * @param {number} [tileY] - The top most tile index (in tile coordinates) to use as the origin of the area.
     * @param {number} [width] - How many tiles wide from the `tileX` index the area will be.
     * @param {number} [height] - How many tiles tall from the `tileY` index the area will be.
     * @param {number[]} [indexes] - An array of indexes to randomly draw from during randomization.
     *
     * @return {this} This Tilemap Layer object.
     */
    randomize: function (tileX, tileY, width, height, indexes)
    {
        TilemapComponents.Randomize(tileX, tileY, width, height, indexes, this.layer);

        return this;
    },

    /**
     * Removes the tile at the given tile coordinates in the specified layer and updates the layers
     * collision information.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#removeTileAt
     * @since 3.50.0
     *
     * @param {number} tileX - The x coordinate, in tiles, not pixels.
     * @param {number} tileY - The y coordinate, in tiles, not pixels.
     * @param {boolean} [replaceWithNull=true] - If true, this will replace the tile at the specified location with null instead of a Tile with an index of -1.
     * @param {boolean} [recalculateFaces=true] - `true` if the faces data should be recalculated.
     *
     * @return {Phaser.Tilemaps.Tile} A Tile object.
     */
    removeTileAt: function (tileX, tileY, replaceWithNull, recalculateFaces)
    {
        return TilemapComponents.RemoveTileAt(tileX, tileY, replaceWithNull, recalculateFaces, this.layer);
    },

    /**
     * Removes the tile at the given world coordinates in the specified layer and updates the layers
     * collision information.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#removeTileAtWorldXY
     * @since 3.50.0
     *
     * @param {number} worldX - The x coordinate, in pixels.
     * @param {number} worldY - The y coordinate, in pixels.
     * @param {boolean} [replaceWithNull=true] - If true, this will replace the tile at the specified location with null instead of a Tile with an index of -1.
     * @param {boolean} [recalculateFaces=true] - `true` if the faces data should be recalculated.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use when calculating the tile index from the world values.
     *
     * @return {Phaser.Tilemaps.Tile} The Tile object that was removed from the given location.
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
     * @method Phaser.Tilemaps.TilemapLayerBase#renderDebug
     * @since 3.50.0
     *
     * @param {Phaser.GameObjects.Graphics} graphics - The target Graphics object to draw upon.
     * @param {Phaser.Types.Tilemaps.StyleConfig} [styleConfig] - An object specifying the colors to use for the debug drawing.
     *
     * @return {this} This Tilemap Layer object.
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
     * @method Phaser.Tilemaps.TilemapLayerBase#replaceByIndex
     * @since 3.50.0
     *
     * @param {number} findIndex - The index of the tile to search for.
     * @param {number} newIndex - The index of the tile to replace it with.
     * @param {number} [tileX] - The left most tile index (in tile coordinates) to use as the origin of the area.
     * @param {number} [tileY] - The top most tile index (in tile coordinates) to use as the origin of the area.
     * @param {number} [width] - How many tiles wide from the `tileX` index the area will be.
     * @param {number} [height] - How many tiles tall from the `tileY` index the area will be.
     *
     * @return {this} This Tilemap Layer object.
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
     * @method Phaser.Tilemaps.TilemapLayerBase#setCollision
     * @since 3.50.0
     *
     * @param {(number|array)} indexes - Either a single tile index, or an array of tile indexes.
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the update.
     * @param {boolean} [updateLayer=true] - If true, updates the current tiles on the layer. Set to false if no tiles have been placed for significant performance boost.
     *
     * @return {this} This Tilemap Layer object.
     */
    setCollision: function (indexes, collides, recalculateFaces, updateLayer)
    {
        TilemapComponents.SetCollision(indexes, collides, recalculateFaces, this.layer, updateLayer);

        return this;
    },

    /**
     * Sets collision on a range of tiles in a layer whose index is between the specified `start` and
     * `stop` (inclusive). Calling this with a start value of 10 and a stop value of 14 would set
     * collision for tiles 10, 11, 12, 13 and 14. The `collides` parameter controls if collision will be
     * enabled (true) or disabled (false).
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#setCollisionBetween
     * @since 3.50.0
     *
     * @param {number} start - The first index of the tile to be set for collision.
     * @param {number} stop - The last index of the tile to be set for collision.
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the update.
     *
     * @return {this} This Tilemap Layer object.
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
     * @method Phaser.Tilemaps.TilemapLayerBase#setCollisionByProperty
     * @since 3.50.0
     *
     * @param {object} properties - An object with tile properties and corresponding values that should be checked.
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the update.
     *
     * @return {this} This Tilemap Layer object.
     */
    setCollisionByProperty: function (properties, collides, recalculateFaces)
    {
        TilemapComponents.SetCollisionByProperty(properties, collides, recalculateFaces, this.layer);

        return this;
    },

    /**
     * Sets collision on all tiles in the given layer, except for tiles that have an index specified in
     * the given array. The `collides` parameter controls if collision will be enabled (true) or
     * disabled (false). Tile indexes not currently in the layer are not affected.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#setCollisionByExclusion
     * @since 3.50.0
     *
     * @param {number[]} indexes - An array of the tile indexes to not be counted for collision.
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the update.
     *
     * @return {this} This Tilemap Layer object.
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
     * @method Phaser.Tilemaps.TilemapLayerBase#setCollisionFromCollisionGroup
     * @since 3.50.0
     *
     * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear collision.
     * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the update.
     *
     * @return {this} This Tilemap Layer object.
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
     * @method Phaser.Tilemaps.TilemapLayerBase#setTileIndexCallback
     * @since 3.50.0
     *
     * @param {(number|number[])} indexes - Either a single tile index, or an array of tile indexes to have a collision callback set for.
     * @param {function} callback - The callback that will be invoked when the tile is collided with.
     * @param {object} callbackContext - The context under which the callback is called.
     *
     * @return {this} This Tilemap Layer object.
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
     * @method Phaser.Tilemaps.TilemapLayerBase#setTileLocationCallback
     * @since 3.50.0
     *
     * @param {number} [tileX] - The left most tile index (in tile coordinates) to use as the origin of the area.
     * @param {number} [tileY] - The top most tile index (in tile coordinates) to use as the origin of the area.
     * @param {number} [width] - How many tiles wide from the `tileX` index the area will be.
     * @param {number} [height] - How many tiles tall from the `tileY` index the area will be.
     * @param {function} [callback] - The callback that will be invoked when the tile is collided with.
     * @param {object} [callbackContext] - The context, or scope, under which the callback is invoked.
     *
     * @return {this} This Tilemap Layer object.
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
     * @method Phaser.Tilemaps.TilemapLayerBase#shuffle
     * @since 3.50.0
     *
     * @param {number} [tileX] - The left most tile index (in tile coordinates) to use as the origin of the area.
     * @param {number} [tileY] - The top most tile index (in tile coordinates) to use as the origin of the area.
     * @param {number} [width] - How many tiles wide from the `tileX` index the area will be.
     * @param {number} [height] - How many tiles tall from the `tileY` index the area will be.
     *
     * @return {this} This Tilemap Layer object.
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
     * @method Phaser.Tilemaps.TilemapLayerBase#swapByIndex
     * @since 3.50.0
     *
     * @param {number} tileA - First tile index.
     * @param {number} tileB - Second tile index.
     * @param {number} [tileX] - The left most tile index (in tile coordinates) to use as the origin of the area.
     * @param {number} [tileY] - The top most tile index (in tile coordinates) to use as the origin of the area.
     * @param {number} [width] - How many tiles wide from the `tileX` index the area will be.
     * @param {number} [height] - How many tiles tall from the `tileY` index the area will be.
     *
     * @return {this} This Tilemap Layer object.
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
     * @method Phaser.Tilemaps.TilemapLayerBase#tileToWorldX
     * @since 3.50.0
     *
     * @param {number} tileX - The x coordinate, in tiles, not pixels.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use when calculating the tile index from the world values.
     *
     * @return {number} The Tile X coordinate converted to pixels.
     */
    tileToWorldX: function (tileX, camera)
    {
        return this.tilemap.tileToWorldX(tileX, camera, this);
    },

    /**
     * Converts from tile Y coordinates (tile units) to world Y coordinates (pixels), factoring in the
     * layers position, scale and scroll.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#tileToWorldY
     * @since 3.50.0
     *
     * @param {number} tileY - The y coordinate, in tiles, not pixels.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use when calculating the tile index from the world values.
     *
     * @return {number} The Tile Y coordinate converted to pixels.
     */
    tileToWorldY: function (tileY, camera)
    {
        return this.tilemap.tileToWorldY(tileY, camera, this);
    },

    /**
     * Converts from tile XY coordinates (tile units) to world XY coordinates (pixels), factoring in the
     * layers position, scale and scroll. This will return a new Vector2 object or update the given
     * `point` object.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#tileToWorldXY
     * @since 3.50.0
     *
     * @param {number} tileX - The x coordinate, in tiles, not pixels.
     * @param {number} tileY - The y coordinate, in tiles, not pixels.
     * @param {Phaser.Math.Vector2} [point] - A Vector2 to store the coordinates in. If not given a new Vector2 is created.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use when calculating the tile index from the world values.
     *
     * @return {Phaser.Math.Vector2} A Vector2 containing the world coordinates of the Tile.
     */
    tileToWorldXY: function (tileX, tileY, point, camera)
    {
        return this.tilemap.tileToWorldXY(tileX, tileY, point, camera, this);
    },

    /**
     * Returns an array of Vector2s where each entry corresponds to the corner of the requested tile.
     *
     * The `tileX` and `tileY` parameters are in tile coordinates, not world coordinates.
     *
     * The corner coordinates are in world space, having factored in TilemapLayer scale, position
     * and the camera, if given.
     *
     * The size of the array will vary based on the orientation of the map. For example an
     * orthographic map will return an array of 4 vectors, where-as a hexagonal map will,
     * of course, return an array of 6 corner vectors.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#getTileCorners
     * @since 3.60.0
     *
     * @param {number} tileX - The x coordinate, in tiles, not pixels.
     * @param {number} tileY - The y coordinate, in tiles, not pixels.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use when calculating the tile index from the world values.
     *
     * @return {?Phaser.Math.Vector2[]} Returns an array of Vector2s, or null if the layer given was invalid.
     */
    getTileCorners: function (tileX, tileY, camera)
    {
        return this.tilemap.getTileCorners(tileX, tileY, camera, this);
    },

    /**
     * Randomizes the indexes of a rectangular region of tiles (in tile coordinates) within the
     * specified layer. Each tile will receive a new index. New indexes are drawn from the given
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
     * @method Phaser.Tilemaps.TilemapLayerBase#weightedRandomize
     * @since 3.50.0
     *
     * @param {object[]} weightedIndexes - An array of objects to randomly draw from during randomization. They should be in the form: { index: 0, weight: 4 } or { index: [0, 1], weight: 4 } if you wish to draw from multiple tile indexes.
     * @param {number} [tileX] - The left most tile index (in tile coordinates) to use as the origin of the area.
     * @param {number} [tileY] - The top most tile index (in tile coordinates) to use as the origin of the area.
     * @param {number} [width] - How many tiles wide from the `tileX` index the area will be.
     * @param {number} [height] - How many tiles tall from the `tileY` index the area will be.
     *
     * @return {this} This Tilemap Layer object.
     */
    weightedRandomize: function (weightedIndexes, tileX, tileY, width, height)
    {
        TilemapComponents.WeightedRandomize(tileX, tileY, width, height, weightedIndexes, this.layer);

        return this;
    },

    /**
     * Converts from world X coordinates (pixels) to tile X coordinates (tile units), factoring in the
     * layers position, scale and scroll.
     *
     * You cannot call this method for Isometric or Hexagonal tilemaps as they require
     * both `worldX` and `worldY` values to determine the correct tile, instead you
     * should use the `worldToTileXY` method.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#worldToTileX
     * @since 3.50.0
     *
     * @param {number} worldX - The x coordinate to be converted, in pixels, not tiles.
     * @param {boolean} [snapToFloor] - Whether or not to round the tile coordinate down to the nearest integer.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use when calculating the tile index from the world values.
     *
     * @return {number} The tile X coordinate based on the world value.
     */
    worldToTileX: function (worldX, snapToFloor, camera)
    {
        return this.tilemap.worldToTileX(worldX, snapToFloor, camera, this);
    },

    /**
     * Converts from world Y coordinates (pixels) to tile Y coordinates (tile units), factoring in the
     * layers position, scale and scroll.
     *
     * You cannot call this method for Isometric or Hexagonal tilemaps as they require
     * both `worldX` and `worldY` values to determine the correct tile, instead you
     * should use the `worldToTileXY` method.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#worldToTileY
     * @since 3.50.0
     *
     * @param {number} worldY - The y coordinate to be converted, in pixels, not tiles.
     * @param {boolean} [snapToFloor] - Whether or not to round the tile coordinate down to the nearest integer.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use when calculating the tile index from the world values.
     *
     * @return {number} The tile Y coordinate based on the world value.
     */
    worldToTileY: function (worldY, snapToFloor, camera)
    {
        return this.tilemap.worldToTileY(worldY, snapToFloor, camera, this);
    },

    /**
     * Converts from world XY coordinates (pixels) to tile XY coordinates (tile units), factoring in the
     * layers position, scale and scroll. This will return a new Vector2 object or update the given
     * `point` object.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#worldToTileXY
     * @since 3.50.0
     *
     * @param {number} worldX - The x coordinate to be converted, in pixels, not tiles.
     * @param {number} worldY - The y coordinate to be converted, in pixels, not tiles.
     * @param {boolean} [snapToFloor] - Whether or not to round the tile coordinate down to the nearest integer.
     * @param {Phaser.Math.Vector2} [point] - A Vector2 to store the coordinates in. If not given a new Vector2 is created.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to use when calculating the tile index from the world values.
     *
     * @return {Phaser.Math.Vector2} A Vector2 containing the tile coordinates of the world values.
     */
    worldToTileXY: function (worldX, worldY, snapToFloor, point, camera)
    {
        return this.tilemap.worldToTileXY(worldX, worldY, snapToFloor, point, camera, this);
    },

    /**
     * Destroys this TilemapLayer and removes its link to the associated LayerData.
     *
     * @method Phaser.Tilemaps.TilemapLayerBase#destroy
     * @since 3.50.0
     *
     * @param {boolean} [removeFromTilemap=true] - Remove this layer from the parent Tilemap?
     */
    destroy: function (removeFromTilemap)
    {
        if (removeFromTilemap === undefined) { removeFromTilemap = true; }

        if (!this.tilemap)
        {
            //  Abort, we've already been destroyed
            return;
        }

        //  Uninstall this layer only if it is still installed on the LayerData object
        if (this.layer.tilemapLayer === this)
        {
            this.layer.tilemapLayer = undefined;
        }

        if (removeFromTilemap)
        {
            this.tilemap.removeLayer(this);
        }

        this.tilemap = undefined;
        this.layer = undefined;

        this.gidMap = [];
        this.tileset = [];

        GameObject.prototype.destroy.call(this);
    }

});

module.exports = TilemapLayerBase;
