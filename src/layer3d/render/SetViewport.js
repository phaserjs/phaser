/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector4 = require('../../math/Vector4');

var currentViewport = new Vector4();

var SetViewport = function (state, x, y, width, height)
{
    var gl = state.gl;

    if (currentViewport.x !== x || currentViewport.y !== y || currentViewport.z !== width || currentViewport.w !== height)
    {
        gl.viewport(x, y, width, height);

        currentViewport.set(x, y, width, height);
    }
};

module.exports = SetViewport;
