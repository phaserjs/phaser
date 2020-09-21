/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var RGB = require('../../display/RGB');
var Vector3 = require('../../math/Vector3');

/**
 * @classdesc
 * A Layer3D Ambient Light.
 *
 * @class Layer3DLight
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.50.0
 */
var Layer3DLight = new Class({

    initialize:

    function Layer3DLight (x, y, z)
    {
        this.position = new Vector3(x, y, z);
        this.ambient = new RGB(1, 1, 1);
        this.diffuse = new RGB(1, 1, 1);
        this.specular = new RGB(1, 1, 1);

        //  cache structure = position
        this.dirtyCache = [ 0, 0, 0 ];
    },

    isDirty: function ()
    {
        var position = this.position;
        var dirtyCache = this.dirtyCache;

        var x = position.x;
        var y = position.y;
        var z = position.z;

        var xCached = dirtyCache[0];
        var yCached = dirtyCache[1];
        var zCached = dirtyCache[2];

        dirtyCache[0] = x;
        dirtyCache[1] = y;
        dirtyCache[2] = z;

        return (xCached !== x || yCached !== y || zCached !== z);
    },

    setPosition: function (x, y, z)
    {
        this.position.set(x, y, z);

        return this;
    },

    setAmbient: function (r, g, b)
    {
        this.ambient.set(r, g, b);

        return this;
    },

    setDiffuse: function (r, g, b)
    {
        this.diffuse.set(r, g, b);

        return this;
    },

    setSpecular: function (r, g, b)
    {
        this.specular.set(r, g, b);

        return this;
    },

    x: {

        get: function ()
        {
            return this.position.x;
        },

        set: function (value)
        {
            this.position.x = value;
        }

    },

    y: {

        get: function ()
        {
            return this.position.y;
        },

        set: function (value)
        {
            this.position.y = value;
        }

    },

    z: {

        get: function ()
        {
            return this.position.z;
        },

        set: function (value)
        {
            this.position.z = value;
        }

    }

});

module.exports = Layer3DLight;
