var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../_definitions.ts" />
/**
* Phaser - QuadTree
*
* A fairly generic quad tree structure for rapid overlap checks. QuadTree is also configured for single or dual list operation.
* You can add items either to its A list or its B list. When you do an overlap check, you can compare the A list to itself,
* or the A list against the B list.  Handy for different things!
*/
var Phaser;
(function (Phaser) {
    var QuadTree = (function (_super) {
        __extends(QuadTree, _super);
        /**
        * Instantiate a new Quad Tree node.
        *
        * @param {Number} x			The X-coordinate of the point in space.
        * @param {Number} y			The Y-coordinate of the point in space.
        * @param {Number} width		Desired width of this node.
        * @param {Number} height		Desired height of this node.
        * @param {Number} parent		The parent branch or node.  Pass null to create a root.
        */
        //constructor(manager: Phaser.Physics.Manager, x: number, y: number, width: number, height: number, parent: QuadTree = null) {
        function QuadTree(manager, x, y, width, height, parent) {
            if (typeof parent === "undefined") { parent = null; }
                _super.call(this, x, y, width, height);
            QuadTree.physics = manager;
            this._headA = this._tailA = new Phaser.LinkedList();
            this._headB = this._tailB = new Phaser.LinkedList();
            //Copy the parent's children (if there are any)
            if(parent != null) {
                if(parent._headA.object != null) {
                    this._iterator = parent._headA;
                    while(this._iterator != null) {
                        if(this._tailA.object != null) {
                            this._ot = this._tailA;
                            this._tailA = new Phaser.LinkedList();
                            this._ot.next = this._tailA;
                        }
                        this._tailA.object = this._iterator.object;
                        this._iterator = this._iterator.next;
                    }
                }
                if(parent._headB.object != null) {
                    this._iterator = parent._headB;
                    while(this._iterator != null) {
                        if(this._tailB.object != null) {
                            this._ot = this._tailB;
                            this._tailB = new Phaser.LinkedList();
                            this._ot.next = this._tailB;
                        }
                        this._tailB.object = this._iterator.object;
                        this._iterator = this._iterator.next;
                    }
                }
            } else {
                QuadTree._min = (this.width + this.height) / (2 * QuadTree.divisions);
            }
            this._canSubdivide = (this.width > QuadTree._min) || (this.height > QuadTree._min);
            //Set up comparison/sort helpers
            this._northWestTree = null;
            this._northEastTree = null;
            this._southEastTree = null;
            this._southWestTree = null;
            this._leftEdge = this.x;
            this._rightEdge = this.x + this.width;
            this._halfWidth = this.width / 2;
            this._midpointX = this._leftEdge + this._halfWidth;
            this._topEdge = this.y;
            this._bottomEdge = this.y + this.height;
            this._halfHeight = this.height / 2;
            this._midpointY = this._topEdge + this._halfHeight;
        }
        QuadTree.A_LIST = 0;
        QuadTree.B_LIST = 1;
        QuadTree.prototype.destroy = /**
        * Clean up memory.
        */
        function () {
            this._tailA.destroy();
            this._tailB.destroy();
            this._headA.destroy();
            this._headB.destroy();
            this._tailA = null;
            this._tailB = null;
            this._headA = null;
            this._headB = null;
            if(this._northWestTree != null) {
                this._northWestTree.destroy();
            }
            if(this._northEastTree != null) {
                this._northEastTree.destroy();
            }
            if(this._southEastTree != null) {
                this._southEastTree.destroy();
            }
            if(this._southWestTree != null) {
                this._southWestTree.destroy();
            }
            this._northWestTree = null;
            this._northEastTree = null;
            this._southEastTree = null;
            this._southWestTree = null;
            QuadTree._object = null;
            QuadTree._processingCallback = null;
            QuadTree._notifyCallback = null;
        };
        QuadTree.prototype.load = /**
        * Load objects and/or groups into the quad tree, and register notify and processing callbacks.
        *
        * @param {} objectOrGroup1	Any object that is or extends IGameObject or Group.
        * @param {} objectOrGroup2	Any object that is or extends IGameObject or Group.  If null, the first parameter will be checked against itself.
        * @param {Function} notifyCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject)</code> that is called whenever two objects are found to overlap in world space, and either no processCallback is specified, or the processCallback returns true.
        * @param {Function} processCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject):bool</code> that is called whenever two objects are found to overlap in world space.  The notifyCallback is only called if this function returns true.  See GameObject.separate().
        * @param context The context in which the callbacks will be called
        */
        function (objectOrGroup1, objectOrGroup2, notifyCallback, processCallback, context) {
            if (typeof objectOrGroup2 === "undefined") { objectOrGroup2 = null; }
            if (typeof notifyCallback === "undefined") { notifyCallback = null; }
            if (typeof processCallback === "undefined") { processCallback = null; }
            if (typeof context === "undefined") { context = null; }
            this.add(objectOrGroup1, QuadTree.A_LIST);
            if(objectOrGroup2 != null) {
                this.add(objectOrGroup2, QuadTree.B_LIST);
                QuadTree._useBothLists = true;
            } else {
                QuadTree._useBothLists = false;
            }
            QuadTree._notifyCallback = notifyCallback;
            QuadTree._processingCallback = processCallback;
            QuadTree._callbackContext = context;
        };
        QuadTree.prototype.add = /**
        * Call this function to add an object to the root of the tree.
        * This function will recursively add all group members, but
        * not the groups themselves.
        *
        * @param {} objectOrGroup	GameObjects are just added, Groups are recursed and their applicable members added accordingly.
        * @param {Number} list	A <code>uint</code> flag indicating the list to which you want to add the objects.  Options are <code>QuadTree.A_LIST</code> and <code>QuadTree.B_LIST</code>.
        */
        function (objectOrGroup, list) {
            QuadTree._list = list;
            if(objectOrGroup.type == Phaser.Types.GROUP) {
                this._i = 0;
                this._members = objectOrGroup['members'];
                this._l = objectOrGroup['length'];
                while(this._i < this._l) {
                    this._basic = this._members[this._i++];
                    if(this._basic != null && this._basic.exists) {
                        if(this._basic.type == Phaser.Types.GROUP) {
                            this.add(this._basic, list);
                        } else {
                            QuadTree._object = this._basic;
                            if(QuadTree._object.exists && QuadTree._object.body.allowCollisions) {
                                this.addObject();
                            }
                        }
                    }
                }
            } else {
                QuadTree._object = objectOrGroup;
                if(QuadTree._object.exists && QuadTree._object.body.allowCollisions) {
                    this.addObject();
                }
            }
        };
        QuadTree.prototype.addObject = /**
        * Internal function for recursively navigating and creating the tree
        * while adding objects to the appropriate nodes.
        */
        function () {
            //If this quad (not its children) lies entirely inside this object, add it here
            if(!this._canSubdivide || ((this._leftEdge >= QuadTree._object.body.bounds.x) && (this._rightEdge <= QuadTree._object.body.bounds.right) && (this._topEdge >= QuadTree._object.body.bounds.y) && (this._bottomEdge <= QuadTree._object.body.bounds.bottom))) {
                this.addToList();
                return;
            }
            //See if the selected object fits completely inside any of the quadrants
            if((QuadTree._object.body.bounds.x > this._leftEdge) && (QuadTree._object.body.bounds.right < this._midpointX)) {
                if((QuadTree._object.body.bounds.y > this._topEdge) && (QuadTree._object.body.bounds.bottom < this._midpointY)) {
                    if(this._northWestTree == null) {
                        this._northWestTree = new QuadTree(QuadTree.physics, this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
                    }
                    this._northWestTree.addObject();
                    return;
                }
                if((QuadTree._object.body.bounds.y > this._midpointY) && (QuadTree._object.body.bounds.bottom < this._bottomEdge)) {
                    if(this._southWestTree == null) {
                        this._southWestTree = new QuadTree(QuadTree.physics, this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
                    }
                    this._southWestTree.addObject();
                    return;
                }
            }
            if((QuadTree._object.body.bounds.x > this._midpointX) && (QuadTree._object.body.bounds.right < this._rightEdge)) {
                if((QuadTree._object.body.bounds.y > this._topEdge) && (QuadTree._object.body.bounds.bottom < this._midpointY)) {
                    if(this._northEastTree == null) {
                        this._northEastTree = new QuadTree(QuadTree.physics, this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
                    }
                    this._northEastTree.addObject();
                    return;
                }
                if((QuadTree._object.body.bounds.y > this._midpointY) && (QuadTree._object.body.bounds.bottom < this._bottomEdge)) {
                    if(this._southEastTree == null) {
                        this._southEastTree = new QuadTree(QuadTree.physics, this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
                    }
                    this._southEastTree.addObject();
                    return;
                }
            }
            //If it wasn't completely contained we have to check out the partial overlaps
            if((QuadTree._object.body.bounds.right > this._leftEdge) && (QuadTree._object.body.bounds.x < this._midpointX) && (QuadTree._object.body.bounds.bottom > this._topEdge) && (QuadTree._object.body.bounds.y < this._midpointY)) {
                if(this._northWestTree == null) {
                    this._northWestTree = new QuadTree(QuadTree.physics, this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
                }
                this._northWestTree.addObject();
            }
            if((QuadTree._object.body.bounds.right > this._midpointX) && (QuadTree._object.body.bounds.x < this._rightEdge) && (QuadTree._object.body.bounds.bottom > this._topEdge) && (QuadTree._object.body.bounds.y < this._midpointY)) {
                if(this._northEastTree == null) {
                    this._northEastTree = new QuadTree(QuadTree.physics, this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
                }
                this._northEastTree.addObject();
            }
            if((QuadTree._object.body.bounds.right > this._midpointX) && (QuadTree._object.body.bounds.x < this._rightEdge) && (QuadTree._object.body.bounds.bottom > this._midpointY) && (QuadTree._object.body.bounds.y < this._bottomEdge)) {
                if(this._southEastTree == null) {
                    this._southEastTree = new QuadTree(QuadTree.physics, this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
                }
                this._southEastTree.addObject();
            }
            if((QuadTree._object.body.bounds.right > this._leftEdge) && (QuadTree._object.body.bounds.x < this._midpointX) && (QuadTree._object.body.bounds.bottom > this._midpointY) && (QuadTree._object.body.bounds.y < this._bottomEdge)) {
                if(this._southWestTree == null) {
                    this._southWestTree = new QuadTree(QuadTree.physics, this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
                }
                this._southWestTree.addObject();
            }
        };
        QuadTree.prototype.addToList = /**
        * Internal function for recursively adding objects to leaf lists.
        */
        function () {
            if(QuadTree._list == QuadTree.A_LIST) {
                if(this._tailA.object != null) {
                    this._ot = this._tailA;
                    this._tailA = new Phaser.LinkedList();
                    this._ot.next = this._tailA;
                }
                this._tailA.object = QuadTree._object;
            } else {
                if(this._tailB.object != null) {
                    this._ot = this._tailB;
                    this._tailB = new Phaser.LinkedList();
                    this._ot.next = this._tailB;
                }
                this._tailB.object = QuadTree._object;
            }
            if(!this._canSubdivide) {
                return;
            }
            if(this._northWestTree != null) {
                this._northWestTree.addToList();
            }
            if(this._northEastTree != null) {
                this._northEastTree.addToList();
            }
            if(this._southEastTree != null) {
                this._southEastTree.addToList();
            }
            if(this._southWestTree != null) {
                this._southWestTree.addToList();
            }
        };
        QuadTree.prototype.execute = /**
        * <code>QuadTree</code>'s other main function.  Call this after adding objects
        * using <code>QuadTree.load()</code> to compare the objects that you loaded.
        *
        * @return {bool} Whether or not any overlaps were found.
        */
        function () {
            this._overlapProcessed = false;
            if(this._headA.object != null) {
                this._iterator = this._headA;
                while(this._iterator != null) {
                    QuadTree._object = this._iterator.object;
                    if(QuadTree._useBothLists) {
                        QuadTree._iterator = this._headB;
                    } else {
                        QuadTree._iterator = this._iterator.next;
                    }
                    if(QuadTree._object.exists && (QuadTree._object.body.allowCollisions > 0) && (QuadTree._iterator != null) && (QuadTree._iterator.object != null) && QuadTree._iterator.object.exists && this.overlapNode()) {
                        this._overlapProcessed = true;
                    }
                    this._iterator = this._iterator.next;
                }
            }
            //Advance through the tree by calling overlap on each child
            if((this._northWestTree != null) && this._northWestTree.execute()) {
                this._overlapProcessed = true;
            }
            if((this._northEastTree != null) && this._northEastTree.execute()) {
                this._overlapProcessed = true;
            }
            if((this._southEastTree != null) && this._southEastTree.execute()) {
                this._overlapProcessed = true;
            }
            if((this._southWestTree != null) && this._southWestTree.execute()) {
                this._overlapProcessed = true;
            }
            return this._overlapProcessed;
        };
        QuadTree.prototype.overlapNode = /**
        * A private for comparing an object against the contents of a node.
        *
        * @return {bool} Whether or not any overlaps were found.
        */
        function () {
            //Walk the list and check for overlaps
            this._overlapProcessed = false;
            while(QuadTree._iterator != null) {
                if(!QuadTree._object.exists || (QuadTree._object.body.allowCollisions <= 0)) {
                    break;
                }
                this._checkObject = QuadTree._iterator.object;
                if((QuadTree._object === this._checkObject) || !this._checkObject.exists || (this._checkObject.body.allowCollisions <= 0)) {
                    QuadTree._iterator = QuadTree._iterator.next;
                    continue;
                }
                /*
                if (QuadTree.physics.checkHullIntersection(QuadTree._object.body, this._checkObject.body))
                {
                //Execute callback functions if they exist
                if ((QuadTree._processingCallback == null) || QuadTree._processingCallback(QuadTree._object, this._checkObject))
                {
                this._overlapProcessed = true;
                }
                
                if (this._overlapProcessed && (QuadTree._notifyCallback != null))
                {
                if (QuadTree._callbackContext !== null)
                {
                QuadTree._notifyCallback.call(QuadTree._callbackContext, QuadTree._object, this._checkObject);
                }
                else
                {
                QuadTree._notifyCallback(QuadTree._object, this._checkObject);
                }
                }
                }
                */
                QuadTree._iterator = QuadTree._iterator.next;
            }
            return this._overlapProcessed;
        };
        return QuadTree;
    })(Phaser.Rectangle);
    Phaser.QuadTree = QuadTree;    
})(Phaser || (Phaser = {}));
