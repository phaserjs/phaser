/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DefaultTilemapGPULayerNodes = require('../renderer/webgl/renderNodes/defaults/DefaultTilemapGPULayerNodes');
var Class = require('../utils/Class');
var TilemapLayerBase = require('./TilemapLayerBase');
var TilemapGPULayerRender = require('./TilemapGPULayerRender');

/**
 * @classdesc
 * A TilemapGPULayer is a special kind of Game Object that renders LayerData from a Tilemap.
 * Unlike the more flexible TilemapLayer, this object uses a single Tileset
 * and is optimized for speed and quality over flexibility.
 * Use it for high-performance rendering of tilemaps which don't update
 * their contents. It still supports tile animation and flip.
 *
 * This layer is designed to be used with the WebGL renderer only.
 *
 * Performance of this layer is excellent. If you do not need to
 * manipulate the tiles in the layer, and the layer is of the supported type,
 * this is the best option for rendering tilemaps.
 * It is almost entirely GPU-bound, so it will free up CPU resources
 * for other game code (the CPU usually does much more work than the GPU in games).
 * It has a fixed cost per pixel on screen, whether there is anything in that
 * tile or not.
 * In general, it suffers no performance loss when many tiles are visible.
 *
 * Create a TilemapGPULayer by adding the `gpu` flag to a call to
 * `Tilemap.createLayer()`. This will return a TilemapGPULayer instance.
 *
 * This layer has the following abilities and restrictions:
 *
 * - Use a single tileset, with a single texture image.
 * - Maximum tilemap size of 4096x4096 tiles.
 * - Maximum of 2^23 (8388608) unique tile IDs.
 * - Tiles may be flipped.
 * - Tiles may be animated.
 * - Animation data limit of 8388608 entries (each animation or each frame of animation uses one entry).
 * - Orthographic tilemaps only.
 *
 * The layer renders via a special shader.
 * This uses a texture containing the layer tile data, and a second texture
 * containing any tile animations. The shader then renders the tiles
 * as a single quad. Because it doesn't have to compute individual tiles
 * on the CPU, this is much faster than a TilemapLayer.
 * However, because it treats tiles as a single orthographic grid,
 * it is not suitable for use with isometric or hexagonal tilemaps,
 * or other types of tilemap that require different rendering methods.
 *
 * If the tileset image uses NEAREST minfiltering, the shader will render
 * sharp edged pixels. Otherwise, it assumes LINEAR filtering.
 * The shader will automatically render smooth borders between tiles
 * in LINEAR mode, with no seams or bleeding, for perfect results.
 * A regular TilemapLayer cannot render smooth borders like this,
 * creating sharp seams between tiles.
 *
 * The layer can be edited, but it will not update automatically.
 * Regenerate the layer tile data texture by calling `generateLayerDataTexture`.
 *
 * @class TilemapGPULayer
 * @extends Phaser.Tilemaps.TilemapLayerBase
 * @memberof Phaser.Tilemaps
 * @constructor
 * @since 4.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this TilemapGPULayer belongs.
 * @param {Phaser.Tilemaps.Tilemap} tilemap - The Tilemap this layer is a part of.
 * @param {number} layerIndex - The index of the LayerData associated with this layer.
 * @param {(string|Phaser.Tilemaps.Tileset)} tileset - The tileset used to render the tiles in this layer. Can be a string or a Tileset object.
 * @param {number} [x] - The world x position where the top left of this layer will be placed.
 * @param {number} [y] - The world y position where the top left of this layer will be placed.
 */
