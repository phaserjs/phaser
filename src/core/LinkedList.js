Phaser.LinkedList = function () {

    this.next = null;
    this.prev = null;
    this.first = null;
    this.last = null;
    this.total = 0;

};

Phaser.LinkedList.prototype = {


    add: function (child) {

    	//	If the list is empty
    	if (this.total == 0 && this.first == null && this.last == null)
    	{
    		this.first = child;
    		this.last = child;
	    	this.next = child;
	    	child.prev = this;
	    	this.total++;
    		return;
    	}

    	//	Get gets appended to the end of the list, regardless of anything, and it won't have any children of its own (non-nested list)
    	this.last.next = child;

    	child.prev = this.last;

    	this.last = child;

		this.total++;

		return child;

    },

    remove: function (child) {

    	//	If the list is empty
    	if (this.first == null && this.last == null)
    	{
    		return;
    	}

		this.total--;

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

    callAll: function (callback) {

    	if (!this.first || !this.last)
    	{
    		return;
    	}

		var entity = this.first;
		
		do	
		{
			if (entity && entity[callback])
			{
				entity[callback].call(entity);
			}

			entity = entity.next;

		}
		while(entity != this.last.next)			

    },

	dump: function () {

		var spacing = 20;

		var output = "\n" + Phaser.Utils.pad('Node', spacing) + "|" + Phaser.Utils.pad('Next', spacing) + "|" + Phaser.Utils.pad('Previous', spacing) + "|" + Phaser.Utils.pad('First', spacing) + "|" + Phaser.Utils.pad('Last', spacing);
		console.log(output);

		var output = Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing) + "|" + Phaser.Utils.pad('----------', spacing);
		console.log(output);

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

			var output = Phaser.Utils.pad(name, spacing) + "|" + Phaser.Utils.pad(nameNext, spacing) + "|" + Phaser.Utils.pad(namePrev, spacing) + "|" + Phaser.Utils.pad(nameFirst, spacing) + "|" + Phaser.Utils.pad(nameLast, spacing);
			console.log(output);

			entity = entity.next;

		}
		while(entity != testObject)

	}

};