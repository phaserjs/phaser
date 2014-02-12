/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser Group constructor.
* @class Phaser.Group
* @classdesc A Group is a container for display objects that allows for fast pooling, recycling and collision checks.
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {*} parent - The parent Group, DisplayObject or DisplayObjectContainer that this Group will be added to. If undefined or null it will use game.world.
* @param {string} [name=group] - A name for this Group. Not used internally but useful for debugging.
* @param {boolean} [addToStage=false] - If set to true this Group will be added directly to the Game.Stage instead of Game.World.
*/
Phaser.Group = function (game, parent, name, addToStage) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    if (typeof parent === 'undefined' || parent === null)
    {
        parent = game.world;
    }

    /**
    * @property {string} name - A name for this Group. Not used internally but useful for debugging.
    */
    this.name = name || 'group';

    PIXI.DisplayObjectContainer.call(this);

    if (typeof addToStage === 'undefined')
    {
        if (parent)
        {
            parent.addChild(this);
        }
        else
        {
            this.game.stage.addChild(this);
        }
    }
    else
    {
        this.game.stage.addChild(this);
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
    * @property {Phaser.Group|Phaser.Sprite} parent - The parent of this Group.
    */
    // this.group = null;

    /**
    * @property {Phaser.Point} scale - The scale of the Group container.
    */
    this.scale = new Phaser.Point(1, 1);

    /**
    * @property {Phaser.Point} pivot - The pivot point of the Group container.
    */

    /**
    * The cursor is a simple way to iterate through the objects in a Group using the Group.next and Group.previous functions.
    * The cursor is set to the first child added to the Group and doesn't change unless you call next, previous or set it directly with Group.cursor.
    * @property {any} cursor - The current display object that the Group cursor is pointing to.
    */
    this.cursor = null;

    this._cursorIndex = 0;

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

// PIXI.DisplayObjectContainer.prototype.addChildAt = function(child, index)

/**
* Adds an existing object to this Group. The object can be an instance of Phaser.Sprite, Phaser.Button or any other display object.
* The child is automatically added to the top of the Group, so renders on-top of everything else within the Group. If you need to control
* that then see the addAt method.
*
* @see Phaser.Group#create
* @see Phaser.Group#addAt
* @method Phaser.Group#add
* @param {*} child - An instance of Phaser.Sprite, Phaser.Button or any other display object..
* @return {*} The child that was added to the Group.
*/
Phaser.Group.prototype.add = function (child) {

    if (child.parent !== this)
    {
        this.addChild(child);

        if (child.events)
        {
            child.events.onAddedToGroup.dispatch(child, this);
        }
    }

    if (this.cursor === null)
    {
        this.cursor = child;
    }

    return child;

}

/**
* Adds an existing object to this Group. The object can be an instance of Phaser.Sprite, Phaser.Button or any other display object.
* The child is added to the Group at the location specified by the index value, this allows you to control child ordering.
*
* @method Phaser.Group#addAt
* @param {*} child - An instance of Phaser.Sprite, Phaser.Button or any other display object..
* @param {number} index - The index within the Group to insert the child to.
* @return {*} The child that was added to the Group.
*/
Phaser.Group.prototype.addAt = function (child, index) {

    if (child.parent !== this)
    {
        this.addChildAt(child, index);

        if (child.events)
        {
            child.events.onAddedToGroup.dispatch(child, this);
        }
    }

    if (this.cursor === null)
    {
        this.cursor = child;
    }

    return child;

}

/**
* Returns the child found at the given index within this Group.
*
* @method Phaser.Group#getAt
* @param {number} index - The index to return the child from.
* @return {*} The child that was found at the given index.
*/
Phaser.Group.prototype.getAt = function (index) {

    return this.getChildAt(index);

}

/**
* Automatically creates a new Phaser.Sprite object and adds it to the top of this Group.
* Useful if you don't need to create the Sprite instances before-hand.
*
* @method Phaser.Group#create
* @param {number} x - The x coordinate to display the newly created Sprite at. The value is in relation to the Group.x point.
* @param {number} y - The y coordinate to display the newly created Sprite at. The value is in relation to the Group.y point.
* @param {string} key - The Game.cache key of the image that this Sprite will use.
* @param {number|string} [frame] - If the Sprite image contains multiple frames you can specify which one to use here.
* @param {boolean} [exists=true] - The default exists state of the Sprite.
* @return {Phaser.Sprite} The child that was created.
*/
Phaser.Group.prototype.create = function (x, y, key, frame, exists) {

    if (typeof exists === 'undefined') { exists = true; }

    var child = new Phaser.Sprite(this.game, x, y, key, frame);

    child.exists = exists;
    child.visible = exists;
    child.alive = exists;

    this.addChild(child);
        
    if (child.events)
    {
        child.events.onAddedToGroup.dispatch(child, this);
    }

    if (this.cursor === null)
    {
        this.cursor = child;
    }

    return child;

}

/**
* Automatically creates multiple Phaser.Sprite objects and adds them to the top of this Group.
* Useful if you need to quickly generate a pool of identical sprites, such as bullets. By default the sprites will be set to not exist
* and will be positioned at 0, 0 (relative to the Group.x/y)
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

}

/**
* Advances the Group cursor to the next object in the Group. If it's at the end of the Group it wraps around to the first object.
*
* @method Phaser.Group#next
*/
Phaser.Group.prototype.next = function () {

    if (this.cursor)
    {
        //  Wrap the cursor?
        if (this._cursorIndex === this.children.length)
        {
            this._cursorIndex = 0;
        }
        else
        {
            this._cursorIndex++;
        }

        this.cursor = this.children[this._cursorIndex];
    }

}

/**
* Moves the Group cursor to the previous object in the Group. If it's at the start of the Group it wraps around to the last object.
*
* @method Phaser.Group#previous
*/
Phaser.Group.prototype.previous = function () {

    if (this.cursor)
    {
        //  Wrap the cursor?
        if (this._cursorIndex === 0)
        {
            this._cursorIndex = this.children.length - 1;
        }
        else
        {
            this._cursorIndex--;
        }

        this.cursor = this.children[this._cursorIndex];
    }

}

/**
* Swaps the position of two children in this Group. Both children must be in this Group.
* You cannot swap a child with itself, or swap un-parented children, doing so will return false.
*
* @method Phaser.Group#swap
* @param {*} child1 - The first child to swap.
* @param {*} child2 - The second child to swap.
*/
Phaser.Group.prototype.swap = function (child1, child2) {

    return this.swapChildren(child1, child2);
    
}

/**
* Brings the given child to the top of this Group so it renders above all other children.
*
* @method Phaser.Group#bringToTop
* @param {*} child - The child to bring to the top of this Group.
* @return {*} The child that was moved.
*/
Phaser.Group.prototype.bringToTop = function (child) {

    if (child.parent === this)
    {
        this.remove(child);
        this.add(child);
    }

    return child;

}

/**
* Get the index position of the given child in this Group.
*
* @method Phaser.Group#getIndex
* @param {*} child - The child to get the index for.
* @return {number} The index of the child or -1 if it's not a member of this Group.
*/
Phaser.Group.prototype.getIndex = function (child) {

    return this.children.indexOf(child);

}

/**
* Replaces a child of this Group with the given newChild. The newChild cannot be a member of this Group.
*
* @method Phaser.Group#replace
* @param {*} oldChild - The child in this Group that will be replaced.
* @param {*} newChild - The child to be inserted into this group.
*/
Phaser.Group.prototype.replace = function (oldChild, newChild) {

    var index = this.getIndex(oldChild);
    
    if (index !== -1)
    {
        if (newChild.parent !== undefined)
        {
            newChild.events.onRemovedFromGroup.dispatch(newChild, this);
            newChild.parent.removeChild(newChild);
        }

        this.removeChild(oldChild);
        this.addChildAt(newChild, index);

        newChild.events.onAddedToGroup.dispatch(newChild, this);

        if (this.cursor === oldChild)
        {
            this.cursor = newChild;
        }
    }

}

/**
* Sets the given property to the given value on the child. The operation controls the assignment of the value.
*
* @method Phaser.Group#setProperty
* @param {*} child - The child to set the property value on.
* @param {array} key - An array of strings that make up the property that will be set.
* @param {*} value - The value that will be set.
* @param {number} [operation=0] - Controls how the value is assigned. A value of 0 replaces the value with the new one. A value of 1 adds it, 2 subtracts it, 3 multiplies it and 4 divides it.
*/
Phaser.Group.prototype.setProperty = function (child, key, value, operation) {

    operation = operation || 0;

    //  As ugly as this approach looks, and although it's limited to a depth of only 4, it's extremely fast.
    //  Much faster than a for loop or object iteration. There are no checks, so if the key isn't valid then it'll fail
    //  but as you are likely to call this from inner loops that have to perform well, I'll take that trade off.

    //  0 = Equals
    //  1 = Add
    //  2 = Subtract
    //  3 = Multiply
    //  4 = Divide

    var len = key.length;

    if (len == 1)
    {
        if (operation === 0) { child[key[0]] = value; }
        else if (operation == 1) { child[key[0]] += value; }
        else if (operation == 2) { child[key[0]] -= value; }
        else if (operation == 3) { child[key[0]] *= value; }
        else if (operation == 4) { child[key[0]] /= value; }
    }
    else if (len == 2)
    {
        if (operation === 0) { child[key[0]][key[1]] = value; }
        else if (operation == 1) { child[key[0]][key[1]] += value; }
        else if (operation == 2) { child[key[0]][key[1]] -= value; }
        else if (operation == 3) { child[key[0]][key[1]] *= value; }
        else if (operation == 4) { child[key[0]][key[1]] /= value; }
    }
    else if (len == 3)
    {
        if (operation === 0) { child[key[0]][key[1]][key[2]] = value; }
        else if (operation == 1) { child[key[0]][key[1]][key[2]] += value; }
        else if (operation == 2) { child[key[0]][key[1]][key[2]] -= value; }
        else if (operation == 3) { child[key[0]][key[1]][key[2]] *= value; }
        else if (operation == 4) { child[key[0]][key[1]][key[2]] /= value; }
    }
    else if (len == 4)
    {
        if (operation === 0) { child[key[0]][key[1]][key[2]][key[3]] = value; }
        else if (operation == 1) { child[key[0]][key[1]][key[2]][key[3]] += value; }
        else if (operation == 2) { child[key[0]][key[1]][key[2]][key[3]] -= value; }
        else if (operation == 3) { child[key[0]][key[1]][key[2]][key[3]] *= value; }
        else if (operation == 4) { child[key[0]][key[1]][key[2]][key[3]] /= value; }
    }

}

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
*/
Phaser.Group.prototype.set = function (child, key, value, checkAlive, checkVisible, operation) {

    key = key.split('.');

    if (typeof checkAlive === 'undefined') { checkAlive = false; }
    if (typeof checkVisible === 'undefined') { checkVisible = false; }

    if ((checkAlive === false || (checkAlive && child.alive)) && (checkVisible === false || (checkVisible && child.visible)))
    {
        this.setProperty(child, key, value, operation);
    }

}

/**
* This function allows you to quickly set the same property across all children of this Group to a new value.
* The operation parameter controls how the new value is assigned to the property, from simple replacement to addition and multiplication.
*
* @method Phaser.Group#setAll
* @param {string} key - The property, as a string, to be set. For example: 'body.velocity.x'
* @param {*} value - The value that will be set.
* @param {boolean} [checkAlive=false] - If set then only children with alive=true will be updated.
* @param {boolean} [checkVisible=false] - If set then only children with visible=true will be updated.
* @param {number} [operation=0] - Controls how the value is assigned. A value of 0 replaces the value with the new one. A value of 1 adds it, 2 subtracts it, 3 multiplies it and 4 divides it.
*/
Phaser.Group.prototype.setAll = function (key, value, checkAlive, checkVisible, operation) {

    key = key.split('.');

    if (typeof checkAlive === 'undefined') { checkAlive = false; }
    if (typeof checkVisible === 'undefined') { checkVisible = false; }

    operation = operation || 0;

    for (var i = 0, len = this.children.length; i < len; i++)
    {
        if ((!checkAlive || (checkAlive && this.children[i].alive)) && (!checkVisible || (checkVisible && this.children[i].visible)))
        {
            this.setProperty(this.children[i], key, value, operation);
        }
    }

}

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

}

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

}

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

}

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

}

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

    var args = Array.prototype.splice.call(arguments, 2);

    for (var i = 0, len = this.children.length; i < len; i++)
    {
        if (this.children[i].exists === existsValue && this.children[i][callback])
        {
            this.children[i][callback].apply(this.children[i], args);
        }
    }

}

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

}

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

    if (typeof context === 'undefined')
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

    var args = Array.prototype.splice.call(arguments, 2);
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

}

