/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/
/**
* The Children Component features quick access to Group sorting related methods.
*
* @class
*/
export default class Children {
    gameObject: any;
    position: number;
    list: any;
    children: any;
    constructor(gameObject: any);
    add(child: any, skipTransform?: boolean): any;
    addAt(child: any, index?: number, skipTransform?: boolean): any;
    addMultiple(children: any, skipTransform: any): any;
    getAt(index: any): any;
    getIndex(child: any): any;
    /**
    * Gets the first item from the set based on the property strictly equaling the value given.
    * Returns null if not found.
    *
    * @method Phaser.ArraySet#getByKey
    * @param {string} property - The property to check against the value.
    * @param {any} value - The value to check if the property strictly equals.
    * @return {any} The item that was found, or null if nothing matched.
    */
    getByKey(property: any, value: any): any;
    /**
    * Searches the Group for the first instance of a child with the `name`
    * property matching the given argument. Should more than one child have
    * the same name only the first instance is returned.
    *
    * @method Phaser.Group#getByName
    * @param {string} name - The name to search for.
    * @return {any} The first child with a matching name, or null if none were found.
    */
    getByName(name: any): any;
    /**
    * Returns a random child from the group.
    *
    * @method Phaser.Group#getRandom
    * @param {integer} [startIndex=0] - Offset from the front of the group (lowest child).
    * @param {integer} [length=(to top)] - Restriction on the number of values you want to randomly select from.
    * @return {any} A random child of this Group.
    */
    getRandom(startIndex: any, length: any): any;
    /**
    * Returns all children in this Group.
    *
    * You can optionally specify a matching criteria using the `property` and `value` arguments.
    *
    * For example: `getAll('exists', true)` would return only children that have their exists property set.
    *
    * Optionally you can specify a start and end index. For example if this Group had 100 children,
    * and you set `startIndex` to 0 and `endIndex` to 50, it would return matches from only
    * the first 50 children in the Group.
    *
    * @method Phaser.Group#getAll
    * @param {string} [property] - An optional property to test against the value argument.
    * @param {any} [value] - If property is set then Child.property must strictly equal this value to be included in the results.
    * @param {integer} [startIndex=0] - The first child index to start the search from.
    * @param {integer} [endIndex] - The last child index to search up until.
    * @return {any} A random existing child of this Group.
    */
    getAll(property: any, value: any, startIndex: any, endIndex: any): any[];
    swap(child1: any, child2: any): void;
    moveTo(child: any, index: any): any;
    remove(child: any, skipTransform?: any): any;
    removeAt(index: any, skipTransform: any): any;
    removeBetween(beginIndex: any, endIndex: any): any;
    /**
    * Removes all the items.
    *
    * @method Phaser.ArraySet#removeAll
    */
    removeAll(): this;
    contains(child: any): any;
    /**
    * Brings the given child to the top of this group so it renders above all other children.
    *
    * @method Phaser.Group#bringToTop
    * @param {any} child - The child to bring to the top of this group.
    * @return {any} The child that was moved.
    */
    bringToTop(child: any): any;
    /**
    * Sends the given child to the bottom of this group so it renders below all other children.
    *
    * @method Phaser.Group#sendToBack
    * @param {any} child - The child to send to the bottom of this group.
    * @return {any} The child that was moved.
    */
    sendToBack(child: any): any;
    /**
    * Moves the given child up one place in this group unless it's already at the top.
    *
    * @method Phaser.Group#moveUp
    * @param {any} child - The child to move up in the group.
    * @return {any} The child that was moved.
    */
    moveUp(child: any): any;
    /**
    * Moves the given child down one place in this group unless it's already at the bottom.
    *
    * @method Phaser.Group#moveDown
    * @param {any} child - The child to move down in the group.
    * @return {any} The child that was moved.
    */
    moveDown(child: any): any;
    /**
    * Reverses all children in this group.
    *
    * This operation applies only to immediate children and does not propagate to subgroups.
    *
    * @method Phaser.Group#reverse
    */
    reverse(): this;
    shuffle(): this;
    /**
    * Replaces a child of this Group with the given newChild. The newChild cannot be a member of this Group.
    *
    * If `Group.enableBody` is set, then a physics body will be created on the object, so long as one does not already exist.
    *
    * If `Group.inputEnableChildren` is set, then an Input Handler will be created on the object, so long as one does not already exist.
    *
    * @method Phaser.Group#replace
    * @param {any} oldChild - The child in this group that will be replaced.
    * @param {any} newChild - The child to be inserted into this group.
    * @return {any} Returns the oldChild that was replaced within this group.
    */
    replace(oldChild: any, newChild: any, skipTransform: any): any;
    exchange(child1: any, child2: any, skipTransform: any): void;
    /**
    * Checks for the item within this list.
    *
    * @method Phaser.ArraySet#exists
    * @param {any} item - The element to get the list index for.
    * @return {boolean} True if the item is found in the list, otherwise false.
    */
    exists(child: any): boolean;
    /**
    * Sets the property `key` to the given value on all members of this list.
    *
    * @method Phaser.ArraySet#setAll
    * @param {any} key - The property of the item to set.
    * @param {any} value - The value to set the property to.
    */
    setAll(key: any, value: any): void;
    /**
    * Passes all children to the given callback.
    *
    * @method each
    * @param {function} callback - The function to call.
    * @param {object} [thisArg] - Value to use as `this` when executing callback.
    * @param {...*} [arguments] - Additional arguments that will be passed to the callback, after the child.
    */
    each(callback: any, thisArg: any): void;
    /**
    * Moves all children from this Group to the Group given.
    *
    * @method Phaser.Group#moveAll
    * @param {Phaser.Group} group - The new Group to which the children will be moved to.
    * @param {boolean} [silent=false] - If true the children will not dispatch the `onAddedToGroup` event for the new Group.
    * @return {Phaser.Group} The Group to which all the children were moved.
    */
    reparent(newParent: any): any;
    /**
    * Returns the first item and resets the cursor to the start.
    *
    * @name Phaser.ArraySet#first
    * @property {any} first
    */
    readonly length: any;
    /**
    * Returns the first item and resets the cursor to the start.
    *
    * @name Phaser.ArraySet#first
    * @property {any} first
    */
    readonly first: any;
    /**
    * Returns the last item and resets the cursor to the end.
    *
    * @name Phaser.ArraySet#last
    * @property {any} last
    */
    readonly last: any;
    /**
    * Returns the the next item (based on the cursor) and advances the cursor.
    *
    * @name Phaser.ArraySet#next
    * @property {any} next
    */
    readonly next: any;
    /**
    * Returns the the previous item (based on the cursor) and retreats the cursor.
    *
    * @name Phaser.ArraySet#previous
    * @property {any} previous
    */
    readonly previous: any;
}
