/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var CONST = require('./const');
var GameObject3D = require('./GameObject3D');

var Mesh = new Class({

    Extends: GameObject3D,

    initialize:

    function Mesh (geometry, material)
    {
        GameObject3D.call(this);

        /**
         * An instance of Geometry.
         * @type {Geometry}
         */
        this.geometry = geometry;

        /**
         * A material or an array of materials.
         * @type {Material}
         */
        this.material = material;

        /**
         * An array of weights typically from 0-1 that specify how much of the morph is applied.
         */
        this.morphTargetInfluences = null;

        this.type = CONST.OBJECT_TYPE.MESH;
    }

});

module.exports = Mesh;
