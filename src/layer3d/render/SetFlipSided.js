/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var currentFrontFace = null;

var SetFlipSided = function (state, flipSided)
{
    var gl = state.gl;

    if (currentFrontFace !== flipSided)
    {
        if (flipSided)
        {
            gl.frontFace(gl.CW);
        }
        else
        {
            gl.frontFace(gl.CCW);
        }

        currentFrontFace = flipSided;
    }
};

module.exports = SetFlipSided;
