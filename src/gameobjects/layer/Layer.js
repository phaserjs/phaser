/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BlendModes = require('../../renderer/BlendModes');
var Class = require('../../utils/Class');
var Components = require('../components');
var ComponentsToJSON = require('../components/ToJSON');
var DataManager = require('../../data/DataManager');
var EventEmitter = require('eventemitter3');
var GameObjectEvents = require('../events');
var List = require('../../structs/List');
var Render = require('./LayerRender');
var SceneEvents = require('../../scene/events');
var StableSort = require('../../utils/array/StableSort');

/**
 * @classdesc
 * A Layer Game Object.
 *
 * A Layer is a special type of Game Object that acts as a Display List. You can add any type of Game Object
 * to a Layer, just as you would to a Scene. Layers can be used to visually group together 'layers' of Game
 * Objects:
 *
 * ```javascript
 * const spaceman = this.add.sprite(150, 300, 'spaceman');
 * const bunny = this.add.sprite(400, 300, 'bunny');
 * const elephant = this.add.sprite(650, 300, 'elephant');
 *
 * const layer = this.add.layer();
 *
 * layer.add([ spaceman, bunny, elephant ]);
 * ```
 *
 * The 3 sprites in the example above will now be managed by the Layer they were added to. Therefore,
 * if you then set `layer.setVisible(false)` they would all vanish from the display.
 *
 * You can also control the depth of the Game Objects within the Layer. For example, calling the
 * `setDepth` method of a child of a Layer will allow you to adjust the depth of that child _within the
 * Layer itself_, rather than the whole Scene. The Layer, too, can have its depth set as well.
 *
 * The Layer class also offers many different methods for manipulating the list, such as the
 * methods `moveUp`, `moveDown`, `sendToBack`, `bringToTop` and so on. These allow you to change the
 * display list position of the Layers children, causing it to adjust the order in which they are
 * rendered. Using `setDepth` on a child allows you to override this.
 *
 * Layers have no position or size within the Scene. This means you cannot enable a Layer for
 * physics or input, or change the position, rotation or scale of a Layer. They also have no scroll
 * factor, texture, tint, origin, crop or bounds.
 *
 * If you need those kind of features then you should use a Container instead. Containers can be added
 * to Layers, but Layers cannot be added to Containers.
 *
 * However, you can set the Alpha, Blend Mode, Depth, Mask and Visible state of a Layer. These settings
 * will impact all children being rendered by the Layer.
 *
 * @class Layer
 * @extends Phaser.Structs.List.<Phaser.GameObjects.GameObject>
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.50.0
 *
 * @extends Phaser.GameObjects.Components.AlphaSingle
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Filters
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.RenderSteps
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {Phaser.GameObjects.GameObject[]} [children] - An optional array of Game Objects to add to this Layer.
 */
