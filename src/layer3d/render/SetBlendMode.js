/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const');

var isEnabled = false;
var currentBlend = null;
var currentBlendEquation = null;
var currentBlendSrc = null;
var currentBlendDst = null;
var currentBlendEquationAlpha = null;
var currentBlendSrcAlpha = null;
var currentBlendDstAlpha = null;
var currentPremultipliedAlpha = null;

var SetBlendMode = function (state, blend, blendEquation, blendSrc, blendDst, blendEquationAlpha, blendSrcAlpha, blendDstAlpha, premultipliedAlpha)
{
    var gl = state.gl;

    if (blend === CONST.BLEND_TYPE.NONE)
    {
        gl.disable(gl.BLEND);
        isEnabled = false;
    }
    else if (!isEnabled)
    {
        gl.enable(gl.BLEND);
        isEnabled = true;
    }

    if (blend !== CONST.BLEND_TYPE.CUSTOM)
    {
        if (blend !== currentBlend || premultipliedAlpha !== currentPremultipliedAlpha)
        {
            if (blend === CONST.BLEND_TYPE.NORMAL)
            {
                if (premultipliedAlpha)
                {
                    gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                    gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                }
                else
                {
                    gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                }
            }

            if (blend === CONST.BLEND_TYPE.ADD)
            {
                if (premultipliedAlpha)
                {
                    gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                    gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
                }
                else
                {
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                }
            }
        }

        currentBlendEquation = null;
        currentBlendSrc = null;
        currentBlendDst = null;
        currentBlendEquationAlpha = null;
        currentBlendSrcAlpha = null;
        currentBlendDstAlpha = null;
    }
    else
    {
        blendEquationAlpha = blendEquationAlpha || blendEquation;
        blendSrcAlpha = blendSrcAlpha || blendSrc;
        blendDstAlpha = blendDstAlpha || blendDst;

        if (blendEquation !== currentBlendEquation || blendEquationAlpha !== currentBlendEquationAlpha)
        {
            gl.blendEquationSeparate(blendEquation, blendEquationAlpha);

            currentBlendEquation = blendEquation;
            currentBlendEquationAlpha = blendEquationAlpha;
        }

        if (blendSrc !== currentBlendSrc || blendDst !== currentBlendDst || blendSrcAlpha !== currentBlendSrcAlpha || blendDstAlpha !== currentBlendDstAlpha)
        {
            gl.blendFuncSeparate(blendSrc, blendDst, blendSrcAlpha, blendDstAlpha);

            currentBlendSrc = blendSrc;
            currentBlendDst = blendDst;
            currentBlendSrcAlpha = blendSrcAlpha;
            currentBlendDstAlpha = blendDstAlpha;
        }
    }

    currentBlend = blend;
    currentPremultipliedAlpha = premultipliedAlpha;
};

module.exports = SetBlendMode;
