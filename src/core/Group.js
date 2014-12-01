/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Group is a container for display objects that allows for fast pooling and object recycling.
* Groups can be nested within other Groups and have their own local transforms.
* 
* @class Phaser.Group
* @extends PIXI.DisplayObjectContainer
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Phaser.Group|Phaser.Sprite|null} parent - The parent Group, DisplayObject or DisplayObjectContainer that this Group will be added to. If `undefined` it will use game.world. If null it won't be added to anything.
* @param {string} [name=group] - A name for this Group. Not used internally but useful for debugging.
* @param {boolean} [addToStage=false] - If set to true this Group will be added directly to the Game.Stage instead of Game.World.
* @param {boolean} [enableBody=false] - If true all Sprites created with `Group.create` or `Group.createMulitple` will have a physics body created on them. Change the body type with physicsBodyType.
* @param {number} [physicsBodyType=0] - If enableBody is true this is the type of physics body that is created on new Sprites. Phaser.Physics.ARCADE, Phaser.Physics.P2, Phaser.Physics.NINJA, etc.
*/
Phaser.Group = function (game, parent, name, addToStage, enableBody, physicsBodyType) {

    if (typeof addToStage === 'undefined') { addToStage = false; }
    if (typeof enableBody === 'undefined') { enableBody = false; }
    if (typeof physicsBodyType === 'undefined') { physicsBodyType = Phaser.Physics.ARCADE; }

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    if (typeof parent === 'undefined')
    {
        parent = game.world;
    }

    /**
    * @property {string} name - A name for this Group. Not used internally but useful for debugging.
    */
    this.name = name || 'group';

    /**
    * @property {number} z - The z-depth value of this object within its Group (remember the World is a Group as well). No two objects in a Group can have the same z value.
    */
    this.z = 0;

    PIXI.DisplayObjectContainer.call(this);

    if (addToStage) {
        this.game.stage.addChild(this);
        this.z = this.game.stage.children.length;
    }
    else {
        if (parent) {
            parent.addChild(this);
            this.z = parent.children.length;
        }
    }

    /**
    * @property {number} type - Internal Phaser Type value.
    * @protected
    */
    this.type = Phaser.GROUP;

    /**
    * @property {boolean} alive - The alive property is useful for Groups that are children of other Groups and need to be included/excluded in checks like forEachAlive.
    * @default
    */
    this.alive = true;

    /**
    * @property {boolean} exists - If exists is true the Group is updated, otherwise it is skipped.
    * @default
    */
    this.exists = true;

    /**
    * @property {boolean} ignoreDestroy - A Group with `ignoreDestroy` set to `true` ignores all calls to its `destroy` method.
    * @default
    */
    this.ignoreDestroy = false;

    /**
    * The type of objects that will be created when you use Group.create or Group.createMultiple. Defaults to Phaser.Sprite.
    * When a new object is created it is passed the following parameters to its constructor: game, x, y, key, frame.
    * @property {object} classType
    * @default
    */
    this.classType = Phaser.Sprite;

    /**
    * @property {Phaser.Point} scale - The scale of the Group container.
    */
    this.scale = new Phaser.Point(1, 1);

    /**
    * The cursor is a simple way to iterate through the objects in a Group using the Group.next and Group.previous functions.
    * The cursor is set to the first child added to the Group and doesn't change unless you call next, previous or set it directly with Group.cursor.
    * @property {any} cursor - The current display object that the Group cursor is pointing to.
    */
    this.cursor = null;

    /**
    * @property {Phaser.Point} cameraOffset - If this object is fixedToCamera then this stores the x/y offset that its drawn at, from the top-left of the camera view.
    */
    this.cameraOffset = new Phaser.Point();

    /**
    * @property {boolean} enableBody - If true all Sprites created by, or added to this Group, will have a physics body enabled on them. Change the body type with `Group.physicsBodyType`.
    * @default
    */
    this.enableBody = enableBody;

    /**
    * @property {boolean} enableBodyDebug - If true when a physics body is created (via Group.enableBody) it will create a physics debug object as well. Only works for P2 bodies.
    */
    this.enableBodyDebug = false;

    /**
    * @property {number} physicsBodyType - If Group.enableBody is true this is the type of physics body that is created on new Sprites. Phaser.Physics.ARCADE, Phaser.Physics.P2, Phaser.Physics.NINJA, etc.
    */
    this.physicsBodyType = physicsBodyType;

    /**
    * @property {Phaser.Signal} onDestroy - This signal is dispatched if this Group is destroyed.
    */
    this.onDestroy = new Phaser.Signal();

    /**
    * @property {string} _sortProperty - The property on which children are sorted.
    * @private
    */
    this._sortProperty = 'z';

    /**
    * A small internal cache:
    * 0 = previous position.x
    * 1 = previous position.y
    * 2 = previous rotation
    * 3 = renderID
    * 4 = fresh? (0 = no, 1 = yes)
    * 5 = outOfBoundsFired (0 = no, 1 = yes)
    * 6 = exists (0 = no, 1 = yes)
    * 7 = fixed to camera (0 = no, 1 = yes)
    * 8 = cursor index
    * 9 = sort order
    * @property {Array} _cache
    * @private
    */
    this._cache = [ 0, 0, 0, 0, 1, 0, 1, 0, 0, 0 ];

};

Phaser.Group.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
Phaser.Group.prototype.constructor = Phaser.Group;

/**
* @constant
* @type {number}
*/
Phaser.Group.RETURN_NONE = 0;

/**
* @constant
* @type {number}
*/
Phaser.Group.RETURN_TOTAL = 1;

/**
* @constant
* @type {number}
*/
Phaser.Group.RETURN_CHILD = 2;

/**
* @constant
* @type {number}
*/
Phaser.Group.SORT_ASCENDING = -1;

/**
* @constant
* @type {number}
*/
Phaser.Group.SORT_DESCENDING = 1;

/**
* Adds an existing object to this Group. The object can be an instance of Phaser.Sprite, Phaser.Button or any other display object.
* The child is automatically added to the top of the Group, so renders on-top of everything else within the Group. If you need to control
* that then see the addAt method.
*
* @see Phaser.Group#create
* @see Phaser.Group#addAt
* @method Phaser.Group#add
* @param {*} child - An instance of Phaser.Sprite, Phaser.Button or any other display object.
* @param {boolean} [silent=false] - If the silent parameter is `true` the child will not dispatch the onAddedToGroup event.
* @return {*} The child that was added to the Group.
*/
Phaser.Group.prototype.add = function (child, silent) {

    if (typeof silent === 'undefined') { silent = false; }

    if (child.parent !== this)
    {
        if (this.enableBody)
        {
            this.game.physics.enable(child, this.physicsBodyType);
        }

        this.addChild(child);

        child.z = this.children.length;

        if (!silent && child.events)
        {
            child.events.onAddedToGroup$dispatch(child, this);
        }

        if (this.cursor === null)
        {
            this.cursor = child;
        }
    }

    return child;

};

