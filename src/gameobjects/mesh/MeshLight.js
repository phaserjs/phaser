/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Vector3 = require('../../math/Vector3');

/**
 * @classdesc
 * The Mesh Light.
 *
 * @class MeshLight
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.50.0
 */
var MeshLight = new Class({

    initialize:

    function MeshLight (x, y, z)
    {
        this.position = new Vector3(x, y, z);
        this.ambient = new Vector3(1, 1, 1);
        this.diffuse = new Vector3(1, 1, 1);
        this.specular = new Vector3(1, 1, 1);
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

module.exports = MeshLight;
