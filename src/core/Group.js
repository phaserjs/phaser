Phaser.Group = function (game, name) {

	this.game = game;
	this.name = name || '';

	this._container = new PIXI.DisplayObjectContainer();

	//	Swap for proper access to stage
	this.game.world._stage.addChild(this._container);

	this.active = true;
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
			this._container.addChild(child);
		}

		return child;

	},

	addAt: function (child, index) {

		if (child.group !== this)
		{
			child.group = this;
			this._container.addChildAt(child, index);
		}

		return child;

	},

	getChildAt: function (index) {

		return this._container.getChildAt(index);

	},

	createSprite: function (x, y, key, frame) {

		var child = new Phaser.Sprite(this.game, x, y, key, frame);
		this._container.addChild(child);
		return child;

	},

	swap: function (child1, child2) {

		return this.game.world.swapChildren(child1, child2);

	},

	bringToTop: function (child) {

		//	?!

	},

	replace: function (newChild, oldChild) {
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

	setAll: function () {
	},

	callAll: function () {
	},

	forEach: function () {
	},

	forEachAlive: function () {
	},

	forEachDead: function () {
	},

	getFirstAlive: function () {

		var endNode = this._container.last._iNext;
		var currentNode = this._container.first;
			
		do	
		{
			if (currentNode.alive)
			{
				return currentNode;
			}

			currentNode = currentNode._iNext;
		}
		while (currentNode != endNode)

	},

	getFirstDead: function () {

		var endNode = this._container.last._iNext;
		var currentNode = this._container.first;
			
		do	
		{
			if (currentNode.alive == false)
			{
				return currentNode;
			}

			currentNode = currentNode._iNext;
		}
		while (currentNode != endNode)

	},

	count: function (alive, visible) {

		var endNode = this._container.last._iNext;
		var currentNode = this._container.first;
			
		do	
		{
			if (currentNode.alive)
			{
				return currentNode;
			}

			currentNode = currentNode._iNext;
		}
		while (currentNode != endNode)

	}

	countLiving: function () {

		var total = 0;
		var endNode = this._container.last._iNext;
		var currentNode = this._container.first;
			
		do	
		{
			if (currentNode.alive)
			{
				total++;
			}

			currentNode = currentNode._iNext;
		}
		while (currentNode != endNode);

		return total;

	},

	countDead: function () {
	},

	getRandom: function () {
	},

	remove: function (child) {
	},

	destroy: function () {
	}

};

Object.defineProperty(Phaser.World.prototype, "visible", {

    get: function () {
        return this._container.visible;
    },

    set: function (value) {
        this._container.visible = value;
    },

    enumerable: true,
    configurable: true
});