/**
* Adds an array existing objects to this Group. The objects can be instances of Phaser.Sprite, Phaser.Button or any other display object.
* The children are automatically added to the top of the Group, so render on-top of everything else within the Group.
* TODO: Add ability to pass the children as parameters rather than having to be an array.
*
* @method Phaser.Group#addMultiple
* @param {array} children - An array containing instances of Phaser.Sprite, Phaser.Button or any other display object.
* @param {boolean} [silent=false] - If the silent parameter is `true` the children will not dispatch the onAddedToGroup event.
* @return {*} The array of children that were added to the Group.
*/
Phaser.Group.prototype.addMultiple = function (children, silent) {

    if (Array.isArray(children))
    {
        for (var i = 0; i < children.length; i++)
        {
            this.add(children[i], silent);
        }
    }

    return children;

};

/**
* Adds an existing object to this Group. The object can be an instance of Phaser.Sprite, Phaser.Button or any other display object.
* The child is added to the Group at the location specified by the index value, this allows you to control child ordering.
*
* @method Phaser.Group#addAt
* @param {*} child - An instance of Phaser.Sprite, Phaser.Button or any other display object..
* @param {number} index - The index within the Group to insert the child to.
* @param {boolean} [silent=false] - If the silent parameter is `true` the child will not dispatch the onAddedToGroup event.
* @return {*} The child that was added to the Group.
*/
Phaser.Group.prototype.addAt = function (child, index, silent) {

    if (typeof silent === 'undefined') { silent = false; }

    if (child.parent !== this)
    {
        if (this.enableBody)
        {
            this.game.physics.enable(child, this.physicsBodyType);
        }

        this.addChildAt(child, index);

        this.updateZ();

        if (!silent && child.events)
        {
            child.events.onAddedToGroup$dispatch(child, this);
        }

        if (this.cursor === null)
        {
            this.cursor = child;
        }
    }

    return child;

};

/**
* Returns the child found at the given index within this Group.
*
* @method Phaser.Group#getAt
* @param {number} index - The index to return the child from.
* @return {*} The child that was found at the given index. If the index was out of bounds then this will return -1.
*/
Phaser.Group.prototype.getAt = function (index) {

    if (index < 0 || index >= this.children.length)
    {
        return -1;
    }
    else
    {
        return this.getChildAt(index);
    }

};

/**
* Automatically creates a new Phaser.Sprite object and adds it to the top of this Group.
* You can change Group.classType to any object and this call will create an object of that type instead, but it should extend either Sprite or Image.
*
* @method Phaser.Group#create
* @param {number} x - The x coordinate to display the newly created Sprite at. The value is in relation to the Group.x point.
* @param {number} y - The y coordinate to display the newly created Sprite at. The value is in relation to the Group.y point.
* @param {string} key - The Game.cache key of the image that this Sprite will use.
* @param {number|string} [frame] - If the Sprite image contains multiple frames you can specify which one to use here.
* @param {boolean} [exists=true] - The default exists state of the Sprite.
* @return {Phaser.Sprite|object} The child that was created. Will be a Phaser.Sprite unless Group.classType has been changed.
*/
Phaser.Group.prototype.create = function (x, y, key, frame, exists) {

    if (typeof exists === 'undefined') { exists = true; }

    var child = new this.classType(this.game, x, y, key, frame);

    if (this.enableBody)
    {
        this.game.physics.enable(child, this.physicsBodyType, this.enableBodyDebug);
    }

    child.exists = exists;
    child.visible = exists;
    child.alive = exists;

    this.addChild(child);

    child.z = this.children.length;

    if (child.events)
    {
        child.events.onAddedToGroup$dispatch(child, this);
    }

    if (this.cursor === null)
    {
        this.cursor = child;
    }

    return child;

};

/**
* Automatically creates multiple Phaser.Sprite objects and adds them to the top of this Group.
* Useful if you need to quickly generate a pool of identical sprites, such as bullets. By default the sprites will be set to not exist
* and will be positioned at 0, 0 (relative to the Group.x/y)
* You can change Group.classType to any object and this call will create an object of that type instead, but it should extend either Sprite or Image.
*
* @method Phaser.Group#createMultiple
* @param {number} quantity - The number of Sprites to create.
* @param {string} key - The Game.cache key of the image that this Sprite will use.
* @param {number|string} [frame] - If the Sprite image contains multiple frames you can specify which one to use here.
* @param {boolean} [exists=false] - The default exists state of the Sprite.
*/
Phaser.Group.prototype.createMultiple = function (quantity, key, frame, exists) {

    if (typeof exists === 'undefined') { exists = false; }

    for (var i = 0; i < quantity; i++)
    {
        this.create(0, 0, key, frame, exists);
    }

};

/**
* Internal method that re-applies all of the childrens Z values.
*
* @method Phaser.Group#updateZ
* @protected
*/
Phaser.Group.prototype.updateZ = function () {

    var i = this.children.length;

    while (i--)
    {
        this.children[i].z = i;
    }

};

/**
* Sets the Group cursor to the first object in the Group. If the optional index parameter is given it sets the cursor to the object at that index instead.
*
* @method Phaser.Group#resetCursor
* @param {number} [index=0] - Set the cursor to point to a specific index.
* @return {*} The child the cursor now points to.
*/
Phaser.Group.prototype.resetCursor = function (index) {

    if (typeof index === 'undefined') { index = 0; }

    if (index > this.children.length - 1)
    {
        index = 0;
    }

    if (this.cursor)
    {
        this._cache[8] = index;
        this.cursor = this.children[this._cache[8]];
        return this.cursor;
    }

};

/**
* Advances the Group cursor to the next object in the Group. If it's at the end of the Group it wraps around to the first object.
*
* @method Phaser.Group#next
* @return {*} The child the cursor now points to.
*/
Phaser.Group.prototype.next = function () {

    if (this.cursor)
    {
        //  Wrap the cursor?
        if (this._cache[8] >= this.children.length - 1)
        {
            this._cache[8] = 0;
        }
        else
        {
            this._cache[8]++;
        }

        this.cursor = this.children[this._cache[8]];

        return this.cursor;
    }

};

/**
* Moves the Group cursor to the previous object in the Group. If it's at the start of the Group it wraps around to the last object.
*
* @method Phaser.Group#previous
* @return {*} The child the cursor now points to.
*/
Phaser.Group.prototype.previous = function () {

    if (this.cursor)
    {
        //  Wrap the cursor?
        if (this._cache[8] === 0)
        {
            this._cache[8] = this.children.length - 1;
        }
        else
        {
            this._cache[8]--;
        }

        this.cursor = this.children[this._cache[8]];

        return this.cursor;
    }

};

/**
* Swaps the position of two children in this Group. Both children must be in this Group.
* You cannot swap a child with itself, or swap un-parented children.
*
* @method Phaser.Group#swap
* @param {*} child1 - The first child to swap.
* @param {*} child2 - The second child to swap.
*/
Phaser.Group.prototype.swap = function (child1, child2) {

    this.swapChildren(child1, child2);
    this.updateZ();

};

/**
* Brings the given child to the top of this Group so it renders above all other children.
*
* @method Phaser.Group#bringToTop
* @param {*} child - The child to bring to the top of this Group.
* @return {*} The child that was moved.
*/
Phaser.Group.prototype.bringToTop = function (child) {

    if (child.parent === this && this.getIndex(child) < this.children.length)
    {
        this.remove(child, false, true);
        this.add(child, true);
    }

    return child;

};

