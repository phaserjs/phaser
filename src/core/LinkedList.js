Phaser.LinkedList = function () {
};

Phaser.LinkedList.prototype = {

    _iNext: null,
    _iPrev: null,
    first: null,
    last: null,
    sprite: { name: 'HD' },

    add: function (child) {

    	//	If the list is empty
    	if (this.first == null && this.last == null)
    	{
    		this.first = child;
    		this.last = child;
	    	this._iNext = child;
	    	child._iPrev = this;
    		return;
    	}

    	//	Get gets appended to the end of the list, regardless of anything, and it won't have any children of its own (non-nested list)
    	this.last._iNext = child;

    	child._iPrev = this.last;

    	this.last = child;

    },

    remove: function (child) {

    	//	If the list is empty
    	if (this.first == null && this.last == null)
    	{
    		return;
    	}

    	//	The only node?
    	if (this.first == child && this.last == child)
    	{
    		this.first = null;
    		this.last = null;
    		this._iNext = null;
    		child._iNext = null;
    		child._iPrev = null;
    		return;
    	}

		var childPrev = child._iPrev;

    	//	Tail node?
    	if (child._iNext)
    	{
			//	Has another node after it?
	    	child._iNext._iPrev = child._iPrev;
    	}

    	childPrev._iNext = child._iNext;

    },

	dump: function () {

		console.log("\nNode\t\t|\t\tNext\t\t|\t\tPrev\t\t|\t\tFirst\t\t|\t\tLast");
		console.log("\t\t\t|\t\t\t\t\t|\t\t\t\t\t|\t\t\t\t\t|");

		var nameNext = '-';
		var namePrev = '-';
		var nameFirst = '-';
		var nameLast = '-';

		if (this._iNext)
		{
			nameNext = this._iNext.sprite.name;
		}

		if (this._iPrev)
		{
			namePrev = this._iPrev.sprite.name;
		}

		if (this.first)
		{
			nameFirst = this.first.sprite.name;
		}

		if (this.last)
		{
			nameLast = this.last.sprite.name;
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

		console.log('HD' + '\t\t\t|\t\t' + nameNext + '\t\t\t|\t\t' + namePrev + '\t\t\t|\t\t' + nameFirst + '\t\t\t|\t\t' + nameLast);

		var entity = this;

		var testObject = entity.last._iNext;
		entity = entity.first;
		
		do	
		{
			var name = entity.sprite.name || '*';
			var nameNext = '-';
			var namePrev = '-';
			var nameFirst = '-';
			var nameLast = '-';

			if (entity._iNext)
			{
				nameNext = entity._iNext.sprite.name;
			}

			if (entity._iPrev)
			{
				namePrev = entity._iPrev.sprite.name;
			}

			if (entity.first)
			{
				nameFirst = entity.first.sprite.name;
			}

			if (entity.last)
			{
				nameLast = entity.last.sprite.name;
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

			console.log(name + '\t\t\t|\t\t' + nameNext + '\t\t\t|\t\t' + namePrev + '\t\t\t|\t\t' + nameFirst + '\t\t\t|\t\t' + nameLast);

			entity = entity._iNext;

		}
		while(entity != testObject)

	}

};