/**
* Allows you to call your own function on each member of this Group. You must pass the callback and context in which it will run.
* After the checkExists parameter you can add as many parameters as you like, which will all be passed to the callback along with the child.
* For example: Group.forEach(awardBonusGold, this, true, 100, 500)
* Note: Currently this will skip any children which are Groups themselves.
* 
* @method Phaser.Group#forEach
* @param {function} callback - The function that will be called. Each child of the Group will be passed to it as its first parameter.
* @param {Object} callbackContext - The context in which the function should be called (usually 'this').
* @param {boolean} checkExists - If set only children with exists=true will be passed to the callback, otherwise all children will be passed.
*/
Phaser.Group.prototype.forEach = function (callback, callbackContext, checkExists) {

    if (typeof checkExists === 'undefined')
    {
        checkExists = false;
    }

    var args = Array.prototype.splice.call(arguments, 3);
    args.unshift(null);

    for (var i = 0, len = this.children.length; i < len; i++)
    {
        if (!checkExists || (checkExists && this.children[i].exists))
        {
            args[0] = this.children[i];
            callback.apply(callbackContext, args);
        }
    }

}

/**
* Allows you to call your own function on each alive member of this Group (where child.alive=true). You must pass the callback and context in which it will run.
* You can add as many parameters as you like, which will all be passed to the callback along with the child.
* For example: Group.forEachAlive(causeDamage, this, 500)
* 
* @method Phaser.Group#forEachAlive
* @param {function} callback - The function that will be called. Each child of the Group will be passed to it as its first parameter.
* @param {Object} callbackContext - The context in which the function should be called (usually 'this').
*/
Phaser.Group.prototype.forEachExists = function (callback, callbackContext) {

    var args = Array.prototype.splice.call(arguments, 2);
    args.unshift(null);

    this.iterate('exists', true, Phaser.Group.RETURN_TOTAL, callback, callbackContext, args);

}

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

    var args = Array.prototype.splice.call(arguments, 2);
    args.unshift(null);

    this.iterate('alive', true, Phaser.Group.RETURN_TOTAL, callback, callbackContext, args);

}

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

    var args = Array.prototype.splice.call(arguments, 2);
    args.unshift(null);

    this.iterate('alive', false, Phaser.Group.RETURN_TOTAL, callback, callbackContext, args);

}

