/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var GetFastValue = require('../../utils/object/GetFastValue');

/**
 * @classdesc
 * A class for representing a Tiled object layer in a map. This mirrors the structure of a Tiled
 * object layer, except:
 *  - "x" & "y" properties are ignored since these cannot be changed in Tiled.
 *  - "offsetx" & "offsety" are applied to the individual object coordinates directly, so they
 *    are ignored as well.
 *  - "draworder" is ignored.
 *
 * @class ObjectLayer
 * @memberOf Phaser.Tilemaps
 * @constructor
 * @since 3.0.0
 *
 * @param {object} [config] - [description]
 */
var ObjectLayer = new Class({

    initialize:

    function ObjectLayer (config)
    {
        if (config === undefined) { config = {}; }

        /**
         * [description]
         *
         * @name Phaser.Tilemaps.ObjectLayer#name
         * @type {string}
         * @since 3.0.0
         */
        this.name = GetFastValue(config, 'name', 'object layer');

        /**
         * [description]
         *
         * @name Phaser.Tilemaps.ObjectLayer#opacity
         * @type {number}
         * @since 3.0.0
         */
        this.opacity = GetFastValue(config, 'opacity', 1);

        /**
         * [description]
         *
         * @name Phaser.Tilemaps.ObjectLayer#properties
         * @type {object}
         * @since 3.0.0
         */
        this.properties = GetFastValue(config, 'properties', {});

        /**
         * [description]
         *
         * @name Phaser.Tilemaps.ObjectLayer#propertyTypes
         * @type {object}
         * @since 3.0.0
         */
        this.propertyTypes = GetFastValue(config, 'propertytypes', {});

        /**
         * [description]
         *
         * @name Phaser.Tilemaps.ObjectLayer#type
         * @type {string}
         * @since 3.0.0
         */
        this.type = GetFastValue(config, 'type', 'objectgroup');

        /**
         * [description]
         *
         * @name Phaser.Tilemaps.ObjectLayer#visible
         * @type {boolean}
         * @since 3.0.0
         */
        this.visible = GetFastValue(config, 'visible', true);

        /**
         * [description]
         *
         * @name Phaser.Tilemaps.ObjectLayer#objects
         * @type {Phaser.GameObjects.GameObject[]}
         * @since 3.0.0
         */
        this.objects = GetFastValue(config, 'objects', []);
    }

});

module.exports = ObjectLayer;
