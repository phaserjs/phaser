/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BlendModes = require('../../renderer/BlendModes');
var Class = require('../../utils/Class');
var Components = require('../components');
var EventEmitter = require('eventemitter3');
var GameObject = require('../GameObject');
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
 * Layers should always be the topmost elements of any scene hierarchy.
 * They can be children of layers, but not of anything else.
 *
 * Until Phaser version 4.1.0, Layer was not a true GameObject.
 * It is now a true GameObject.
 *
 * @class Layer
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.50.0
 *
 * @extends Phaser.GameObjects.Components.AlphaSingle
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {Phaser.GameObjects.GameObject[]} [children] - An optional array of Game Objects to add to this Layer.
 */
var Layer = new Class({

    Extends: List,

    Mixins: [
        EventEmitter,
        GameObject,
        Components.AlphaSingle,
        Components.BlendMode,
        Components.Depth,
        Components.Mask,
        Components.Visible,
        Render
    ],

    initialize:

    function Layer (scene, children)
    {
        List.call(this, scene);
        EventEmitter.call(this);
        GameObject.call(this, scene, 'Layer');

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
         * The flag that determines whether Game Objects should be sorted when `depthSort()` is called.
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

        //  Tell the Scene to re-sort the children
        scene.sys.queueDepthSort();
    },

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
    setInteractive: function ()
    {
        return this;
    },

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
    disableInteractive: function ()
    {
        return this;
    },

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
    removeInteractive: function ()
    {
        return this;
    },

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
    willRender: function (camera)
    {
        return !(this.renderFlags !== 15 || this.list.length === 0 || (this.cameraFilter !== 0 && (this.cameraFilter & camera.id)));
    },

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
    addChildCallback: function (gameObject)
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
    },

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
    removeChildCallback: function (gameObject)
    {
        this.queueDepthSort();

        gameObject.displayList = null;

        gameObject.emit(GameObjectEvents.REMOVED_FROM_SCENE, gameObject, this.scene);

        this.events.emit(SceneEvents.REMOVED_FROM_SCENE, gameObject, this.scene);
    },

    /**
     * Force a sort of the display list on the next call to depthSort.
     *
     * @method Phaser.GameObjects.Layer#queueDepthSort
     * @since 3.50.0
     */
    queueDepthSort: function ()
    {
        this.sortChildrenFlag = true;
    },

    /**
     * Immediately sorts the display list if the flag is set.
     *
     * @method Phaser.GameObjects.Layer#depthSort
     * @since 3.50.0
     */
    depthSort: function ()
    {
        if (this.sortChildrenFlag)
        {
            StableSort(this.list, this.sortByDepth);

            this.sortChildrenFlag = false;
        }
    },

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
    sortByDepth: function (childA, childB)
    {
        return childA._depth - childB._depth;
    },

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
    getChildren: function ()
    {
        return this.list;
    },

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

    // --------------
    // Append type declarations from List, which won't otherwise be picked up by the type build system.
    // --------------

    /**
     * The parent of this list.
     *
     * @name Phaser.GameObjects.Layer#parent
     * @type {*}
     * @since 3.0.0
     */

    /**
     * The objects that belong to this collection.
     *
     * @name Phaser.GameObjects.Layer#list
     * @type {Array.<Phaser.GameObjects.GameObject>}
     * @default []
     * @since 3.0.0
     */

    /**
     * The index of the current element.
     *
     * This is used internally when iterating through the list with the {@link #first}, {@link #last}, {@link #next}, and {@link #previous} properties.
     *
     * @name Phaser.GameObjects.Layer#position
     * @type {number}
     * @default 0
     * @since 3.0.0
     */

    /**
     * A callback that is invoked every time a child is added to this list.
     *
     * @name Phaser.GameObjects.Layer#addCallback
     * @type {function}
     * @since 3.4.0
     */

    /**
     * A callback that is invoked every time a child is removed from this list.
     *
     * @name Phaser.GameObjects.Layer#removeCallback
     * @type {function}
     * @since 3.4.0
     */

    /**
     * The property key to sort by.
     *
     * @name Phaser.GameObjects.Layer#_sortKey
     * @type {string}
     * @since 3.4.0
     */

    /**
     * Adds the given item to the end of the list. Each item must be unique.
     *
     * @method Phaser.GameObjects.Layer#add
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject|Array.<Phaser.GameObjects.GameObject>} child - The item, or array of items, to add to the list.
     * @param {boolean} [skipCallback=false] - Skip calling the List.addCallback if this child is added successfully.
     *
     * @return {*} The list's underlying array.
     */

    /**
     * Adds an item to list, starting at a specified index. Each item must be unique within the list.
     *
     * @method Phaser.GameObjects.Layer#addAt
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject|Array.<Phaser.GameObjects.GameObject>} child - The item, or array of items, to add to the list.
     * @param {number} [index=0] - The index in the list at which the element(s) will be inserted.
     * @param {boolean} [skipCallback=false] - Skip calling the List.addCallback if this child is added successfully.
     *
     * @return {Array.<Phaser.GameObjects.GameObject>} The List's underlying array.
     */

    /**
     * Retrieves the item at a given position inside the List.
     *
     * @method Phaser.GameObjects.Layer#getAt
     * @since 3.0.0
     *
     * @param {number} index - The index of the item.
     *
     * @return {Phaser.GameObjects.GameObject|undefined} The retrieved item, or `undefined` if it's outside the List's bounds.
     */

    /**
     * Locates an item within the List and returns its index.
     *
     * @method Phaser.GameObjects.Layer#getIndex
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The item to locate.
     *
     * @return {number} The index of the item within the List, or -1 if it's not in the List.
     */

    /**
     * Sort the contents of this List so the items are in order based on the given property.
     * For example, `sort('alpha')` would sort the List contents based on the value of their `alpha` property.
     *
     * @method Phaser.GameObjects.Layer#sort
     * @since 3.0.0
     *
     * @param {string} property - The property to lexically sort by.
     * @param {function} [handler] - Provide your own custom handler function. Will receive 2 children which it should compare and return a number (negative if the first should come before the second, positive if after, zero if equal).
     *
     * @return {Phaser.GameObjects.Layer} This List object.
     */

    /**
     * Searches for the first instance of a child with its `name`
     * property matching the given argument. Should more than one child have
     * the same name only the first is returned.
     *
     * @method Phaser.GameObjects.Layer#getByName
     * @since 3.0.0
     *
     * @param {string} name - The name to search for.
     *
     * @return {?Phaser.GameObjects.GameObject} The first child with a matching name, or null if none were found.
     */

    /**
     * Returns a random child from the list.
     *
     * @method Phaser.GameObjects.Layer#getRandom
     * @since 3.0.0
     *
     * @param {number} [startIndex=0] - Offset from the front of the list (lowest child).
     * @param {number} [length=(to top)] - Restriction on the number of values you want to randomly select from.
     *
     * @return {?Phaser.GameObjects.GameObject} A random child of this List.
     */

    /**
     * Returns the first element in a given part of the List which matches a specific criterion.
     *
     * @method Phaser.GameObjects.Layer#getFirst
     * @since 3.0.0
     *
     * @param {string} property - The name of the property to test or a falsey value to have no criterion.
     * @param {Phaser.GameObjects.GameObject|undefined} value - The value to test the `property` against, or `undefined` to allow any value and only check for existence.
     * @param {number} [startIndex=0] - The position in the List to start the search at.
     * @param {number} [endIndex] - The position in the List to optionally stop the search at. It won't be checked.
     *
     * @return {?Phaser.GameObjects.GameObject} The first item which matches the given criterion, or `null` if no such item exists.
     */

    /**
     * Returns all children in this List.
     *
     * You can optionally specify a matching criteria using the `property` and `value` arguments.
     *
     * For example: `getAll('parent')` would return only children that have a property called `parent`.
     *
     * You can also specify a value to compare the property to:
     *
     * `getAll('visible', true)` would return only children that have their visible property set to `true`.
     *
     * Optionally you can specify a start and end index. For example if this List had 100 children,
     * and you set `startIndex` to 0 and `endIndex` to 50, it would return matches from only
     * the first 50 children in the List.
     *
     * @method Phaser.GameObjects.Layer#getAll
     * @since 3.0.0
     *
     * @param {string} [property] - An optional property to test against the value argument.
     * @param {any} [value] - If property is set then Child.property must strictly equal this value to be included in the results.
     * @param {number} [startIndex] - The first child index to start the search from.
     * @param {number} [endIndex] - The last child index to search up until.
     *
     * @return {Array.<Phaser.GameObjects.GameObject>} All items of the List which match the given criterion, if any.
     */

    /**
     * Returns the total number of items in the List which have a property matching the given value.
     *
     * @method Phaser.GameObjects.Layer#count
     * @since 3.0.0
     *
     * @param {string} property - The property to test on each item.
     * @param {Phaser.GameObjects.GameObject} value - The value to test the property against.
     *
     * @return {number} The total number of matching elements.
     */

    /**
     * Swaps the positions of two items in the list.
     *
     * @method Phaser.GameObjects.Layer#swap
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child1 - The first item to swap.
     * @param {Phaser.GameObjects.GameObject} child2 - The second item to swap.
     */

    /**
     * Moves an item in the List to a new position.
     *
     * @method Phaser.GameObjects.Layer#moveTo
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The item to move.
     * @param {number} index - The new position to move the item to.
     *
     * @return {Phaser.GameObjects.GameObject} The item that was moved.
     */

    /**
     * Moves an item above another one in the List.
     * If the given item is already above the other, it isn't moved.
     * Above means toward the end of the List.
     *
     * @method Phaser.GameObjects.Layer#moveAbove
     * @since 3.55.0
     *
     * @param {Phaser.GameObjects.GameObject} child1 - The element to move above base element.
     * @param {Phaser.GameObjects.GameObject} child2 - The base element.
     */

    /**
     * Moves an item below another one in the List.
     * If the given item is already below the other, it isn't moved.
     * Below means toward the start of the List.
     *
     * @method Phaser.GameObjects.Layer#moveBelow
     * @since 3.55.0
     *
     * @param {Phaser.GameObjects.GameObject} child1 - The element to move below base element.
     * @param {Phaser.GameObjects.GameObject} child2 - The base element.
     */

    /**
     * Removes one or many items from the List.
     *
     * @method Phaser.GameObjects.Layer#remove
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject|Array.<Phaser.GameObjects.GameObject>} child - The item, or array of items, to remove.
     * @param {boolean} [skipCallback=false] - Skip calling the List.removeCallback.
     *
     * @return {Phaser.GameObjects.GameObject|Array.<Phaser.GameObjects.GameObject>} The item, or array of items, which were successfully removed from the List.
     */

    /**
     * Removes the item at the given position in the List.
     *
     * @method Phaser.GameObjects.Layer#removeAt
     * @since 3.0.0
     *
     * @param {number} index - The position to remove the item from.
     * @param {boolean} [skipCallback=false] - Skip calling the List.removeCallback.
     *
     * @return {Phaser.GameObjects.GameObject} The item that was removed.
     */

    /**
     * Removes the items within the given range in the List.
     *
     * @method Phaser.GameObjects.Layer#removeBetween
     * @since 3.0.0
     *
     * @param {number} [startIndex=0] - The index to start removing from.
     * @param {number} [endIndex] - The position to stop removing at. The item at this position won't be removed.
     * @param {boolean} [skipCallback=false] - Skip calling the List.removeCallback.
     *
     * @return {Array.<Phaser.GameObjects.GameObject>} An array of the items which were removed.
     */

    /**
     * Removes all the items.
     *
     * @method Phaser.GameObjects.Layer#removeAll
     * @since 3.0.0
     *
     * @param {boolean} [skipCallback=false] - Skip calling the List.removeCallback.
     *
     * @return {this} This List object.
     */

    /**
     * Brings the given child to the top of this List.
     *
     * @method Phaser.GameObjects.Layer#bringToTop
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The item to bring to the top of the List.
     *
     * @return {Phaser.GameObjects.GameObject} The item which was moved.
     */

    /**
     * Sends the given child to the bottom of this List.
     *
     * @method Phaser.GameObjects.Layer#sendToBack
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The item to send to the back of the list.
     *
     * @return {Phaser.GameObjects.GameObject} The item which was moved.
     */

    /**
     * Moves the given child up one place in this List unless it's already at the top.
     *
     * @method Phaser.GameObjects.Layer#moveUp
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The item to move up.
     *
     * @return {Phaser.GameObjects.GameObject} The item which was moved.
     */

    /**
     * Moves the given child down one place in this List unless it's already at the bottom.
     *
     * @method Phaser.GameObjects.Layer#moveDown
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The item to move down.
     *
     * @return {Phaser.GameObjects.GameObject} The item which was moved.
     */

    /**
     * Reverses the order of all children in this List.
     *
     * @method Phaser.GameObjects.Layer#reverse
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Layer} This List object.
     */

    /**
     * Shuffles the items in the list.
     *
     * @method Phaser.GameObjects.Layer#shuffle
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Layer} This List object.
     */

    /**
     * Replaces a child of this List with the given newChild. The newChild cannot be a member of this List.
     *
     * @method Phaser.GameObjects.Layer#replace
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} oldChild - The child in this List that will be replaced.
     * @param {Phaser.GameObjects.GameObject} newChild - The child to be inserted into this List.
     *
     * @return {Phaser.GameObjects.GameObject} Returns the oldChild that was replaced within this List.
     */

    /**
     * Checks if an item exists within the List.
     *
     * @method Phaser.GameObjects.Layer#exists
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The item to check for the existence of.
     *
     * @return {boolean} `true` if the item is found in the list, otherwise `false`.
     */

    /**
     * Sets the property `key` to the given value on all members of this List.
     *
     * @method Phaser.GameObjects.Layer#setAll
     * @since 3.0.0
     *
     * @param {string} property - The name of the property to set.
     * @param {any} value - The value to set the property to.
     * @param {number} [startIndex] - The first child index to start the search from.
     * @param {number} [endIndex] - The last child index to search up until.
     */

    /**
     * Passes all children to the given callback.
     *
     * @method Phaser.GameObjects.Layer#each
     * @since 3.0.0
     *
     * @param {EachListCallback.<Phaser.GameObjects.GameObject>} callback - The function to call.
     * @param {any} [context] - Value to use as `this` when executing callback.
     * @param {...any} [args] - Additional arguments that will be passed to the callback, after the child.
     */

    /**
     * Clears the List and recreates its internal array.
     *
     * @method Phaser.GameObjects.Layer#shutdown
     * @since 3.0.0
     */

    /**
     * The number of items inside the List.
     *
     * @name Phaser.GameObjects.Layer#length
     * @type {number}
     * @readonly
     * @since 3.0.0
     */

    /**
     * The first item in the List or `null` for an empty List.
     *
     * @name Phaser.GameObjects.Layer#first
     * @type {?Phaser.GameObjects.GameObject}
     * @readonly
     * @since 3.0.0
     */

    /**
     * The last item in the List, or `null` for an empty List.
     *
     * @name Phaser.GameObjects.Layer#last
     * @type {?Phaser.GameObjects.GameObject}
     * @readonly
     * @since 3.0.0
     */

    /**
     * The next item in the List, or `null` if the entire List has been traversed.
     *
     * This property can be read successively after reading {@link #first} or manually setting the {@link #position} to iterate the List.
     *
     * @name Phaser.GameObjects.Layer#next
     * @type {?Phaser.GameObjects.GameObject}
     * @readonly
     * @since 3.0.0
     */

    /**
     * The previous item in the List, or `null` if the entire List has been traversed.
     *
     * This property can be read successively after reading {@link #last} or manually setting the {@link #position} to iterate the List backwards.
     *
     * @name Phaser.GameObjects.Layer#previous
     * @type {?Phaser.GameObjects.GameObject}
     * @readonly
     * @since 3.0.0
     */

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
    destroy: function (fromScene)
    {
        //  This Game Object has already been destroyed
        if (!this.scene || this.ignoreDestroy)
        {
            return;
        }

        GameObject.prototype.destroy.call(this, fromScene);

        var list = this.list;

        while (list.length)
        {
            list[0].destroy(fromScene);
        }

        this.list = undefined;
        this.systems = undefined;
        this.events = undefined;
    }

});

module.exports = Layer;
