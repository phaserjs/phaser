/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var DOMElementRender = require('./DOMElementRender');
var GameObject = require('../GameObject');
var IsPlainObject = require('../../utils/object/IsPlainObject');
var RemoveFromDOM = require('../../dom/RemoveFromDOM');
var Vector4 = require('../../math/Vector4');

/**
 * @classdesc
 * [description]
 *
 * @class DOMElement
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.17.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x=0] - The horizontal position of this DOM Element in the world.
 * @param {number} [y=0] - The vertical position of this DOM Element in the world.
 * @param {(HTMLElement|string)} [element] - An existing DOM element, or a string. If a string starting with a # it will do a `getElementById` look-up on the string (minus the hash). Without a hash, it represents the type of element to create, i.e. 'div'.
 * @param {(DOMString|any)} [style] - If a string, will be set directly as the elements `style` property value. If a plain object, will be iterated and the values transferred. In both cases the values replacing whatever CSS styles may have been previously set.
 * @param {DOMString} [innerText] - If given, will be set directly as the elements `innerText` property value, replacing whatever was there before.
 */
var DOMElement = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Origin,
        Components.ScrollFactor,
        Components.Transform,
        Components.Visible,
        DOMElementRender
    ],

    initialize:

    function DOMElement (scene, x, y, element, style, innerText)
    {
        GameObject.call(this, scene, 'DOMElement');

        /**
         * A reference to the parent DOM Container that the Game instance created when it started.
         * 
         * @name Phaser.GameObjects.DOMElement#parent
         * @type {Element}
         * @since 3.17.0
         */
        this.parent = scene.sys.game.domContainer;

        /**
         * A reference to the HTML Cache.
         * 
         * @name Phaser.GameObjects.DOMElement#cache
         * @type {Phaser.Cache.BaseCache}
         * @since 3.17.0
         */
        this.cache = scene.sys.cache.html;

        /**
         * The actual DOM Element that this Game Object is bound to. For example, if you've created a `<div>`
         * then this property is a direct reference to that element within the dom.
         * 
         * @name Phaser.GameObjects.DOMElement#node
         * @type {Element}
         * @since 3.17.0
         */
        this.node;

        /**
         * By default a DOM Element will have its transform, display, opacity, zIndex and blend mode properties
         * updated when its rendered. If, for some reason, you don't want any of these changed other than the
         * CSS transform, then set this flag to `true`. When `true` only the CSS Transform is applied and it's
         * up to you to keep track of and set the other properties as required.
         * 
         * This can be handy if, for example, you've a nested DOM Element and you don't want the opacity to be
         * picked-up by any of its children.
         * 
         * @name Phaser.GameObjects.DOMElement#transformOnly
         * @type {boolean}
         * @since 3.17.0
         */
        this.transformOnly = false;

        /**
         * The angle, in radians, by which to skew the DOM Element on the horizontal axis.
         * 
         * https://developer.mozilla.org/en-US/docs/Web/CSS/transform
         * 
         * @name Phaser.GameObjects.DOMElement#skewX
         * @type {number}
         * @since 3.17.0
         */
        this.skewX = 0;

        /**
         * The angle, in radians, by which to skew the DOM Element on the vertical axis.
         * 
         * https://developer.mozilla.org/en-US/docs/Web/CSS/transform
         * 
         * @name Phaser.GameObjects.DOMElement#skewY
         * @type {number}
         * @since 3.17.0
         */
        this.skewY = 0;

        /**
         * A Vector4 that contains the 3D rotation of this DOM Element around a fixed axis in 3D space.
         * 
         * All values in the Vector4 are treated as degrees, unless the `rotate3dAngle` property is changed.
         * 
         * For more details see the following MDN page:
         * 
         * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate3d
         * 
         * @name Phaser.GameObjects.DOMElement#rotate3d
         * @type {Phaser.Math.Vector4}
         * @since 3.17.0
         */
        this.rotate3d = new Vector4();

        /**
         * The unit that represents the 3D rotation values. By default this is `deg` for degrees, but can
         * be changed to any supported unit. See this page for further details:
         * 
         * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate3d
         * 
         * @name Phaser.GameObjects.DOMElement#rotate3dAngle
         * @type {string}
         * @since 3.17.0
         */
        this.rotate3dAngle = 'deg';

        /**
         * The native (un-scaled) width of this Game Object.
         * 
         * For a DOM Element this property is read-only.
         * 
         * The property `displayWidth` holds the computed bounds of this DOM Element, factoring in scaling.
         * 
         * @name Phaser.GameObjects.DOMElement#width
         * @type {number}
         * @readonly
         * @since 3.17.0
         */
        this.width = 0;

        /**
         * The native (un-scaled) height of this Game Object.
         * 
         * For a DOM Element this property is read-only.
         * 
         * The property `displayHeight` holds the computed bounds of this DOM Element, factoring in scaling.
         * 
         * @name Phaser.GameObjects.DOMElement#height
         * @type {number}
         * @readonly
         * @since 3.17.0
         */
        this.height = 0;

        /**
         * The computed display width of this Game Object, based on the `getBoundingClientRect` DOM call.
         * 
         * The property `width` holds the un-scaled width of this DOM Element.
         * 
         * @name Phaser.GameObjects.DOMElement#displayWidth
         * @type {number}
         * @readonly
         * @since 3.17.0
         */
        this.displayWidth = 0;

        /**
         * The computed display height of this Game Object, based on the `getBoundingClientRect` DOM call.
         * 
         * The property `height` holds the un-scaled height of this DOM Element.
         * 
         * @name Phaser.GameObjects.DOMElement#displayHeight
         * @type {number}
         * @readonly
         * @since 3.17.0
         */
        this.displayHeight = 0;

        /**
         * Internal native event handler.
         * 
         * @name Phaser.GameObjects.DOMElement#handler
         * @type {number}
         * @private
         * @since 3.17.0
         */
        this.handler = this.dispatchNativeEvent.bind(this);

        this.setPosition(x, y);

        if (typeof element === 'string')
        {
            //  hash?
            if (element[0] === '#')
            {
                this.setElement(element.substr(1), style, innerText);
            }
            else
            {
                this.createElement(element, style, innerText);
            }
        }
        else if (element)
        {
            this.setElement(element, style, innerText);
        }
    },

    /**
     * Sets the horizontal and vertical skew values of this DOM Element.
     * 
     * For more information see: https://developer.mozilla.org/en-US/docs/Web/CSS/transform
     *
     * @method Phaser.GameObjects.Sprite#setSkew
     * @since 3.17.0
     *
     * @param {number} [x=0] - The angle, in radians, by which to skew the DOM Element on the horizontal axis.
     * @param {number} [y=x] - The angle, in radians, by which to skew the DOM Element on the vertical axis.
     * 
     * @return {this} This DOM Element instance.
     */
    setSkew: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        this.skewX = x;
        this.skewY = y;

        return this;
    },

    /**
     * Sets the perspective CSS property of the _parent DOM Container_. This determines the distance between the z=0
     * plane and the user in order to give a 3D-positioned element some perspective. Each 3D element with
     * z > 0 becomes larger; each 3D-element with z < 0 becomes smaller. The strength of the effect is determined
     * by the value of this property.
     * 
     * For more information see: https://developer.mozilla.org/en-US/docs/Web/CSS/perspective
     * 
     * **Changing this value changes it globally for all DOM Elements, as they all share the same parent container.**
     *
     * @method Phaser.GameObjects.Sprite#setPerspective
     * @since 3.17.0
     *
     * @param {number} value - The perspective value, in pixels, that determines the distance between the z plane and the user.
     * 
     * @return {this} This DOM Element instance.
     */
    setPerspective: function (value)
    {
        this.parent.style.perspective = value + 'px';

        return this;
    },

    /**
     * The perspective CSS property value of the _parent DOM Container_. This determines the distance between the z=0
     * plane and the user in order to give a 3D-positioned element some perspective. Each 3D element with
     * z > 0 becomes larger; each 3D-element with z < 0 becomes smaller. The strength of the effect is determined
     * by the value of this property.
     * 
     * For more information see: https://developer.mozilla.org/en-US/docs/Web/CSS/perspective
     * 
     * **Changing this value changes it globally for all DOM Elements, as they all share the same parent container.**
     * 
     * @name Phaser.GameObjects.DOMElement#perspective
     * @type {number}
     * @since 3.17.0
     */
    perspective: {

        get: function ()
        {
            return parseFloat(this.parent.style.perspective);
        },

        set: function (value)
        {
            this.parent.style.perspective = value + 'px';
        }

    },

    /**
     * Adds one or more native DOM event listeners onto the underlying Element of this Game Object.
     * The event is then dispatched via this Game Objects standard event emitter.
     * 
     * For example:
     * 
     * ```javascript
     * var div = this.add.dom(x, y, element);
     * 
     * div.addListener('click');
     * 
     * div.on('click', handler);
     * ```
     *
     * @method Phaser.GameObjects.Sprite#addListener
     * @since 3.17.0
     *
     * @param {string} events - The DOM event/s to listen for. You can specify multiple events by separating them with spaces.
     * 
     * @return {this} This DOM Element instance.
     */
    addListener: function (events)
    {
        if (this.node)
        {
            events = events.split(' ');

            for (var i = 0; i < events.length; i++)
            {
                this.node.addEventListener(events[i], this.handler, false);
            }
        }

        return this;
    },

    /**
     * Removes one or more native DOM event listeners from the underlying Element of this Game Object.
     *
     * @method Phaser.GameObjects.Sprite#removeListener
     * @since 3.17.0
     *
     * @param {string} events - The DOM event/s to stop listening for. You can specify multiple events by separating them with spaces.
     * 
     * @return {this} This DOM Element instance.
     */
    removeListener: function (events)
    {
        if (this.node)
        {
            events = events.split(' ');

            for (var i = 0; i < events.length; i++)
            {
                this.node.removeEventListener(events[i], this.handler);
            }
        }

        return this;
    },

    /**
     * Internal event proxy to dispatch native DOM Events via this Game Object.
     *
     * @method Phaser.GameObjects.Sprite#dispatchNativeEvent
     * @private
     * @since 3.17.0
     *
     * @param {any} event - The native DOM event.
     */
    dispatchNativeEvent: function (event)
    {
        this.emit(event.type, event);
    },

    /**
     * 
     *
     * @method Phaser.GameObjects.Sprite#createElement
     * @since 3.17.0
     *
     * @param {string} element - 
     * @param {DOMString} style - 
     * @param {DOMString} innerText - 
     * 
     * @return {this} This DOM Element instance.
     */
    createElement: function (element, style, innerText)
    {
        return this.setElement(document.createElement(element), style, innerText);
    },

    /**
     * 
     *
     * @method Phaser.GameObjects.Sprite#setElement
     * @since 3.17.0
     *
     * @param {(string|Element)} element - 
     * @param {DOMString} style - 
     * @param {DOMString} innerText - 
     * 
     * @return {this} This DOM Element instance.
     */
    setElement: function (element, style, innerText)
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

        //  style can be empty, a string or a plain object
        if (style && IsPlainObject(style))
        {
            for (var key in style)
            {
                target.style[key] = style[key];
            }
        }
        else if (typeof style === 'string')
        {
            target.style = style;
        }

        //  Add / Override the values we need

        target.style.zIndex = '0';
        target.style.display = 'inline';
        target.style.position = 'absolute';

        //  Node handler

        target.phaser = this;

        if (this.parent)
        {
            this.parent.appendChild(target);
        }

        //  InnerText

        if (innerText)
        {
            target.innerText = innerText;
        }

        return this.updateSize();
    },

    createFromCache: function (key, elementType)
    {
        return this.createFromHTML(this.cache.get(key), elementType);
    },

    createFromHTML: function (html, elementType)
    {
        if (elementType === undefined) { elementType = 'div'; }

        var element = document.createElement(elementType);

        this.node = element;

        element.style.zIndex = '0';
        element.style.display = 'inline';
        element.style.position = 'absolute';

        //  Node handler

        element.phaser = this;

        if (this.parent)
        {
            this.parent.appendChild(element);
        }

        element.innerHTML = html;

        return this.updateSize();
    },

    updateSize: function ()
    {
        var node = this.node;

        var nodeBounds = node.getBoundingClientRect();

        this.width = node.clientWidth;
        this.height = node.clientHeight;

        this.displayWidth = nodeBounds.width || 0;
        this.displayHeight = nodeBounds.height || 0;

        return this;
    },

    getChildByProperty: function (property, value)
    {
        if (this.node)
        {
            var children = this.node.querySelectorAll('*');

            for (var i = 0; i < children.length; i++)
            {
                if (children[i][property] === value)
                {
                    return children[i];
                }
            }
        }

        return null;
    },

    getChildByID: function (id)
    {
        return this.getChildByProperty('id', id);
    },

    getChildByName: function (name)
    {
        return this.getChildByProperty('name', name);
    },

    setClassName: function (className)
    {
        if (this.node)
        {
            this.node.className = className;

            var nodeBounds = this.node.getBoundingClientRect();

            this.setSize(nodeBounds.width, nodeBounds.height);
        }

        return this;
    },

    setText: function (text)
    {
        if (this.node)
        {
            this.node.innerText = text;

            var nodeBounds = this.node.getBoundingClientRect();

            this.setSize(nodeBounds.width, nodeBounds.height);
        }

        return this;
    },

    setHTML: function (html)
    {
        if (this.node)
        {
            this.node.innerHTML = html;

            var nodeBounds = this.node.getBoundingClientRect();

            this.setSize(nodeBounds.width, nodeBounds.height);
        }

        return this;
    },

    /**
     * Runs internal update tasks.
     *
     * @method Phaser.GameObjects.DOMElement#preUpdate
     * @private
     * @since 3.17.0
     */
    preUpdate: function ()
    {
        var parent = this.parentContainer;
        var node = this.node;

        if (node && parent && !parent.willRender())
        {
            node.style.display = 'none';
        }
    },

    /**
     * Compares the renderMask with the renderFlags to see if this Game Object will render or not.
     * 
     * DOMElements always return `true` as they need to still set values during the render pass, even if not visible.
     *
     * @method Phaser.GameObjects.DOMElement#willRender
     * @since 3.17.0
     *
     * @return {boolean} `true` if the Game Object should be rendered, otherwise `false`.
     */
    willRender: function ()
    {
        return true;
    },

    /**
     * Handles the pre-destroy step for the DOM Element, which removes the underlying node from the DOM.
     *
     * @method Phaser.GameObjects.DOMElement#preDestroy
     * @private
     * @since 3.17.0
     */
    preDestroy: function ()
    {
        RemoveFromDOM(this.node);
    }

});

module.exports = DOMElement;
