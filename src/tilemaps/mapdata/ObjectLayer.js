/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @memberof Phaser.Tilemaps
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Types.Tilemaps.ObjectLayerConfig} [config] - The data for the layer from the Tiled JSON object.
 */
var ObjectLayer = new Class({

    initialize:

    function ObjectLayer (config)
    {
        if (config === undefined) { config = {}; }

        /**
         * The name of the Object Layer.
         *
         * @name Phaser.Tilemaps.ObjectLayer#name
         * @type {string}
         * @since 3.0.0
         */
        this.name = GetFastValue(config, 'name', 'object layer');

        /**
         * The id of the object layer, as specified in the map data.
         *
         * @name Phaser.Tilemaps.ObjectLayer#id
         * @type {number}
         * @since 3.70.0
         */
        this.id = GetFastValue(config, 'id', 0);

        /**
         * The opacity of the layer, between 0 and 1.
         *
         * @name Phaser.Tilemaps.ObjectLayer#opacity
         * @type {number}
         * @since 3.0.0
         */
        this.opacity = GetFastValue(config, 'opacity', 1);

        /**
         * The custom properties defined on the Object Layer, keyed by their name.
         *
         * @name Phaser.Tilemaps.ObjectLayer#properties
         * @type {object}
         * @since 3.0.0
         */
        this.properties = GetFastValue(config, 'properties', {});

        /**
         * The type of each custom property defined on the Object Layer, keyed by its name.
         *
         * @name Phaser.Tilemaps.ObjectLayer#propertyTypes
         * @type {object}
         * @since 3.0.0
         */
        this.propertyTypes = GetFastValue(config, 'propertytypes', {});

        /**
         * The type of the layer, which should be `objectgroup`.
         *
         * @name Phaser.Tilemaps.ObjectLayer#type
         * @type {string}
         * @since 3.0.0
         */
        this.type = GetFastValue(config, 'type', 'objectgroup');

        /**
         * Whether the layer is shown (`true`) or hidden (`false`).
         *
         * @name Phaser.Tilemaps.ObjectLayer#visible
         * @type {boolean}
         * @since 3.0.0
         */
        this.visible = GetFastValue(config, 'visible', true);

        /**
         * An array of all objects on this Object Layer.
         *
         * Each Tiled object corresponds to a JavaScript object in this array. It has an `id` (unique),
         * `name` (as assigned in Tiled), `type` (as assigned in Tiled), `rotation` (in clockwise degrees),
         * `properties` (if any), `visible` state (`true` if visible, `false` otherwise),
         * `x` and `y` coordinates (in pixels, relative to the tilemap), and a `width` and `height` (in pixels).
         *
         * An object tile has a `gid` property (GID of the represented tile), a `flippedHorizontal` property,
         * a `flippedVertical` property, and `flippedAntiDiagonal` property.
         * The {@link http://docs.mapeditor.org/en/latest/reference/tmx-map-format/|Tiled documentation} contains
         * information on flipping and rotation.
         *
         * Polylines have a `polyline` property, which is an array of objects corresponding to points,
         * where each point has an `x` property and a `y` property. Polygons have an identically structured
         * array in their `polygon` property. Text objects have a `text` property with the text's properties.
         *
         * Rectangles and ellipses have a `rectangle` or `ellipse` property set to `true`.
         *
         * @name Phaser.Tilemaps.ObjectLayer#objects
         * @type {Phaser.Types.Tilemaps.TiledObject[]}
         * @since 3.0.0
         */
        this.objects = GetFastValue(config, 'objects', []);

        //  Because Tiled can sometimes create an empty object if you don't populate it, not an empty array
        if (!Array.isArray(this.objects))
        {
            this.objects = [];
        }
    }

});

module.exports = ObjectLayer;
