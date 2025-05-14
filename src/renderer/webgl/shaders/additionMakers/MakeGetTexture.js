/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetTexture = require('../GetTexture-glsl');

var MakeGetTexture = function (maxTextures, disable)
{
    if (maxTextures === undefined) { maxTextures = 1; }

    var texIdProcess = '';
    for (var i = 1; i < maxTextures; i++)
    {
        texIdProcess += 'ELSE_TEX_CASE(' + i + ')\n';
    }
    var header = GetTexture.replace('#pragma phaserTemplate(texIdProcess)', texIdProcess);

    return {
        name: 'GetTexture' + maxTextures,
        additions: {
            fragmentHeader: header,
            fragmentProcess: 'vec4 fragColor = getTexture(texCoord);'
        },
        tags: [ 'TEXTURE' ],
        disable: !!disable
    };
};

module.exports = MakeGetTexture;
