/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const');
var Class = require('../../utils/Class');

var WebGLAttribute = new Class({

    initialize:

    function WebGLAttribute (webglProgram, attributeData)
    {
        this.renderer = webglProgram.renderer;

        this.name = attributeData.name;
        this.type = attributeData.type;
        this.size = attributeData.size;

        var gl = this.renderer.gl;

        this.location = gl.getAttribLocation(webglProgram.program, this.name);

        this.count = 0;
        this.format = gl.FLOAT;

        this.initCount();
        this.initFormat();
    },

    initCount: function ()
    {
        var type = this.type;

        switch (type)
        {
            case CONST.WEBGL_ATTRIBUTE_TYPE.FLOAT:
            case CONST.WEBGL_ATTRIBUTE_TYPE.BYTE:
            case CONST.WEBGL_ATTRIBUTE_TYPE.UNSIGNED_BYTE:
            case CONST.WEBGL_ATTRIBUTE_TYPE.UNSIGNED_SHORT:
                this.count = 1;
                break;

            case CONST.WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC2:
                this.count = 2;
                break;

            case CONST.WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC3:
                this.count = 3;
                break;

            case CONST.WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC4:
                this.count = 4;
                break;
        }
    },

    initFormat: function ()
    {
        var type = this.type;
        var gl = this.renderer.gl;

        switch (type)
        {
            case CONST.WEBGL_ATTRIBUTE_TYPE.FLOAT:
            case CONST.WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC2:
            case CONST.WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC3:
            case CONST.WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC4:
                this.format = gl.FLOAT;
                break;

            case CONST.WEBGL_ATTRIBUTE_TYPE.UNSIGNED_BYTE:
                this.format = gl.UNSIGNED_BYTE;
                break;

            case CONST.WEBGL_ATTRIBUTE_TYPE.UNSIGNED_SHORT:
                this.format = gl.UNSIGNED_SHORT;
                break;

            case CONST.WEBGL_ATTRIBUTE_TYPE.BYTE:
                this.format = gl.BYTE;
                break;
        }
    }

});

module.exports = WebGLAttribute;
