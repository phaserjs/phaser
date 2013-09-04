/*
 * Javascript QuadTree 
 * @version 1.0
 * @author Timo Hausmann
 *
 * @version 1.2, September 4th 2013
 * @author Richard Davey
 * The original code was a conversion of the Java code posted to GameDevTuts. However I've tweaked
 * it massively to add node indexing, removed lots of temp. var creation and significantly
 * increased performance as a result.
 *
 * Original version at https://github.com/timohausmann/quadtree-js/
 */
 
/*
 Copyright © 2012 Timo Hausmann

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*
* QuadTree Constructor
* @param Integer maxObjects		(optional) max objects a node can hold before splitting into 4 subnodes (default: 10)
* @param Integer maxLevels		(optional) total max levels inside root QuadTree (default: 4) 
* @param Integer level		(optional) deepth level, required for subnodes  
*/
Phaser.QuadTree = function (physicsManager, x, y, width, height, maxObjects, maxLevels, level) {
		
	this.physicsManager = physicsManager;
	this.ID = physicsManager.quadTreeID;
	physicsManager.quadTreeID++;

	this.maxObjects = maxObjects || 10;
	this.maxLevels = maxLevels || 4;
	this.level = level || 0;

	this.bounds = { 
		x: Math.round(x), 
		y: Math.round(y), 
		width: width, 
		height: height, 
		subWidth: Math.floor(width / 2),
		subHeight: Math.floor(height / 2),
		right: Math.round(x) + Math.floor(width / 2),
		bottom: Math.round(y) + Math.floor(height / 2)
	};
	
	this.objects = [];
	this.nodes = [];

};

Phaser.QuadTree.prototype = {

	/*
	 * Split the node into 4 subnodes
	 */
	split: function() {

		this.level++;
		
	 	//	top right node
		this.nodes[0] = new Phaser.QuadTree(this.physicsManager, this.bounds.right, this.bounds.y, this.bounds.subWidth, this.bounds.subHeight, this.maxObjects, this.maxLevels, this.level);
		
		//	top left node
		this.nodes[1] = new Phaser.QuadTree(this.physicsManager, this.bounds.x, this.bounds.y, this.bounds.subWidth, this.bounds.subHeight, this.maxObjects, this.maxLevels, this.level);
		
		//	bottom left node
		this.nodes[2] = new Phaser.QuadTree(this.physicsManager, this.bounds.x, this.bounds.bottom, this.bounds.subWidth, this.bounds.subHeight, this.maxObjects, this.maxLevels, this.level);
		
		//	bottom right node
		this.nodes[3] = new Phaser.QuadTree(this.physicsManager, this.bounds.right, this.bounds.bottom, this.bounds.subWidth, this.bounds.subHeight, this.maxObjects, this.maxLevels, this.level);

	},

	/*
	 * Insert the object into the node. If the node
	 * exceeds the capacity, it will split and add all
	 * objects to their corresponding subnodes.
	 * @param Object pRect		bounds of the object to be added, with x, y, width, height
	 */
	insert: function (body) {
		
		var i = 0;
		var index;
	 	
	 	//	if we have subnodes ...
		if (this.nodes[0] != null)
		{
			index = this.getIndex(body.bounds);
	 
		  	if (index !== -1)
		  	{
				this.nodes[index].insert(body);
			 	return;
			}
		}
	 
	 	this.objects.push(body);
		
		if (this.objects.length > this.maxObjects && this.level < this.maxLevels)
		{
			//	Split if we don't already have subnodes
			if (this.nodes[0] == null)
			{
				this.split();
			}
			
			//	Add objects to subnodes
			while (i < this.objects.length)
			{
				index = this.getIndex(this.objects[i].bounds);
				
				if (index !== -1)
				{
					//	this is expensive - see what we can do about it
					this.nodes[index].insert(this.objects.splice(i, 1)[0]);
				}
				else
				{
					i++;
			 	}
		 	}
		}
	 },
	 
	/*
	 * Determine which node the object belongs to
	 * @param Object pRect		bounds of the area to be checked, with x, y, width, height
	 * @return Integer		index of the subnode (0-3), or -1 if pRect cannot completely fit within a subnode and is part of the parent node
	 */
	getIndex: function (rect) {
		
		//	default is that rect doesn't fit, i.e. it straddles the internal quadrants
		var index = -1;

		if (rect.x < this.bounds.right && rect.right < this.bounds.right)
		{
			if ((rect.y < this.bounds.bottom && rect.bottom < this.bounds.bottom))
			{
				//	rect fits within the top-left quadrant of this quadtree
				index = 1;
			}
			else if ((rect.y > this.bounds.bottom))
			{
				//	rect fits within the bottom-left quadrant of this quadtree
				index = 2;
			}
		}
		else if (rect.x > this.bounds.right)
		{
			//	rect can completely fit within the right quadrants
			if ((rect.y < this.bounds.bottom && rect.bottom < this.bounds.bottom))
			{
				//	rect fits within the top-right quadrant of this quadtree
				index = 0;
			}
			else if ((rect.y > this.bounds.bottom))
			{
				//	rect fits within the bottom-right quadrant of this quadtree
				index = 3;
			}
		}
	 
		return index;

	},

	 /*
	 * Return all objects that could collide with the given object
	 * @param Object pRect		bounds of the object to be checked, with x, y, width, height
	 * @Return Array		array with all detected objects
	 */
	retrieve: function (sprite) {
	 	
		var returnObjects = this.objects;

		sprite.body.quadTreeIndex = this.getIndex(sprite.body.bounds);

		//	Temp store for the node IDs this sprite is in, we can use this for fast elimination later
		sprite.body.quadTreeIDs.push(this.ID);

		if (this.nodes[0])
		{
			//	if rect fits into a subnode ..
			if (sprite.body.quadTreeIndex !== -1)
			{
				returnObjects = returnObjects.concat(this.nodes[sprite.body.quadTreeIndex].retrieve(sprite));
			}
			else
			{
				//	if rect does not fit into a subnode, check it against all subnodes (unrolled for speed)
				returnObjects = returnObjects.concat(this.nodes[0].retrieve(sprite));
				returnObjects = returnObjects.concat(this.nodes[1].retrieve(sprite));
				returnObjects = returnObjects.concat(this.nodes[2].retrieve(sprite));
				returnObjects = returnObjects.concat(this.nodes[3].retrieve(sprite));
			}
		}
	 
		return returnObjects;

	},

	/*
	 * Clear the quadtree
	 */
	clear: function () {
		
		this.objects = [];
	 
		for (var i = 0, len = this.nodes.length; i < len; i++)
		{
			// if (typeof this.nodes[i] !== 'undefined')
			if (this.nodes[i])
			{
				this.nodes[i].clear();
				delete this.nodes[i];
		  	}
		}
	}

};
