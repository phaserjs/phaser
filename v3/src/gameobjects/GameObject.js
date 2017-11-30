/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2017 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var Components = require('./components');
var DataProxy = require('./components/DataProxy');

var GameObject = new Class({

    initialize:

    /**
     * The base class that all Game Objects extend.
     * You don't create GameObjects directly and they cannot be added to the display list.
     * Instead, use them as the base for your own custom classes.
     *
     * @class GameObject
     * @memberof Phaser.GameObjects
     * @constructor
     *
     * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
     * @param {string} type - A textual representation of the type of Game Object, i.e. `sprite`.
     */
    function GameObject (scene, type)
    {
        /**
         * The Scene to which this Game Object belongs.
         * Game Objects can only belong to one Scene.
         *
         * @property {Phaser.Scene} scene
         * @protected
         */
        this.scene = scene;

        /**
         * A textual representation of this Game Object, i.e. `sprite`.
         * Used internally by Phaser but is available for your own custom classes to populate.
         *
         * @property {string} type
         */
        this.type = type;

        /**
         * The name of this Game Object.
         * Empty by default and never populated by Phaser, this is left for developers to use.
         *
         * @property {string} [name='']
         */
        this.name = '';

        /**
         * The active state of this Game Object.
         * A Game Object with an active state of `true` is processed by the Scenes UpdateList, if added to it.
         * An active object is one which is having its logic and internal systems updated.
         *
         * @property {boolean} [active=true]
         */
        this.active = true;

        /**
         * The Tab Index of the Game Object.
         * Reserved for future use by plugins and the Input Manager.
         *
         * @property {integer} [tabIndex=-1]
         */
        this.tabIndex = -1;

        /**
         * A proxy to the Data class.
         * It allows you to store, query and get key/value paired information specific to this Game Object.
         *
         * @property {DataProxy} data
         */
        this.data = new DataProxy(scene, this);

        /**
         * The flags that are compared against `RENDER_MASK` to determine if this Game Object will render or not.
         * The bits are 0001 | 0010 | 0100 | 1000 set by the components Visible, Alpha, Transform and Texture respectively.
         * If those components are not used by your custom class then you can use this bitmask as you wish.
         *
         * @property {integer} [renderFlags=15]
         */
        this.renderFlags = 15;

        /**
         * A bitmask that controls if this Game Object is drawn by a Camera or not.
         * Not usually set directly. Instead call `Camera.ignore`.
         *
         * @property {number} [cameraFilter=0]
         * @see Phaser.Cameras.Camera.ignore
         */
        this.cameraFilter = 0;

        /**
         * If this Game Object is enabled for input then this property will contain an InteractiveObject instance.
         * Not usually set directly. Instead call `GameObject.setInteractive()`.
         *
         * @property {?Phaser.Input.InteractiveObject} [input=null]
         * @see setInteractive
         */
        this.input = null;

        /**
         * If this Game Object is enabled for physics then this property will contain a reference to a Physics Body.
         *
         * @property {?Phaser.Physics.Body} [body=null]
         */
        this.body = null;

        //  Tell the Scene to re-sort the children
        this.scene.sys.sortChildrenFlag = true;
    },

    /**
     * Sets the `active` property of this Game Object and returns this Game Object for further chaining.
     * A Game Object with its `active` property set to `true` will be updated by the Scenes UpdateList.
     *
     * @method setActive
     *
     * @param {boolean} value - True if this Game Object should be set as active, false if not.
     * @return {GameObject} This GameObject.
     */
    setActive: function (value)
    {
        this.active = value;

        return this;
    },

    /**
     * Sets the `name` property of this Game Object and returns this Game Object for further chaining.
     * The `name` property is not populated by Phaser and is presented for your own use.
     *
     * @example game objects/image/set name.js
     * @tutorial game objects/basics
     *
     * @method setName
     *
     * @param {string} value - The name to be given to this Game Object.
     * @return {GameObject} This GameObject.
     */
    setName: function (value)
    {
        this.name = value;

        return this;
    },

    /**
     * This is a quick chainable alias to the `DataProxy.set` method.
     * It allows you to set a key and value in this Game Objects data store.
     *
     * @method setData
     *
     * @param {string} key - The key of the property to be stored.
     * @param {any} value - The value to store with the key. Can be a string, number, array or object.
     * @return {GameObject} This GameObject.
     */
    setData: function (key, value)
    {
        this.data.set(key, value);

        return this;
    },

    /**
     * This is a quick alias to the `DataProxy.get` method to remain consistent with `setData`.
     *
     * @method getData
     *
     * @param {string} key - The key of the property to be retrieve.
     * @return {any} The data, if present in the Data Store.
     */
    getData: function (key)
    {
        return this.data.get(key);
    },

    /**
     * Pass this Game Object to the Input Manager to enable it for Input.
     *
     * @example game objects/image/set interactive.js
     * @tutorial input/basics
     * 
     * @method setInteractive
     *
     * @param {any} [shape] - A geometric shape that defines the hit area for the Game Object. If not specified a Rectangle will be used.
     * @param {function} [callback] - A callback to be invoked when the Game Object is interacted with.
     * @return {GameObject} This GameObject.
     */
    setInteractive: function (shape, callback)
    {
        this.scene.sys.inputManager.enable(this, shape, callback);

        return this;
    },

    //  To be overridden by custom GameObjects. Allows base objects to be used in a Pool.
    update: function ()
    {
    },

    /**
     * Returns a JSON representation of the Game Object.
     *
     * @method toJSON
     *
     * @return {object} A JSON representation of the Game Object.
     */
    toJSON: function ()
    {
        return Components.ToJSON(this);
    },

    /**
     * Compares the renderMask with the renderFlags to see if this Game Object will render or not.
     *
     * @method willRender
     *
     * @return {boolean} True if the Game Object should be rendered, otherwise false.
     */
    willRender: function ()
    {
        return (GameObject.RENDER_MASK === this.renderFlags);
    },

    /**
     * Destroys this Game Object removing it from the Display List and Update List and
     * severing all ties to parent resources.
     * 
     * Also removes itself from the Input Manager and Physics Manager if previously enabled.
     * 
     * Use this to remove a Game Object from your game if you don't ever plan to use it again.
     * As long as no reference to it exists within your own code it should become free for
     * garbage collection by the browser.
     * 
     * If you just want to temporarily disable an object then look at using the
     * Game Object Pool instead of destroying it, as destroyed objects cannot be resurrected.
     *
     * @method destroy
     */
    destroy: function ()
    {
        if (this.preDestroy)
        {
            this.preDestroy();
        }

        this.scene.sys.displayList.remove(this);
        this.scene.sys.updateList.remove(this);

        if (this.input)
        {
            this.scene.sys.inputManager.clear(this);
            this.input = undefined;
        }

        if (this.body)
        {
            this.scene.sys.physicsManager.remove(this);
            this.body = undefined;
        }

        this.active = false;

        this.data = undefined;

        this.scene = undefined;
    }

});

/**
 * The bitmask that `GameObject.renderFlags` is compared against to determine if the Game Object will render or not.
 *
 * @constant {integer} RENDER_MASK
 * @default
 */
GameObject.RENDER_MASK = 15;

module.exports = GameObject;
