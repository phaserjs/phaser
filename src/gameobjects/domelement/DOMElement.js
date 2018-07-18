/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var DOMElementRender = require('./DOMElementRender');
var GameObject = require('../GameObject');
var Vector4 = require('../../math/Vector4');

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
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {(string|HTMLElement)} [element] - The DOM Element to use.
 */
var DOMElement = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.ComputedSize,
        Components.Depth,
        Components.Origin,
        Components.ScrollFactor,
        Components.Transform,
        Components.Visible,
        DOMElementRender
    ],

    initialize:

    function DOMElement (scene, x, y, element)
    {
        GameObject.call(this, scene, 'DOMElement');

        this.parent = scene.sys.game.domContainer;

        this.node;

        this.skewX = 0;
        this.skewY = 0;

        //  https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate3d
        this.rotate3d = new Vector4();
        this.rotate3dAngle = 'deg';

        this.setPosition(x, y);

        if (element)
        {
            this.setElement(element);
        }
    },

    setSkew: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        this.skewX = x;
        this.skewY = y;

        return this;
    },

    setPerspective: function (value)
    {
        //  Sets it on the DOM Container!
        this.parent.style.perspective = value + 'px';

        return this;
    },

    setElement: function (element)
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
        target.style.display = 'block';
        target.style.position = 'absolute';

        if (this.parent)
        {
            this.parent.appendChild(target);
        }

        var nodeBounds = target.getBoundingClientRect();

        this.setSize(nodeBounds.width || 0, nodeBounds.height || 0);

        return this;
    },

    setText: function (text)
    {
        if (this.node)
        {
            this.node.innerText = text;
        }

        return this;
    },

    setHTML: function (html)
    {
        if (this.node)
        {
            this.node.innerHTML = html;
        }

        return this;
    },

    destroy: function ()
    {

    }

});

module.exports = DOMElement;
