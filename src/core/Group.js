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
* @param {Description} parent - Description.
* @param {string} name - The unique name for this animation, used in playback commands.
* @param {boolean} useStage - Description.
*/
Phaser.Group = function (game, parent, name, useStage) {

	parent = parent || null;

	if (typeof useStage == 'undefined')
	{
		useStage = false;
	}

    /**
	* @property {Phaser.Game} game - A reference to the currently running Game.
	*/
	this.game = game;
	
    /**
	* @property {Phaser.Game} name - Description.
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
			}
			else
			{
				parent.addChild(this._container);
			}
		}
		else
		{
			this.game.stage._stage.addChild(this._container);
		}
	}

	/**
	* @property {Description} type - Description.
	*/
	this.type = Phaser.GROUP;

	/**
	* @property {boolean} exists - Description.
	* @default
	*/
	this.exists = true;

	/**
	* @property {string} _sortIndex - Helper for sort.
	* @private
	* @default
	*/
    this._sortIndex = 'y';
	
};

Phaser.Group.prototype = {

    /**
    * Description.
    *
    * @method Phaser.Group#add
	* @param {Description} child - Description.
	* @return {Description} Description.
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
		}

		return child;

	},

    /**
	* Description.
	*
    * @method Phaser.Group#addAt
	* @param {Description} child - Description.
	* @param {Description} index - Description.
    * @return {Description} Description.
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
		}

		return child;

	},

    /**
	* Description.
	*
    * @method Phaser.Group#getAt
    * @memberof Phaser.Group
	* @param {Description} index - Description.
    * @return {Description} Description.
	*/
	getAt: function (index) {

		return this._container.getChildAt(index);

	},

    /**
	* Description.
	*
    * @method Phaser.Group#create
	* @param {number} x - Description.
	* @param {number} y - Description.
	* @param {string} key - Description.
	* @param {string} [frame] - Description.
	* @param {boolean} [exists] - Description.
    * @return {Description} Description.
	*/
	create: function (x, y, key, frame, exists) {

		if (typeof exists == 'undefined') { exists = true; }

		var child = new Phaser.Sprite(this.game, x, y, key, frame);

		child.group = this;
		child.exists = exists;

		if (child.events)
		{
			child.events.onAddedToGroup.dispatch(child, this);
		}

		this._container.addChild(child);

		return child;

	},

	/**
	* Description.
	*
    * @method Phaser.Group#swap
	* @param {Description} child1 - Description.
	* @param {Description} child2 - Description.
    * @return {boolean} Description.
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
	* Description.
	*
    * @method Phaser.Group#bringToTop
	* @param {Description} child - Description.
    * @return {Description} Description.
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
	* Description.
	*
    * @method Phaser.Group#getIndex
	* @param {Description} child - Description.
    * @return {Description} Description.
	*/
	getIndex: function (child) {

		return this._container.children.indexOf(child);

	},

	/**
	* Description.
	*
    * @method Phaser.Group#replace
	* @param {Description} oldChild - Description.
	* @param {Description} newChild - Description.
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
		}

	},

	/**
     * Description.
     *
     * @method Phaser.Group#setProperty
     * @param {Description} child - Description.
     * @param {array} key - An array of values that will be set.
     * @param {Description} value - Description.
     * @param {Description} operation - Description.
     * @return {number} An integer value: -1 (Obj1 before Obj2), 0 (same), or 1 (Obj1 after Obj2). (TODO)
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
     * Description.
     *
     * @method Phaser.Group#setAll
     * @param {Description} key - Description.
     * @param {Description} value - Description.
     * @param {Description} checkAlive - Description.
     * @param {Description} checkVisible - Description.
     * @param {Description} operation - Description.
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
	* Description.
   	* After the checkExists parameter you can add as many parameters as you like, which will all be passed to the callback along with the child.
	* 
	* @method Phaser.Group#forEach
	* @param {Description} callback - Description.
    * @param {Description} callbackContext - Description.
    * @param {boolean} checkExists - Description.
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
	* Description.
	* 
	* @method Phaser.Group#forEachAlive
	* @param {Description} callback - Description.
    * @param {Description} callbackContext - Description.
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
	* Description.
	* 
	* @method Phaser.Group#forEachDead
	* @param {Description} callback - Description.
    * @param {Description} callbackContext - Description.
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
    * Call this function to retrieve the first object with exists == (the given state) in the group.
    *
    * @method Phaser.Group#getFirstExists
    * @param {Description} state - Description.
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
    * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
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
    * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
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

		var total = -1;

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

		return total;

	},

	/**
    * Call this function to find out how many members of the group are dead.
    *
    * @method Phaser.Group#countDead
    * @return {number} The number of children flagged as dead. Returns -1 if Group is empty.
    */
	countDead: function () {

		var total = -1;

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
	* Description.
	*
	* @method Phaser.Group#remove
	* @param {Description} child - Description.
	*/
	remove: function (child) {

		child.events.onRemovedFromGroup.dispatch(child, this);
		this._container.removeChild(child);
		child.group = null;

	},

	/**
	* Description.
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
	* Description.
	*
	* @method Phaser.Group#removeBetween
	* @param {Description} startIndex - Description.
	* @param {Description} endIndex - Description.
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
	* Description.
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
	* Description.
	*
	* @method Phaser.Group#dump
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
* @name Phaser.Group#length
* @property {number} length - The number of children in this Group.
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
