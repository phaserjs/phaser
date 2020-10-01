/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var currentLineWidth = 0;

var SetLineWidth = function (state, width)
{
    var gl = state.gl;

    if (width !== currentLineWidth)
    {
        if (width >= state.lineWidthRange[0] && width <= state.lineWidthRange[1])
        {
            gl.lineWidth(width);

            currentLineWidth = width;
        }
    }
};

module.exports = SetLineWidth;
