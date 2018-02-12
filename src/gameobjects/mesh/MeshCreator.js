/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GetValue = require('../../utils/object/GetValue');
var Mesh = require('./Mesh');

/**
 * Creates a new Mesh Game Object and returns it.
 *
 * Note: This method will only be available if the Mesh Game Object and WebGL support have been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#mesh
 * @since 3.0.0
 *
 * @param {object} config - [description]
 *
 * @return {Phaser.GameObjects.Mesh} The Game Object that was created.
 */
GameObjectCreator.register('mesh', function (config)
{
    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);
    var vertices = GetValue(config, 'vertices', []);
    var colors = GetValue(config, 'colors', []);
    var alphas = GetValue(config, 'alphas', []);
    var uv = GetValue(config, 'uv', []);

    var mesh = new Mesh(this.scene, 0, 0, vertices, uv, colors, alphas, key, frame);

    BuildGameObject(this.scene, mesh, config);

    return mesh;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
