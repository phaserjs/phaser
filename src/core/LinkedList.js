/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.LinkedList
*/

/**
* A linked list data structure.
*
* @class Phaser.LinkedList
* @constructor
*/
Phaser.LinkedList = function () {

    /**
	* @property {object} next - Next element in the list.
	* @default
	*/
    this.next = null;

    /**
	* @property {object} prev - Previous element in the list.
	* @default
	*/
    this.prev = null;

    /**
	* @property {object} first - First element in the list.
	* @default
	*/
    this.first = null;

    /**
	* @property {object} last - Last element in the list.
	* @default
	*/
    this.last = null;
    
    /**
	* @property {object} game - Number of elements in the list.
	* @default
	*/
    this.total = 0;

};

Phaser.LinkedList.prototype = {

	/**
    * Add element to a linked list.
	* 
	* @method add
    * @memberof Phaser.LinkedList
	* @param {object} child - Description.
	* @return {object} Description.	   
    */
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

	/**
    * Remove element from a linked list.
 	* 
 	* @method remove
    * @memberof Phaser.LinkedList
 	* @param {object} child - Description.   
    */
    remove: function (child) {
    	if( child == this.first )  this.first = this.first.next;      // It was 'first', make 'first' point to first.next
		else if ( child == this.last ) this.last = this.last.prev; // It was 'last', make 'last' point to last.prev

		if( child.prev ) child.prev.next = child.next; // make child.prev.next point to childs.next instead of child
		if( child.next ) child.next.prev = child.prev; // make child.next.prev point to child.prev instead of child
		child.next = child.prev = null;

		if( this.first == null ) this.last = null;

		this.total--;
    },

	/**
    * Description.
  	* 
  	* @method callAll
    * @memberof Phaser.LinkedList
  	* @param {object} callback - Description.   
    */
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

	/**
    * Description.
   	* 
   	* @method dump 
    * @memberof Phaser.LinkedList
    */
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