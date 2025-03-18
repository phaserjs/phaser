/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Renderer.WebGL.ShaderAdditionMakers
 */

module.exports = {

    MakeAnimLength: require('./MakeAnimLength'),
    MakeApplyFlatLighting: require('./MakeApplyFlatLighting'),
    MakeApplyLighting: require('./MakeApplyLighting'),
    MakeApplyTint: require('./MakeApplyTint'),
    MakeBoundedSampler: require('./MakeBoundedSampler'),
    MakeDefineLights: require('./MakeDefineLights'),
    MakeDefineTexCount: require('./MakeDefineTexCount'),
    MakeFlatNormal: require('./MakeFlatNormal'),
    MakeGetNormalFromMap: require('./MakeGetNormalFromMap'),
    MakeGetTexCoordOut: require('./MakeGetTexCoordOut'),
    MakeGetTexRes: require('./MakeGetTexRes'),
    MakeGetTexture: require('./MakeGetTexture'),
    MakeOutFrame: require('./MakeOutFrame'),
    MakeOutInverseRotation: require('./MakeOutInverseRotation'),
    MakeRotationDatum: require('./MakeRotationDatum'),
    MakeSampleNormal: require('./MakeSampleNormal'),
    MakeSmoothPixelArt: require('./MakeSmoothPixelArt'),
    MakeTexCoordFrameClamp: require('./MakeTexCoordFrameClamp'),
    MakeTexCoordFrameWrap: require('./MakeTexCoordFrameWrap')

};