/**
* Sends the given child to the bottom of this Group so it renders below all other children.
*
* @method Phaser.Group#sendToBack
* @param {*} child - The child to send to the bottom of this Group.
* @return {*} The child that was moved.
*/
Phaser.Group.prototype.sendToBack = function (child) {

    if (child.parent === this && this.getIndex(child) > 0)
    {
        this.remove(child, false, true);
        this.addAt(child, 0, true);
    }

    return child;

};

/**
* Moves the given child up one place in this Group unless it's already at the top.
*
* @method Phaser.Group#moveUp
* @param {*} child - The child to move up in the Group.
* @return {*} The child that was moved.
*/
Phaser.Group.prototype.moveUp = function (child) {

    if (child.parent === this && this.getIndex(child) < this.children.length - 1)
    {
        var a = this.getIndex(child);
        var b = this.getAt(a + 1);

        if (b)
        {
            this.swap(child, b);
        }
    }

    return child;

};

/**
* Moves the given child down one place in this Group unless it's already at the top.
*
* @method Phaser.Group#moveDown
* @param {*} child - The child to move down in the Group.
* @return {*} The child that was moved.
*/
Phaser.Group.prototype.moveDown = function (child) {

    if (child.parent === this && this.getIndex(child) > 0)
    {
        var a = this.getIndex(child);
        var b = this.getAt(a - 1);

        if (b)
        {
            this.swap(child, b);
        }
    }

    return child;

};

/**
* Positions the child found at the given index within this Group to the given x and y coordinates.
*
* @method Phaser.Group#xy
* @param {number} index - The index of the child in the Group to set the position of.
* @param {number} x - The new x position of the child.
* @param {number} y - The new y position of the child.
*/
Phaser.Group.prototype.xy = function (index, x, y) {

    if (index < 0 || index > this.children.length)
    {
        return -1;
    }
    else
    {
        this.getChildAt(index).x = x;
        this.getChildAt(index).y = y;
    }

};

/**
* Reverses all children in this Group. Note that this does not propagate, only direct children are re-ordered.
*
* @method Phaser.Group#reverse
*/
Phaser.Group.prototype.reverse = function () {

    this.children.reverse();
    this.updateZ();

};

/**
* Get the index position of the given child in this Group. This should always match the childs z property.
*
* @method Phaser.Group#getIndex
* @param {*} child - The child to get the index for.
* @return {number} The index of the child or -1 if it's not a member of this Group.
*/
Phaser.Group.prototype.getIndex = function (child) {

    return this.children.indexOf(child);

};

/**
* Replaces a child of this Group with the given newChild. The newChild cannot be a member of this Group.
*
* @method Phaser.Group#replace
* @param {*} oldChild - The child in this Group that will be replaced.
* @param {*} newChild - The child to be inserted into this Group.
* @return {*} Returns the oldChild that was replaced within this Group.
*/
Phaser.Group.prototype.replace = function (oldChild, newChild) {

    var index = this.getIndex(oldChild);

    if (index !== -1)
    {
        if (newChild.parent !== undefined)
        {
            newChild.events.onRemovedFromGroup$dispatch(newChild, this);
            newChild.parent.removeChild(newChild);

            if (newChild.parent instanceof Phaser.Group)
            {
                newChild.parent.updateZ();
            }
        }

        var temp = oldChild;

        this.remove(temp);

        this.addAt(newChild, index);

        return temp;
    }

};

/**
* Checks if the child has the given property. Will scan up to 4 levels deep only.
*
* @method Phaser.Group#hasProperty
* @param {*} child - The child to check for the existance of the property on.
* @param {array} key - An array of strings that make up the property.
* @return {boolean} True if the child has the property, otherwise false.
*/
Phaser.Group.prototype.hasProperty = function (child, key) {

    var len = key.length;

    if (len === 1 && key[0] in child)
    {
        return true;
    }
    else if (len === 2 && key[0] in child && key[1] in child[key[0]])
    {
        return true;
    }
    else if (len === 3 && key[0] in child && key[1] in child[key[0]] && key[2] in child[key[0]][key[1]])
    {
        return true;
    }
    else if (len === 4 && key[0] in child && key[1] in child[key[0]] && key[2] in child[key[0]][key[1]] && key[3] in child[key[0]][key[1]][key[2]])
    {
        return true;
    }

    return false;

};

/**
* Sets a property to the given value on the child. The operation parameter controls how the value is set.
* Operation 0 means set the existing value to the given value, or if force is `false` create a new property with the given value.
* 1 will add the given value to the value already present.
* 2 will subtract the given value from the value already present.
* 3 will multiply the value already present by the given value.
* 4 will divide the value already present by the given value.
*
* @method Phaser.Group#setProperty
* @param {*} child - The child to set the property value on.
* @param {array} key - An array of strings that make up the property that will be set.
* @param {*} value - The value that will be set.
* @param {number} [operation=0] - Controls how the value is assigned. A value of 0 replaces the value with the new one. A value of 1 adds it, 2 subtracts it, 3 multiplies it and 4 divides it.
* @param {boolean} [force=false] - If `force` is true then the property will be set on the child regardless if it already exists or not. If false and the property doesn't exist, nothing will be set.
* @return {boolean} True if the property was set, false if not.
*/
Phaser.Group.prototype.setProperty = function (child, key, value, operation, force) {

    if (typeof force === 'undefined') { force = false; }

    operation = operation || 0;

    //  As ugly as this approach looks, and although it's limited to a depth of only 4, it's much faster than a for loop or object iteration.

    //  0 = Equals
    //  1 = Add
    //  2 = Subtract
    //  3 = Multiply
    //  4 = Divide

    //  We can't force a property in and the child doesn't have it, so abort.
    //  Equally we can't add, subtract, multiply or divide a property value if it doesn't exist, so abort in those cases too.
    if (!this.hasProperty(child, key) && (!force || operation > 0))
    {
        return false;
    }

    var len = key.length;

    if (len === 1)
    {
        if (operation === 0) { child[key[0]] = value; }
        else if (operation == 1) { child[key[0]] += value; }
        else if (operation == 2) { child[key[0]] -= value; }
        else if (operation == 3) { child[key[0]] *= value; }
        else if (operation == 4) { child[key[0]] /= value; }
    }
    else if (len === 2)
    {
        if (operation === 0) { child[key[0]][key[1]] = value; }
        else if (operation == 1) { child[key[0]][key[1]] += value; }
        else if (operation == 2) { child[key[0]][key[1]] -= value; }
        else if (operation == 3) { child[key[0]][key[1]] *= value; }
        else if (operation == 4) { child[key[0]][key[1]] /= value; }
    }
    else if (len === 3)
    {
        if (operation === 0) { child[key[0]][key[1]][key[2]] = value; }
        else if (operation == 1) { child[key[0]][key[1]][key[2]] += value; }
        else if (operation == 2) { child[key[0]][key[1]][key[2]] -= value; }
        else if (operation == 3) { child[key[0]][key[1]][key[2]] *= value; }
        else if (operation == 4) { child[key[0]][key[1]][key[2]] /= value; }
    }
    else if (len === 4)
    {
        if (operation === 0) { child[key[0]][key[1]][key[2]][key[3]] = value; }
        else if (operation == 1) { child[key[0]][key[1]][key[2]][key[3]] += value; }
        else if (operation == 2) { child[key[0]][key[1]][key[2]][key[3]] -= value; }
        else if (operation == 3) { child[key[0]][key[1]][key[2]][key[3]] *= value; }
        else if (operation == 4) { child[key[0]][key[1]][key[2]][key[3]] /= value; }
    }

    return true;

};