var TilemapGPULayer = new Class({
    Extends: TilemapLayerBase,

    Mixins: [
        TilemapGPULayerRender
    ],

    initialize: function TilemapGPULayer (scene, tilemap, layerIndex, tileset, x, y)
    {
        TilemapLayerBase.call(this, 'TilemapGPULayer', scene, tilemap, layerIndex, x, y);

        /**
         * The `Tileset` associated with this layer.
         *
         * Unlike a `TilemapLayer`, this object can only have one tileset,
         * because the renderer is optimized for a single texture.
         *
         * @name Phaser.Tilemaps.TilemapGPULayer#tileset
         * @type {Phaser.Tilemaps.Tileset}
         * @since 3.50.0
         */
        this.tileset = null;

        /**
         * A texture containing the tile data for this game object.
         * Each texel describes a single tile in the layer.
         *
         * Each texel is stored as a 32-bit value, encoded thus:
         *
         * - 1 bit: Horizontal flip flag.
         * - 1 bit: Vertical flip flag.
         * - 1 bit: Animation flag.
         * - 1 bit: Unused.
         * - 28 bits: Tile index.
         *
         * @name Phaser.Tilemaps.TilemapGPULayer#layerDataTexture
         * @type {Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper}
         * @since 4.0.0
         */
        this.layerDataTexture = null;

        this.setTileset(tileset);

        this.initRenderNodes(this._defaultRenderNodesMap);
    },

    /**
     * The default render nodes for this Game Object.
     *
     * @name Phaser.Tilemaps.TilemapGPULayer#_defaultRenderNodesMap
     * @type {Map<string, string>}
     * @private
     * @webglOnly
     * @readonly
     * @since 4.0.0
     */
    _defaultRenderNodesMap: {
        get: function ()
        {
            return DefaultTilemapGPULayerNodes;
        }
    },

    /**
     * Populates data structures to render this tilemap layer.
     *
     * @method Phaser.Tilemaps.TilemapGPULayer#setTileset
     * @private
     * @since 4.0.0
     *
     * @param {(string|Phaser.Tilemaps.Tileset)} tileset - The tileset used to render this layer. Can be a string or a Tileset object.
     */
    setTileset: function (tileset)
    {
        if (typeof tileset === 'string')
        {
            tileset = this.tilemap.getTileset(tileset);
        }

        this.tileset = tileset;

        // Convert layer into a data texture.
        this.generateLayerDataTexture();
    },

    /**
     * Generate the data textures for this game object.
     * This method is called internally by `setTileset`.
     *
     * @method Phaser.Tilemaps.TilemapGPULayer#generateLayerDataTexture
     * @since 4.0.0
     */
    generateLayerDataTexture: function ()
    {
        var layer = this.layer;
        var tileset = this.tileset;
        var firstgid = tileset.firstgid;
        var renderer = this.scene.renderer;

        // Get or initialize the animation data texture in the Tileset.
        var indexToAnimMap = tileset.getAnimationDataIndexMap(renderer);

        // Generate the layer map.
        var u32 = new Uint32Array(layer.width * layer.height);
        for (var y = 0; y < layer.height; y++)
        {
            for (var x = 0; x < layer.width; x++)
            {
                var tile = layer.data[y][x];

                var index = tile.index - firstgid;

                var flipX = tile.flipX;
                var flipY = tile.flipY;
                var animated = false;

                if (indexToAnimMap.has(index))
                {
                    // This tile is part of an animation.
                    index = indexToAnimMap.get(index);
                    animated = true;
                }

                // Set flip flags.
                if (flipX)
                {
                    index |= 0x80000000;
                }
                if (flipY)
                {
                    index |= 0x40000000;
                }
                if (animated)
                {
                    index |= 0x20000000;
                }
                if (tile.index === -1)
                {
                    // Set the fourth bit to 1 to indicate an empty tile.
                    index = 0x10000000;
                }

                u32[y * layer.width + x] = index;
            }
        }

        // Create or update the tile data texture.
        if (this.layerDataTexture)
        {
            this.layerDataTexture.destroy();
        }
        var u8 = new Uint8Array(u32.buffer);
        this.layerDataTexture = renderer.createUint8ArrayTexture(u8, layer.width, layer.height, false, true);
    }
});

module.exports = TilemapGPULayer;
