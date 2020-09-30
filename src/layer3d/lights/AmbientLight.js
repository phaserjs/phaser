/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Light = require('./Light');

var AmbientLight = new Class({

    Extends: Light,

    initialize:

    function AmbientLight (color, intensity)
    {
        Light.call(this, color, intensity);

        this.lightType = 'ambient';
    }

});

module.exports = AmbientLight;