/**
* Checks a property for the given value on the child.
*
* @method Phaser.Group#checkProperty
* @param {*} child - The child to check the property value on.
* @param {array} key - An array of strings that make up the property that will be set.
* @param {*} value - The value that will be checked.
* @param {boolean} [force=false] - If `force` is true then the property will be checked on the child regardless if it already exists or not. If true and the property doesn't exist, false will be returned.
* @return {boolean} True if the property was was equal to value, false if not.
*/
Phaser.Group.prototype.checkProperty = function (child, key, value, force) {

    if (typeof force === 'undefined') { force = false; }

    //  We can't force a property in and the child doesn't have it, so abort.
    if (!Phaser.Utils.getProperty(child, key) && force)
    {
        return false;
    }

    if (Phaser.Utils.getProperty(child, key) !== value)
    {
        return false;
    }

    return true;

};

/**
* This function allows you to quickly set a property on a single child of this Group to a new value.
* The operation parameter controls how the new value is assigned to the property, from simple replacement to addition and multiplication.
*
* @method Phaser.Group#set
* @param {Phaser.Sprite} child - The child to set the property on.
* @param {string} key - The property, as a string, to be set. For example: 'body.velocity.x'
* @param {*} value - The value that will be set.
* @param {boolean} [checkAlive=false] - If set then the child will only be updated if alive=true.
* @param {boolean} [checkVisible=false] - If set then the child will only be updated if visible=true.
* @param {number} [operation=0] - Controls how the value is assigned. A value of 0 replaces the value with the new one. A value of 1 adds it, 2 subtracts it, 3 multiplies it and 4 divides it.
* @param {boolean} [force=false] - If `force` is true then the property will be set on the child regardless if it already exists or not. If false and the property doesn't exist, nothing will be set.
* @return {boolean} True if the property was set, false if not.
*/
Phaser.Group.prototype.set = function (child, key, value, checkAlive, checkVisible, operation, force) {

    if (typeof force === 'undefined') { force = false; }

    key = key.split('.');

    if (typeof checkAlive === 'undefined') { checkAlive = false; }
    if (typeof checkVisible === 'undefined') { checkVisible = false; }

    if ((checkAlive === false || (checkAlive && child.alive)) && (checkVisible === false || (checkVisible && child.visible)))
    {
        return this.setProperty(child, key, value, operation, force);
    }

};

/**
* This function allows you to quickly set the same property across all children of this Group to a new value.
* This call doesn't descend down children, so if you have a Group inside of this Group, the property will be set on the Group but not its children.
* If you need that ability please see `Group.setAllChildren`.
*
* The operation parameter controls how the new value is assigned to the property, from simple replacement to addition and multiplication.
*
* @method Phaser.Group#setAll
* @param {string} key - The property, as a string, to be set. For example: 'body.velocity.x'
* @param {*} value - The value that will be set.
* @param {boolean} [checkAlive=false] - If set then only children with alive=true will be updated. This includes any Groups that are children.
* @param {boolean} [checkVisible=false] - If set then only children with visible=true will be updated. This includes any Groups that are children.
* @param {number} [operation=0] - Controls how the value is assigned. A value of 0 replaces the value with the new one. A value of 1 adds it, 2 subtracts it, 3 multiplies it and 4 divides it.
* @param {boolean} [force=false] - If `force` is true then the property will be set on the child regardless if it already exists or not. If false and the property doesn't exist, nothing will be set.
*/
Phaser.Group.prototype.setAll = function (key, value, checkAlive, checkVisible, operation, force) {

    if (typeof checkAlive === 'undefined') { checkAlive = false; }
    if (typeof checkVisible === 'undefined') { checkVisible = false; }
    if (typeof force === 'undefined') { force = false; }

    key = key.split('.');
    operation = operation || 0;

    for (var i = 0, len = this.children.length; i < len; i++)
    {
        if ((!checkAlive || (checkAlive && this.children[i].alive)) && (!checkVisible || (checkVisible && this.children[i].visible)))
        {
            this.setProperty(this.children[i], key, value, operation, force);
        }
    }

};

/**
* This function allows you to quickly set the same property across all children of this Group, and any child Groups, to a new value.
*
* If this Group contains other Groups then the same property is set across their children as well, iterating down until it reaches the bottom.
* Unlike with Group.setAll the property is NOT set on child Groups itself.
*
* The operation parameter controls how the new value is assigned to the property, from simple replacement to addition and multiplication.
*
* @method Phaser.Group#setAllChildren
* @param {string} key - The property, as a string, to be set. For example: 'body.velocity.x'
* @param {*} value - The value that will be set.
* @param {boolean} [checkAlive=false] - If set then only children with alive=true will be updated. This includes any Groups that are children.
* @param {boolean} [checkVisible=false] - If set then only children with visible=true will be updated. This includes any Groups that are children.
* @param {number} [operation=0] - Controls how the value is assigned. A value of 0 replaces the value with the new one. A value of 1 adds it, 2 subtracts it, 3 multiplies it and 4 divides it.
* @param {boolean} [force=false] - If `force` is true then the property will be set on the child regardless if it already exists or not. If false and the property doesn't exist, nothing will be set.
*/
Phaser.Group.prototype.setAllChildren = function (key, value, checkAlive, checkVisible, operation, force) {

    if (typeof checkAlive === 'undefined') { checkAlive = false; }
    if (typeof checkVisible === 'undefined') { checkVisible = false; }
    if (typeof force === 'undefined') { force = false; }

    operation = operation || 0;

    for (var i = 0, len = this.children.length; i < len; i++)
    {
        if ((!checkAlive || (checkAlive && this.children[i].alive)) && (!checkVisible || (checkVisible && this.children[i].visible)))
        {
            if (this.children[i] instanceof Phaser.Group)
            {
                this.children[i].setAllChildren(key, value, checkAlive, checkVisible, operation, force);
            }
            else
            {
                this.setProperty(this.children[i], key.split('.'), value, operation, force);
            }
        }
    }

};

