/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var Quad = require('./Quad');

/**
 * Creates a new Quad Game Object and returns it.
 *
 * Note: This method will only be available if the Quad Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#quad
 * @since 3.0.0
 *
 * @param {object} config - [description]
 *
 * @return {Phaser.GameObjects.Quad} The Game Object that was created.
 */
GameObjectCreator.register('quad', function (config)
{
    var x = GetAdvancedValue(config, 'x', 0);
    var y = GetAdvancedValue(config, 'y', 0);
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);

    var quad = new Quad(this.scene, x, y, key, frame);

    BuildGameObject(this.scene, quad, config);

    return quad;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
