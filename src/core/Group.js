/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser Group constructor.
* @class Phaser.Group
* @classdesc A Group is a container for display objects that allows for fast pooling, recycling and collision checks.
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {*} parent - The parent Group or DisplayObjectContainer that will hold this group, if any.
* @param {string} [name=group] - A name for this Group. Not used internally but useful for debugging.
* @param {boolean} [useStage=false] - Should the DisplayObjectContainer this Group creates be added to the World (default, false) or direct to the Stage (true).
*/
Phaser.Group = function (game, parent, name, useStage) {

	if (typeof parent === 'undefined')
	{
		parent = game.world;
	}

	if (typeof useStage === 'undefined')
	{
		useStage = false;
	}

    /**
	* @property {Phaser.Game} game - A reference to the currently running Game.
	*/
	this.game = game;
	
    /**
	* @property {string} name - A name for this Group. Not used internally but useful for debugging.
	*/
	this.name = name || 'group';

	if (useStage)
	{
		this._container = this.game.stage._stage;
	}
	else
	{
		this._container = new PIXI.DisplayObjectContainer();
		this._container.name = this.name;

		if (parent)
		{
			if (parent instanceof Phaser.Group)
			{
				parent._container.addChild(this._container);
				parent._container.updateTransform();
			}
			else
			{
				parent.addChild(this._container);
				parent.updateTransform();
			}
		}
		else
		{
			this.game.stage._stage.addChild(this._container);
			this.game.stage._stage.updateTransform();
		}
	}

	/**
	* @property {number} type - Internal Phaser Type value.
	* @protected
	*/
	this.type = Phaser.GROUP;

	/**
	* @property {boolean} exists - If exists is true the the Group is updated, otherwise it is skipped.
	* @default
	*/
	this.exists = true;

    /**
    * @property {Phaser.Point} scale - Replaces the PIXI.Point with a slightly more flexible one.
    */ 
    this.scale = new Phaser.Point(1, 1);

};

