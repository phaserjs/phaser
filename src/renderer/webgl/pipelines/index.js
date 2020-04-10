/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Renderer.WebGL.Pipelines
 */

module.exports = {

    BitmapMaskPipeline: require('./BitmapMaskPipeline'),
    ForwardDiffuseLightPipeline: require('./ForwardDiffuseLightPipeline'),
    TextureTintPipeline: require('./TextureTintPipeline'),
    TextureTintStripPipeline: require('./TextureTintStripPipeline'),
    ModelViewProjection: require('./components/ModelViewProjection')

};
