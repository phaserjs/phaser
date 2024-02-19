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
 * A class for representing data about a map. Maps are parsed from CSV, Tiled, etc. into this
 * format. A Tilemap object get a copy of this data and then unpacks the needed properties into
 * itself.
 *
 * @class MapData
 * @memberof Phaser.Tilemaps
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Types.Tilemaps.MapDataConfig} [config] - The Map configuration object.
 */
var MapData = new Class({

    initialize:

    function MapData (config)
    {
        if (config === undefined) { config = {}; }

        /**
         * The key in the Phaser cache that corresponds to the loaded tilemap data.
         *
         * @name Phaser.Tilemaps.MapData#name
         * @type {string}
         * @since 3.0.0
         */
        this.name = GetFastValue(config, 'name', 'map');

        /**
         * The width of the entire tilemap.
         *
         * @name Phaser.Tilemaps.MapData#width
         * @type {number}
         * @since 3.0.0
         */
        this.width = GetFastValue(config, 'width', 0);

        /**
         * The height of the entire tilemap.
         *
         * @name Phaser.Tilemaps.MapData#height
         * @type {number}
         * @since 3.0.0
         */
        this.height = GetFastValue(config, 'height', 0);

        /**
         * If the map is infinite or not.
         *
         * @name Phaser.Tilemaps.MapData#infinite
         * @type {boolean}
         * @since 3.17.0
         */
        this.infinite = GetFastValue(config, 'infinite', false);

        /**
         * The width of the tiles.
         *
         * @name Phaser.Tilemaps.MapData#tileWidth
         * @type {number}
         * @since 3.0.0
         */
        this.tileWidth = GetFastValue(config, 'tileWidth', 0);

        /**
         * The height of the tiles.
         *
         * @name Phaser.Tilemaps.MapData#tileHeight
         * @type {number}
         * @since 3.0.0
         */
        this.tileHeight = GetFastValue(config, 'tileHeight', 0);

        /**
         * The width in pixels of the entire tilemap.
         *
         * @name Phaser.Tilemaps.MapData#widthInPixels
         * @type {number}
         * @since 3.0.0
         */
        this.widthInPixels = GetFastValue(config, 'widthInPixels', this.width * this.tileWidth);

        /**
         * The height in pixels of the entire tilemap.
         *
         * @name Phaser.Tilemaps.MapData#heightInPixels
         * @type {number}
         * @since 3.0.0
         */
        this.heightInPixels = GetFastValue(config, 'heightInPixels', this.height * this.tileHeight);

        /**
         * The format of the map data.
         *
         * @name Phaser.Tilemaps.MapData#format
         * @type {number}
         * @since 3.0.0
         */
        this.format = GetFastValue(config, 'format', null);

        /**
         * The orientation of the map data (i.e. orthogonal, isometric, hexagonal), default 'orthogonal'.
         *
         * @name Phaser.Tilemaps.MapData#orientation
         * @type {Phaser.Tilemaps.OrientationType}
         * @since 3.50.0
         */
        this.orientation = GetFastValue(config, 'orientation', CONST.ORTHOGONAL);

        /**
         * Determines the draw order of tilemap. Default is right-down
         *
         * 0, or 'right-down'
         * 1, or 'left-down'
         * 2, or 'right-up'
         * 3, or 'left-up'
         *
         * @name Phaser.Tilemaps.MapData#renderOrder
         * @type {string}
         * @since 3.12.0
         */
        this.renderOrder = GetFastValue(config, 'renderOrder', 'right-down');

        /**
         * The version of the map data (as specified in Tiled).
         *
         * @name Phaser.Tilemaps.MapData#version
         * @type {string}
         * @since 3.0.0
         */
        this.version = GetFastValue(config, 'version', '1');

        /**
         * Map specific properties (can be specified in Tiled)
         *
         * @name Phaser.Tilemaps.MapData#properties
         * @type {object}
         * @since 3.0.0
         */
        this.properties = GetFastValue(config, 'properties', {});

        /**
         * An array with all the layers configured to the MapData.
         *
         * @name Phaser.Tilemaps.MapData#layers
         * @type {(Phaser.Tilemaps.LayerData[]|Phaser.Tilemaps.ObjectLayer)}
         * @since 3.0.0
         */
        this.layers = GetFastValue(config, 'layers', []);

        /**
         * An array of Tiled Image Layers.
         *
         * @name Phaser.Tilemaps.MapData#images
         * @type {array}
         * @since 3.0.0
         */
        this.images = GetFastValue(config, 'images', []);

        /**
         * An object of Tiled Object Layers.
         *
         * @name Phaser.Tilemaps.MapData#objects
         * @type {Phaser.Types.Tilemaps.ObjectLayerConfig[]}
         * @since 3.0.0
         */
        this.objects = GetFastValue(config, 'objects', []);

        //  Because Tiled can sometimes create an empty object if you don't populate it, not an empty array
        if (!Array.isArray(this.objects))
        {
            this.objects = [];
        }

        /**
         * An object of collision data. Must be created as physics object or will return undefined.
         *
         * @name Phaser.Tilemaps.MapData#collision
         * @type {object}
         * @since 3.0.0
         */
        this.collision = GetFastValue(config, 'collision', {});

        /**
         * An array of Tilesets.
         *
         * @name Phaser.Tilemaps.MapData#tilesets
         * @type {Phaser.Tilemaps.Tileset[]}
         * @since 3.0.0
         */
        this.tilesets = GetFastValue(config, 'tilesets', []);

        /**
         * The collection of images the map uses(specified in Tiled)
         *
         * @name Phaser.Tilemaps.MapData#imageCollections
         * @type {array}
         * @since 3.0.0
         */
        this.imageCollections = GetFastValue(config, 'imageCollections', []);

        /**
         * An array of tile instances.
         *
         * @name Phaser.Tilemaps.MapData#tiles
         * @type {array}
         * @since 3.0.0
         */
        this.tiles = GetFastValue(config, 'tiles', []);

        /**
         * The length of the horizontal sides of the hexagon.
         *
         * Only used for hexagonal orientation Tilemaps.
         *
         * @name Phaser.Tilemaps.MapData#hexSideLength
         * @type {number}
         * @since 3.50.0
         */
        this.hexSideLength = GetFastValue(config, 'hexSideLength', 0);

        /**
         * The Stagger Axis as defined in Tiled.
         *
         * Only used for hexagonal orientation Tilemaps.
         *
         * @name Phaser.Tilemaps.MapData#staggerAxis
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
         * @name Phaser.Tilemaps.MapData#staggerIndex
         * @type {string}
         * @since 3.60.0
         */
        this.staggerIndex = GetFastValue(config, 'staggerIndex', 'odd');
    }

});

module.exports = MapData;