/**
* This function allows you to quickly check that the same property across all children of this Group is equal to the given value.
* This call doesn't descend down children, so if you have a Group inside of this Group, the property will be checked on the Group but not its children.
*
* @method Phaser.Group#checkAll
* @param {string} key - The property, as a string, to be set. For example: 'body.velocity.x'
* @param {*} value - The value that will be checked.
* @param {boolean} [checkAlive=false] - If set then only children with alive=true will be checked. This includes any Groups that are children.
* @param {boolean} [checkVisible=false] - If set then only children with visible=true will be checked. This includes any Groups that are children.
* @param {boolean} [force=false] - If `force` is true then the property will be checked on the child regardless if it already exists or not. If true and the property doesn't exist, false will be returned.
*/
Phaser.Group.prototype.checkAll = function (key, value, checkAlive, checkVisible, force) {

    if (typeof checkAlive === 'undefined') { checkAlive = false; }
    if (typeof checkVisible === 'undefined') { checkVisible = false; }
    if (typeof force === 'undefined') { force = false; }

    for (var i = 0, len = this.children.length; i < len; i++)
    {
        if ((!checkAlive || (checkAlive && this.children[i].alive)) && (!checkVisible || (checkVisible && this.children[i].visible)))
        {
            if (!this.checkProperty(this.children[i], key, value, force))
            {
                return false;
            }
        }
    }

    return true;

};

/**
* Adds the amount to the given property on all children in this Group.
* Group.addAll('x', 10) will add 10 to the child.x value.
*
* @method Phaser.Group#addAll
* @param {string} property - The property to increment, for example 'body.velocity.x' or 'angle'.
* @param {number} amount - The amount to increment the property by. If child.x = 10 then addAll('x', 40) would make child.x = 50.
* @param {boolean} checkAlive - If true the property will only be changed if the child is alive.
* @param {boolean} checkVisible - If true the property will only be changed if the child is visible.
*/
Phaser.Group.prototype.addAll = function (property, amount, checkAlive, checkVisible) {

    this.setAll(property, amount, checkAlive, checkVisible, 1);

};

/**
* Subtracts the amount from the given property on all children in this Group.
* Group.subAll('x', 10) will minus 10 from the child.x value.
*
* @method Phaser.Group#subAll
* @param {string} property - The property to decrement, for example 'body.velocity.x' or 'angle'.
* @param {number} amount - The amount to subtract from the property. If child.x = 50 then subAll('x', 40) would make child.x = 10.
* @param {boolean} checkAlive - If true the property will only be changed if the child is alive.
* @param {boolean} checkVisible - If true the property will only be changed if the child is visible.
*/
Phaser.Group.prototype.subAll = function (property, amount, checkAlive, checkVisible) {

    this.setAll(property, amount, checkAlive, checkVisible, 2);

};

/**
* Multiplies the given property by the amount on all children in this Group.
* Group.multiplyAll('x', 2) will x2 the child.x value.
*
* @method Phaser.Group#multiplyAll
* @param {string} property - The property to multiply, for example 'body.velocity.x' or 'angle'.
* @param {number} amount - The amount to multiply the property by. If child.x = 10 then multiplyAll('x', 2) would make child.x = 20.
* @param {boolean} checkAlive - If true the property will only be changed if the child is alive.
* @param {boolean} checkVisible - If true the property will only be changed if the child is visible.
*/
Phaser.Group.prototype.multiplyAll = function (property, amount, checkAlive, checkVisible) {

    this.setAll(property, amount, checkAlive, checkVisible, 3);

};

/**
* Divides the given property by the amount on all children in this Group.
* Group.divideAll('x', 2) will half the child.x value.
*
* @method Phaser.Group#divideAll
* @param {string} property - The property to divide, for example 'body.velocity.x' or 'angle'.
* @param {number} amount - The amount to divide the property by. If child.x = 100 then divideAll('x', 2) would make child.x = 50.
* @param {boolean} checkAlive - If true the property will only be changed if the child is alive.
* @param {boolean} checkVisible - If true the property will only be changed if the child is visible.
*/
Phaser.Group.prototype.divideAll = function (property, amount, checkAlive, checkVisible) {

    this.setAll(property, amount, checkAlive, checkVisible, 4);

};

/**
* Calls a function on all of the children that have exists=true in this Group.
* After the existsValue parameter you can add as many parameters as you like, which will all be passed to the child callback.
*
* @method Phaser.Group#callAllExists
* @param {function} callback - The function that exists on the children that will be called.
* @param {boolean} existsValue - Only children with exists=existsValue will be called.
* @param {...*} parameter - Additional parameters that will be passed to the callback.
*/
Phaser.Group.prototype.callAllExists = function (callback, existsValue) {

    var args;
    if (arguments.length > 2)
    {
        args = [];
        for (var i = 2; i < arguments.length; i++) { args.push(arguments[i]); }
    }

    for (var i = 0, len = this.children.length; i < len; i++)
    {
        if (this.children[i].exists === existsValue && this.children[i][callback])
        {
            this.children[i][callback].apply(this.children[i], args);
        }
    }

};

/**
* Returns a reference to a function that exists on a child of the Group based on the given callback array.
*
* @method Phaser.Group#callbackFromArray
* @param {object} child - The object to inspect.
* @param {array} callback - The array of function names.
* @param {number} length - The size of the array (pre-calculated in callAll).
* @protected
*/
Phaser.Group.prototype.callbackFromArray = function (child, callback, length) {

    //  Kinda looks like a Christmas tree

    if (length == 1)
    {
        if (child[callback[0]])
        {
            return child[callback[0]];
        }
    }
    else if (length == 2)
    {
        if (child[callback[0]][callback[1]])
        {
            return child[callback[0]][callback[1]];
        }
    }
    else if (length == 3)
    {
        if (child[callback[0]][callback[1]][callback[2]])
        {
            return child[callback[0]][callback[1]][callback[2]];
        }
    }
    else if (length == 4)
    {
        if (child[callback[0]][callback[1]][callback[2]][callback[3]])
        {
            return child[callback[0]][callback[1]][callback[2]][callback[3]];
        }
    }
    else
    {
        if (child[callback])
        {
            return child[callback];
        }
    }

    return false;

};

/**
* Calls a function on all of the children regardless if they are dead or alive (see callAllExists if you need control over that)
* After the method parameter and context you can add as many extra parameters as you like, which will all be passed to the child.
*
* @method Phaser.Group#callAll
* @param {string} method - A string containing the name of the function that will be called. The function must exist on the child.
* @param {string} [context=null] - A string containing the context under which the method will be executed. Set to null to default to the child.
* @param {...*} parameter - Additional parameters that will be passed to the method.
*/
Phaser.Group.prototype.callAll = function (method, context) {

    if (typeof method === 'undefined')
    {
        return;
    }

    //  Extract the method into an array
    method = method.split('.');

    var methodLength = method.length;

    if (typeof context === 'undefined' || context === null || context === '')
    {
        context = null;
    }
    else
    {
        //  Extract the context into an array
        if (typeof context === 'string')
        {
            context = context.split('.');
            var contextLength = context.length;
        }
    }

    var args;
    if (arguments.length > 2)
    {
        args = [];
        for (var i = 2; i < arguments.length; i++) { args.push(arguments[i]); }
    }

    var callback = null;
    var callbackContext = null;

    for (var i = 0, len = this.children.length; i < len; i++)
    {
        callback = this.callbackFromArray(this.children[i], method, methodLength);

        if (context && callback)
        {
            callbackContext = this.callbackFromArray(this.children[i], context, contextLength);

            if (callback)
            {
                callback.apply(callbackContext, args);
            }
        }
        else if (callback)
        {
            callback.apply(this.children[i], args);
        }
    }

};

