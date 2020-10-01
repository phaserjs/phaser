/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var currentProgram = null;

var SetProgram = function (state, program)
{
    var gl = state.gl;

    if (currentProgram !== program)
    {
        gl.useProgram(program);

        currentProgram = program;
    }
};

module.exports = SetProgram;
