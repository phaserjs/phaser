/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('./const');
var Extend = require('../../../utils/object/Extend');

/**
 * @namespace Phaser.Renderer.WebGL.Pipelines
 */

var Pipelines = {

    FX: require('./fx'),

    BitmapMaskPipeline: require('./BitmapMaskPipeline'),
    Events: require('./events'),
    FXPipeline: require('./FXPipeline'),
    LightPipeline: require('./LightPipeline'),
    MobilePipeline: require('./MobilePipeline'),
    MultiPipeline: require('./MultiPipeline'),
    PointLightPipeline: require('./PointLightPipeline'),
    PostFXPipeline: require('./PostFXPipeline'),
    PreFXPipeline: require('./PreFXPipeline'),
    RopePipeline: require('./RopePipeline'),
    SinglePipeline: require('./SinglePipeline'),
    UtilityPipeline: require('./UtilityPipeline')

};

//   Merge in the consts

Pipelines = Extend(false, Pipelines, CONST);

//  Export it

module.exports = Pipelines;
