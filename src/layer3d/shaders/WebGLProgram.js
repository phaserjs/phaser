/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var WebGLAttribute = require('./WebGLAttribute');

var programCount = 0;

var WebGLProgram = new Class({

    initialize:

    function WebGLProgram (renderer, vertexShader, fragmentShader)
    {
        this.id = programCount++;

        this.renderer = renderer;

        this.usedTimes = 1;

        this.vertexShaderSrc = vertexShader;
        this.fragmentShaderSrc = fragmentShader;

        this.program = this.createProgram();

        this.attributes = this.getAttributes();

        // uniforms
    },

    createProgram: function ()
    {
        var gl = this.renderer.gl;

        var vertexShader = this.createShader(this.vertexShaderSrc, gl.VERTEX_SHADER);
        var fragmentShader = this.createShader(this.fragmentShaderSrc, gl.FRAGMENT_SHADER);

        var program = gl.createProgram();

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);

        var linked = gl.getProgramParameter(program, gl.LINK_STATUS);

        if (!linked)
        {
            console.warn('linkProgram failed: ', gl.getProgramInfoLog(program));
        }

        return program;
    },

    createShader: function (source, type)
    {
        var gl = this.renderer.gl;

        var shader = gl.createShader(type);

        gl.shaderSource(shader, source);

        gl.compileShader(shader);

        var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

        if (!compiled)
        {
            console.warn('compileShader failed: ', gl.getShaderInfoLog(shader), this.addLineNumbers(source));
        }

        return shader;
    },

    addLineNumbers: function (string)
    {
        var lines = string.split('\n');

        for (var i = 0; i < lines.length; i++)
        {
            lines[i] = (i + 1) + ': ' + lines[i];
        }

        return lines.join('\n');
    },

    getAttributes: function ()
    {
        var gl = this.renderer.gl;
        var program = this.program;

        var attributes = {};

        var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

        for (var i = 0; i < totalAttributes; i++)
        {
            var attribData = gl.getActiveAttrib(program, i);

            var name = attribData.name;

            var attribute = new WebGLAttribute(gl, program, attribData);

            attributes[name] = attribute;
        }

        return attributes;
    }

});

module.exports = WebGLProgram;
