/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BuildGameObject = require('../BuildGameObject');
var GameObjectCreator = require('../GameObjectCreator');
var GetAdvancedValue = require('../../utils/object/GetAdvancedValue');
var Text = require('./Text');

/**
 * Creates a new Text Game Object and returns it.
 *
 * Note: This method will only be available if the Text Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#text
 * @since 3.0.0
 *
 * @param {Phaser.Types.GameObjects.Text.TextConfig} config - The configuration object this Game Object will use to create itself.
 * @param {boolean} [addToScene] - Add this Game Object to the Scene after creating it? If set this argument overrides the `add` property in the config object.
 *
 * @return {Phaser.GameObjects.Text} The Game Object that was created.
 */
GameObjectCreator.register('text', function (config, addToScene)
{
    if (config === undefined) { config = {}; }

    // style Object = {
    //     font: [ 'font', '16px Courier' ],
    //     backgroundColor: [ 'backgroundColor', null ],
    //     fill: [ 'fill', '#fff' ],
    //     stroke: [ 'stroke', '#fff' ],
    //     strokeThickness: [ 'strokeThickness', 0 ],
    //     shadowOffsetX: [ 'shadow.offsetX', 0 ],
    //     shadowOffsetY: [ 'shadow.offsetY', 0 ],
    //     shadowColor: [ 'shadow.color', '#000' ],
    //     shadowBlur: [ 'shadow.blur', 0 ],
    //     shadowStroke: [ 'shadow.stroke', false ],
    //     shadowFill: [ 'shadow.fill', false ],
    //     align: [ 'align', 'left' ],
    //     maxLines: [ 'maxLines', 0 ],
    //     fixedWidth: [ 'fixedWidth', false ],
    //     fixedHeight: [ 'fixedHeight', false ],
    //     rtl: [ 'rtl', false ]
    // }

    var content = GetAdvancedValue(config, 'text', '');
    var style = GetAdvancedValue(config, 'style', null);

    //  Padding
    //      { padding: 2 }
    //      { padding: { x: , y: }}
    //      { padding: { left: , top: }}
    //      { padding: { left: , right: , top: , bottom: }}

    var padding = GetAdvancedValue(config, 'padding', null);

    if (padding !== null)
    {
        style.padding = padding;
    }

    var text = new Text(this.scene, 0, 0, content, style);

    if (addToScene !== undefined)
    {
        config.add = addToScene;
    }

    BuildGameObject(this.scene, text, config);

    //  Text specific config options:

    text.autoRound = GetAdvancedValue(config, 'autoRound', true);
    text.resolution = GetAdvancedValue(config, 'resolution', 1);

    return text;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
