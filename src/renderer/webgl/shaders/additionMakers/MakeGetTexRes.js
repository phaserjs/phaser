/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetTexRes = require('../GetTexRes-glsl');

var MakeGetTexRes = function (disable)
{
    return {
        name: 'GetTexRes',
        additions: {
            fragmentHeader: GetTexRes
        },
        tags: [ 'TEXRES' ],
        disable: !!disable
    };
};

module.exports = MakeGetTexRes;
