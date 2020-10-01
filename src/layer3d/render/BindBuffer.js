/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var currentBoundBuffers = [];

var BindBuffer = function (state, type, buffer)
{
    var gl = state.gl;

    var boundBuffer = currentBoundBuffers[type];

    if (boundBuffer !== buffer)
    {
        gl.bindBuffer(type, buffer);

        currentBoundBuffers[type] = buffer;
    }
};

module.exports = BindBuffer;