/**
* The core preUpdate - as called by World.
* @method Phaser.Group#preUpdate
* @protected
*/
Phaser.Group.prototype.preUpdate = function () {

    if (!this.exists || !this.parent.exists)
    {
        this.renderOrderID = -1;
        return false;
    }

    var i = this.children.length;

    while (i--)
    {
        this.children[i].preUpdate();
    }

    return true;

};

/**
* The core update - as called by World.
* @method Phaser.Group#update
* @protected
*/
Phaser.Group.prototype.update = function () {

    var i = this.children.length;

    while (i--)
    {
        this.children[i].update();
    }

};

/**
* The core postUpdate - as called by World.
* @method Phaser.Group#postUpdate
* @protected
*/
Phaser.Group.prototype.postUpdate = function () {

    //  Fixed to Camera?
    if (this._cache[7] === 1)
    {
        this.x = this.game.camera.view.x + this.cameraOffset.x;
        this.y = this.game.camera.view.y + this.cameraOffset.y;
    }

    var i = this.children.length;

    while (i--)
    {
        this.children[i].postUpdate();
    }

};


/**
* Allows you to obtain a Phaser.ArraySet of children that return true for the given predicate
* For example:
*
*     var healthyList = Group.filter(function(child, index, children) {
*         return child.health > 10 ? true : false;
*     }, true);
*     healthyList.callAll('attack');
*
* Note: Currently this will skip any children which are Groups themselves.
*
* @method Phaser.Group#filter
* @param {function} predicate - The function that each child will be evaluated against. Each child of the Group will be passed to it as its first parameter, the index as the second, and the entire child array as the third
* @param {boolean} [checkExists=false] - If set only children with exists=true will be passed to the callback, otherwise all children will be passed.
* @return {Phaser.ArraySet} Returns an array list containing all the children that the predicate returned true for
*/
Phaser.Group.prototype.filter = function (predicate, checkExists) {

    var index = -1;
    var length = this.children.length;
    var results = [];

    while (++index < length)
    {
        var child = this.children[index];

        if (!checkExists || (checkExists && child.exists))
        {
            if (predicate(child, index, this.children))
            {
                results.push(child);
            }
        }
    }

    return new Phaser.ArraySet(results);

};

/**
* Allows you to call your own function on each member of this Group. You must pass the callback and context in which it will run.
* After the checkExists parameter you can add as many parameters as you like, which will all be passed to the callback along with the child.
* For example: Group.forEach(awardBonusGold, this, true, 100, 500)
* Note: Currently this will skip any children which are Groups themselves.
*
* @method Phaser.Group#forEach
* @param {function} callback - The function that will be called. Each child of the Group will be passed to it as its first parameter.
* @param {Object} callbackContext - The context in which the function should be called (usually 'this').
* @param {boolean} [checkExists=false] - If set only children with exists=true will be passed to the callback, otherwise all children will be passed.
*/
Phaser.Group.prototype.forEach = function (callback, callbackContext, checkExists) {

    if (typeof checkExists === 'undefined') { checkExists = false; }

    if (arguments.length <= 3)
    {
        for (var i = 0, len = this.children.length; i < len; i++)
        {
            if (!checkExists || (checkExists && this.children[i].exists))
            {
                callback.call(callbackContext, this.children[i]);
            }
        }
    }
    else
    {
        // Assigning to arguments properties causes Extreme Deoptimization in Chrome, FF, and IE.
        // Using an array and pushing each element (not a slice!) is _significantly_ faster.
        var args = [null];
        for (var i = 3; i < arguments.length; i++) { args.push(arguments[i]); }

        for (var i = 0, len = this.children.length; i < len; i++)
        {
            if (!checkExists || (checkExists && this.children[i].exists))
            {
                args[0] = this.children[i];
                callback.apply(callbackContext, args);
            }
        }
    }

};

/**
* Allows you to call your own function on each member of this Group where child.exists=true. You must pass the callback and context in which it will run.
* You can add as many parameters as you like, which will all be passed to the callback along with the child.
* For example: Group.forEachExists(causeDamage, this, 500)
*
* @method Phaser.Group#forEachExists
* @param {function} callback - The function that will be called. Each child of the Group will be passed to it as its first parameter.
* @param {Object} callbackContext - The context in which the function should be called (usually 'this').
*/
Phaser.Group.prototype.forEachExists = function (callback, callbackContext) {

    var args;
    if (arguments.length > 2)
    {
        args = [null];
        for (var i = 2; i < arguments.length; i++) { args.push(arguments[i]); }
    }

    this.iterate('exists', true, Phaser.Group.RETURN_TOTAL, callback, callbackContext, args);

};

/**
* Allows you to call your own function on each alive member of this Group (where child.alive=true). You must pass the callback and context in which it will run.
* You can add as many parameters as you like, which will all be passed to the callback along with the child.
* For example: Group.forEachAlive(causeDamage, this, 500)
*
* @method Phaser.Group#forEachAlive
* @param {function} callback - The function that will be called. Each child of the Group will be passed to it as its first parameter.
* @param {Object} callbackContext - The context in which the function should be called (usually 'this').
*/
Phaser.Group.prototype.forEachAlive = function (callback, callbackContext) {

    var args;
    if (arguments.length > 2)
    {
        args = [null];
        for (var i = 2; i < arguments.length; i++) { args.push(arguments[i]); }
    }

    this.iterate('alive', true, Phaser.Group.RETURN_TOTAL, callback, callbackContext, args);

};

/**
* Allows you to call your own function on each dead member of this Group (where alive=false). You must pass the callback and context in which it will run.
* You can add as many parameters as you like, which will all be passed to the callback along with the child.
* For example: Group.forEachDead(bringToLife, this)
*
* @method Phaser.Group#forEachDead
* @param {function} callback - The function that will be called. Each child of the Group will be passed to it as its first parameter.
* @param {Object} callbackContext - The context in which the function should be called (usually 'this').
*/
Phaser.Group.prototype.forEachDead = function (callback, callbackContext) {

    var args;
    if (arguments.length > 2)
    {
        args = [null];
        for (var i = 2; i < arguments.length; i++) { args.push(arguments[i]); }
    }

    this.iterate('alive', false, Phaser.Group.RETURN_TOTAL, callback, callbackContext, args);

};

/**
* Call this function to sort the group according to a particular value and order.
* For example to depth sort Sprites for Zelda-style game you might call `group.sort('y', Phaser.Group.SORT_ASCENDING)` at the bottom of your `State.update()`.
*
* @method Phaser.Group#sort
* @param {string} [index='z'] - The `string` name of the property you want to sort on. Defaults to the objects z-depth value.
* @param {number} [order=Phaser.Group.SORT_ASCENDING] - The `Group` constant that defines the sort order. Possible values are Phaser.Group.SORT_ASCENDING and Phaser.Group.SORT_DESCENDING.
*/
Phaser.Group.prototype.sort = function (index, order) {

    if (this.children.length < 2)
    {
        //  Nothing to swap
        return;
    }

    if (typeof index === 'undefined') { index = 'z'; }
    if (typeof order === 'undefined') { order = Phaser.Group.SORT_ASCENDING; }

    this._sortProperty = index;

    if (order === Phaser.Group.SORT_ASCENDING)
    {
        this.children.sort(this.ascendingSortHandler.bind(this));
    }
    else
    {
        this.children.sort(this.descendingSortHandler.bind(this));
    }

    this.updateZ();

};

