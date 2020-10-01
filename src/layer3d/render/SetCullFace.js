/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const');

var isEnabled = false;
var currentCullFace = CONST.CULL_FACE_TYPE.NONE;

var SetCullFace = function (state, cullFace)
{
    var gl = state.gl;

    if (cullFace === CONST.CULL_FACE_TYPE.NONE)
    {
        if (isEnabled)
        {
            gl.disable(gl.CULL_FACE);

            isEnabled = false;
        }
    }
    else
    {
        if (!isEnabled)
        {
            gl.enable(gl.CULL_FACE);
            isEnabled = true;
        }

        if (cullFace !== currentCullFace)
        {
            if (cullFace === CONST.CULL_FACE_TYPE.BACK)
            {
                gl.cullFace(gl.BACK);
            }
            else if (cullFace === CONST.CULL_FACE_TYPE.FRONT)
            {
                gl.cullFace(gl.FRONT);
            }
            else
            {
                gl.cullFace(gl.FRONT_AND_BACK);
            }
        }
    }

    currentCullFace = cullFace;
};

module.exports = SetCullFace;
