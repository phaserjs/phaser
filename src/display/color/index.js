/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @typedef {object} InputColorObject
 *
 * @property {number} [r] - The red color value in the range 0 to 255.
 * @property {number} [g] - The green color value in the range 0 to 255.
 * @property {number} [b] - The blue color value in the range 0 to 255.
 * @property {number} [a] - The alpha color value in the range 0 to 255.
 */

/**
 * @typedef {object} ColorObject
 * 
 * @property {number} r - The red color value in the range 0 to 255.
 * @property {number} g - The green color value in the range 0 to 255.
 * @property {number} b - The blue color value in the range 0 to 255.
 * @property {number} a - The alpha color value in the range 0 to 255.
 */

var Color = require('./Color');

Color.ColorToRGBA = require('./ColorToRGBA');
Color.ComponentToHex = require('./ComponentToHex');
Color.GetColor = require('./GetColor');
Color.GetColor32 = require('./GetColor32');
Color.HexStringToColor = require('./HexStringToColor');
Color.HSLToColor = require('./HSLToColor');
Color.HSVColorWheel = require('./HSVColorWheel');
Color.HSVToRGB = require('./HSVToRGB');
Color.HueToComponent = require('./HueToComponent');
Color.IntegerToColor = require('./IntegerToColor');
Color.IntegerToRGB = require('./IntegerToRGB');
Color.Interpolate = require('./Interpolate');
Color.ObjectToColor = require('./ObjectToColor');
Color.RandomRGB = require('./RandomRGB');
Color.RGBStringToColor = require('./RGBStringToColor');
Color.RGBToHSV = require('./RGBToHSV');
Color.RGBToString = require('./RGBToString');
Color.ValueToColor = require('./ValueToColor');

module.exports = Color;
