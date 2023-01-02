/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var Zone = require('./Zone');

/**
 * Creates a new Zone Game Object and returns it.
 *
 * Note: This method will only be available if the Zone Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#zone
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.Zone.ZoneConfig} config - The configuration object this Game Object will use to create itself.
 *
 * @return {Phaser.GameObjects.Zone} The Game Object that was created.
 */
GameObjectCreator.register('zone', function (config)
{
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var width = GetAdvancedValue(config, 'width', 1);
    var height = GetAdvancedValue(config, 'height', width);

    return new Zone(this.scene, x, y, width, height);
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
