/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DefineBlockyTexCoord = require('../DefineBlockyTexCoord-glsl');

var MakeSmoothPixelArt = function (disable)
{
    return {
        name: 'SmoothPixelArt',
        additions: {
            extensions: '#extension GL_OES_standard_derivatives : enable',
            fragmentHeader: DefineBlockyTexCoord,
            texCoord: 'texCoord = getBlockyTexCoord(texCoord, getTexRes());'
        },
        disable: !!disable
    };
};

module.exports = MakeSmoothPixelArt;