Phaser.Group.prototype = {

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
	add: function (child) {

		if (child.group !== this)
		{
			child.group = this;

			if (child.events)
			{
				child.events.onAddedToGroup.dispatch(child, this);
			}

			this._container.addChild(child);

			child.updateTransform();
		}

		return child;

	},

    /**
    * Adds an existing object to this Group. The object can be an instance of Phaser.Sprite, Phaser.Button or any other display object.
    * The child is added to the Group at the location specified by the index value, this allows you to control child ordering.
	*
    * @method Phaser.Group#addAt
	* @param {*} child - An instance of Phaser.Sprite, Phaser.Button or any other display object..
	* @param {number} index - The index within the Group to insert the child to.
	* @return {*} The child that was added to the Group.
	*/
	addAt: function (child, index) {

		if (child.group !== this)
		{
			child.group = this;

			if (child.events)
			{
				child.events.onAddedToGroup.dispatch(child, this);
			}

			this._container.addChildAt(child, index);

			child.updateTransform();
		}

		return child;

	},

    /**
	* Returns the child found at the given index within this Group.
	*
    * @method Phaser.Group#getAt
    * @memberof Phaser.Group
	* @param {number} index - The index to return the child from.
	* @return {*} The child that was found at the given index.
	*/
	getAt: function (index) {

		return this._container.getChildAt(index);

	},

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
	create: function (x, y, key, frame, exists) {

		if (typeof exists == 'undefined') { exists = true; }

		var child = new Phaser.Sprite(this.game, x, y, key, frame);

		child.group = this;
		child.exists = exists;
		child.visible = exists;
		child.alive = exists;

		if (child.events)
		{
			child.events.onAddedToGroup.dispatch(child, this);
		}

		this._container.addChild(child);
			
		child.updateTransform();

		return child;

	},

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
	createMultiple: function (quantity, key, frame, exists) {

		if (typeof exists == 'undefined') { exists = false; }

		for (var i = 0; i < quantity; i++)
		{
			var child = new Phaser.Sprite(this.game, 0, 0, key, frame);

			child.group = this;
			child.exists = exists;
			child.visible = exists;
			child.alive = exists;

			if (child.events)
			{
				child.events.onAddedToGroup.dispatch(child, this);
			}

			this._container.addChild(child);
			child.updateTransform();

		}

	},

	/**
	* Swaps the position of two children in this Group.
	*
    * @method Phaser.Group#swap
	* @param {*} child1 - The first child to swap.
	* @param {*} child2 - The second child to swap.
    * @return {boolean} True if the swap was successful, otherwise false.
	*/
	swap: function (child1, child2) {

		if (child1 === child2 || !child1.parent || !child2.parent)
		{
			console.warn('You cannot swap a child with itself or swap un-parented children');
			return false;
		}

		//	Cache the values
		var child1Prev = child1._iPrev;
		var child1Next = child1._iNext;
		var child2Prev = child2._iPrev;
		var child2Next = child2._iNext;

		var endNode = this._container.last._iNext;
		var currentNode = this.game.stage._stage;
			
		do
		{
			if (currentNode !== child1 && currentNode !== child2)
			{
				if (currentNode.first === child1)
				{
					currentNode.first = child2;
				}
				else if (currentNode.first === child2)
				{
					currentNode.first = child1;
				}

				if (currentNode.last === child1)
				{
					currentNode.last = child2;
				}
				else if (currentNode.last === child2)
				{
					currentNode.last = child1;
				}
			}

			currentNode = currentNode._iNext;
		}
		while (currentNode != endNode)

		if (child1._iNext == child2)
		{
			//	This is a downward (A to B) neighbour swap
			child1._iNext = child2Next;
			child1._iPrev = child2;
			child2._iNext = child1;
			child2._iPrev = child1Prev;

			if (child1Prev) { child1Prev._iNext = child2; }
			if (child2Next) { child2Next._iPrev = child1; }

			if (child1.__renderGroup)
			{
				child1.__renderGroup.updateTexture(child1);
			}

			if (child2.__renderGroup)
			{
				child2.__renderGroup.updateTexture(child2);
			}

			return true;
		}
		else if (child2._iNext == child1)
		{
			//	This is an upward (B to A) neighbour swap
			child1._iNext = child2;
			child1._iPrev = child2Prev;
			child2._iNext = child1Next;
			child2._iPrev = child1;

			if (child2Prev) { child2Prev._iNext = child1; }
			if (child1Next) { child2Next._iPrev = child2; }

			if (child1.__renderGroup)
			{
				child1.__renderGroup.updateTexture(child1);
			}

			if (child2.__renderGroup)
			{
				child2.__renderGroup.updateTexture(child2);
			}

			return true;
		}
		else
		{
			//	Children are far apart
			child1._iNext = child2Next;
			child1._iPrev = child2Prev;
			child2._iNext = child1Next;
			child2._iPrev = child1Prev;

			if (child1Prev) { child1Prev._iNext = child2; }
			if (child1Next) { child1Next._iPrev = child2; }
			if (child2Prev) { child2Prev._iNext = child1; }
			if (child2Next) { child2Next._iPrev = child1; }

			if (child1.__renderGroup)
			{
				child1.__renderGroup.updateTexture(child1);
			}

			if (child2.__renderGroup)
			{
				child2.__renderGroup.updateTexture(child2);
			}

			return true;
		}

		return false;
		
	},

	/**
	* Brings the given child to the top of this Group so it renders above all other children.
	*
    * @method Phaser.Group#bringToTop
	* @param {*} child - The child to bring to the top of this Group.
    * @return {*} The child that was moved.
	*/
	bringToTop: function (child) {

		if (child.group === this)
		{
			this.remove(child);
			this.add(child);
		}

		return child;

	},

	/**
	* Get the index position of the given child in this Group.
	*
    * @method Phaser.Group#getIndex
	* @param {*} child - The child to get the index for.
    * @return {number} The index of the child or -1 if it's not a member of this Group.
	*/
	getIndex: function (child) {

		return this._container.children.indexOf(child);

	},

	/**
	* Replaces a child of this Group with the given newChild. The newChild cannot be a member of this Group.
	*
    * @method Phaser.Group#replace
	* @param {*} oldChild - The child in this Group that will be replaced.
	* @param {*} newChild - The child to be inserted into this group.
	*/
	replace: function (oldChild, newChild) {

		if (!this._container.first._iNext)
		{
			return;
		}

		var index = this.getIndex(oldChild);
		
		if (index != -1)
		{
			if (newChild.parent != undefined)
			{
				newChild.events.onRemovedFromGroup.dispatch(newChild, this);
				newChild.parent.removeChild(newChild);
			}

			this._container.removeChild(oldChild);
			this._container.addChildAt(newChild, index);
			newChild.events.onAddedToGroup.dispatch(newChild, this);
			newChild.updateTransform();
		}

	},

	/**
     * Sets the given property to the given value on the child. The operation controls the assignment of the value.
     *
     * @method Phaser.Group#setProperty
     * @param {*} child - The child to set the property value on.
     * @param {array} key - An array of strings that make up the property that will be set.
     * @param {*} value - The value that will be set.
     * @param {number} [operation=0] - Controls how the value is assigned. A value of 0 replaces the value with the new one. A value of 1 adds it, 2 subtracts it, 3 multiplies it and 4 divides it.
     */
	setProperty: function (child, key, value, operation) {

		operation = operation || 0;

		//	As ugly as this approach looks, and although it's limited to a depth of only 4, it's extremely fast.
		//	Much faster than a for loop or object iteration. There are no checks, so if the key isn't valid then it'll fail
		//	but as you are likely to call this from inner loops that have to perform well, I'll take that trade off.

		//	0 = Equals
		//	1 = Add
		//	2 = Subtract
		//	3 = Multiply
		//	4 = Divide

		if (key.length == 1)
		{
			if (operation == 0) { child[key[0]] = value; }
			else if (operation == 1) { child[key[0]] += value; }
			else if (operation == 2) { child[key[0]] -= value; }
			else if (operation == 3) { child[key[0]] *= value; }
			else if (operation == 4) { child[key[0]] /= value; }
		}
		else if (key.length == 2)
		{
			if (operation == 0) { child[key[0]][key[1]] = value; }
			else if (operation == 1) { child[key[0]][key[1]] += value; }
			else if (operation == 2) { child[key[0]][key[1]] -= value; }
			else if (operation == 3) { child[key[0]][key[1]] *= value; }
			else if (operation == 4) { child[key[0]][key[1]] /= value; }
		}
		else if (key.length == 3)
		{
			if (operation == 0) { child[key[0]][key[1]][key[2]] = value; }
			else if (operation == 1) { child[key[0]][key[1]][key[2]] += value; }
			else if (operation == 2) { child[key[0]][key[1]][key[2]] -= value; }
			else if (operation == 3) { child[key[0]][key[1]][key[2]] *= value; }
			else if (operation == 4) { child[key[0]][key[1]][key[2]] /= value; }
		}
		else if (key.length == 4)
		{
			if (operation == 0) { child[key[0]][key[1]][key[2]][key[3]] = value; }
			else if (operation == 1) { child[key[0]][key[1]][key[2]][key[3]] += value; }
			else if (operation == 2) { child[key[0]][key[1]][key[2]][key[3]] -= value; }
			else if (operation == 3) { child[key[0]][key[1]][key[2]][key[3]] *= value; }
			else if (operation == 4) { child[key[0]][key[1]][key[2]][key[3]] /= value; }
		}
		else
		{
			//	TODO - Deep property scane
		}

	},

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
	setAll: function (key, value, checkAlive, checkVisible, operation) {

		key = key.split('.');

		if (typeof checkAlive === 'undefined') { checkAlive = false; }
		if (typeof checkVisible === 'undefined') { checkVisible = false; }

		operation = operation || 0;

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if ((checkAlive == false || (checkAlive && currentNode.alive)) && (checkVisible == false || (checkVisible && currentNode.visible)))
				{
					this.setProperty(currentNode, key, value, operation);
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext)
		}

	},

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
	addAll: function (property, amount, checkAlive, checkVisible) {

		this.setAll(property, amount, checkAlive, checkVisible, 1);

	},

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
	subAll: function (property, amount, checkAlive, checkVisible) {

		this.setAll(property, amount, checkAlive, checkVisible, 2);

	},

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
	multiplyAll: function (property, amount, checkAlive, checkVisible) {

		this.setAll(property, amount, checkAlive, checkVisible, 3);

	},

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
	divideAll: function (property, amount, checkAlive, checkVisible) {

		this.setAll(property, amount, checkAlive, checkVisible, 4);

	},

	/**
    * Calls a function on all of the children that have exists=true in this Group.
    * After the existsValue parameter you can add as many parameters as you like, which will all be passed to the child callback.
    * 
    * @method Phaser.Group#callAllExists
    * @param {function} callback - The function that exists on the children that will be called.
    * @param {boolean} existsValue - Only children with exists=existsValue will be called.
    * @param {...*} parameter - Additional parameters that will be passed to the callback.
    */
	callAllExists: function (callback, existsValue) {

		var args = Array.prototype.splice.call(arguments, 2);

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (currentNode.exists == existsValue && currentNode[callback])
				{
					currentNode[callback].apply(currentNode, args);
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext)

		}

	},

	/**
    * Calls a function on all of the children regardless if they are dead or alive (see callAllExists if you need control over that)
    * After the callback parameter you can add as many extra parameters as you like, which will all be passed to the child.
    * 
    * @method Phaser.Group#callAll
    * @param {function} callback - The function that exists on the children that will be called.
    * @param {...*} parameter - Additional parameters that will be passed to the callback.
    */
	callAll: function (callback) {

		var args = Array.prototype.splice.call(arguments, 1);

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (currentNode[callback])
				{
					currentNode[callback].apply(currentNode, args);
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext)

		}

	},

	/**
	* Allows you to call your own function on each member of this Group. You must pass the callback and context in which it will run.
   	* After the checkExists parameter you can add as many parameters as you like, which will all be passed to the callback along with the child.
   	* For example: Group.forEach(awardBonusGold, this, true, 100, 500)
	* 
	* @method Phaser.Group#forEach
	* @param {function} callback - The function that will be called. Each child of the Group will be passed to it as its first parameter.
    * @param {Object} callbackContext - The context in which the function should be called (usually 'this').
    * @param {boolean} checkExists - If set only children with exists=true will be passed to the callback, otherwise all children will be passed.
	*/
	forEach: function (callback, callbackContext, checkExists) {

		if (typeof checkExists === 'undefined')
		{
			checkExists = false;
		}

		var args = Array.prototype.splice.call(arguments, 3);
		args.unshift(null);

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (checkExists == false || (checkExists && currentNode.exists))
				{
					args[0] = currentNode;
					callback.apply(callbackContext, args);
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);

		}

	},

	/**
	* Allows you to call your own function on each alive member of this Group (where child.alive=true). You must pass the callback and context in which it will run.
   	* You can add as many parameters as you like, which will all be passed to the callback along with the child.
   	* For example: Group.forEachAlive(causeDamage, this, 500)
	* 
	* @method Phaser.Group#forEachAlive
	* @param {function} callback - The function that will be called. Each child of the Group will be passed to it as its first parameter.
    * @param {Object} callbackContext - The context in which the function should be called (usually 'this').
	*/
	forEachAlive: function (callback, callbackContext) {

		var args = Array.prototype.splice.call(arguments, 2);
		args.unshift(null);

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (currentNode.alive)
				{
					args[0] = currentNode;
					callback.apply(callbackContext, args);
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);

		}

	},

	/**
	* Allows you to call your own function on each dead member of this Group (where alive=false). You must pass the callback and context in which it will run.
   	* You can add as many parameters as you like, which will all be passed to the callback along with the child.
   	* For example: Group.forEachDead(bringToLife, this)
	* 
	* @method Phaser.Group#forEachDead
	* @param {function} callback - The function that will be called. Each child of the Group will be passed to it as its first parameter.
    * @param {Object} callbackContext - The context in which the function should be called (usually 'this').
	*/
	forEachDead: function (callback, callbackContext) {

		var args = Array.prototype.splice.call(arguments, 2);
		args.unshift(null);

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (currentNode.alive == false)
				{
					args[0] = currentNode;
					callback.apply(callbackContext, args);
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);

		}
	},

	/**
    * Call this function to retrieve the first object with exists == (the given state) in the Group.
    *
    * @method Phaser.Group#getFirstExists
    * @param {boolean} state - True or false.
    * @return {Any} The first child, or null if none found.
    */
	getFirstExists: function (state) {

		if (typeof state !== 'boolean')
		{
			state = true;
		}

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (currentNode.exists === state)
				{
					return currentNode;
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);
		}

		return null;

	},

	/**
    * Call this function to retrieve the first object with alive == true in the group.
    * This is handy for checking if everything has been wiped out, or choosing a squad leader, etc.
    *
    * @method Phaser.Group#getFirstAlive
    * @return {Any} The first alive child, or null if none found.
    */
	getFirstAlive: function () {

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (currentNode.alive)
				{
					return currentNode;
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);
		}

		return null;

	},

	/**
    * Call this function to retrieve the first object with alive == false in the group.
    * This is handy for checking if everything has been wiped out, or choosing a squad leader, etc.
    *
    * @method Phaser.Group#getFirstDead
    * @return {Any} The first dead child, or null if none found.
    */
	getFirstDead: function () {

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (!currentNode.alive)
				{
					return currentNode;
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);
		}

		return null;

	},

	/**
    * Call this function to find out how many members of the group are alive.
    *
    * @method Phaser.Group#countLiving
    * @return {number} The number of children flagged as alive. Returns -1 if Group is empty.
    */
	countLiving: function () {

		var total = 0;

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (currentNode.alive)
				{
					total++;
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);
		}
		else
		{
			total = -1;
		}

		return total;

	},

	/**
    * Call this function to find out how many members of the group are dead.
    *
    * @method Phaser.Group#countDead
    * @return {number} The number of children flagged as dead. Returns -1 if Group is empty.
    */
	countDead: function () {

		var total = 0;

		if (this._container.children.length > 0 && this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (!currentNode.alive)
				{
					total++;
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);
		}
		else
		{
			total = -1;
		}

		return total;

	},

	/**
    * Returns a member at random from the group.
    *
    * @method Phaser.Group#getRandom
    * @param {number} startIndex - Optional offset off the front of the array. Default value is 0, or the beginning of the array.
    * @param {number} length - Optional restriction on the number of values you want to randomly select from.
    * @return {Any} A random child of this Group.
    */
	getRandom: function (startIndex, length) {

		if (this._container.children.length == 0)
		{
			return null;
		}

		startIndex = startIndex || 0;
		length = length || this._container.children.length;

        return this.game.math.getRandom(this._container.children, startIndex, length);

	},

	/**
	* Removes the given child from this Group and sets its group property to null.
	*
	* @method Phaser.Group#remove
	* @param {Any} child - The child to remove.
	*/
	remove: function (child) {

		if (child.events)
		{
			child.events.onRemovedFromGroup.dispatch(child, this);
		}

		this._container.removeChild(child);

		child.group = null;

	},

	/**
	* Removes all children from this Group, setting all group properties to null.
	* The Group container remains on the display list.
	*
	* @method Phaser.Group#removeAll
	*/
	removeAll: function () {

		if (this._container.children.length == 0)
		{
			return;
		}

		do
		{
			if (this._container.children[0].events)
			{
				this._container.children[0].events.onRemovedFromGroup.dispatch(this._container.children[0], this);
			}
			this._container.removeChild(this._container.children[0]);
		}
		while (this._container.children.length > 0);

	},

	/**
	* Removes all children from this Group whos index falls beteen the given startIndex and endIndex values.
	*
	* @method Phaser.Group#removeBetween
	* @param {number} startIndex - The index to start removing children from.
	* @param {number} endIndex - The index to stop removing children from. Must be higher than startIndex and less than the length of the Group.
	*/	
	removeBetween: function (startIndex, endIndex) {

		if (this._container.children.length == 0)
		{
			return;
		}

		if (startIndex > endIndex || startIndex < 0 || endIndex > this._container.children.length)
		{
			return false;
		}

		for (var i = startIndex; i < endIndex; i++)
		{
			var child = this._container.children[i];
			child.events.onRemovedFromGroup.dispatch(child, this);
			this._container.removeChild(child);
		}

	},

	/**
	* Destroys this Group. Removes all children, then removes the container from the display list and nulls references.
	*
	* @method Phaser.Group#destroy
	*/
	destroy: function () {

		this.removeAll();

		this._container.parent.removeChild(this._container);

		this._container = null;

		this.game = null;

		this.exists = false;

	},

	/**
	* Dumps out a list of Group children and their index positions to the browser console. Useful for group debugging.
	*
	* @method Phaser.Group#dump
	* @param {boolean} [full=false] - If full the dump will include the entire display list, start from the Stage. Otherwise it will only include this container.
	*/
	dump: function (full) {

		if (typeof full == 'undefined')
		{
			full = false;
		}

		var spacing = 20;
		var output = "\n" + Phaser.Utils.pad('Node', spacing) + "|" + Phaser.Utils.pad('Next', spacing) + "|" + Phaser.Utils.pad('Previous', spacing) + "|" + Phaser.Utils.pad('First', spacing) + "|" + Phaser.Utils.pad('Last', spacing);

		console.log(output);

		var output = Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing);
		console.log(output);

		if (full)
		{
			var testObject = this.game.stage._stage.last._iNext;
			var displayObject = this.game.stage._stage;
		}
		else
		{
			var testObject = this._container.last._iNext;
			var displayObject = this._container;
		}
		
		do	
		{
			var name = displayObject.name || '*';
			var nameNext = '-';
			var namePrev = '-';
			var nameFirst = '-';
			var nameLast = '-';

			if (displayObject._iNext)
			{
				nameNext = displayObject._iNext.name;
			}

			if (displayObject._iPrev)
			{
				namePrev = displayObject._iPrev.name;
			}

			if (displayObject.first)
			{
				nameFirst = displayObject.first.name;
			}

			if (displayObject.last)
			{
				nameLast = displayObject.last.name;
			}

			if (typeof nameNext === 'undefined')
			{
				nameNext = '-';
			}

			if (typeof namePrev === 'undefined')
			{
				namePrev = '-';
			}

			if (typeof nameFirst === 'undefined')
			{
				nameFirst = '-';
			}

			if (typeof nameLast === 'undefined')
			{
				nameLast = '-';
			}

			var output = Phaser.Utils.pad(name, spacing) + "|" + Phaser.Utils.pad(nameNext, spacing) + "|" + Phaser.Utils.pad(namePrev, spacing) + "|" + Phaser.Utils.pad(nameFirst, spacing) + "|" + Phaser.Utils.pad(nameLast, spacing);
			console.log(output);

			displayObject = displayObject._iNext;

		}
		while(displayObject != testObject)

	}

};

