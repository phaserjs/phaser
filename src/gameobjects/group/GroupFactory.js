/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Group = require('./Group');
var GameObjectFactory = require('../GameObjectFactory');

/**
 * Creates a new Group Game Object and adds it to the Scene.
 *
 * Note: This method will only be available if the Group Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectFactory#group
 * @since 3.0.0
 *
 * @param {(Phaser.GameObjects.GameObject[]|GroupConfig|GroupConfig[])} [children] - Game Objects to add to this Group; or the `config` argument.
 * @param {GroupConfig|GroupCreateConfig} [config] - A Group Configuration object.
 *
 * @return {Phaser.GameObjects.Group} The Game Object that was created.
 */
GameObjectFactory.register('group', function (children, config)
{
    return this.updateList.add(new Group(this.scene, children, config));
});
