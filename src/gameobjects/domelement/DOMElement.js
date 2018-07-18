/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var DOMElementRender = require('./DOMElementRender');

/**
 * @classdesc
 * [description]
 *
 * @class DOMElement
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.12.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScaleMode
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.TextureCrop
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 */
var DOMElement = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        // Components.Flip,
        // Components.GetBounds,
        // Components.Mask,
        // Components.Origin,
        // Components.Pipeline,
        // Components.ScaleMode,
        Components.ScrollFactor,
        // Components.Size,
        // Components.TextureCrop,
        // Components.Tint,
        Components.Transform,
        Components.Visible,
        DOMElementRender
    ],

    initialize:

    function DOMElement (scene, x, y, element)
    {
        GameObject.call(this, scene, 'DOMElement');

        // this.setTexture(texture, frame);
        this.setPosition(x, y);
        // this.setSizeToFrame();
        // this.setOriginFromFrame();
        // this.initPipeline('TextureTintPipeline');

        this.parent = scene.sys.game.domContainer;

        this.node;

        this.setNode(element);
    },

    setNode: function (element)
    {
        var target;

        if (typeof element === 'string')
        {
            target = document.getElementById(element);
        }
        else if (typeof element === 'object' && element.nodeType === 1)
        {
            target = element;
        }

        if (!target)
        {
            return;
        }

        this.node = target;

        target.style.zIndex = '0';
        target.style.position = 'absolute';

        if (this.parent)
        {
            this.parent.appendChild(target);
        }
    }

});

module.exports = DOMElement;