var Layer = class extends List {

    static
    {
        Class.mixin(this, [
            Components.AlphaSingle,
            Components.BlendMode,
            Components.Depth,
            Components.Filters,
            Components.Mask,
            Components.RenderSteps, // This does not extend GameObject so it must mixin RenderSteps here.
            Components.Visible,
            EventEmitter,
            Render
        ], false);
    }

    constructor(scene, children)
    {
        super(scene);
        EventEmitter.call(this);

        /**
         * A reference to the Scene to which this Game Object belongs.
         *
         * Game Objects can only belong to one Scene.
         *
         * You should consider this property as being read-only. You cannot move a
         * Game Object to another Scene by simply changing it.
         *
         * @name Phaser.GameObjects.Layer#scene
         * @type {Phaser.Scene}
         * @since 3.50.0
         */
        this.scene = scene;

        /**
         * Holds a reference to the Display List that contains this Game Object.
         *
         * This is set automatically when this Game Object is added to a Scene or Layer.
         *
         * You should treat this property as being read-only.
         *
         * @name Phaser.GameObjects.Layer#displayList
         * @type {(Phaser.GameObjects.DisplayList|Phaser.GameObjects.Layer)}
         * @default null
         * @since 3.50.0
         */
        this.displayList = null;

        /**
         * A textual representation of this Game Object, i.e. `sprite`.
         * Used internally by Phaser but is available for your own custom classes to populate.
         *
         * @name Phaser.GameObjects.Layer#type
         * @type {string}
         * @since 3.50.0
         */
        this.type = 'Layer';

        /**
         * The current state of this Game Object.
         *
         * Phaser itself will never modify this value, although plugins may do so.
         *
         * Use this property to track the state of a Game Object during its lifetime. For example, it could change from
         * a state of 'moving', to 'attacking', to 'dead'. The state value should be an integer (ideally mapped to a constant
         * in your game code), or a string. These are recommended to keep it light and simple, with fast comparisons.
         * If you need to store complex data about your Game Object, look at using the Data Component instead.
         *
         * @name Phaser.GameObjects.Layer#state
         * @type {(number|string)}
         * @since 3.50.0
         */
        this.state = 0;

        /**
         * A Layer cannot be placed inside a Container.
         *
         * This property is kept purely so a Layer has the same
         * shape as a Game Object.
         *
         * @name Phaser.GameObjects.Layer#parentContainer
         * @type {Phaser.GameObjects.Container}
         * @since 3.51.0
         */
        this.parentContainer = null;

        /**
         * The name of this Game Object.
         * Empty by default and never populated by Phaser, this is left for developers to use.
         *
         * @name Phaser.GameObjects.Layer#name
         * @type {string}
         * @default ''
         * @since 3.50.0
         */
        this.name = '';

        /**
         * The active state of this Game Object.
         * A Game Object with an active state of `true` is processed by the Scenes UpdateList, if added to it.
         * An active object is one which is having its logic and internal systems updated.
         *
         * @name Phaser.GameObjects.Layer#active
         * @type {boolean}
         * @default true
         * @since 3.50.0
         */
        this.active = true;

        /**
         * The Tab Index of the Game Object.
         * Reserved for future use by plugins and the Input Manager.
         *
         * @name Phaser.GameObjects.Layer#tabIndex
         * @type {number}
         * @default -1
         * @since 3.51.0
         */
        this.tabIndex = -1;

        /**
         * A Data Manager.
         * It allows you to store, query and get key/value paired information specific to this Game Object.
         * `null` by default. Automatically created if you use `getData` or `setData` or `setDataEnabled`.
         *
         * @name Phaser.GameObjects.Layer#data
         * @type {Phaser.Data.DataManager}
         * @default null
         * @since 3.50.0
         */
        this.data = null;

        /**
         * The flags that are compared against `RENDER_MASK` to determine if this Game Object will render or not.
         * The bits are 0001 | 0010 | 0100 | 1000 set by the components Visible, Alpha, Transform and Texture respectively.
         * If those components are not used by your custom class then you can use this bitmask as you wish.
         *
         * @name Phaser.GameObjects.Layer#renderFlags
         * @type {number}
         * @default 15
         * @since 3.50.0
         */
        this.renderFlags = 15;

        /**
         * A bitmask that controls if this Game Object is drawn by a Camera or not.
         * Not usually set directly, instead call `Camera.ignore`, however you can
         * set this property directly using the Camera.id property:
         *
         * @example
         * this.cameraFilter |= camera.id
         *
         * @name Phaser.GameObjects.Layer#cameraFilter
         * @type {number}
         * @default 0
         * @since 3.50.0
         */
        this.cameraFilter = 0;

        /**
         * This property is kept purely so a Layer has the same
         * shape as a Game Object. You cannot input enable a Layer.
         *
         * @name Phaser.GameObjects.Layer#input
         * @type {?Phaser.Types.Input.InteractiveObject}
         * @default null
         * @since 3.51.0
         */
        this.input = null;

        /**
         * This property is kept purely so a Layer has the same
         * shape as a Game Object. You cannot give a Layer a physics body.
         *
         * @name Phaser.GameObjects.Layer#body
         * @type {?(Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody|MatterJS.BodyType)}
         * @default null
         * @since 3.51.0
         */
        this.body = null;

        /**
         * This Game Object will ignore all calls made to its destroy method if this flag is set to `true`.
         * This includes calls that may come from a Group, Container or the Scene itself.
         * While it allows you to persist a Game Object across Scenes, please understand you are entirely
         * responsible for managing references to and from this Game Object.
         *
         * @name Phaser.GameObjects.Layer#ignoreDestroy
         * @type {boolean}
         * @default false
         * @since 3.50.0
         */
        this.ignoreDestroy = false;

        /**
         * A reference to the Scene Systems.
         *
         * @name Phaser.GameObjects.Layer#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.50.0
         */
        this.systems = scene.sys;

        /**
         * A reference to the Scene Event Emitter.
         *
         * @name Phaser.GameObjects.Layer#events
         * @type {Phaser.Events.EventEmitter}
         * @since 3.50.0
         */
        this.events = scene.sys.events;

        /**
         * The flag the determines whether Game Objects should be sorted when `depthSort()` is called.
         *
         * @name Phaser.GameObjects.Layer#sortChildrenFlag
         * @type {boolean}
         * @default false
         * @since 3.50.0
         */
        this.sortChildrenFlag = false;

        //  Set the List callbacks
        this.addCallback = this.addChildCallback;
        this.removeCallback = this.removeChildCallback;

        this.clearAlpha();

        this.setBlendMode(BlendModes.SKIP_CHECK);

        if (children)
        {
            this.add(children);
        }

        // Initialize RenderSteps mixin.
        if (this.addRenderStep)
        {
            this.addRenderStep(this.renderWebGL);
        }

        //  Tell the Scene to re-sort the children
        scene.sys.queueDepthSort();
    }

    /**
     * Sets the `active` property of this Game Object and returns this Game Object for further chaining.
     * A Game Object with its `active` property set to `true` will be updated by the Scenes UpdateList.
     *
     * @method Phaser.GameObjects.Layer#setActive
     * @since 3.50.0
     *
     * @param {boolean} value - True if this Game Object should be set as active, false if not.
     *
     * @return {this} This GameObject.
     */
    setActive(value)
    {
        this.active = value;

        return this;
    }

    /**
     * Sets the `name` property of this Game Object and returns this Game Object for further chaining.
     * The `name` property is not populated by Phaser and is presented for your own use.
     *
     * @method Phaser.GameObjects.Layer#setName
     * @since 3.50.0
     *
     * @param {string} value - The name to be given to this Game Object.
     *
     * @return {this} This GameObject.
     */
    setName(value)
    {
        this.name = value;

        return this;
    }

    /**
     * Sets the current state of this Game Object.
     *
     * Phaser itself will never modify the State of a Game Object, although plugins may do so.
     *
     * For example, a Game Object could change from a state of 'moving', to 'attacking', to 'dead'.
     * The state value should typically be an integer (ideally mapped to a constant
     * in your game code), but could also be a string. It is recommended to keep it light and simple.
     * If you need to store complex data about your Game Object, look at using the Data Component instead.
     *
     * @method Phaser.GameObjects.Layer#setState
     * @since 3.50.0
     *
     * @param {(number|string)} value - The state of the Game Object.
     *
     * @return {this} This GameObject.
     */
    setState(value)
    {
        this.state = value;

        return this;
    }

    /**
     * Adds a Data Manager component to this Game Object.
     *
     * @method Phaser.GameObjects.Layer#setDataEnabled
     * @since 3.50.0
     * @see Phaser.Data.DataManager
     *
     * @return {this} This GameObject.
     */
    setDataEnabled()
    {
        if (!this.data)
        {
            this.data = new DataManager(this);
        }

        return this;
    }

    /**
     * Allows you to store a key value pair within this Game Objects Data Manager.
     *
     * If the Game Object has not been enabled for data (via `setDataEnabled`) then it will be enabled
     * before setting the value.
     *
     * If the key doesn't already exist in the Data Manager then it is created.
     *
     * ```javascript
     * sprite.setData('name', 'Red Gem Stone');
     * ```
     *
     * You can also pass in an object of key value pairs as the first argument:
     *
     * ```javascript
     * sprite.setData({ name: 'Red Gem Stone', level: 2, owner: 'Link', gold: 50 });
     * ```
     *
     * To get a value back again you can call `getData`:
     *
     * ```javascript
     * sprite.getData('gold');
     * ```
     *
     * Or you can access the value directly via the `values` property, where it works like any other variable:
     *
     * ```javascript
     * sprite.data.values.gold += 50;
     * ```
     *
     * When the value is first set, a `setdata` event is emitted from this Game Object.
     *
     * If the key already exists, a `changedata` event is emitted instead, along an event named after the key.
     * For example, if you updated an existing key called `PlayerLives` then it would emit the event `changedata-PlayerLives`.
     * These events will be emitted regardless if you use this method to set the value, or the direct `values` setter.
     *
     * Please note that the data keys are case-sensitive and must be valid JavaScript Object property strings.
     * This means the keys `gold` and `Gold` are treated as two unique values within the Data Manager.
     *
     * @method Phaser.GameObjects.Layer#setData
     * @since 3.50.0
     *
     * @param {(string|object)} key - The key to set the value for. Or an object of key value pairs. If an object the `data` argument is ignored.
     * @param {*} [data] - The value to set for the given key. If an object is provided as the key this argument is ignored.
     *
     * @return {this} This GameObject.
     */
    setData(key, value)
    {
        if (!this.data)
        {
            this.data = new DataManager(this);
        }

        this.data.set(key, value);

        return this;
    }

    /**
     * Increase a value for the given key within this Game Objects Data Manager. If the key doesn't already exist in the Data Manager then it is increased from 0.
     *
     * If the Game Object has not been enabled for data (via `setDataEnabled`) then it will be enabled
     * before setting the value.
     *
     * If the key doesn't already exist in the Data Manager then it is created.
     *
     * When the value is first set, a `setdata` event is emitted from this Game Object.
     *
     * @method Phaser.GameObjects.Layer#incData
     * @since 3.50.0
     *
     * @param {(string|object)} key - The key to increase the value for.
     * @param {*} [data] - The value to increase for the given key.
     *
     * @return {this} This GameObject.
     */
    incData(key, value)
    {
        if (!this.data)
        {
            this.data = new DataManager(this);
        }

        this.data.inc(key, value);

        return this;
    }

    /**
     * Toggle a boolean value for the given key within this Game Objects Data Manager. If the key doesn't already exist in the Data Manager then it is toggled from false.
     *
     * If the Game Object has not been enabled for data (via `setDataEnabled`) then it will be enabled
     * before setting the value.
     *
     * If the key doesn't already exist in the Data Manager then it is created.
     *
     * When the value is first set, a `setdata` event is emitted from this Game Object.
     *
     * @method Phaser.GameObjects.Layer#toggleData
     * @since 3.50.0
     *
     * @param {(string|object)} key - The key to toggle the value for.
     *
     * @return {this} This GameObject.
     */
    toggleData(key)
    {
        if (!this.data)
        {
            this.data = new DataManager(this);
        }

        this.data.toggle(key);

        return this;
    }

    /**
     * Retrieves the value for the given key in this Game Objects Data Manager, or undefined if it doesn't exist.
     *
     * You can also access values via the `values` object. For example, if you had a key called `gold` you can do either:
     *
     * ```javascript
     * sprite.getData('gold');
     * ```
     *
     * Or access the value directly:
     *
     * ```javascript
     * sprite.data.values.gold;
     * ```
     *
     * You can also pass in an array of keys, in which case an array of values will be returned:
     *
     * ```javascript
     * sprite.getData([ 'gold', 'armor', 'health' ]);
     * ```
     *
     * This approach is useful for destructuring arrays in ES6.
     *
     * @method Phaser.GameObjects.Layer#getData
     * @since 3.50.0
     *
     * @param {(string|string[])} key - The key of the value to retrieve, or an array of keys.
     *
     * @return {*} The value belonging to the given key, or an array of values, the order of which will match the input array.
     */
    getData(key)
    {
        if (!this.data)
        {
            this.data = new DataManager(this);
        }

        return this.data.get(key);
    }

    /**
     * A Layer cannot be enabled for input.
     *
     * This method does nothing and is kept to ensure
     * the Layer has the same shape as a Game Object.
     *
     * @method Phaser.GameObjects.Layer#setInteractive
     * @since 3.51.0
     *
     * @return {this} This GameObject.
     */
    setInteractive()
    {
        return this;
    }

    /**
     * A Layer cannot be enabled for input.
     *
     * This method does nothing and is kept to ensure
     * the Layer has the same shape as a Game Object.
     *
     * @method Phaser.GameObjects.Layer#disableInteractive
     * @since 3.51.0
     *
     * @return {this} This GameObject.
     */
    disableInteractive()
    {
        return this;
    }

    /**
     * A Layer cannot be enabled for input.
     *
     * This method does nothing and is kept to ensure
     * the Layer has the same shape as a Game Object.
     *
     * @method Phaser.GameObjects.Layer#removeInteractive
     * @since 3.51.0
     *
     * @return {this} This GameObject.
     */
    removeInteractive()
    {
        return this;
    }

    /**
     * This callback is invoked when this Game Object is added to a Scene.
     *
     * Can be overriden by custom Game Objects, but be aware of some Game Objects that
     * will use this, such as Sprites, to add themselves into the Update List.
     *
     * You can also listen for the `ADDED_TO_SCENE` event from this Game Object.
     *
     * @method Phaser.GameObjects.Layer#addedToScene
     * @since 3.50.0
     */
    addedToScene()
    {
    }

    /**
     * This callback is invoked when this Game Object is removed from a Scene.
     *
     * Can be overriden by custom Game Objects, but be aware of some Game Objects that
     * will use this, such as Sprites, to removed themselves from the Update List.
     *
     * You can also listen for the `REMOVED_FROM_SCENE` event from this Game Object.
     *
     * @method Phaser.GameObjects.Layer#removedFromScene
     * @since 3.50.0
     */
    removedFromScene()
    {
    }

    /**
     * To be overridden by custom GameObjects. Allows base objects to be used in a Pool.
     *
     * @method Phaser.GameObjects.Layer#update
     * @since 3.50.0
     *
     * @param {...*} [args] - args
     */
    update()
    {
    }

    /**
     * Returns a JSON representation of the Game Object.
     *
     * @method Phaser.GameObjects.Layer#toJSON
     * @since 3.50.0
     *
     * @return {Phaser.Types.GameObjects.JSONGameObject} A JSON representation of the Game Object.
     */
    toJSON()
    {
        return ComponentsToJSON(this);
    }

    /**
     * Compares the renderMask with the renderFlags to see if this Game Object will render or not.
     * Also checks the Game Object against the given Cameras exclusion list.
     *
     * @method Phaser.GameObjects.Layer#willRender
     * @since 3.50.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to check against this Game Object.
     *
     * @return {boolean} True if the Game Object should be rendered, otherwise false.
     */
    willRender(camera)
    {
        return !(this.renderFlags !== 15 || this.list.length === 0 || (this.cameraFilter !== 0 && (this.cameraFilter & camera.id)));
    }

    /**
     * Returns an array containing the display list index of either this Game Object, or if it has one,
     * its parent Container. It then iterates up through all of the parent containers until it hits the
     * root of the display list (which is index 0 in the returned array).
     *
     * Used internally by the InputPlugin but also useful if you wish to find out the display depth of
     * this Game Object and all of its ancestors.
     *
     * @method Phaser.GameObjects.Layer#getIndexList
     * @since 3.51.0
     *
     * @return {number[]} An array of display list position indexes.
     */
    getIndexList()
    {
        // eslint-disable-next-line consistent-this
        var child = this;
        var parent = this.parentContainer;

        var indexes = [];

        while (parent)
        {
            indexes.unshift(parent.getIndex(child));

            child = parent;

            if (!parent.parentContainer)
            {
                break;
            }
            else
            {
                parent = parent.parentContainer;
            }
        }

        indexes.unshift(this.displayList.getIndex(child));

        return indexes;
    }

    /**
     * Internal method called from `List.addCallback`.
     *
     * @method Phaser.GameObjects.Layer#addChildCallback
     * @private
     * @fires Phaser.Scenes.Events#ADDED_TO_SCENE
     * @fires Phaser.GameObjects.Events#ADDED_TO_SCENE
     * @since 3.50.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that was added to the list.
     */
    addChildCallback(gameObject)
    {
        var displayList = gameObject.displayList;

        if (displayList && displayList !== this)
        {
            gameObject.removeFromDisplayList();
        }

        if (!gameObject.displayList)
        {
            this.queueDepthSort();

            gameObject.displayList = this;

            gameObject.emit(GameObjectEvents.ADDED_TO_SCENE, gameObject, this.scene);

            this.events.emit(SceneEvents.ADDED_TO_SCENE, gameObject, this.scene);
        }
    }

    /**
     * Internal method called from `List.removeCallback`.
     *
     * @method Phaser.GameObjects.Layer#removeChildCallback
     * @private
     * @fires Phaser.Scenes.Events#REMOVED_FROM_SCENE
     * @fires Phaser.GameObjects.Events#REMOVED_FROM_SCENE
     * @since 3.50.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that was removed from the list.
     */
    removeChildCallback(gameObject)
    {
        this.queueDepthSort();

        gameObject.displayList = null;

        gameObject.emit(GameObjectEvents.REMOVED_FROM_SCENE, gameObject, this.scene);

        this.events.emit(SceneEvents.REMOVED_FROM_SCENE, gameObject, this.scene);
    }

    /**
     * Force a sort of the display list on the next call to depthSort.
     *
     * @method Phaser.GameObjects.Layer#queueDepthSort
     * @since 3.50.0
     */
    queueDepthSort()
    {
        this.sortChildrenFlag = true;
    }

    /**
     * Immediately sorts the display list if the flag is set.
     *
     * @method Phaser.GameObjects.Layer#depthSort
     * @since 3.50.0
     */
    depthSort()
    {
        if (this.sortChildrenFlag)
        {
            StableSort(this.list, this.sortByDepth);

            this.sortChildrenFlag = false;
        }
    }

    /**
     * Compare the depth of two Game Objects.
     *
     * @method Phaser.GameObjects.Layer#sortByDepth
     * @since 3.50.0
     *
     * @param {Phaser.GameObjects.GameObject} childA - The first Game Object.
     * @param {Phaser.GameObjects.GameObject} childB - The second Game Object.
     *
     * @return {number} The difference between the depths of each Game Object.
     */
    sortByDepth(childA, childB)
    {
        return childA._depth - childB._depth;
    }

    /**
     * Returns a reference to the array which contains all Game Objects in this Layer.
     *
     * This is a reference, not a copy of it, so be very careful not to mutate it.
     *
     * @method Phaser.GameObjects.Layer#getChildren
     * @since 3.50.0
     *
     * @return {Phaser.GameObjects.GameObject[]} An array of Game Objects within this Layer.
     */
    getChildren()
    {
        return this.list;
    }

    /**
     * Adds this Layer to the given Display List.
     *
     * If no Display List is specified, it will default to the Display List owned by the Scene to which
     * this Layer belongs.
     *
     * A Layer can only exist on one Display List at any given time, but may move freely between them.
     *
     * If this Layer is already on another Display List when this method is called, it will first
     * be removed from it, before being added to the new list.
     *
     * You can query which list it is on by looking at the `Phaser.GameObjects.Layer#displayList` property.
     *
     * If a Layer isn't on any display list, it will not be rendered. If you just wish to temporarily
     * disable it from rendering, consider using the `setVisible` method, instead.
     *
     * @method Phaser.GameObjects.Layer#addToDisplayList
     * @fires Phaser.Scenes.Events#ADDED_TO_SCENE
     * @fires Phaser.GameObjects.Events#ADDED_TO_SCENE
     * @since 3.60.0
     *
     * @param {(Phaser.GameObjects.DisplayList|Phaser.GameObjects.Layer)} [displayList] - The Display List to add to. Defaults to the Scene Display List.
     *
     * @return {this} This Layer instance.
     */
    addToDisplayList(displayList)
    {
        if (displayList === undefined) { displayList = this.scene.sys.displayList; }

        if (this.displayList && this.displayList !== displayList)
        {
            this.removeFromDisplayList();
        }

        //  Don't repeat if it's already on this list
        if (!displayList.exists(this))
        {
            this.displayList = displayList;

            displayList.add(this, true);

            displayList.queueDepthSort();

            this.emit(GameObjectEvents.ADDED_TO_SCENE, this, this.scene);

            displayList.events.emit(SceneEvents.ADDED_TO_SCENE, this, this.scene);
        }

        return this;
    }

    /**
     * Removes this Layer from the Display List it is currently on.
     *
     * A Layer can only exist on one Display List at any given time, but may move freely removed
     * and added back at a later stage.
     *
     * You can query which list it is on by looking at the `Phaser.GameObjects.GameObject#displayList` property.
     *
     * If a Layer isn't on any Display List, it will not be rendered. If you just wish to temporarily
     * disable it from rendering, consider using the `setVisible` method, instead.
     *
     * @method Phaser.GameObjects.Layer#removeFromDisplayList
     * @fires Phaser.Scenes.Events#REMOVED_FROM_SCENE
     * @fires Phaser.GameObjects.Events#REMOVED_FROM_SCENE
     * @since 3.60.0
     *
     * @return {this} This Layer instance.
     */
    removeFromDisplayList()
    {
        var displayList = this.displayList || this.scene.sys.displayList;

        if (displayList.exists(this))
        {
            displayList.remove(this, true);

            displayList.queueDepthSort();

            this.displayList = null;

            this.emit(GameObjectEvents.REMOVED_FROM_SCENE, this, this.scene);

            displayList.events.emit(SceneEvents.REMOVED_FROM_SCENE, this, this.scene);
        }

        return this;
    }

    /**
     * Returns a reference to the underlying display list _array_ that contains this Game Object,
     * which will be either the Scene's Display List or the internal list belonging
     * to its parent Container, if it has one.
     * 
     * If this Game Object is not on a display list or in a container, it will return `null`.
     * 
     * You should be very careful with this method, and understand that it returns a direct reference to the
     * internal array used by the Display List. Mutating this array directly can cause all kinds of subtle
     * and difficult to debug issues in your game.
     *
     * @method Phaser.GameObjects.Layer#getDisplayList
     * @since 3.88.0
     *
     * @return {?Phaser.GameObjects.GameObject[]} The internal Display List array of Game Objects, or `null`.
     */
    getDisplayList()
    {
        var list = null;

        if (this.parentContainer)
        {
            list = this.parentContainer.list;
        }
        else if (this.displayList)
        {
            list = this.displayList.list;
        }

        return list;
    }

    /**
     * Destroys this Layer removing it from the Display List and Update List and
     * severing all ties to parent resources.
     *
     * Also destroys all children of this Layer. If you do not wish for the
     * children to be destroyed, you should move them from this Layer first.
     *
     * Use this to remove this Layer from your game if you don't ever plan to use it again.
     * As long as no reference to it exists within your own code it should become free for
     * garbage collection by the browser.
     *
     * If you just want to temporarily disable an object then look at using the
     * Game Object Pool instead of destroying it, as destroyed objects cannot be resurrected.
     *
     * @method Phaser.GameObjects.Layer#destroy
     * @fires Phaser.GameObjects.Events#DESTROY
     * @since 3.50.0
     *
     * @param {boolean} [fromScene=false] - `True` if this Game Object is being destroyed by the Scene, `false` if not.
     */
    destroy(fromScene)
    {
        //  This Game Object has already been destroyed
        if (!this.scene || this.ignoreDestroy)
        {
            return;
        }

        this.emit(GameObjectEvents.DESTROY, this);

        var list = this.list;

        while (list.length)
        {
            list[0].destroy(fromScene);
        }

        this.removeAllListeners();

        if (this.displayList)
        {
            this.displayList.remove(this, true, false);

            this.displayList.queueDepthSort();
        }

        if (this.data)
        {
            this.data.destroy();

            this.data = undefined;
        }

        if (this.filterCamera)
        {
            this.filterCamera.destroy();

            this.filterCamera = undefined;
        }

        this.active = false;
        this.visible = false;

        this.list = undefined;
        this.scene = undefined;
        this.displayList = undefined;
        this.systems = undefined;
        this.events = undefined;
    }

    /**
     * Return an array listing the events for which the emitter has registered listeners.
     *
     * @method Phaser.GameObjects.Layer#eventNames
     * @since 3.50.0
     *
     * @return {Array.<string|symbol>}
     */

    /**
     * Return the listeners registered for a given event.
     *
     * @method Phaser.GameObjects.Layer#listeners
     * @since 3.50.0
     *
     * @param {(string|symbol)} event - The event name.
     *
     * @return {Function[]} The registered listeners.
     */

    /**
     * Return the number of listeners listening to a given event.
     *
     * @method Phaser.GameObjects.Layer#listenerCount
     * @since 3.50.0
     *
     * @param {(string|symbol)} event - The event name.
     *
     * @return {number} The number of listeners.
     */

    /**
     * Calls each of the listeners registered for a given event.
     *
     * @method Phaser.GameObjects.Layer#emit
     * @since 3.50.0
     *
     * @param {(string|symbol)} event - The event name.
     * @param {...*} [args] - Additional arguments that will be passed to the event handler.
     *
     * @return {boolean} `true` if the event had listeners, else `false`.
     */

    /**
     * Add a listener for a given event.
     *
     * @method Phaser.GameObjects.Layer#on
     * @since 3.50.0
     *
     * @param {(string|symbol)} event - The event name.
     * @param {function} fn - The listener function.
     * @param {*} [context=this] - The context to invoke the listener with.
     *
     * @return {this} This Layer instance.
     */

    /**
     * Add a listener for a given event.
     *
     * @method Phaser.GameObjects.Layer#addListener
     * @since 3.50.0
     *
     * @param {(string|symbol)} event - The event name.
     * @param {function} fn - The listener function.
     * @param {*} [context=this] - The context to invoke the listener with.
     *
     * @return {this} This Layer instance.
     */

    /**
     * Add a one-time listener for a given event.
     *
     * @method Phaser.GameObjects.Layer#once
     * @since 3.50.0
     *
     * @param {(string|symbol)} event - The event name.
     * @param {function} fn - The listener function.
     * @param {*} [context=this] - The context to invoke the listener with.
     *
     * @return {this} This Layer instance.
     */

    /**
     * Remove the listeners of a given event.
     *
     * @method Phaser.GameObjects.Layer#removeListener
     * @since 3.50.0
     *
     * @param {(string|symbol)} event - The event name.
     * @param {function} [fn] - Only remove the listeners that match this function.
     * @param {*} [context] - Only remove the listeners that have this context.
     * @param {boolean} [once] - Only remove one-time listeners.
     *
     * @return {this} This Layer instance.
     */

    /**
     * Remove the listeners of a given event.
     *
     * @method Phaser.GameObjects.Layer#off
     * @since 3.50.0
     *
     * @param {(string|symbol)} event - The event name.
     * @param {function} [fn] - Only remove the listeners that match this function.
     * @param {*} [context] - Only remove the listeners that have this context.
     * @param {boolean} [once] - Only remove one-time listeners.
     *
     * @return {this} This Layer instance.
     */

    /**
     * Remove all listeners, or those of the specified event.
     *
     * @method Phaser.GameObjects.Layer#removeAllListeners
     * @since 3.50.0
     *
     * @param {(string|symbol)} [event] - The event name.
     *
     * @return {this} This Layer instance.
     */

};

module.exports = Layer;