/**
* Call this function to sort the group according to a particular value and order.
* For example to depth sort Sprites for Zelda-style game you might call `group.sort('y', Phaser.Group.SORT_ASCENDING)` at the bottom of your `State.update()`.
*
* @method Phaser.Group#sort
* @param {string} [index='y'] - The `string` name of the property you want to sort on.
* @param {number} [order=Phaser.Group.SORT_ASCENDING] - The `Group` constant that defines the sort order. Possible values are Phaser.Group.SORT_ASCENDING and Phaser.Group.SORT_DESCENDING.
*/
Phaser.Group.prototype.sort = function (index, order) {

    if (typeof index === 'undefined') { index = 'y'; }
    if (typeof order === 'undefined') { order = Phaser.Group.SORT_ASCENDING; }


}

Phaser.Group.prototype.sortHandler = function (a, b) {

}

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

    if (typeof callback === 'undefined')
    {
        callback = false;
    }

    var total = 0;

    for (var i = 0, len = this.children.length; i < len; i++)
    {
        if (this.children[i][key] === value)
        {
            total++;

            if (callback)
            {
                args[0] = this.children[i];
                callback.apply(callbackContext, args);
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
    else if (returnType === Phaser.Group.RETURN_CHILD)
    {
        return null;
    }

}

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

}

/**
* Call this function to retrieve the first object with alive === true in the group.
* This is handy for checking if everything has been wiped out, or choosing a squad leader, etc.
*
* @method Phaser.Group#getFirstAlive
* @return {Any} The first alive child, or null if none found.
*/
Phaser.Group.prototype.getFirstAlive = function () {

    return this.iterate('alive', true, Phaser.Group.RETURN_CHILD);

}

/**
* Call this function to retrieve the first object with alive === false in the group.
* This is handy for checking if everything has been wiped out, or choosing a squad leader, etc.
*
* @method Phaser.Group#getFirstDead
* @return {Any} The first dead child, or null if none found.
*/
Phaser.Group.prototype.getFirstDead = function () {

    return this.iterate('alive', false, Phaser.Group.RETURN_CHILD);

}

/**
* Call this function to find out how many members of the group are alive.
*
* @method Phaser.Group#countLiving
* @return {number} The number of children flagged as alive.
*/
Phaser.Group.prototype.countLiving = function () {

    return this.iterate('alive', true, Phaser.Group.RETURN_TOTAL);

}

/**
* Call this function to find out how many members of the group are dead.
*
* @method Phaser.Group#countDead
* @return {number} The number of children flagged as dead.
*/
Phaser.Group.prototype.countDead = function () {

    return this.iterate('alive', false, Phaser.Group.RETURN_TOTAL);

}

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

    return this.game.math.getRandom(this.children, startIndex, length);

}

