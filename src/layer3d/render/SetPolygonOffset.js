/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var isEnabled = false;
var currentPolygonOffsetFactor = null;
var currentPolygonOffsetUnits = null;

var SetPolygonOffset = function (state, polygonOffset, factor, units)
{
    var gl = state.gl;

    if (!polygonOffset)
    {
        if (isEnabled)
        {
            gl.disable(gl.POLYGON_OFFSET_FILL);

            isEnabled = false;
        }
    }
    else
    {
        if (!isEnabled)
        {
            gl.enable(gl.POLYGON_OFFSET_FILL);

            isEnabled = true;
        }

        if (currentPolygonOffsetFactor !== factor || currentPolygonOffsetUnits !== units)
        {
            gl.polygonOffset(factor, units);

            currentPolygonOffsetFactor = factor;
            currentPolygonOffsetUnits = units;
        }
    }
};

module.exports = SetPolygonOffset;
