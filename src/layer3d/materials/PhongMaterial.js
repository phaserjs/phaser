/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const');
var Material = require('./Material');
var RGB = require('../math/RGB');

var PhongMaterial = new Class({

    Extends: Material,

    initialize:

    function PhongMaterial ()
    {
        Material.call(this);

        this.type = CONST.MATERIAL_TYPE.PHONG;

        this.shininess = 30;
        this.specular = new RGB(0x111111);
        this.specularMap = null;
        this.acceptLight = true;
    }

});

module.exports = PhongMaterial;
