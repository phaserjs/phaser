/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * A ShaderAdditionConfig defines an addition to be made to a shader program.
 * It consists of a name, a set of shader additions, and optional tags.
 *
 * The name is used as a key to identify the shader addition.
 * It is used as part of a unique identifier for a shader program.
 *
 * The shader additions are key-value pairs of strings,
 * where the key is the template to which the value is added.
 * This is found in the base shader program source code as
 * `#pragma phaserTemplate(key)`.
 *
 * @typedef {object} Phaser.Types.Renderer.WebGL.ShaderAdditionConfig
 * @since 4.0.0
 * @property {string} name - The name of the shader addition, used as a key.
 * @property {object} additions - The shader additions to apply. Each addition is a key-value pair of strings, where the key is the template to which the value is added. Keys are applied to both vertex and fragment shader code, if the template exists in both.
 * @property {string[]} [tags] - Optional tags used to describe the shader addition.
 * @property {boolean} [disable] - Whether to ignore this addition while compiling a shader.
 */