/**
* Removes the given child from this Group and sets its group property to null.
*
* @method Phaser.Group#remove
* @param {Any} child - The child to remove.
* @return {boolean} true if the child was removed from this Group, otherwise false.
*/
Phaser.Group.prototype.remove = function (child) {

    if (this.children.length === 0)
    {
        return;
    }

    if (child.events)
    {
        child.events.onRemovedFromGroup.dispatch(child, this);
    }

    this.removeChild(child);

    if (this.cursor === child)
    {
        this.next();
    }

    return true;

}

/**
* Removes all children from this Group, setting all group properties to null.
* The Group container remains on the display list.
*
* @method Phaser.Group#removeAll
*/
Phaser.Group.prototype.removeAll = function () {

    if (this.children.length === 0)
    {
        return;
    }

    do
    {
        if (this.children[0].events)
        {
            this.children[0].events.onRemovedFromGroup.dispatch(this.children[0], this);
        }

        this.removeChild(this.children[0]);
    }
    while (this.children.length > 0);

    this.cursor = null;

}

/**
* Removes all children from this Group whos index falls beteen the given startIndex and endIndex values.
*
* @method Phaser.Group#removeBetween
* @param {number} startIndex - The index to start removing children from.
* @param {number} endIndex - The index to stop removing children from. Must be higher than startIndex and less than the length of the Group.
*/
Phaser.Group.prototype.removeBetween = function (startIndex, endIndex) {

    if (this.children.length === 0)
    {
        return;
    }

    if (startIndex > endIndex || startIndex < 0 || endIndex > this.children.length)
    {
        return false;
    }

    for (var i = startIndex; i < endIndex; i++)
    {
        if (this.children[i].events)
        {
            this.children[i].events.onRemovedFromGroup.dispatch(this.children[i], this);
        }

        this.removeChild(this.children[i]);

        if (this.cursor === child)
        {
            this.cursor = null;
        }
    }

}

/**
* Destroys this Group. Removes all children, then removes the container from the display list and nulls references.
*
* @method Phaser.Group#destroy
* @param {boolean} [destroyChildren=false] - Should every child of this Group have its destroy method called?
*/
Phaser.Group.prototype.destroy = function (destroyChildren) {

    if (typeof destroyChildren === 'undefined') { destroyChildren = false; }

    if (destroyChildren)
    {
        if (this.children.length > 0)
        {
            do
            {
                if (this.children[0].group)
                {
                    this.children[0].destroy();
                }
            }
            while (this.children.length > 0);
        }
    }
    else
    {
        this.removeAll();
    }

    this.parent.removeChild(this);

    this.game = null;

    this.exists = false;

    this.cursor = null;

}

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
