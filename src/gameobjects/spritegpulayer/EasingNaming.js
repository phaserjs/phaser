/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var EasingEncoding = require('./EasingEncoding');

/**
 * Easing function identifiers.
 * This is a reverse mapping of EasingEncoding,
 * mapping numbers to their string names.
 *
 * @ignore
 */
var EasingNaming = {};

var animations = Object.keys(EasingEncoding);
var animLen = animations.length;

for (var i = 0; i < animLen; i++)
{
    var key = animations[i];
    var value = EasingEncoding[key];
    EasingNaming[value] = key;
}

module.exports = EasingNaming;
