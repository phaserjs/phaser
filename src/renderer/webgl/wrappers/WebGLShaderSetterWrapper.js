/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');

/**
 * @classdesc
 * This class stores data necessary for setting WebGL shader uniforms
 * and attributes. Most of it is static. Its purpose as a class is to
 * load the WebGL functions provided by the rendering context.
 *
 * @class WebGLShaderSetterWrapper
 * @memberof Phaser.Renderer.WebGL.Wrappers
 * @constructor
 * @since 4.0.0
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer instance that owns this WebGLShaderSetterWrapper.
 */
var WebGLShaderSetterWrapper = new Class({
    initialize: function WebGLShaderSetterWrapper (renderer)
    {
        var gl = renderer.gl;

        /**
         * Map of GL Constants to their setter functions and relevant data sizes.
         *
         * @name Phaser.Renderer.WebGL.Wrappers.WebGLShaderSetterWrapper#constants
         * @type {Phaser.Types.Renderer.WebGL.Wrappers.ShaderSetterConstants}
         * @since 4.0.0
         * @readonly
         */
        this.constants = {
            0x1404: {
                constant: gl.INT,
                baseType: gl.INT,
                size: 1,
                bytes: 4,
                set: gl.uniform1i,
                setV: gl.uniform1iv,
                isMatrix: false
            },
            0x8B53: {
                constant: gl.INT_VEC2,
                baseType: gl.INT,
                size: 2,
                bytes: 4,
                set: gl.uniform2i,
                setV: gl.uniform2iv,
                isMatrix: false
            },
            0x8B54: {
                constant: gl.INT_VEC3,
                baseType: gl.INT,
                size: 3,
                bytes: 4,
                set: gl.uniform3i,
                setV: gl.uniform3iv,
                isMatrix: false
            },
            0x8B55: {
                constant: gl.INT_VEC4,
                baseType: gl.INT,
                size: 4,
                bytes: 4,
                set: gl.uniform4i,
                setV: gl.uniform4iv,
                isMatrix: false
            },
            0x1406: {
                constant: gl.FLOAT,
                baseType: gl.FLOAT,
                size: 1,
                bytes: 4,
                set: gl.uniform1f,
                setV: gl.uniform1fv,
                isMatrix: false
            },
            0x8B50: {
                constant: gl.FLOAT_VEC2,
                baseType: gl.FLOAT,
                size: 2,
                bytes: 4,
                set: gl.uniform2f,
                setV: gl.uniform2fv,
                isMatrix: false
            },
            0x8B51: {
                constant: gl.FLOAT_VEC3,
                baseType: gl.FLOAT,
                size: 3,
                bytes: 4,
                set: gl.uniform3f,
                setV: gl.uniform3fv,
                isMatrix: false
            },
            0x8B52: {
                constant: gl.FLOAT_VEC4,
                baseType: gl.FLOAT,
                size: 4,
                bytes: 4,
                set: gl.uniform4f,
                setV: gl.uniform4fv,
                isMatrix: false
            },
            0x1405: {
                constant: gl.UNSIGNED_INT,
                baseType: gl.UNSIGNED_INT,
                size: 1,
                bytes: 4,
                set: gl.uniform1i,
                setV: gl.uniform1iv,
                isMatrix: false
            },
            0x1400: {
                constant: gl.BYTE,
                baseType: gl.BYTE,
                size: 1,
                bytes: 1,
                set: gl.uniform1i,
                setV: gl.uniform1iv,
                isMatrix: false
            },
            0x1401: {
                constant: gl.UNSIGNED_BYTE,
                baseType: gl.UNSIGNED_BYTE,
                size: 1,
                bytes: 1,
                set: gl.uniform1i,
                setV: gl.uniform1iv,
                isMatrix: false
            },
            0x1402: {
                constant: gl.SHORT,
                baseType: gl.SHORT,
                size: 1,
                bytes: 2,
                set: gl.uniform1i,
                setV: gl.uniform1iv,
                isMatrix: false
            },
            0x1403: {
                constant: gl.UNSIGNED_SHORT,
                baseType: gl.UNSIGNED_SHORT,
                size: 1,
                bytes: 2,
                set: gl.uniform1i,
                setV: gl.uniform1iv,
                isMatrix: false
            },
            0x8B56: {
                constant: gl.BOOL,
                baseType: gl.BOOL,
                size: 1,
                bytes: 4,
                set: gl.uniform1i,
                setV: gl.uniform1iv,
                isMatrix: false
            },
            0x8B57: {
                constant: gl.BOOL_VEC2,
                baseType: gl.BOOL,
                size: 2,
                bytes: 4,
                set: gl.uniform2i,
                setV: gl.uniform2iv,
                isMatrix: false
            },
            0x8B58: {
                constant: gl.BOOL_VEC3,
                baseType: gl.BOOL,
                size: 3,
                bytes: 4,
                set: gl.uniform3i,
                setV: gl.uniform3iv,
                isMatrix: false
            },
            0x8B59: {
                constant: gl.BOOL_VEC4,
                baseType: gl.BOOL,
                size: 4,
                bytes: 4,
                set: gl.uniform4i,
                setV: gl.uniform4iv,
                isMatrix: false
            },
            0x8B5A: {
                constant: gl.FLOAT_MAT2,
                baseType: gl.FLOAT,
                size: 4,
                bytes: 4,
                set: gl.uniformMatrix2fv,
                setV: gl.uniformMatrix2fv,
                isMatrix: true
            },
            0x8B5B: {
                constant: gl.FLOAT_MAT3,
                baseType: gl.FLOAT,
                size: 9,
                bytes: 4,
                set: gl.uniformMatrix3fv,
                setV: gl.uniformMatrix3fv,
                isMatrix: true
            },
            0x8B5C: {
                constant: gl.FLOAT_MAT4,
                baseType: gl.FLOAT,
                size: 16,
                bytes: 4,
                set: gl.uniformMatrix4fv,
                setV: gl.uniformMatrix4fv,
                isMatrix: true
            },
            0x8B5E: {
                constant: gl.SAMPLER_2D,
                baseType: gl.INT,
                size: 1,
                bytes: 4,
                set: gl.uniform1i,
                setV: gl.uniform1iv,
                isMatrix: false
            },
            0x8B60: {
                constant: gl.SAMPLER_CUBE,
                baseType: gl.INT,
                size: 1,
                bytes: 4,
                set: gl.uniform1i,
                setV: gl.uniform1iv,
                isMatrix: false
            }
        };
    }
});

module.exports = WebGLShaderSetterWrapper;
