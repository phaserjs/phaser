/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetTexture = require('../GetTexture-glsl');

var MakeGetTexture = function (disable)
{
    return {
        name: 'GetTexture',
        additions: {
            fragmentHeader: GetTexture,
            fragmentProcess: 'vec4 fragColor = getTexture(texCoord);'
        },
        tags: [ 'TEXTURE' ],
        disable: !!disable
    };
};

module.exports = MakeGetTexture;
