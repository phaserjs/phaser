/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var ModelViewProjection = require('./components/ModelViewProjection');
var TextureTintPipeline = require('./TextureTintPipeline');

/**
 * @classdesc
 * The Texture Tint Strip Pipeline is a variation of the Texture Tint Pipeline that uses a TRIANGLE_STRIP for
 * its topology, instead of TRIANGLES. This is primarily used by the Rope Game Object any anything that extends it.
 *
 * @class TextureTintStripPipeline
 * @extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.23.0
 *
 * @param {object} config - The configuration options for this Texture Tint Pipeline, as described above.
 */
var TextureTintStripPipeline = new Class({

    Extends: TextureTintPipeline,

    Mixins: [
        ModelViewProjection
    ],

    initialize:

    function TextureTintStripPipeline (config)
    {
        config.topology = config.renderer.gl.TRIANGLE_STRIP;

        TextureTintPipeline.call(this, config);
    }
});

module.exports = TextureTintStripPipeline;