/**
* This allows you to use your own sort handler function.
* It will be sent two parameters: the two children involved in the comparison (a and b). It should return -1 if a > b, 1 if a < b or 0 if a === b.
*
* @method Phaser.Group#customSort
* @param {function} sortHandler - Your sort handler function. It will be sent two parameters: the two children involved in the comparison. It must return -1, 1 or 0.
* @param {object} context - The scope in which the sortHandler is called.
*/
Phaser.Group.prototype.customSort = function (sortHandler, context) {

    if (this.children.length < 2)
    {
        //  Nothing to swap
        return;
    }

    this.children.sort(sortHandler.bind(context));

    this.updateZ();

};

/**
* An internal helper function for the sort process.
*
* @method Phaser.Group#ascendingSortHandler
* @param {object} a - The first object being sorted.
* @param {object} b - The second object being sorted.
*/
Phaser.Group.prototype.ascendingSortHandler = function (a, b) {

    if (a[this._sortProperty] < b[this._sortProperty])
    {
        return -1;
    }
    else if (a[this._sortProperty] > b[this._sortProperty])
    {
        return 1;
    }
    else
    {
        if (a.z < b.z)
        {
            return -1;
        }
        else
        {
            return 1;
        }
    }

};

/**
* An internal helper function for the sort process.
*
* @method Phaser.Group#descendingSortHandler
* @param {object} a - The first object being sorted.
* @param {object} b - The second object being sorted.
*/
Phaser.Group.prototype.descendingSortHandler = function (a, b) {

    if (a[this._sortProperty] < b[this._sortProperty])
    {
        return 1;
    }
    else if (a[this._sortProperty] > b[this._sortProperty])
    {
        return -1;
    }
    else
    {
        return 0;
    }

};

/**
* Iterates over the children of the Group. When a child has a property matching key that equals the given value, it is considered as a match.
* Matched children can be sent to the optional callback, or simply returned or counted.
* You can add as many callback parameters as you like, which will all be passed to the callback along with the child, after the callbackContext parameter.
*
* @method Phaser.Group#iterate
* @param {string} key - The child property to check, i.e. 'exists', 'alive', 'health'
* @param {any} value - If child.key === this value it will be considered a match. Note that a strict comparison is used.
* @param {number} returnType - How to return the data from this method. Either Phaser.Group.RETURN_NONE, Phaser.Group.RETURN_TOTAL or Phaser.Group.RETURN_CHILD.
* @param {function} [callback=null] - Optional function that will be called on each matching child. Each child of the Group will be passed to it as its first parameter.
* @param {Object} [callbackContext] - The context in which the function should be called (usually 'this').
* @return {any} Returns either a numeric total (if RETURN_TOTAL was specified) or the child object.
*/
Phaser.Group.prototype.iterate = function (key, value, returnType, callback, callbackContext, args) {

    if (returnType === Phaser.Group.RETURN_TOTAL && this.children.length === 0)
    {
        return 0;
    }

    var total = 0;

    for (var i = 0, len = this.children.length; i < len; i++)
    {
        if (this.children[i][key] === value)
        {
            total++;

            if (callback)
            {
                if (args)
                {
                    args[0] = this.children[i];
                    callback.apply(callbackContext, args);
                }
                else
                {
                    callback.call(callbackContext, this.children[i]);
                }
            }

            if (returnType === Phaser.Group.RETURN_CHILD)
            {
                return this.children[i];
            }
        }
    }

    if (returnType === Phaser.Group.RETURN_TOTAL)
    {
        return total;
    }

    // RETURN_CHILD or RETURN_NONE
    return null;

};

/**
* Call this function to retrieve the first object with exists == (the given state) in the Group.
*
* @method Phaser.Group#getFirstExists
* @param {boolean} state - True or false.
* @return {Any} The first child, or null if none found.
*/
Phaser.Group.prototype.getFirstExists = function (state) {

    if (typeof state !== 'boolean')
    {
        state = true;
    }

    return this.iterate('exists', state, Phaser.Group.RETURN_CHILD);

};

/**
* Call this function to retrieve the first object with alive === true in the group.
* This is handy for checking if everything has been wiped out, or choosing a squad leader, etc.
*
* @method Phaser.Group#getFirstAlive
* @return {Any} The first alive child, or null if none found.
*/
Phaser.Group.prototype.getFirstAlive = function () {

    return this.iterate('alive', true, Phaser.Group.RETURN_CHILD);

};

/**
* Call this function to retrieve the first object with alive === false in the group.
* This is handy for checking if everything has been wiped out, or choosing a squad leader, etc.
*
* @method Phaser.Group#getFirstDead
* @return {Any} The first dead child, or null if none found.
*/
Phaser.Group.prototype.getFirstDead = function () {

    return this.iterate('alive', false, Phaser.Group.RETURN_CHILD);

};

/**
* Returns the child at the top of this Group. The top is the one being displayed (rendered) above every other child.
*
* @method Phaser.Group#getTop
* @return {Any} The child at the top of the Group.
*/
Phaser.Group.prototype.getTop = function () {

    if (this.children.length > 0)
    {
        return this.children[this.children.length - 1];
    }

};

/**
* Returns the child at the bottom of this Group. The bottom is the one being displayed (rendered) below every other child.
*
* @method Phaser.Group#getBottom
* @return {Any} The child at the bottom of the Group.
*/
Phaser.Group.prototype.getBottom = function () {

    if (this.children.length > 0)
    {
        return this.children[0];
    }

};

/**
* Call this function to find out how many members of the group are alive.
*
* @method Phaser.Group#countLiving
* @return {number} The number of children flagged as alive.
*/
Phaser.Group.prototype.countLiving = function () {

    return this.iterate('alive', true, Phaser.Group.RETURN_TOTAL);

};

/**
* Call this function to find out how many members of the group are dead.
*
* @method Phaser.Group#countDead
* @return {number} The number of children flagged as dead.
*/
Phaser.Group.prototype.countDead = function () {

    return this.iterate('alive', false, Phaser.Group.RETURN_TOTAL);

};

/**
* Returns a member at random from the group.
*
* @method Phaser.Group#getRandom
* @param {number} startIndex - Optional offset off the front of the array. Default value is 0, or the beginning of the array.
* @param {number} length - Optional restriction on the number of values you want to randomly select from.
* @return {Any} A random child of this Group.
*/
Phaser.Group.prototype.getRandom = function (startIndex, length) {

    if (this.children.length === 0)
    {
        return null;
    }

    startIndex = startIndex || 0;
    length = length || this.children.length;

    return Phaser.ArrayUtils.getRandomItem(this.children, startIndex, length);

};

