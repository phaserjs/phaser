/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var CollisionComponent = require('../physics/arcade/components/Collision');
var Components = require('../gameobjects/components');
var GameObject = require('../gameobjects/GameObject');
var TilemapComponents = require('./components');
var TilemapLayerRender = require('./TilemapLayerRender');
var Vector2 = require('../math/Vector2');

/**
 * @classdesc
 * A Tilemap Layer is a Game Object that renders LayerData from a Tilemap when used in combination
 * with one, or more, Tilesets.
 * 
 * Do not add TilemapLayers to Containers, they are stand-alone display objects.
 *
 * @class TilemapLayer
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.Tilemaps
 * @constructor
 * @since 3.50.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.PostPipeline
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * @extends Phaser.Physics.Arcade.Components.Collision
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {Phaser.Tilemaps.Tilemap} tilemap - The Tilemap this layer is a part of.
 * @param {number} layerIndex - The index of the LayerData associated with this layer.
 * @param {(string|string[]|Phaser.Tilemaps.Tileset|Phaser.Tilemaps.Tileset[])} tileset - The tileset, or an array of tilesets, used to render this layer. Can be a string or a Tileset object.
 * @param {number} [x=0] - The world x position where the top left of this layer will be placed.
 * @param {number} [y=0] - The world y position where the top left of this layer will be placed.
 */
