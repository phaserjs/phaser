/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObjectCreator = require('../GameObjectCreator');
var Group = require('./Group');

/**
 * Creates a new Group Game Object and returns it.
 *
 * Note: This method will only be available if the Group Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#group
 * @since 3.0.0
 *
 * @param {object} config - [description]
 *
 * @return {Phaser.GameObjects.Group} The Game Object that was created.
 */
GameObjectCreator.register('group', function (config)
{
    return new Group(this.scene, null, config);
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