/**
* Removes the given child from this Group. This will dispatch an onRemovedFromGroup event from the child (if it has one),
* reset the Group cursor and optionally destroy the child.
*
* @method Phaser.Group#remove
* @param {Any} child - The child to remove.
* @param {boolean} [destroy=false] - You can optionally call destroy on the child that was removed.
* @param {boolean} [silent=false] - If the silent parameter is `true` the child will not dispatch the onRemovedFromGroup event.
* @return {boolean} true if the child was removed from this Group, otherwise false.
*/
Phaser.Group.prototype.remove = function (child, destroy, silent) {

    if (typeof destroy === 'undefined') { destroy = false; }
    if (typeof silent === 'undefined') { silent = false; }

    if (this.children.length === 0 || this.children.indexOf(child) === -1)
    {
        return false;
    }

    if (!silent && child.events && !child.destroyPhase)
    {
        child.events.onRemovedFromGroup$dispatch(child, this);
    }

    var removed = this.removeChild(child);

    this.updateZ();

    if (this.cursor === child)
    {
        this.next();
    }

    if (destroy && removed)
    {
        removed.destroy(true);
    }

    return true;

};

/**
* Removes all children from this Group, setting the `parent` property of the children to `null`.
* The Group container remains on the display list.
*
* @method Phaser.Group#removeAll
* @param {boolean} [destroy=false] - You can optionally call destroy on each child that is removed.
* @param {boolean} [silent=false] - If the silent parameter is `true` the children will not dispatch their onRemovedFromGroup events.
*/
Phaser.Group.prototype.removeAll = function (destroy, silent) {

    if (typeof destroy === 'undefined') { destroy = false; }
    if (typeof silent === 'undefined') { silent = false; }

    if (this.children.length === 0)
    {
        return;
    }

    do
    {
        if (!silent && this.children[0].events)
        {
            this.children[0].events.onRemovedFromGroup$dispatch(this.children[0], this);
        }

        var removed = this.removeChild(this.children[0]);

        if (destroy && removed)
        {
            removed.destroy(true);
        }
    }
    while (this.children.length > 0);

    this.cursor = null;

};

/**
* Removes all children from this Group whos index falls beteen the given startIndex and endIndex values.
*
* @method Phaser.Group#removeBetween
* @param {number} startIndex - The index to start removing children from.
* @param {number} [endIndex] - The index to stop removing children at. Must be higher than startIndex. If undefined this method will remove all children between startIndex and the end of the Group.
* @param {boolean} [destroy=false] - You can optionally call destroy on the child that was removed.
* @param {boolean} [silent=false] - If the silent parameter is `true` the children will not dispatch their onRemovedFromGroup events.
*/
Phaser.Group.prototype.removeBetween = function (startIndex, endIndex, destroy, silent) {

    if (typeof endIndex === 'undefined') { endIndex = this.children.length - 1; }
    if (typeof destroy === 'undefined') { destroy = false; }
    if (typeof silent === 'undefined') { silent = false; }

    if (this.children.length === 0)
    {
        return;
    }

    if (startIndex > endIndex || startIndex < 0 || endIndex > this.children.length)
    {
        return false;
    }

    var i = endIndex;

    while (i >= startIndex)
    {
        if (!silent && this.children[i].events)
        {
            this.children[i].events.onRemovedFromGroup$dispatch(this.children[i], this);
        }

        var removed = this.removeChild(this.children[i]);

        if (destroy && removed)
        {
            removed.destroy(true);
        }

        if (this.cursor === this.children[i])
        {
            this.cursor = null;
        }

        i--;
    }

    this.updateZ();

};

/**
* Destroys this Group. Removes all children, then removes the container from the display list and nulls references.
*
* @method Phaser.Group#destroy
* @param {boolean} [destroyChildren=true] - Should every child of this Group have its destroy method called?
* @param {boolean} [soft=false] - A 'soft destroy' (set to true) doesn't remove this Group from its parent or null the game reference. Set to false and it does.
*/
Phaser.Group.prototype.destroy = function (destroyChildren, soft) {

    if (this.game === null || this.ignoreDestroy) { return; }

    if (typeof destroyChildren === 'undefined') { destroyChildren = true; }
    if (typeof soft === 'undefined') { soft = false; }

    this.onDestroy.dispatch(this, destroyChildren, soft);

    this.removeAll(destroyChildren);

    this.cursor = null;
    this.filters = null;

    if (!soft)
    {
        if (this.parent)
        {
            this.parent.removeChild(this);
        }

        this.game = null;
        this.exists = false;
    }

};

/**
* @name Phaser.Group#total
* @property {number} total - The total number of children in this Group who have a state of exists = true.
* @readonly
*/
Object.defineProperty(Phaser.Group.prototype, "total", {

    get: function () {

        return this.iterate('exists', true, Phaser.Group.RETURN_TOTAL);

    }

});

/**
* @name Phaser.Group#length
* @property {number} length - The total number of children in this Group, regardless of their exists/alive status.
* @readonly
*/
Object.defineProperty(Phaser.Group.prototype, "length", {

    get: function () {

        return this.children.length;

    }

});

/**
* The angle of rotation of the Group container. This will adjust the Group container itself by modifying its rotation.
* This will have no impact on the rotation value of its children, but it will update their worldTransform and on-screen position.
* @name Phaser.Group#angle
* @property {number} angle - The angle of rotation given in degrees, where 0 degrees = to the right.
*/
Object.defineProperty(Phaser.Group.prototype, "angle", {

    get: function() {
        return Phaser.Math.radToDeg(this.rotation);
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(value);
    }

});

/**
* A Group that is fixed to the camera uses its x/y coordinates as offsets from the top left of the camera. These are stored in Group.cameraOffset.
* Note that the cameraOffset values are in addition to any parent in the display list.
* So if this Group was in a Group that has x: 200, then this will be added to the cameraOffset.x
*
* @name Phaser.Group#fixedToCamera
* @property {boolean} fixedToCamera - Set to true to fix this Group to the Camera at its current world coordinates.
*/
Object.defineProperty(Phaser.Group.prototype, "fixedToCamera", {

    get: function () {

        return !!this._cache[7];

    },

    set: function (value) {

        if (value)
        {
            this._cache[7] = 1;
            this.cameraOffset.set(this.x, this.y);
        }
        else
        {
            this._cache[7] = 0;
        }
    }

});

//  Documentation stubs

/**
* The x coordinate of the Group container. You can adjust the Group container itself by modifying its coordinates.
* This will have no impact on the x/y coordinates of its children, but it will update their worldTransform and on-screen position.
* @name Phaser.Group#x
* @property {number} x - The x coordinate of the Group container.
*/

/**
* The y coordinate of the Group container. You can adjust the Group container itself by modifying its coordinates.
* This will have no impact on the x/y coordinates of its children, but it will update their worldTransform and on-screen position.
* @name Phaser.Group#y
* @property {number} y - The y coordinate of the Group container.
*/

/**
* The angle of rotation of the Group container. This will adjust the Group container itself by modifying its rotation.
* This will have no impact on the rotation value of its children, but it will update their worldTransform and on-screen position.
* @name Phaser.Group#rotation
* @property {number} rotation - The angle of rotation given in radians.
*/

/**
* @name Phaser.Group#visible
* @property {boolean} visible - The visible state of the Group. Non-visible Groups and all of their children are not rendered.
*/

/**
* @name Phaser.Group#alpha
* @property {number} alpha - The alpha value of the Group container.
*/
