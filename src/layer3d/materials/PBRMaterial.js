/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const');
var Material = require('./Material');

var PBRMaterial = new Class({

    Extends: Material,

    initialize:

    function PBRMaterial ()
    {
        Material.call(this);

        this.type = CONST.MATERIAL_TYPE.PBR;

        this.roughness = 0.5;
        this.metalness = 0.5;

        this.roughnessMap = null;
        this.metalnessMap = null;

        this.acceptLight = true;
    }

});

module.exports = PBRMaterial;
