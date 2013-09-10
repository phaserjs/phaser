Phaser.Group = function (game, parent, name) {

	parent = parent || null;

	this.game = game;
	this.name = name || 'group';

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
		this.game.world.add(this._container);
	}

	this.exists = true;

    /**
    * Helper for sort.
    */
    this._sortIndex = 'y';
	
};

Phaser.Group.prototype = {

	add: function (child) {

		if (child.group !== this)
		{
			child.group = this;
			child.events.onAddedToGroup.dispatch(child, this);
			this._container.addChild(child);
		}

		return child;

	},

	addAt: function (child, index) {

		if (child.group !== this)
		{
			child.group = this;
			child.events.onAddedToGroup.dispatch(child, this);
			this._container.addChildAt(child, index);
		}

		return child;

	},

	getAt: function (index) {

		return this._container.getChildAt(index);

	},

	create: function (x, y, key, frame) {

		var child = new Phaser.Sprite(this.game, x, y, key, frame);
		child.group = this;
		child.events.onAddedToGroup.dispatch(child, this);
		this._container.addChild(child);
		return child;

	},

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

			return true;
		}

		return false;
		
	},

	bringToTop: function (child) {

		if (child.group === this)
		{
			this.remove(child);
			this.add(child);
		}

		return child;

	},

	getIndex: function (child) {

		return this._container.children.indexOf(child);

	},

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
    * Call this function to sort the group according to a particular value and order.
    * For example, to sort game objects for Zelda-style overlaps you might call
    * <code>myGroup.sort("y",Group.ASCENDING)</code> at the bottom of your
    * <code>State.update()</code> override.  To sort all existing objects after
    * a big explosion or bomb attack, you might call <code>myGroup.sort("exists",Group.DESCENDING)</code>.
    *
    * @param {string} index The <code>string</code> name of the member variable you want to sort on.  Default value is "z".
    * @param {number} order A <code>Group</code> constant that defines the sort order.  Possible values are <code>Group.ASCENDING</code> and <code>Group.DESCENDING</code>.  Default value is <code>Group.ASCENDING</code>.
    */

	//	http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.c

    sort: function (index, order) {
        // if (typeof index === "undefined") { index = 'z'; }
        // if (typeof order === "undefined") { order = Phaser.Types.SORT_ASCENDING; }
        // var _this = this;
        // this._sortIndex = index;
        // this._sortOrder = order;
        // this.members.sort(function (a, b) {
        //     return _this.sortHandler(a, b);
        // });
    },

	/**
    * Helper function for the sort process.
    *
    * @param {Basic} Obj1 The first object being sorted.
    * @param {Basic} Obj2 The second object being sorted.
    *
    * @return {number} An integer value: -1 (Obj1 before Obj2), 0 (same), or 1 (Obj1 after Obj2).
    */
    sortHandler: function (obj1, obj2) {

    	/*
        if(!obj1 || !obj2) {
            //console.log('null objects in sort', obj1, obj2);
            return 0;
        }
        if(obj1[this._sortIndex] < obj2[this._sortIndex]) {
            return this._sortOrder;
        } else if(obj1[this._sortIndex] > obj2[this._sortIndex]) {
            return -this._sortOrder;
        }
        return 0;
        */
    },

	//	key is an ARRAY of values.
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

	setAll: function (key, value, checkAlive, checkVisible, operation) {

		key = key.split('.');
		checkAlive = checkAlive || false;
		checkVisible = checkVisible || false;
		operation = operation || 0;

		if (this._container.first._iNext)
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

	addAll: function (key, value, checkAlive, checkVisible) {

		this.setAll(key, value, checkAlive, checkVisible, 1);

	},

	subAll: function (key, value, checkAlive, checkVisible) {

		this.setAll(key, value, checkAlive, checkVisible, 2);

	},

	multiplyAll: function (key, value, checkAlive, checkVisible) {

		this.setAll(key, value, checkAlive, checkVisible, 3);

	},

	divideAll: function (key, value, checkAlive, checkVisible) {

		this.setAll(key, value, checkAlive, checkVisible, 4);

	},

	/**
    * Calls a function on all of the active children (children with exists=true).
    * You must pass the context in which the callback is applied.
    * After the context you can add as many parameters as you like, which will all be passed to the child.
    */
	callAll: function (callback, callbackContext) {

		var args = Array.prototype.splice.call(arguments, 2);

		if (this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (currentNode.exists && currentNode[callback])
				{
					currentNode[callback].apply(currentNode, args);
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext)

		}

	},

	forEach: function (callback, callbackContext, checkExists) {

		checkExists = checkExists || false;

		if (this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (checkExists == false || (checkExists && currentNode.exists))
				{
					callback.call(callbackContext, currentNode);
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);

		}

	},

	forEachAlive: function () {

		if (this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (currentNode.alive)
				{
					callback.call(callbackContext, currentNode);
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);

		}

	},

	forEachDead: function () {

		if (this._container.first._iNext)
		{
			var currentNode = this._container.first._iNext;
				
			do	
			{
				if (currentNode.alive == false)
				{
					callback.call(callbackContext, currentNode);
				}

				currentNode = currentNode._iNext;
			}
			while (currentNode != this._container.last._iNext);

		}
	},

	/**
    * Call this function to retrieve the first object with exists == (the given state) in the group.
    *
    * @return {Any} The first child, or null if none found.
    */
	getFirstExists: function (state) {

		if (typeof state !== 'boolean')
		{
			state = true;
		}

		if (this._container.first._iNext)
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
    * @return {Any} The first alive child, or null if none found.
    */
	getFirstAlive: function () {

		if (this._container.first._iNext)
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
    * @return {Any} The first dead child, or null if none found.
    */
	getFirstDead: function () {

		if (this._container.first._iNext)
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
    * @return {number} The number of children flagged as alive. Returns -1 if Group is empty.
    */
	countLiving: function () {

		var total = -1;

		if (this._container.first._iNext)
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
    * @return {number} The number of children flagged as dead. Returns -1 if Group is empty.
    */
	countDead: function () {

		var total = -1;

		if (this._container.first._iNext)
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
    * @param {number} startIndex Optional offset off the front of the array. Default value is 0, or the beginning of the array.
    * @param {number} length Optional restriction on the number of values you want to randomly select from.
    *
    * @return {Any} A random child of this Group.
    */
	getRandom: function (startIndex, length) {

		startIndex = startIndex || 0;
		length = length || this._container.children.length;

        return this.game.math.getRandom(this._container.children, startIndex, length);

	},

	remove: function (child) {

		child.events.onRemovedFromGroup.dispatch(child, this);
		this._container.removeChild(child);
		child.group = null;

	},

	removeAll: function () {

		do
		{
			this._container.children[0].events.onRemovedFromGroup.dispatch(this._container.children[0], this);
			this._container.removeChild(this._container.children[0]);
		}
		while (this._container.children.length > 0);

	},

	removeBetween: function (startIndex, endIndex) {

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

	destroy: function () {

		this.removeAll();

		this._container.parent.removeChild(this._container);

		this._container = null;

		this.game = null;

		this.exists = false;

	},

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

Object.defineProperty(Phaser.Group.prototype, "x", {

    get: function () {
        return this._container.position.x;
    },

    set: function (value) {
        this._container.position.x = value;
    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Group.prototype, "y", {

    get: function () {
        return this._container.position.y;
    },

    set: function (value) {
        this._container.position.y = value;
    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Group.prototype, "angle", {

    get: function() {
        return Phaser.Math.radToDeg(this._container.rotation);
    },

    set: function(value) {
        this._container.rotation = Phaser.Math.degToRad(value);
    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Group.prototype, "rotation", {

    get: function () {
        return this._container.rotation;
    },

    set: function (value) {
        this._container.rotation = value;
    },

    enumerable: true,
    configurable: true
});

Object.defineProperty(Phaser.Group.prototype, "visible", {

    get: function () {
        return this._container.visible;
    },

    set: function (value) {
        this._container.visible = value;
    },

    enumerable: true,
    configurable: true
});
