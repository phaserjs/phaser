/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const/ORIENTATION_CONST');
var GetFastValue = require('../../utils/object/GetFastValue');

/**
 * @classdesc
 * A class for representing data about about a layer in a map. Maps are parsed from CSV, Tiled,
 * etc. into this format. Tilemap and TilemapLayer objects have a reference
 * to this data and use it to look up and perform operations on tiles.
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
         * The base tile width.
         *
         * @name Phaser.Tilemaps.LayerData#baseTileWidth
         * @type {number}
         * @since 3.0.0
         */
        this.baseTileWidth = GetFastValue(config, 'baseTileWidth', this.tileWidth);

        /**
         * The base tile height.
         *
         * @name Phaser.Tilemaps.LayerData#baseTileHeight
         * @type {number}
         * @since 3.0.0
         */
        this.baseTileHeight = GetFastValue(config, 'baseTileHeight', this.tileHeight);

        /**
         * The layers orientation, necessary to be able to determine a tiles pixelX and pixelY as well as the layers width and height.
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
         * Layer specific properties (can be specified in Tiled)
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
         * An array of callbacks.
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
         * An array of the tile data indexes.
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