var TilemapLayer = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.ComputedSize,
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
        Components.Mask,
        Components.Origin,
        Components.Pipeline,
        Components.PostPipeline,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        CollisionComponent,
        TilemapLayerRender
    ],

    initialize:

    function TilemapLayer (scene, tilemap, layerIndex, tileset, x, y)
    {
        GameObject.call(this, scene, 'TilemapLayer');

        /**
         * Used internally by physics system to perform fast type checks.
         *
         * @name Phaser.Tilemaps.TilemapLayer#isTilemap
         * @type {boolean}
         * @readonly
         * @since 3.50.0
         */
        this.isTilemap = true;

        /**
         * The Tilemap that this layer is a part of.
         *
         * @name Phaser.Tilemaps.TilemapLayer#tilemap
         * @type {Phaser.Tilemaps.Tilemap}
         * @since 3.50.0
         */
        this.tilemap = tilemap;

        /**
         * The index of the LayerData associated with this layer.
         *
         * @name Phaser.Tilemaps.TilemapLayer#layerIndex
         * @type {number}
         * @since 3.50.0
         */
        this.layerIndex = layerIndex;

        /**
         * The LayerData associated with this layer. LayerData can only be associated with one
         * tilemap layer.
         *
         * @name Phaser.Tilemaps.TilemapLayer#layer
         * @type {Phaser.Tilemaps.LayerData}
         * @since 3.50.0
         */
        this.layer = tilemap.layers[layerIndex];

        // Link the LayerData with this static tilemap layer
        this.layer.tilemapLayer = this;

        /**
         * An array of `Tileset` objects associated with this layer.
         *
         * @name Phaser.Tilemaps.TilemapLayer#tileset
         * @type {Phaser.Tilemaps.Tileset[]}
         * @since 3.50.0
         */
        this.tileset = [];

        /**
         * The total number of tiles drawn by the renderer in the last frame.
         *
         * @name Phaser.Tilemaps.TilemapLayer#tilesDrawn
         * @type {number}
         * @readonly
         * @since 3.50.0
         */
        this.tilesDrawn = 0;

        /**
         * The total number of tiles in this layer. Updated every frame.
         *
         * @name Phaser.Tilemaps.TilemapLayer#tilesTotal
         * @type {number}
         * @readonly
         * @since 3.50.0
         */
        this.tilesTotal = this.layer.width * this.layer.height;

        /**
         * Used internally during rendering. This holds the tiles that are visible within the Camera.
         *
         * @name Phaser.Tilemaps.TilemapLayer#culledTiles
         * @type {Phaser.Tilemaps.Tile[]}
         * @since 3.50.0
         */
        this.culledTiles = [];

        /**
         * You can control if the camera should cull tiles on this layer before rendering them or not.
         *
         * By default the camera will try to cull the tiles in this layer, to avoid over-drawing to the renderer.
         *
         * However, there are some instances when you may wish to disable this, and toggling this flag allows
         * you to do so. Also see `setSkipCull` for a chainable method that does the same thing.
         *
         * @name Phaser.Tilemaps.TilemapLayer#skipCull
         * @type {boolean}
         * @since 3.50.0
         */
        this.skipCull = false;

        /**
         * The amount of extra tiles to add into the cull rectangle when calculating its horizontal size.
         *
         * See the method `setCullPadding` for more details.
         *
         * @name Phaser.Tilemaps.TilemapLayer#cullPaddingX
         * @type {number}
         * @default 1
         * @since 3.50.0
         */
        this.cullPaddingX = 1;

        /**
         * The amount of extra tiles to add into the cull rectangle when calculating its vertical size.
         *
         * See the method `setCullPadding` for more details.
         *
         * @name Phaser.Tilemaps.TilemapLayer#cullPaddingY
         * @type {number}
         * @default 1
         * @since 3.50.0
         */
        this.cullPaddingY = 1;

        /**
         * The callback that is invoked when the tiles are culled.
         *
         * It will call a different function based on the map orientation:
         *
         * Orthogonal (the default) is `TilemapComponents.CullTiles`
         * Isometric is `TilemapComponents.IsometricCullTiles`
         * Hexagonal is `TilemapComponents.HexagonalCullTiles`
         * Staggered is `TilemapComponents.StaggeredCullTiles`
         *
         * However, you can override this to call any function you like.
         *
         * It will be sent 4 arguments:
         *
         * 1. The Phaser.Tilemaps.LayerData object for this Layer
         * 2. The Camera that is culling the layer. You can check its `dirty` property to see if it has changed since the last cull.
         * 3. A reference to the `culledTiles` array, which should be used to store the tiles you want rendered.
         * 4. The Render Order constant.
         *
         * See the `TilemapComponents.CullTiles` source code for details on implementing your own culling system.
         *
         * @name Phaser.Tilemaps.TilemapLayer#cullCallback
         * @type {function}
         * @since 3.50.0
         */
        this.cullCallback = TilemapComponents.GetCullTilesFunction(this.layer.orientation);

        /**
         * The rendering (draw) order of the tiles in this layer.
         *
         * The default is 0 which is 'right-down', meaning it will draw the tiles starting from the top-left,
         * drawing to the right and then moving down to the next row.
         *
         * The draw orders are:
         *
         * 0 = right-down
         * 1 = left-down
         * 2 = right-up
         * 3 = left-up
         *
         * This can be changed via the `setRenderOrder` method.
         *
         * @name Phaser.Tilemaps.TilemapLayer#_renderOrder
         * @type {number}
         * @default 0
         * @private
         * @since 3.50.0
         */
        this._renderOrder = 0;

        /**
         * An array holding the mapping between the tile indexes and the tileset they belong to.
         *
         * @name Phaser.Tilemaps.TilemapLayer#gidMap
         * @type {Phaser.Tilemaps.Tileset[]}
         * @since 3.50.0
         */
        this.gidMap = [];

        /**
         * A temporary Vector2 used in the tile coordinate methods.
         *
         * @name Phaser.Tilemaps.TilemapLayer#tempVec
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
         * @name Phaser.Tilemaps.TilemapLayer#collisionCategory
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
         * @name Phaser.Tilemaps.TilemapLayer#collisionMask
         * @type {number}
         * @since 3.70.0
         */
        this.collisionMask = 1;

        /**
         * The horizontal origin of this Tilemap Layer.
         *
         * @name Phaser.Tilemaps.TilemapLayer#originX
         * @type {number}
         * @default 0
         * @readOnly
         * @since 3.0.0
         */

        /**
         * The vertical origin of this Tilemap Layer.
         *
         * @name Phaser.Tilemaps.TilemapLayer#originY
         * @type {number}
         * @default 0
         * @readOnly
         * @since 3.0.0
         */

        /**
         * The horizontal display origin of this Tilemap Layer.
         *
         * @name Phaser.Tilemaps.TilemapLayer#displayOriginX
         * @type {number}
         * @default 0
         * @readOnly
         * @since 3.0.0
         */

        /**
         * The vertical display origin of this Tilemap Layer.
         *
         * @name Phaser.Tilemaps.TilemapLayer#displayOriginY
         * @type {number}
         * @default 0
         * @readOnly
         * @since 3.0.0
         */

        this.setTilesets(tileset);
        this.setAlpha(this.layer.alpha);
        this.setPosition(x, y);
        this.setOrigin(0, 0);
        this.setSize(tilemap.tileWidth * this.layer.width, tilemap.tileHeight * this.layer.height);

        this.initPipeline();
        this.initPostPipeline(false);
    },

    /**
     * Populates the internal `tileset` array with the Tileset references this Layer requires for rendering.
     *
     * @method Phaser.Tilemaps.TilemapLayer#setTilesets
     * @private
     * @since 3.50.0
     *
     * @param {(string|string[]|Phaser.Tilemaps.Tileset|Phaser.Tilemaps.Tileset[])} tileset - The tileset, or an array of tilesets, used to render this layer. Can be a string or a Tileset object.
     */
    setTilesets: function (tilesets)
    {
        var gidMap = [];
        var setList = [];
        var map = this.tilemap;

        if (!Array.isArray(tilesets))
        {
            tilesets = [ tilesets ];
        }

        for (var i = 0; i < tilesets.length; i++)
        {
            var tileset = tilesets[i];

            if (typeof tileset === 'string')
            {
                tileset = map.getTileset(tileset);
            }

            if (tileset)
            {
                setList.push(tileset);

                var s = tileset.firstgid;

                for (var t = 0; t < tileset.total; t++)
                {
                    gidMap[s + t] = tileset;
                }
            }
        }

        this.gidMap = gidMap;
        this.tileset = setList;
    },

    /**
     * Sets the rendering (draw) order of the tiles in this layer.
     *
     * The default is 'right-down', meaning it will order the tiles starting from the top-left,
     * drawing to the right and then moving down to the next row.
     *
     * The draw orders are:
     *
     * 0 = right-down
     * 1 = left-down
     * 2 = right-up
     * 3 = left-up
     *
     * Setting the render order does not change the tiles or how they are stored in the layer,
     * it purely impacts the order in which they are rendered.
     *
     * You can provide either an integer (0 to 3), or the string version of the order.
     *
     * @method Phaser.Tilemaps.TilemapLayer#setRenderOrder
     * @since 3.50.0
     *
     * @param {(number|string)} renderOrder - The render (draw) order value. Either an integer between 0 and 3, or a string: 'right-down', 'left-down', 'right-up' or 'left-up'.
     *
     * @return {this} This Tilemap Layer object.
     */
    setRenderOrder: function (renderOrder)
    {
        var orders = [ 'right-down', 'left-down', 'right-up', 'left-up' ];

        if (typeof renderOrder === 'string')
        {
            renderOrder = orders.indexOf(renderOrder);
        }

        if (renderOrder >= 0 && renderOrder < 4)
        {
            this._renderOrder = renderOrder;
        }

        return this;
    },

    /**
     * Calculates interesting faces at the given tile coordinates of the specified layer. Interesting
     * faces are used internally for optimizing collisions against tiles. This method is mostly used
     * internally to optimize recalculating faces when only one tile has been changed.
     *
     * @method Phaser.Tilemaps.TilemapLayer#calculateFacesAt
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
     * @method Phaser.Tilemaps.TilemapLayer#calculateFacesWithin
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
     * @method Phaser.Tilemaps.TilemapLayer#createFromTiles
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
     * Returns the tiles in the given layer that are within the cameras viewport.
     * This is used internally during rendering.
     *
     * @method Phaser.Tilemaps.TilemapLayer#cull
     * @since 3.50.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to run the cull check against.
     *
     * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects to render.
     */
    cull: function (camera)
    {
        return this.cullCallback(this.layer, camera, this.culledTiles, this._renderOrder);
    },

    /**
     * Copies the tiles in the source rectangular area to a new destination (all specified in tile
     * coordinates) within the layer. This copies all tile properties & recalculates collision
     * information in the destination region.
     *
     * @method Phaser.Tilemaps.TilemapLayer#copy
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
     * @method Phaser.Tilemaps.TilemapLayer#fill
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
     * @method Phaser.Tilemaps.TilemapLayer#filterTiles
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
     * @method Phaser.Tilemaps.TilemapLayer#findByIndex
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
     * @method Phaser.Tilemaps.TilemapLayer#findTile
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
     * @method Phaser.Tilemaps.TilemapLayer#forEachTile
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
     * Sets an additive tint on each Tile within the given area.
     *
     * The tint works by taking the pixel color values from the tileset texture, and then
     * multiplying it by the color value of the tint.
     *
     * If no area values are given then all tiles will be tinted to the given color.
     *
     * To remove a tint call this method with either no parameters, or by passing white `0xffffff` as the tint color.
     *
     * If a tile already has a tint set then calling this method will override that.
     *
     * @method Phaser.Tilemaps.TilemapLayer#setTint
     * @webglOnly
     * @since 3.60.0
     *
     * @param {number} [tint=0xffffff] - The tint color being applied to each tile within the region. Given as a hex value, i.e. `0xff0000` for red. Set to white (`0xffffff`) to reset the tint.
     * @param {number} [tileX] - The left most tile index (in tile coordinates) to use as the origin of the area to search.
     * @param {number} [tileY] - The top most tile index (in tile coordinates) to use as the origin of the area to search.
     * @param {number} [width] - How many tiles wide from the `tileX` index the area will be.
     * @param {number} [height] - How many tiles tall from the `tileY` index the area will be.
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
     *
     * @return {this} This Tilemap Layer object.
     */
    setTint: function (tint, tileX, tileY, width, height, filteringOptions)
    {
        if (tint === undefined) { tint = 0xffffff; }

        var tintTile = function (tile)
        {
            tile.tint = tint;
            tile.tintFill = false;
        };

        return this.forEachTile(tintTile, this, tileX, tileY, width, height, filteringOptions);
    },

    /**
     * Sets a fill-based tint on each Tile within the given area.
     *
     * Unlike an additive tint, a fill-tint literally replaces the pixel colors from the texture
     * with those in the tint.
     *
     * If no area values are given then all tiles will be tinted to the given color.
     *
     * To remove a tint call this method with either no parameters, or by passing white `0xffffff` as the tint color.
     *
     * If a tile already has a tint set then calling this method will override that.
     *
     * @method Phaser.Tilemaps.TilemapLayer#setTintFill
     * @webglOnly
     * @since 3.70.0
     *
     * @param {number} [tint=0xffffff] - The tint color being applied to each tile within the region. Given as a hex value, i.e. `0xff0000` for red. Set to white (`0xffffff`) to reset the tint.
     * @param {number} [tileX] - The left most tile index (in tile coordinates) to use as the origin of the area to search.
     * @param {number} [tileY] - The top most tile index (in tile coordinates) to use as the origin of the area to search.
     * @param {number} [width] - How many tiles wide from the `tileX` index the area will be.
     * @param {number} [height] - How many tiles tall from the `tileY` index the area will be.
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
     *
     * @return {this} This Tilemap Layer object.
     */
    setTintFill: function (tint, tileX, tileY, width, height, filteringOptions)
    {
        if (tint === undefined) { tint = 0xffffff; }

        var tintTile = function (tile)
        {
            tile.tint = tint;
            tile.tintFill = true;
        };

        return this.forEachTile(tintTile, this, tileX, tileY, width, height, filteringOptions);
    },

    /**
     * Gets a tile at the given tile coordinates from the given layer.
     *
     * @method Phaser.Tilemaps.TilemapLayer#getTileAt
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
     * @method Phaser.Tilemaps.TilemapLayer#getTileAtWorldXY
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
     * @method Phaser.Tilemaps.TilemapLayer#getIsoTileAtWorldXY
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
     * @method Phaser.Tilemaps.TilemapLayer#getTilesWithin
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
     * @method Phaser.Tilemaps.TilemapLayer#getTilesWithinShape
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
     * @method Phaser.Tilemaps.TilemapLayer#getTilesWithinWorldXY
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
     * @method Phaser.Tilemaps.TilemapLayer#hasTileAt
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
     * @method Phaser.Tilemaps.TilemapLayer#hasTileAtWorldXY
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
     * @method Phaser.Tilemaps.TilemapLayer#putTileAt
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
     * @method Phaser.Tilemaps.TilemapLayer#putTileAtWorldXY
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
     * @method Phaser.Tilemaps.TilemapLayer#putTilesAt
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
     * @method Phaser.Tilemaps.TilemapLayer#randomize
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
     * @method Phaser.Tilemaps.TilemapLayer#removeTileAt
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
     * @method Phaser.Tilemaps.TilemapLayer#removeTileAtWorldXY
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
     * @method Phaser.Tilemaps.TilemapLayer#renderDebug
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
     * @method Phaser.Tilemaps.TilemapLayer#replaceByIndex
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
     * You can control if the Cameras should cull tiles before rendering them or not.
     *
     * By default the camera will try to cull the tiles in this layer, to avoid over-drawing to the renderer.
     *
     * However, there are some instances when you may wish to disable this.
     *
     * @method Phaser.Tilemaps.TilemapLayer#setSkipCull
     * @since 3.50.0
     *
     * @param {boolean} [value=true] - Set to `true` to stop culling tiles. Set to `false` to enable culling again.
     *
     * @return {this} This Tilemap Layer object.
     */
    setSkipCull: function (value)
    {
        if (value === undefined) { value = true; }

        this.skipCull = value;

        return this;
    },

    /**
     * When a Camera culls the tiles in this layer it does so using its view into the world, building up a
     * rectangle inside which the tiles must exist or they will be culled. Sometimes you may need to expand the size
     * of this 'cull rectangle', especially if you plan on rotating the Camera viewing the layer. Do so
     * by providing the padding values. The values given are in tiles, not pixels. So if the tile width was 32px
     * and you set `paddingX` to be 4, it would add 32px x 4 to the cull rectangle (adjusted for scale)
     *
     * @method Phaser.Tilemaps.TilemapLayer#setCullPadding
     * @since 3.50.0
     *
     * @param {number} [paddingX=1] - The amount of extra horizontal tiles to add to the cull check padding.
     * @param {number} [paddingY=1] - The amount of extra vertical tiles to add to the cull check padding.
     *
     * @return {this} This Tilemap Layer object.
     */
    setCullPadding: function (paddingX, paddingY)
    {
        if (paddingX === undefined) { paddingX = 1; }
        if (paddingY === undefined) { paddingY = 1; }

        this.cullPaddingX = paddingX;
        this.cullPaddingY = paddingY;

        return this;
    },

    /**
     * Sets collision on the given tile or tiles within a layer by index. You can pass in either a
     * single numeric index or an array of indexes: [2, 3, 15, 20]. The `collides` parameter controls if
     * collision will be enabled (true) or disabled (false).
     *
     * @method Phaser.Tilemaps.TilemapLayer#setCollision
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
     * @method Phaser.Tilemaps.TilemapLayer#setCollisionBetween
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
     * @method Phaser.Tilemaps.TilemapLayer#setCollisionByProperty
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
     * @method Phaser.Tilemaps.TilemapLayer#setCollisionByExclusion
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
     * @method Phaser.Tilemaps.TilemapLayer#setCollisionFromCollisionGroup
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
     * @method Phaser.Tilemaps.TilemapLayer#setTileIndexCallback
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
     * @method Phaser.Tilemaps.TilemapLayer#setTileLocationCallback
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
     * @method Phaser.Tilemaps.TilemapLayer#shuffle
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
     * @method Phaser.Tilemaps.TilemapLayer#swapByIndex
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
     * @method Phaser.Tilemaps.TilemapLayer#tileToWorldX
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
     * @method Phaser.Tilemaps.TilemapLayer#tileToWorldY
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
     * @method Phaser.Tilemaps.TilemapLayer#tileToWorldXY
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
     * @method Phaser.Tilemaps.TilemapLayer#getTileCorners
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
     * @method Phaser.Tilemaps.TilemapLayer#weightedRandomize
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
     * @method Phaser.Tilemaps.TilemapLayer#worldToTileX
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
     * @method Phaser.Tilemaps.TilemapLayer#worldToTileY
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
     * @method Phaser.Tilemaps.TilemapLayer#worldToTileXY
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
     * @method Phaser.Tilemaps.TilemapLayer#destroy
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
        this.culledTiles.length = 0;
        this.cullCallback = null;

        this.gidMap = [];
        this.tileset = [];

        GameObject.prototype.destroy.call(this);
    }

});

module.exports = TilemapLayer;
