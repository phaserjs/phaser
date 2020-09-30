/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('../const');
var Material = require('./Material');

var LineMaterial = new Class({

    Extends: Material,

    initialize:

    function LineMaterial ()
    {
        Material.call(this);

        this.type = CONST.MATERIAL_TYPE.LINE;

        this.lineWidth = 1;
        this.drawMode = CONST.DRAW_MODE.LINES;
    }

});

module.exports = LineMaterial;
