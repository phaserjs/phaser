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
    LightPipeline: require('./LightPipeline'),
    SinglePipeline: require('./SinglePipeline'),
    MultiPipeline: require('./MultiPipeline'),
    RopePipeline: require('./RopePipeline'),
    ModelViewProjection: require('./components/ModelViewProjection')

};
