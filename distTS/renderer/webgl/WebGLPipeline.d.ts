/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var Utils: any;
/**
 * @classdesc
 * WebGLPipeline is a class that describes the way elements will be rendererd
 * in WebGL, specially focused on batching vertices (batching is not provided).
 * Pipelines are mostly used for describing 2D rendering passes but it's
 * flexible enough to be used for any type of rendering including 3D.
 * Internally WebGLPipeline will handle things like compiling shaders,
 * creating vertex buffers, assigning primitive topology and binding
 * vertex attributes.
 *
 * The config properties are:
 * - game: Current game instance.
 * - renderer: Current WebGL renderer.
 * - gl: Current WebGL context.
 * - topology: This indicates how the primitives are rendered. The default value is GL_TRIANGLES.
 *              Here is the full list of rendering primitives (https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants).
 * - vertShader: Source for vertex shader as a string.
 * - fragShader: Source for fragment shader as a string.
 * - vertexCapacity: The amount of vertices that shall be allocated
 * - vertexSize: The size of a single vertex in bytes.
 * - vertices: An optional buffer of vertices
 * - attributes: An array describing the vertex attributes
 *
 * The vertex attributes properties are:
 * - name : String - Name of the attribute in the vertex shader
 * - size : integer - How many components describe the attribute. For ex: vec3 = size of 3, float = size of 1
 * - type : GLenum - WebGL type (gl.BYTE, gl.SHORT, gl.UNSIGNED_BYTE, gl.UNSIGNED_SHORT, gl.FLOAT)
 * - normalized : boolean - Is the attribute normalized
 * - offset : integer - The offset in bytes to the current attribute in the vertex. Equivalent to offsetof(vertex, attrib) in C
 * Here you can find more information of how to describe an attribute:
 * - https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
 *
 * @class WebGLPipeline
 * @memberOf Phaser.Renderer.WebGL
 * @constructor
 * @since 3.0.0
 *
 * @param {object} config - [description]
 */
declare var WebGLPipeline: any;
