/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var BuildGameObjectAnimation = require('../BuildGameObjectAnimation');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GetValue = require('../../utils/object/GetValue');
var Plane = require('./Plane');

/**
 * Creates a new Plane Game Object and returns it.
 *
 * Note: This method will only be available if the Plane Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#plane
 * @since 3.60.0
 *
 * @param {Phaser.Types.GameObjects.Plane.PlaneConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Plane} The Game Object that was created.
 */
GameObjectCreator.register('plane', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);
    var width = GetValue(config, 'width', 8);
    var height = GetValue(config, 'height', 8);
    var tile = GetValue(config, 'tile', false);

    var plane = new Plane(this.scene, 0, 0, key, frame, width, height, tile);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    var checkerboard = GetValue(config, 'checkerboard', null);

    if (checkerboard)
    {
        var color1 = GetValue(checkerboard, 'color1', 0xffffff);
        var color2 = GetValue(checkerboard, 'color2', 0x0000ff);
        var alpha1 = GetValue(checkerboard, 'alpha1', 255);
        var alpha2 = GetValue(checkerboard, 'alpha2', 255);
        var checkheight = GetValue(checkerboard, 'height', 128);

        plane.createCheckerboard(color1, color2, alpha1, alpha2, checkheight);
    }

    BuildGameObject(this.scene, plane, config);

    BuildGameObjectAnimation(plane, config);

    return plane;
});
