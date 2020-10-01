/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('./const');
var Extend = require('../../../utils/object/Extend');

/**
 * @namespace Phaser.Renderer.WebGL.Pipelines
 */

var Pipelines = {

    BitmapMaskPipeline: require('./BitmapMaskPipeline'),
    LightPipeline: require('./LightPipeline'),
    ModelViewProjection: require('./components/ModelViewProjection'),
    MultiPipeline: require('./MultiPipeline'),
    RopePipeline: require('./RopePipeline'),
    SinglePipeline: require('./SinglePipeline')

};

//   Merge in the consts

Pipelines = Extend(false, Pipelines, CONST);

//  Export it

module.exports = Pipelines;
