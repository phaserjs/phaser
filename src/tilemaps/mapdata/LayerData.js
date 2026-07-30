/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const/ORIENTATION_CONST');
var GetFastValue = require('../../utils/object/GetFastValue');

/**
 * @classdesc
 * Stores all data associated with a single layer in a tilemap. When a map is parsed from
 * CSV, Tiled JSON, or other formats, each tile layer is converted into a LayerData instance
 * that holds the tile grid, layer dimensions, orientation, visibility, physics bodies,
 * tile callbacks, and any custom properties defined in the editor.
 *
 * Both `Tilemap` and `TilemapLayer` hold a reference to LayerData and use it to look up
 * tile positions, perform collision checks, and drive rendering.
 *
 * @class LayerData
 * @memberof Phaser.Tilemaps
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Types.Tilemaps.LayerDataConfig} [config] - The Layer Data configuration object.
 */
var LayerData = new Class({

    initialize:

    function LayerData (config)
    {
        if (config === undefined) { config = {}; }

        /**
         * The name of the layer, if specified in Tiled.
         *
         * @name Phaser.Tilemaps.LayerData#name
         * @type {string}
         * @since 3.0.0
         */
        this.name = GetFastValue(config, 'name', 'layer');

        /**
         * The id of the layer, as specified in the map data.
         *
         * Note: This is not the index of the layer in the map data, but its actual ID in Tiled.
         *
         * @name Phaser.Tilemaps.LayerData#id
         * @type {number}
         * @since 3.70.0
         */
        this.id = GetFastValue(config, 'id', 0);

        /**
         * The x offset of where to draw from the top left.
         *
         * @name Phaser.Tilemaps.LayerData#x
         * @type {number}
         * @since 3.0.0
         */
        this.x = GetFastValue(config, 'x', 0);

        /**
         * The y offset of where to draw from the top left.
         *
         * @name Phaser.Tilemaps.LayerData#y
         * @type {number}
         * @since 3.0.0
         */
        this.y = GetFastValue(config, 'y', 0);

        /**
         * The width of the layer in tiles.
         *
         * @name Phaser.Tilemaps.LayerData#width
         * @type {number}
         * @since 3.0.0
         */
        this.width = GetFastValue(config, 'width', 0);

        /**
         * The height of the layer in tiles.
         *
         * @name Phaser.Tilemaps.LayerData#height
         * @type {number}
         * @since 3.0.0
         */
        this.height = GetFastValue(config, 'height', 0);

        /**
         * The pixel width of the tiles.
         *
         * @name Phaser.Tilemaps.LayerData#tileWidth
         * @type {number}
         * @since 3.0.0
         */
        this.tileWidth = GetFastValue(config, 'tileWidth', 0);

        /**
         * The pixel height of the tiles.
         *
         * @name Phaser.Tilemaps.LayerData#tileHeight
         * @type {number}
         * @since 3.0.0
         */
        this.tileHeight = GetFastValue(config, 'tileHeight', 0);

        /**
         * The base tile width, in pixels. This is the tile width defined at the map level and
         * is used to calculate pixel coordinates and layer dimensions. It defaults to `tileWidth`
         * but may differ for layers that use a different tile size than the map default.
         *
         * @name Phaser.Tilemaps.LayerData#baseTileWidth
         * @type {number}
         * @since 3.0.0
         */
        this.baseTileWidth = GetFastValue(config, 'baseTileWidth', this.tileWidth);

        /**
         * The base tile height, in pixels. This is the tile height defined at the map level and
         * is used to calculate pixel coordinates and layer dimensions. It defaults to `tileHeight`
         * but may differ for layers that use a different tile size than the map default.
         *
         * @name Phaser.Tilemaps.LayerData#baseTileHeight
         * @type {number}
         * @since 3.0.0
         */
        this.baseTileHeight = GetFastValue(config, 'baseTileHeight', this.tileHeight);

        /**
         * The layer's orientation, necessary to be able to determine a tile's pixelX and pixelY as well as the layer's width and height.
         *
         * @name Phaser.Tilemaps.LayerData#orientation
         * @type {Phaser.Tilemaps.OrientationType}
         * @since 3.50.0
         */
        this.orientation = GetFastValue(config, 'orientation', CONST.ORTHOGONAL);

        /**
         * The width in pixels of the entire layer.
         *
         * @name Phaser.Tilemaps.LayerData#widthInPixels
         * @type {number}
         * @since 3.0.0
         */
        this.widthInPixels = GetFastValue(config, 'widthInPixels', this.width * this.baseTileWidth);

        /**
         * The height in pixels of the entire layer.
         *
         * @name Phaser.Tilemaps.LayerData#heightInPixels
         * @type {number}
         * @since 3.0.0
         */
        this.heightInPixels = GetFastValue(config, 'heightInPixels', this.height * this.baseTileHeight);

        /**
         * The alpha value of the layer.
         *
         * @name Phaser.Tilemaps.LayerData#alpha
         * @type {number}
         * @since 3.0.0
         */
        this.alpha = GetFastValue(config, 'alpha', 1);

        /**
         * Is the layer visible or not?
         *
         * @name Phaser.Tilemaps.LayerData#visible
         * @type {boolean}
         * @since 3.0.0
         */
        this.visible = GetFastValue(config, 'visible', true);

        /**
         * Layer specific properties (can be specified in Tiled).
         *
         * @name Phaser.Tilemaps.LayerData#properties
         * @type {object[]}
         * @since 3.0.0
         */
        this.properties = GetFastValue(config, 'properties', []);

        /**
         * Tile ID index map.
         *
         * @name Phaser.Tilemaps.LayerData#indexes
         * @type {array}
         * @since 3.0.0
         */
        this.indexes = GetFastValue(config, 'indexes', []);

        /**
         * Tile Collision ID index map.
         *
         * @name Phaser.Tilemaps.LayerData#collideIndexes
         * @type {array}
         * @since 3.0.0
         */
        this.collideIndexes = GetFastValue(config, 'collideIndexes', []);

        /**
         * An array of tile location callbacks registered for this layer. Each entry maps a tile
         * index to a callback function that is invoked when a physics-enabled Game Object overlaps
         * or collides with that tile.
         *
         * @name Phaser.Tilemaps.LayerData#callbacks
         * @type {array}
         * @since 3.0.0
         */
        this.callbacks = GetFastValue(config, 'callbacks', []);

        /**
         * An array of physics bodies.
         *
         * @name Phaser.Tilemaps.LayerData#bodies
         * @type {array}
         * @since 3.0.0
         */
        this.bodies = GetFastValue(config, 'bodies', []);

        /**
         * A 2D array of Tile objects representing the tile grid for this layer. Indexed as `data[row][col]`,
         * where each entry is a Tile instance (or null for an empty cell).
         *
         * @name Phaser.Tilemaps.LayerData#data
         * @type {Phaser.Tilemaps.Tile[][]}
         * @since 3.0.0
         */
        this.data = GetFastValue(config, 'data', []);

        /**
         * A reference to the Tilemap layer that owns this data.
         *
         * @name Phaser.Tilemaps.LayerData#tilemapLayer
         * @type {Phaser.Tilemaps.TilemapLayer}
         * @since 3.0.0
         */
        this.tilemapLayer = GetFastValue(config, 'tilemapLayer', null);

        /**
         * The length of the horizontal sides of the hexagon.
         * Only used for hexagonal orientation Tilemaps.
         *
         * @name Phaser.Tilemaps.LayerData#hexSideLength
         * @type {number}
         * @since 3.50.0
         */
        this.hexSideLength = GetFastValue(config, 'hexSideLength', 0);

        /**
         * The Stagger Axis as defined in Tiled.
         *
         * Only used for hexagonal orientation Tilemaps.
         *
         * @name Phaser.Tilemaps.LayerData#staggerAxis
         * @type {string}
         * @since 3.60.0
         */
        this.staggerAxis = GetFastValue(config, 'staggerAxis', 'y');

        /**
         * The Stagger Index as defined in Tiled.
         *
         * Either 'odd' or 'even'.
         *
         * Only used for hexagonal orientation Tilemaps.
         *
         * @name Phaser.Tilemaps.LayerData#staggerIndex
         * @type {string}
         * @since 3.60.0
         */
        this.staggerIndex = GetFastValue(config, 'staggerIndex', 'odd');
    }

});

module.exports = LayerData;
