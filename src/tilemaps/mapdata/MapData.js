/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var GetFastValue = require('../../utils/object/GetFastValue');

/**
 * @classdesc
 * A class for representing data about a map. Maps are parsed from CSV, Tiled, etc. into this
 * format. A Tilemap object get a copy of this data and then unpacks the needed properties into
 * itself.
 *
 * @class MapData
 * @memberOf Phaser.Tilemaps
 * @constructor
 * @since 3.0.0
 *
 * @param {object} [config] - [description]
 */
var MapData = new Class({

    initialize:

    function MapData (config)
    {
        if (config === undefined) { config = {}; }

        /**
         * [description]
         * 
         * @name Phaser.Tilemaps.MapData#name
         * @type {string}
         * @since 3.0.0
         */
        this.name = GetFastValue(config, 'name', 'map');

        /**
         * [description]
         * 
         * @name Phaser.Tilemaps.MapData#width
         * @type {number}
         * @since 3.0.0
         */
        this.width = GetFastValue(config, 'width', 0);

        /**
         * [description]
         * 
         * @name Phaser.Tilemaps.MapData#height
         * @type {number}
         * @since 3.0.0
         */
        this.height = GetFastValue(config, 'height', 0);

        /**
         * [description]
         * 
         * @name Phaser.Tilemaps.MapData#tileWidth
         * @type {number}
         * @since 3.0.0
         */
        this.tileWidth = GetFastValue(config, 'tileWidth', 0);

        /**
         * [description]
         * 
         * @name Phaser.Tilemaps.MapData#tileHeight
         * @type {number}
         * @since 3.0.0
         */
        this.tileHeight = GetFastValue(config, 'tileHeight', 0);

        /**
         * [description]
         * 
         * @name Phaser.Tilemaps.MapData#widthInPixels
         * @type {number}
         * @since 3.0.0
         */
        this.widthInPixels = GetFastValue(config, 'widthInPixels', this.width * this.tileWidth);

        /**
         * [description]
         * 
         * @name Phaser.Tilemaps.MapData#heightInPixels
         * @type {number}
         * @since 3.0.0
         */
        this.heightInPixels = GetFastValue(config, 'heightInPixels', this.height * this.tileHeight);

        /**
         * [description]
         * 
         * @name Phaser.Tilemaps.MapData#format
         * @type {integer}
         * @since 3.0.0
         */
        this.format = GetFastValue(config, 'format', null);

        /**
         * [description]
         * 
         * @name Phaser.Tilemaps.MapData#orientation
         * @type {string}
         * @since 3.0.0
         */
        this.orientation = GetFastValue(config, 'orientation', 'orthogonal');

        /**
         * [description]
         * 
         * @name Phaser.Tilemaps.MapData#version
         * @type {string}
         * @since 3.0.0
         */
        this.version = GetFastValue(config, 'version', '1');

        /**
         * [description]
         * 
         * @name Phaser.Tilemaps.MapData#properties
         * @type {object}
         * @since 3.0.0
         */
        this.properties = GetFastValue(config, 'properties', {});

        /**
         * [description]
         * 
         * @name Phaser.Tilemaps.MapData#layers
         * @type {array}
         * @since 3.0.0
         */
        this.layers = GetFastValue(config, 'layers', []);

        /**
         * [description]
         * 
         * @name Phaser.Tilemaps.MapData#images
         * @type {array}
         * @since 3.0.0
         */
        this.images = GetFastValue(config, 'images', []);

        /**
         * [description]
         * 
         * @name Phaser.Tilemaps.MapData#objects
         * @type {object}
         * @since 3.0.0
         */
        this.objects = GetFastValue(config, 'objects', {});

        /**
         * [description]
         * 
         * @name Phaser.Tilemaps.MapData#collision
         * @type {object}
         * @since 3.0.0
         */
        this.collision = GetFastValue(config, 'collision', {});

        /**
         * [description]
         * 
         * @name Phaser.Tilemaps.MapData#tilesets
         * @type {array}
         * @since 3.0.0
         */
        this.tilesets = GetFastValue(config, 'tilesets', []);

        /**
         * [description]
         * 
         * @name Phaser.Tilemaps.MapData#imageCollections
         * @type {array}
         * @since 3.0.0
         */
        this.imageCollections = GetFastValue(config, 'imageCollections', []);

        /**
         * [description]
         * 
         * @name Phaser.Tilemaps.MapData#tiles
         * @type {array}
         * @since 3.0.0
         */
        this.tiles = GetFastValue(config, 'tiles', []);
    }

});

module.exports = MapData;
