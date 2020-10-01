/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

var WebGLUniforms = new Class({

    initialize:

    function WebGLUniforms (gl, program)
    {
        this.seq = [];
        this.map = {};

        var n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        for (var i = 0; i < n; i++)
        {
            var uniform = gl.getActiveUniform(program, i);
            var location = gl.getUniformLocation(program, uniform.name);

            this.parseUniform(gl, uniform, location, this);
        }
    },

    parseUniform: function (gl, uniform, location, container)
    {
        var path = uniform.name;
        var pathLength = path.length;

        // reset RegExp object, because of the early exit of a previous run
        RePathPart.lastIndex = 0;

        /*
        while (true)
        {
            var match = RePathPart.exec(path);
            var matchEnd = RePathPart.lastIndex;
            var id = match[1];
            var idIsIndex = match[2] === ']';
            var subscript = match[3];

            if (idIsIndex)
            {
                id = id | 0;
            }

            if (!subscript || subscript === '[' && matchEnd + 2 === pathLength)
            {
                this.addUniform((!subscript) ? new SingleUniform(gl, id, uniform, location) : new PureArrayUniform(gl, id, uniform, location));

                break;
            }
            else
            {
                // step into inner node / create it in case it doesn't exist

                var next = this.map[id];

                // var map = container.map,
                // next = map[id];

                if (!next)
                {
                    next = new StructuredUniform(id);

                    this.addUniform(next);
                }

                container = next;
            }
        }
        */
    }

});

module.exports = WebGLUniforms;
