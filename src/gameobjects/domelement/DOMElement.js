/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var DOMElementRender = require('./DOMElementRender');
var GameObject = require('../GameObject');
var IsPlainObject = require('../../utils/object/IsPlainObject');
var RemoveFromDOM = require('../../dom/RemoveFromDOM');
var SCENE_EVENTS = require('../../scene/events');
var Vector4 = require('../../math/Vector4');

/**
 * @classdesc
 * DOM Element Game Objects are a way to control and manipulate HTML Elements over the top of your game.
 *
 * In order for DOM Elements to display you have to enable them by adding the following to your game
 * configuration object:
 *
 * ```javascript
 * dom {
 *   createContainer: true
 * }
 * ```
 *
 * You must also have a parent container for Phaser. This is specified by the `parent` property in the
 * game config.
 *
 * When these two things are added, Phaser will automatically create a DOM Container div that is positioned
 * over the top of the game canvas. This div is sized to match the canvas, and if the canvas size changes,
 * as a result of settings within the Scale Manager, the dom container is resized accordingly.
 *
 * If you have not already done so, you have to provide a `parent` in the Game Configuration, or the DOM
 * Container will fail to be created.
 *
 * You can create a DOM Element by either passing in DOMStrings, or by passing in a reference to an existing
 * Element that you wish to be placed under the control of Phaser. For example:
 *
 * ```javascript
 * this.add.dom(x, y, 'div', 'background-color: lime; width: 220px; height: 100px; font: 48px Arial', 'Phaser');
 * ```
 *
 * The above code will insert a div element into the DOM Container at the given x/y coordinate. The DOMString in
 * the 4th argument sets the initial CSS style of the div and the final argument is the inner text. In this case,
 * it will create a lime colored div that is 220px by 100px in size with the text Phaser in it, in an Arial font.
 *
 * You should nearly always, without exception, use explicitly sized HTML Elements, in order to fully control
 * alignment and positioning of the elements next to regular game content.
 *
 * Rather than specify the CSS and HTML directly you can use the `load.html` File Loader to load it into the
 * cache and then use the `createFromCache` method instead. You can also use `createFromHTML` and various other
 * methods available in this class to help construct your elements.
 *
 * Once the element has been created you can then control it like you would any other Game Object. You can set its
 * position, scale, rotation, alpha and other properties. It will move as the main Scene Camera moves and be clipped
 * at the edge of the canvas. It's important to remember some limitations of DOM Elements: The obvious one is that
 * they appear above or below your game canvas. You cannot blend them into the display list, meaning you cannot have
 * a DOM Element, then a Sprite, then another DOM Element behind it.
 *
 * They also cannot be enabled for input. To do that, you have to use the `addListener` method to add native event
 * listeners directly. The final limitation is to do with cameras. The DOM Container is sized to match the game canvas
 * entirely and clipped accordingly. DOM Elements respect camera scrolling and scrollFactor settings, but if you
 * change the size of the camera so it no longer matches the size of the canvas, they won't be clipped accordingly.
 *
 * Also, all DOM Elements are inserted into the same DOM Container, regardless of which Scene they are created in.
 *
 * Note that you should only have DOM Elements in a Scene with a _single_ Camera. If you require multiple cameras,
 * use parallel scenes to achieve this.
 *
 * DOM Elements are a powerful way to align native HTML with your Phaser Game Objects. For example, you can insert
 * a login form for a multiplayer game directly into your title screen. Or a text input box for a highscore table.
 * Or a banner ad from a 3rd party service. Or perhaps you'd like to use them for high resolution text display and
 * UI. The choice is up to you, just remember that you're dealing with standard HTML and CSS floating over the top
 * of your game, and should treat it accordingly.
 *
 * @class DOMElement
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.17.0
 *
 * @extends Phaser.GameObjects.Components.AlphaSingle
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
 * @param {(Element|string)} [element] - An existing DOM element, or a string. If a string starting with a # it will do a `getElementById` look-up on the string (minus the hash). Without a hash, it represents the type of element to create, i.e. 'div'.
 * @param {(string|any)} [style] - If a string, will be set directly as the elements `style` property value. If a plain object, will be iterated and the values transferred. In both cases the values replacing whatever CSS styles may have been previously set.
 * @param {string} [innerText] - If given, will be set directly as the elements `innerText` property value, replacing whatever was there before.
 */
