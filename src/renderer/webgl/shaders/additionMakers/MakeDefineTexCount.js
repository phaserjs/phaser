/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MakeDefineTexCount = function (maxTextures, disable)
{
    return {
        name: maxTextures + 'TexCount',
        additions: {
            fragmentDefine: '#define TEXTURE_COUNT ' + maxTextures
        },
        tags: [ 'TexCount' ],
        disable: !!disable
    };
};

module.exports = MakeDefineTexCount;
