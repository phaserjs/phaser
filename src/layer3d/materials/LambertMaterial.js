/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const');
var Class = require('../../utils/Class');
var Material = require('./Material');

var LambertMaterial = new Class({

    Extends: Material,

    initialize:

    function LambertMaterial ()
    {
        Material.call(this);

        this.type = CONST.MATERIAL_TYPE.LAMBERT;

        this.acceptLight = true;
    }

});

module.exports = LambertMaterial;
