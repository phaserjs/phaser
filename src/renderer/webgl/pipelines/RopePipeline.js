/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');
var MultiPipeline = require('./MultiPipeline');

/**
 * @classdesc
 * The Rope Pipeline is a variation of the Multi Pipeline that uses a `TRIANGLE_STRIP` for
 * its topology, instead of TRIANGLES. This is primarily used by the Rope Game Object,
 * or anything that extends it.
 *
 * Prior to Phaser v3.50 this pipeline was called the `TextureTintStripPipeline`.
 *
 * The fragment shader it uses can be found in `shaders/src/Multi.frag`.
 * The vertex shader it uses can be found in `shaders/src/Multi.vert`.
 *
 * The default shader attributes for this pipeline are:
 *
 * `inPosition` (vec2, offset 0)
 * `inTexCoord` (vec2, offset 8)
 * `inTexId` (float, offset 16)
 * `inTintEffect` (float, offset 20)
 * `inTint` (vec4, offset 24, normalized)
 *
 * The default shader uniforms for this pipeline are:
 *
 * `uProjectionMatrix` (mat4)
 * `uMainSampler` (sampler2D array)
 *
 * The pipeline is structurally identical to the Multi Pipeline and should be treated as such.
 *
 * @class RopePipeline
 * @extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Types.Renderer.WebGL.WebGLPipelineConfig} config - The configuration options for this pipeline.
 */
var RopePipeline = new Class({

    Extends: MultiPipeline,

    initialize:

    function RopePipeline (config)
    {
        //  GLenum 5 = TRIANGLE_STRIP
        config.topology = 5;
        config.batchSize = GetFastValue(config, 'batchSize', 256);

        MultiPipeline.call(this, config);
    }
});

module.exports = RopePipeline;
