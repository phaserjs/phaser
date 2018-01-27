var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');

var ObjectLayer = new Class({

    initialize:


    /**
     * A class for representing a Tiled object layer in a map. This mirrors the structure of a Tiled
     * object layer, except:
     *  - "x" & "y" properties are ignored since these cannot be changed in Tiled.
     *  - "offsetx" & "offsety" are applied to the individual object coordinates directly, so they
     *    are ignored as well.
     *  - "draworder" is ignored.
     *
     * @class ObjectLayer
     * @constructor
     *
     * @param {object} [config] - [description]
     */
    function ObjectLayer (config)
    {
        if (config === undefined) { config = {}; }

        this.name = GetFastValue(config, 'name', 'object layer');
        this.opacity = GetFastValue(config, 'opacity', 1);
        this.properties = GetFastValue(config, 'properties', {});
        this.propertyTypes = GetFastValue(config, 'propertytypes', {});
        this.type = GetFastValue(config, 'type', 'objectgroup');
        this.visible = GetFastValue(config, 'visible', true);
        this.objects = GetFastValue(config, 'objects', []);
    }

});

module.exports = ObjectLayer;
