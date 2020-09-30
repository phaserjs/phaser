/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var GameObject3D = require('../GameObject3D');
var RGB = require('../math/RGB');

var Light = new Class({

    Extends: GameObject3D,

    initialize:

    function Light (color, intensity)
    {
        if (color === undefined) { color = 0xffffff; }
        if (intensity === undefined) { intensity = 1; }

        GameObject3D.call(this);

        this.type = 'light';

        this.lightType = '';

        this.color = new RGB(color);

        this.intensity = intensity;
    }

});

module.exports = Light;
