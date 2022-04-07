/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @param {Phaser.Types.GameObjects.Mesh.MeshConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Mesh} The Game Object that was created.
 */
GameObjectCreator.register('mesh', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var key = GetAdvancedValue(config, 'key', null);
    var frame = GetAdvancedValue(config, 'frame', null);
    var vertices = GetValue(config, 'vertices', []);
    var uvs = GetValue(config, 'uvs', []);
    var indicies = GetValue(config, 'indicies', []);
    var containsZ = GetValue(config, 'containsZ', false);
    var normals = GetValue(config, 'normals', []);
    var colors = GetValue(config, 'colors', 0xffffff);
    var alphas = GetValue(config, 'alphas', 1);

    var mesh = new Mesh(this.scene, 0, 0, key, frame, vertices, uvs, indicies, containsZ, normals, colors, alphas);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, mesh, config);

    return mesh;
});
