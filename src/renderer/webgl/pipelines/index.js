/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Renderer.WebGL.Pipelines
 */

module.exports = {

    BitmapMaskPipeline: require('./BitmapMaskPipeline'),
    ForwardDiffuseLightPipeline: require('./ForwardDiffuseLightPipeline'),
    TextureTintPipeline: require('./TextureTintPipeline'),
    ModelViewProjection: require('./components/ModelViewProjection')

};
