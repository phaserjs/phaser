/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GetValue = require('../../utils/object/GetValue');
var NineSlice = require('./NineSlice');

/**
 * Creates a new Nine Slice Game Object and returns it.
 *
 * Note: This method will only be available if the Nine Slice Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#nineslice
 * @since 3.60.0
 *
 * @param {Phaser.Types.GameObjects.NineSlice.NineSliceConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.NineSlice} The Game Object that was created.
 */
GameObjectCreator.register('nineslice', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);
    var width = GetValue(config, 'width', 256);
    var height = GetValue(config, 'height', 256);
    var leftWidth = GetValue(config, 'leftWidth', 10);
    var rightWidth = GetValue(config, 'rightWidth', 10);
    var topHeight = GetValue(config, 'topHeight', 0);
    var bottomHeight = GetValue(config, 'bottomHeight', 0);

    var nineslice = new NineSlice(this.scene, 0, 0, key, frame, width, height, leftWidth, rightWidth, topHeight, bottomHeight);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, nineslice, config);

    return nineslice;
});
