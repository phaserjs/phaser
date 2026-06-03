/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DefaultTilemapLayerNodes = require('../renderer/webgl/renderNodes/defaults/DefaultTilemapLayerNodes');
var Class = require('../utils/Class');
var TilemapComponents = require('./components');
var TilemapLayerRender = require('./TilemapLayerRender');
var TilemapLayerBase = require('./TilemapLayerBase');
var TintModes = require('../renderer/TintModes');

/**
 * @classdesc
 * A TilemapLayer is a Game Object responsible for rendering a single layer of tile data from a
 * Tilemap. It works in combination with one or more Tileset objects, which provide the actual
 * tile imagery. You would typically create a TilemapLayer via `Tilemap.createLayer`, rather than
 * instantiating it directly.
 *
 * Each layer corresponds to a LayerData entry within the Tilemap, and supports all four map
 * orientations: Orthogonal, Isometric, Hexagonal, and Staggered. The layer handles its own
 * camera culling, only sending visible tiles to the renderer each frame, which keeps performance
 * efficient even for large maps.
 *
 * TilemapLayers support physics via both Arcade Physics and Matter.js, and can have tints,
 * alpha, and other standard Game Object properties applied to them.
 *
 * A TilemapLayer can be placed inside a Container, but its physics
 * will work as though it was placed directly in the world.
 * This is rarely what you want.
 *
 * @class TilemapLayer
 * @extends Phaser.Tilemaps.TilemapLayerBase
 * @memberof Phaser.Tilemaps
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {Phaser.Tilemaps.Tilemap} tilemap - The Tilemap this layer is a part of.
 * @param {number} layerIndex - The index of the LayerData associated with this layer.
 * @param {(string|string[]|Phaser.Tilemaps.Tileset|Phaser.Tilemaps.Tileset[])} tileset - The tileset, or an array of tilesets, used to render this layer. Can be a string or a Tileset object.
 * @param {number} [x=0] - The world x position where the top left of this layer will be placed.
 * @param {number} [y=0] - The world y position where the top left of this layer will be placed.
 */
var TilemapLayer = new Class({

    Extends: TilemapLayerBase,

    Mixins: [
        TilemapLayerRender
    ],

    initialize:

    function TilemapLayer (scene, tilemap, layerIndex, tileset, x, y)
    {
        TilemapLayerBase.call(this, 'TilemapLayer', scene, tilemap, layerIndex, x, y);

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

        this.setTilesets(tileset);

        this.initRenderNodes(this._defaultRenderNodesMap);
    },

    /**
     * The default render nodes for this Game Object.
     *
     * @name Phaser.Tilemaps.TilemapLayer#_defaultRenderNodesMap
     * @type {Map<string, string>}
     * @private
     * @webglOnly
     * @readonly
     * @since 4.0.0
     */
    _defaultRenderNodesMap: {
        get: function ()
        {
            return DefaultTilemapLayerNodes;
        }
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
     * Returns the tiles in the given layer that are within the camera's viewport.
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
     * Sets a tint color on each Tile within the given area.
     *
     * The tint works by taking the pixel color values from the tileset texture
     * and combining it with the color value of the tint,
     * according to the tint mode.
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
        };

        return this.forEachTile(tintTile, this, tileX, tileY, width, height, filteringOptions);
    },

    /**
     * Sets a secondary tint color on each Tile within the given area.
     * Secondary tints are used by two-color tint modes such as MULTIPLY_TWO.
     *
     * If no area values are given then all tiles will be tinted to the given color.
     *
     * To remove a secondary tint call this method with either no parameters, or by passing black `0x000000` as the secondary tint color.
     *
     * If a tile already has a secondary tint set then calling this method will override that.
     *
     * @method Phaser.Tilemaps.TilemapLayer#setTint2
     * @webglOnly
     * @since 4.NEXT
     *
     * @param {number} [tint2=0x000000] - The secondary tint color being applied to each tile within the region. Given as a hex value, i.e. `0xff0000` for red. Set to black (`0x000000`) to reset the secondary tint.
     * @param {number} [tileX] - The left most tile index (in tile coordinates) to use as the origin of the area to search.
     * @param {number} [tileY] - The top most tile index (in tile coordinates) to use as the origin of the area to search.
     * @param {number} [width] - How many tiles wide from the `tileX` index the area will be.
     * @param {number} [height] - How many tiles tall from the `tileY` index the area will be.
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
     *
     * @return {this} This Tilemap Layer object.
     */
    setTint2: function (tint2, tileX, tileY, width, height, filteringOptions)
    {
        if (tint2 === undefined) { tint2 = 0x000000; }

        var tintTile = function (tile)
        {
            tile.tint2 = tint2;
        };

        return this.forEachTile(tintTile, this, tileX, tileY, width, height, filteringOptions);
    },

    /**
     * Sets the tint mode to use when applying the tint to the texture.
     *
     * Available modes are:
     *
     * - Phaser.TintModes.MULTIPLY (default)
     * - Phaser.TintModes.FILL
     * - Phaser.TintModes.ADD
     * - Phaser.TintModes.SCREEN
     * - Phaser.TintModes.OVERLAY
     * - Phaser.TintModes.HARD_LIGHT
     * - Phaser.TintModes.MULTIPLY_TWO
     *
     * Call this method with no parameters to reset the tint mode to the default.
     *
     * If a tile already has a tint mode set then calling this method will override that.
     *
     * @method Phaser.Tilemaps.TilemapLayer#setTintMode
     * @webglOnly
     * @since 4.0.0
     *
     * @param {Phaser.TintModes} [tintMode=Phaser.TintModes.MULTIPLY] - The tint mode to use.
     * @param {number} [tileX] - The left most tile index (in tile coordinates) to use as the origin of the area to search.
     * @param {number} [tileY] - The top most tile index (in tile coordinates) to use as the origin of the area to search.
     * @param {number} [width] - How many tiles wide from the `tileX` index the area will be.
     * @param {number} [height] - How many tiles tall from the `tileY` index the area will be.
     * @param {Phaser.Types.Tilemaps.FilteringOptions} [filteringOptions] - Optional filters to apply when getting the tiles.
     *
     * @return {this} This Tilemap Layer object.
     */
    setTintMode: function (tintMode, tileX, tileY, width, height, filteringOptions)
    {
        if (tintMode === undefined) { tintMode = TintModes.MULTIPLY; }

        var tintTile = function (tile)
        {
            tile.tintMode = tintMode;
        };

        return this.forEachTile(tintTile, this, tileX, tileY, width, height, filteringOptions);
    },

    /**
     * Destroys this TilemapLayer, clearing the culled tiles array and removing the cull callback.
     * Also removes the layer from its parent Tilemap if `removeFromTilemap` is set to `true`.
     *
     * @method Phaser.Tilemaps.TilemapLayer#destroy
     * @since 3.50.0
     *
     * @param {boolean} [removeFromTilemap=true] - Remove this layer from the parent Tilemap before destroying it.
     */
    destroy: function (removeFromTilemap)
    {
        this.culledTiles.length = 0;
        this.cullCallback = null;

        TilemapLayerBase.prototype.destroy.call(this, removeFromTilemap);
    }
});

module.exports = TilemapLayer;
