/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var Container = require('./Container');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');

/**
 * Creates a new Container Game Object and returns it.
 *
 * Note: This method will only be available if the Container Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#container
 * @since 3.4.0
 *
 * @param {object} config - [description]
 *
 * @return {Phaser.GameObjects.Container} The Game Object that was created.
 */
GameObjectCreator.register('container', function (config)
{
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);

    var container = new Container(this.scene, x, y);

    BuildGameObject(this.scene, container, config);
    
    return container;
});
