/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('./const');
var Extend = require('../../../utils/object/Extend');

/**
 * @namespace Phaser.Renderer.WebGL.Pipelines
 */

var Pipelines = {

    BitmapMaskPipeline: require('./BitmapMaskPipeline'),
    Events: require('./events'),
    LightPipeline: require('./LightPipeline'),
    MobilePipeline: require('./MobilePipeline'),
    MultiPipeline: require('./MultiPipeline'),
    PointLightPipeline: require('./PointLightPipeline'),
    PostFXPipeline: require('./PostFXPipeline'),
    RopePipeline: require('./RopePipeline'),
    SinglePipeline: require('./SinglePipeline'),
    SpriteFXPipeline: require('./SpriteFXPipeline'),
    UtilityPipeline: require('./UtilityPipeline')

};

//   Merge in the consts

Pipelines = Extend(false, Pipelines, CONST);

//  Export it

module.exports = Pipelines;
