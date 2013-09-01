/**
* Phaser - QuadTree
*
* A fairly generic quad tree structure for rapid overlap checks. QuadTree is also configured for single or dual list operation.
* You can add items either to its A list or its B list. When you do an overlap check, you can compare the A list to itself,
* or the A list against the B list.  Handy for different things!
*/

/**
* Instantiate a new Quad Tree node.

* @extends Rectangle
*
* @param {Number} x			The X-coordinate of the point in space.
* @param {Number} y			The Y-coordinate of the point in space.
* @param {Number} width		Desired width of this node.
* @param {Number} height		Desired height of this node.
* @param {Number} parent		The parent branch or node.  Pass null to create a root.
*/
Phaser.QuadTree = function (manager, x, y, width, height, parent) {
	
	Phaser.Rectangle.call(this);
	

};

// constructor
Phaser.QuadTree.prototype = Object.create(Phaser.Rectangle.prototype);
Phaser.QuadTree.prototype.constructor = Phaser.Rectangle;

Phaser.QuadTree.prototype = {


};