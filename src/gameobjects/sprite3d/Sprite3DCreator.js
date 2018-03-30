/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var BuildGameObjectAnimation = require('../BuildGameObjectAnimation');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var Sprite3D = require('./Sprite3D');

/**
 * Creates a new Sprite3D Game Object and returns it.
 *
 * Note: This method will only be available if the Sprite3D Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#sprite3D
 * @since 3.0.0
 *
 * @param {object} config - [description]
 *
 * @return {Phaser.GameObjects.Sprite3D} The Game Object that was created.
 */
GameObjectCreator.register('sprite3D', function (config)
{
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);

    var sprite = new Sprite3D(this.scene, 0, 0, key, frame);

    BuildGameObject(this.scene, sprite, config);

    //  Sprite specific config options:

    BuildGameObjectAnimation(sprite, config);

    //  Physics, Input, etc to follow ...

    return sprite;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
