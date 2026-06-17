/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var StencilReference = require('./StencilReference');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var GetFastValue = require('../../utils/object/GetFastValue');

/**
 * Creates a new StencilReference Game Object and returns it.
 *
 * Note: This method will only be available if the StencilReference Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#stencilreference
 * @since 4.NEXT
 *
 * @param {Phaser.Types.GameObjects.StencilReference.StencilReferenceConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.StencilReference} The Game Object that was created.
 */
GameObjectCreator.register('stencilreference', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    var targetStencil = GetFastValue(config, 'targetStencil', null);
    var options = GetAdvancedValue(config, 'options', {});

    var stencilreference = new StencilReference(this.scene, targetStencil, options);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, stencilreference, config);

    return stencilreference;
});