/**
* @name Phaser.Group#total
* @property {number} total - The total number of children in this Group, regardless of their alive state.
* @readonly
*/
Object.defineProperty(Phaser.Group.prototype, "total", {

    get: function () {
        return this._container.children.length;
    }

});

/**
* @name Phaser.Group#length
* @property {number} length - The number of children in this Group.
* @readonly
*/
Object.defineProperty(Phaser.Group.prototype, "length", {

    get: function () {
        return this._container.children.length;
    }

});

/**
* The x coordinate of the Group container. You can adjust the Group container itself by modifying its coordinates.
* This will have no impact on the x/y coordinates of its children, but it will update their worldTransform and on-screen position.
* @name Phaser.Group#x
* @property {number} x - The x coordinate of the Group container.
*/
Object.defineProperty(Phaser.Group.prototype, "x", {

    get: function () {
        return this._container.position.x;
    },

    set: function (value) {
        this._container.position.x = value;
    }

});

/**
* The y coordinate of the Group container. You can adjust the Group container itself by modifying its coordinates.
* This will have no impact on the x/y coordinates of its children, but it will update their worldTransform and on-screen position.
* @name Phaser.Group#y
* @property {number} y - The y coordinate of the Group container.
*/
Object.defineProperty(Phaser.Group.prototype, "y", {

    get: function () {
        return this._container.position.y;
    },

    set: function (value) {
        this._container.position.y = value;
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
        return Phaser.Math.radToDeg(this._container.rotation);
    },

    set: function(value) {
        this._container.rotation = Phaser.Math.degToRad(value);
    }

});

/**
* The angle of rotation of the Group container. This will adjust the Group container itself by modifying its rotation.
* This will have no impact on the rotation value of its children, but it will update their worldTransform and on-screen position.
* @name Phaser.Group#rotation
* @property {number} rotation - The angle of rotation given in radians.
*/
Object.defineProperty(Phaser.Group.prototype, "rotation", {

    get: function () {
        return this._container.rotation;
    },

    set: function (value) {
        this._container.rotation = value;
    }

});

/**
* @name Phaser.Group#visible
* @property {boolean} visible - The visible state of the Group. Non-visible Groups and all of their children are not rendered.
*/
Object.defineProperty(Phaser.Group.prototype, "visible", {

    get: function () {
        return this._container.visible;
    },

    set: function (value) {
        this._container.visible = value;
    }

});

/**
* @name Phaser.Group#alpha
* @property {number} alpha - The alpha value of the Group container.
*/
Object.defineProperty(Phaser.Group.prototype, "alpha", {

    get: function () {
        return this._container.alpha;
    },

    set: function (value) {
        this._container.alpha = value;
    }

});