var DOMElement = new Class({

    Extends: GameObject,

    Mixins: [
        Components.AlphaSingle,
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
         * Sets the CSS `pointerEvents` attribute on the DOM Element during rendering.
         *
         * This is 'auto' by default. Changing it may have unintended side-effects with
         * internal Phaser input handling, such as dragging, so only change this if you
         * understand the implications.
         *
         * @name Phaser.GameObjects.DOMElement#pointerEvents
         * @type {string}
         * @since 3.55.0
         */
        this.pointerEvents = 'auto';

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

        scene.sys.events.on(SCENE_EVENTS.SLEEP, this.handleSceneEvent, this);
        scene.sys.events.on(SCENE_EVENTS.WAKE, this.handleSceneEvent, this);
        scene.sys.events.on(SCENE_EVENTS.PRE_RENDER, this.preRender, this);
    },

    /**
     * Handles a Scene Sleep and Wake event.
     *
     * @method Phaser.GameObjects.DOMElement#handleSceneEvent
     * @private
     * @since 3.22.0
     *
     * @param {Phaser.Scenes.Systems} sys - The Scene Systems.
     */
    handleSceneEvent: function (sys)
    {
        var node = this.node;
        var style = node.style;

        if (node)
        {
            style.display = (sys.settings.visible) ? 'block' : 'none';
        }
    },

    /**
     * Sets the horizontal and vertical skew values of this DOM Element.
     *
     * For more information see: https://developer.mozilla.org/en-US/docs/Web/CSS/transform
     *
     * @method Phaser.GameObjects.DOMElement#setSkew
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
     * @method Phaser.GameObjects.DOMElement#setPerspective
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
     * @method Phaser.GameObjects.DOMElement#addListener
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
     * @method Phaser.GameObjects.DOMElement#removeListener
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
     * @method Phaser.GameObjects.DOMElement#dispatchNativeEvent
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
     * Creates a native DOM Element, adds it to the parent DOM Container and then binds it to this Game Object,
     * so you can control it. The `tagName` should be a string and is passed to `document.createElement`:
     *
     * ```javascript
     * this.add.dom().createElement('div');
     * ```
     *
     * For more details on acceptable tag names see: https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
     *
     * You can also pass in a DOMString or style object to set the CSS on the created element, and an optional `innerText`
     * value as well. Here is an example of a DOMString:
     *
     * ```javascript
     * this.add.dom().createElement('div', 'background-color: lime; width: 220px; height: 100px; font: 48px Arial', 'Phaser');
     * ```
     *
     * And using a style object:
     *
     * ```javascript
     * var style = {
     *   'background-color': 'lime';
     *   'width': '200px';
     *   'height': '100px';
     *   'font': '48px Arial';
     * };
     *
     * this.add.dom().createElement('div', style, 'Phaser');
     * ```
     *
     * If this Game Object already has an Element, it is removed from the DOM entirely first.
     * Any event listeners you may have previously created will need to be re-created after this call.
     *
     * @method Phaser.GameObjects.DOMElement#createElement
     * @since 3.17.0
     *
     * @param {string} tagName - A string that specifies the type of element to be created. The nodeName of the created element is initialized with the value of tagName. Don't use qualified names (like "html:a") with this method.
     * @param {(string|any)} [style] - Either a DOMString that holds the CSS styles to be applied to the created element, or an object the styles will be ready from.
     * @param {string} [innerText] - A DOMString that holds the text that will be set as the innerText of the created element.
     *
     * @return {this} This DOM Element instance.
     */
    createElement: function (tagName, style, innerText)
    {
        return this.setElement(document.createElement(tagName), style, innerText);
    },

    /**
     * Binds a new DOM Element to this Game Object. If this Game Object already has an Element it is removed from the DOM
     * entirely first. Any event listeners you may have previously created will need to be re-created on the new element.
     *
     * The `element` argument you pass to this method can be either a string tagName:
     *
     * ```javascript
     * <h1 id="heading">Phaser</h1>
     *
     * this.add.dom().setElement('heading');
     * ```
     *
     * Or a reference to an Element instance:
     *
     * ```javascript
     * <h1 id="heading">Phaser</h1>
     *
     * var h1 = document.getElementById('heading');
     *
     * this.add.dom().setElement(h1);
     * ```
     *
     * You can also pass in a DOMString or style object to set the CSS on the created element, and an optional `innerText`
     * value as well. Here is an example of a DOMString:
     *
     * ```javascript
     * this.add.dom().setElement(h1, 'background-color: lime; width: 220px; height: 100px; font: 48px Arial', 'Phaser');
     * ```
     *
     * And using a style object:
     *
     * ```javascript
     * var style = {
     *   'background-color': 'lime';
     *   'width': '200px';
     *   'height': '100px';
     *   'font': '48px Arial';
     * };
     *
     * this.add.dom().setElement(h1, style, 'Phaser');
     * ```
     *
     * @method Phaser.GameObjects.DOMElement#setElement
     * @since 3.17.0
     *
     * @param {(string|Element)} element - If a string it is passed to `getElementById()`, or it should be a reference to an existing Element.
     * @param {(string|any)} [style] - Either a DOMString that holds the CSS styles to be applied to the created element, or an object the styles will be ready from.
     * @param {string} [innerText] - A DOMString that holds the text that will be set as the innerText of the created element.
     *
     * @return {this} This DOM Element instance.
     */
    setElement: function (element, style, innerText)
    {
        //  Already got an element? Remove it first
        this.removeElement();

        var target;

        if (typeof element === 'string')
        {
            //  hash?
            if (element[0] === '#')
            {
                element = element.substr(1);
            }

            target = document.getElementById(element);
        }
        else if (typeof element === 'object' && element.nodeType === 1)
        {
            target = element;
        }

        if (!target)
        {
            return this;
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

    /**
     * Takes a block of html from the HTML Cache, that has previously been preloaded into the game, and then
     * creates a DOM Element from it. The loaded HTML is set as the `innerHTML` property of the created
     * element.
     *
     * Assume the following html is stored in a file called `loginform.html`:
     *
     * ```html
     * <input type="text" name="nameField" placeholder="Enter your name" style="font-size: 32px">
     * <input type="button" name="playButton" value="Let's Play" style="font-size: 32px">
     * ```
     *
     * Which is loaded into your game using the cache key 'login':
     *
     * ```javascript
     * this.load.html('login', 'assets/loginform.html');
     * ```
     *
     * You can create a DOM Element from it using the cache key:
     *
     * ```javascript
     * this.add.dom().createFromCache('login');
     * ```
     *
     * The optional `elementType` argument controls the container that is created, into which the loaded html is inserted.
     * The default is a plain `div` object, but any valid tagName can be given.
     *
     * If this Game Object already has an Element, it is removed from the DOM entirely first.
     * Any event listeners you may have previously created will need to be re-created after this call.
     *
     * @method Phaser.GameObjects.DOMElement#createFromCache
     * @since 3.17.0
     *
     * @param {string} The key of the html cache entry to use for this DOM Element.
     * @param {string} [tagName='div'] - The tag name of the element into which all of the loaded html will be inserted. Defaults to a plain div tag.
     *
     * @return {this} This DOM Element instance.
     */
    createFromCache: function (key, tagName)
    {
        var html = this.cache.get(key);

        if (html)
        {
            this.createFromHTML(html, tagName);
        }

        return this;
    },

    /**
     * Takes a string of html and then creates a DOM Element from it. The HTML is set as the `innerHTML`
     * property of the created element.
     *
     * ```javascript
     * let form = `
     * <input type="text" name="nameField" placeholder="Enter your name" style="font-size: 32px">
     * <input type="button" name="playButton" value="Let's Play" style="font-size: 32px">
     * `;
     * ```
     *
     * You can create a DOM Element from it using the string:
     *
     * ```javascript
     * this.add.dom().createFromHTML(form);
     * ```
     *
     * The optional `elementType` argument controls the type of container that is created, into which the html is inserted.
     * The default is a plain `div` object, but any valid tagName can be given.
     *
     * If this Game Object already has an Element, it is removed from the DOM entirely first.
     * Any event listeners you may have previously created will need to be re-created after this call.
     *
     * @method Phaser.GameObjects.DOMElement#createFromHTML
     * @since 3.17.0
     *
     * @param {string} html - A string of html to be set as the `innerHTML` property of the created element.
     * @param {string} [tagName='div'] - The tag name of the element into which all of the html will be inserted. Defaults to a plain div tag.
     *
     * @return {this} This DOM Element instance.
     */
    createFromHTML: function (html, tagName)
    {
        if (tagName === undefined) { tagName = 'div'; }

        //  Already got an element? Remove it first
        this.removeElement();

        var element = document.createElement(tagName);

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

    /**
     * Removes the current DOM Element bound to this Game Object from the DOM entirely and resets the
     * `node` property of this Game Object to be `null`.
     *
     * @method Phaser.GameObjects.DOMElement#removeElement
     * @since 3.17.0
     *
     * @return {this} This DOM Element instance.
     */
    removeElement: function ()
    {
        if (this.node)
        {
            RemoveFromDOM(this.node);

            this.node = null;
        }

        return this;
    },

    /**
     * Internal method that calls `getBoundingClientRect` on the `node` and then sets the bounds width
     * and height into the `displayWidth` and `displayHeight` properties, and the `clientWidth` and `clientHeight`
     * values into the `width` and `height` properties respectively.
     *
     * This is called automatically whenever a new element is created or set.
     *
     * @method Phaser.GameObjects.DOMElement#updateSize
     * @since 3.17.0
     *
     * @return {this} This DOM Element instance.
     */
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

    /**
     * Gets all children from this DOM Elements node, using `querySelectorAll('*')` and then iterates through
     * them, looking for the first one that has a property matching the given key and value. It then returns this child
     * if found, or `null` if not.
     *
     * @method Phaser.GameObjects.DOMElement#getChildByProperty
     * @since 3.17.0
     *
     * @param {string} property - The property to search the children for.
     * @param {string} value - The value the property must strictly equal.
     *
     * @return {?Element} The first matching child DOM Element, or `null` if not found.
     */
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

    /**
     * Gets all children from this DOM Elements node, using `querySelectorAll('*')` and then iterates through
     * them, looking for the first one that has a matching id. It then returns this child if found, or `null` if not.
     *
     * Be aware that class and id names are case-sensitive.
     *
     * @method Phaser.GameObjects.DOMElement#getChildByID
     * @since 3.17.0
     *
     * @param {string} id - The id to search the children for.
     *
     * @return {?Element} The first matching child DOM Element, or `null` if not found.
     */
    getChildByID: function (id)
    {
        return this.getChildByProperty('id', id);
    },

    /**
     * Gets all children from this DOM Elements node, using `querySelectorAll('*')` and then iterates through
     * them, looking for the first one that has a matching name. It then returns this child if found, or `null` if not.
     *
     * Be aware that class and id names are case-sensitive.
     *
     * @method Phaser.GameObjects.DOMElement#getChildByName
     * @since 3.17.0
     *
     * @param {string} name - The name to search the children for.
     *
     * @return {?Element} The first matching child DOM Element, or `null` if not found.
     */
    getChildByName: function (name)
    {
        return this.getChildByProperty('name', name);
    },

    /**
     * Sets the `className` property of the DOM Element node and updates the internal sizes.
     *
     * @method Phaser.GameObjects.DOMElement#setClassName
     * @since 3.17.0
     *
     * @param {string} className - A string representing the class or space-separated classes of the element.
     *
     * @return {this} This DOM Element instance.
     */
    setClassName: function (className)
    {
        if (this.node)
        {
            this.node.className = className;

            this.updateSize();
        }

        return this;
    },

    /**
     * Sets the `innerText` property of the DOM Element node and updates the internal sizes.
     *
     * Note that only certain types of Elements can have `innerText` set on them.
     *
     * @method Phaser.GameObjects.DOMElement#setText
     * @since 3.17.0
     *
     * @param {string} text - A DOMString representing the rendered text content of the element.
     *
     * @return {this} This DOM Element instance.
     */
    setText: function (text)
    {
        if (this.node)
        {
            this.node.innerText = text;

            this.updateSize();
        }

        return this;
    },

    /**
     * Sets the `innerHTML` property of the DOM Element node and updates the internal sizes.
     *
     * @method Phaser.GameObjects.DOMElement#setHTML
     * @since 3.17.0
     *
     * @param {string} html - A DOMString of html to be set as the `innerHTML` property of the element.
     *
     * @return {this} This DOM Element instance.
     */
    setHTML: function (html)
    {
        if (this.node)
        {
            this.node.innerHTML = html;

            this.updateSize();
        }

        return this;
    },

    /**
     * Runs internal update tasks.
     *
     * @method Phaser.GameObjects.DOMElement#preRender
     * @private
     * @since 3.60.0
     */
    preRender: function ()
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
        this.removeElement();

        this.scene.sys.events.off(SCENE_EVENTS.SLEEP, this.handleSceneEvent, this);
        this.scene.sys.events.off(SCENE_EVENTS.WAKE, this.handleSceneEvent, this);
        this.scene.sys.events.off(SCENE_EVENTS.PRE_RENDER, this.preRender, this);
    }

});

module.exports = DOMElement;
