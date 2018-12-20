/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @typedef {object} RendererConfig
 *
 * @property {boolean} clearBeforeRender - If `false`, the canvas won't be cleared before a frame is rendered. As a side effect, this can give a negligible performance boost with no visual artifacts with full-screen backgrounds.
 * @property {boolean} antialias - Whether to antialias textures when transforming them. This should be turned off if you're using pixel art as it will make it look blurry.
 * @property {Phaser.Display.Color} backgroundColor - The background color of the canvas. This is visible in areas which aren't covered by any Game Objects.
 * @property {number} resolution - The resolution of the game canvas. This is the scale of a pixel compared to the size it'll actually be visible as. This can allow high-resolution textures at the expense of video memory.
 * @property {boolean} autoResize - Whether the game canvas element should be physically resized to match the actual size of the canvas automatically.
 * @property {boolean} roundPixels - If `true`, graphics won't be drawn at fractional pixels. Enabling this can make pixel art look better.
 */

/**
 * @namespace Phaser.Renderer
 */

module.exports = {

    Canvas: require('./canvas'),
    Snapshot: require('./snapshot'),
    WebGL: require('./webgl')

};
