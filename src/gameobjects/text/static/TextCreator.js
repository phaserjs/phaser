/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BuildGameObject = require('../../BuildGameObject');
var GameObjectCreator = require('../../GameObjectCreator');
var GetAdvancedValue = require('../../../utils/object/GetAdvancedValue');
var Text = require('./Text');

/**
 * Creates a new Text Game Object and returns it.
 *
 * Note: This method will only be available if the Text Game Object has been built into Phaser.
 *
 * @method Phaser.GameObjects.GameObjectCreator#text
 * @since 3.0.0
 *
 * @param {object} config - [description]
 *
 * @return {Phaser.GameObjects.Text} The Game Object that was created.
 */
GameObjectCreator.register('text', function (config)
{
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

    BuildGameObject(this.scene, text, config);

    //  Text specific config options:

    text.autoRound = GetAdvancedValue(config, 'autoRound', true);
    text.resolution = GetAdvancedValue(config, 'resolution', 1);

    return text;
});

//  When registering a factory function 'this' refers to the GameObjectCreator context.
