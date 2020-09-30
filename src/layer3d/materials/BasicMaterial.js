/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const');
var Class = require('../../utils/Class');
var Material = require('./Material');

var BasicMaterial = new Class({

    Extends: Material,

    initialize:

    function BasicMaterial ()
    {
        Material.call(this);

        this.type = CONST.MATERIAL_TYPE.BASIC;
    }

});

module.exports = BasicMaterial;
