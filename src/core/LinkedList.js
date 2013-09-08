Phaser.LinkedList = function () {
};

Phaser.LinkedList.prototype = {

    next: null,
    prev: null,
    first: null,
    last: null,
    sprite: { name: 'HD' },

    add: function (child) {

    	//	If the list is empty
    	if (this.first == null && this.last == null)
    	{
    		this.first = child;
    		this.last = child;
	    	this.next = child;
	    	child.prev = this;
    		return;
    	}

    	//	Get gets appended to the end of the list, regardless of anything, and it won't have any children of its own (non-nested list)
    	this.last.next = child;

    	child.prev = this.last;

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
    		this.next = null;
    		child.next = null;
    		child.prev = null;
    		return;
    	}

		var childPrev = child.prev;

    	//	Tail node?
    	if (child.next)
    	{
			//	Has another node after it?
	    	child.next.prev = child.prev;
    	}

    	childPrev.next = child.next;

    },

	dump: function () {

		console.log("\nNode\t\t|\t\tNext\t\t|\t\tPrev\t\t|\t\tFirst\t\t|\t\tLast");
		console.log("\t\t\t|\t\t\t\t\t|\t\t\t\t\t|\t\t\t\t\t|");

		var nameNext = '-';
		var namePrev = '-';
		var nameFirst = '-';
		var nameLast = '-';

		if (this.next)
		{
			nameNext = this.next.sprite.name;
		}

		if (this.prev)
		{
			namePrev = this.prev.sprite.name;
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

		var testObject = entity.last.next;
		entity = entity.first;
		
		do	
		{
			var name = entity.sprite.name || '*';
			var nameNext = '-';
			var namePrev = '-';
			var nameFirst = '-';
			var nameLast = '-';

			if (entity.next)
			{
				nameNext = entity.next.sprite.name;
			}

			if (entity.prev)
			{
				namePrev = entity.prev.sprite.name;
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

			entity = entity.next;

		}
		while(entity != testObject)

	}

};