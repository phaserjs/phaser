var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../Game.ts" />
/// <reference path="LinkedList.ts" />
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
        function QuadTree(x, y, width, height, parent) {
            if (typeof parent === "undefined") { parent = null; }
            _super.call(this, x, y, width, height);
            this._headA = this._tailA = new LinkedList();
            this._headB = this._tailB = new LinkedList();
            //Copy the parent's children (if there are any)
            if(parent != null) {
                var iterator;
                var ot;
                if(parent._headA.object != null) {
                    iterator = parent._headA;
                    while(iterator != null) {
                        if(this._tailA.object != null) {
                            ot = this._tailA;
                            this._tailA = new LinkedList();
                            ot.next = this._tailA;
                        }
                        this._tailA.object = iterator.object;
                        iterator = iterator.next;
                    }
                }
                if(parent._headB.object != null) {
                    iterator = parent._headB;
                    while(iterator != null) {
                        if(this._tailB.object != null) {
                            ot = this._tailB;
                            this._tailB = new LinkedList();
                            ot.next = this._tailB;
                        }
                        this._tailB.object = iterator.object;
                        iterator = iterator.next;
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
            Phaser.QuadTree._object = null;
            Phaser.QuadTree._processingCallback = null;
            Phaser.QuadTree._notifyCallback = null;
        };
        QuadTree.prototype.load = /**
        * Load objects and/or groups into the quad tree, and register notify and processing callbacks.
        *
        * @param {Basic} objectOrGroup1	Any object that is or extends GameObject or Group.
        * @param {Basic} objectOrGroup2	Any object that is or extends GameObject or Group.  If null, the first parameter will be checked against itself.
        * @param {Function} notifyCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject)</code> that is called whenever two objects are found to overlap in world space, and either no processCallback is specified, or the processCallback returns true.
        * @param {Function} processCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject):bool</code> that is called whenever two objects are found to overlap in world space.  The notifyCallback is only called if this function returns true.  See GameObject.separate().
        * @param context The context in which the callbacks will be called
        */
        function (objectOrGroup1, objectOrGroup2, notifyCallback, processCallback, context) {
            if (typeof objectOrGroup2 === "undefined") { objectOrGroup2 = null; }
            if (typeof notifyCallback === "undefined") { notifyCallback = null; }
            if (typeof processCallback === "undefined") { processCallback = null; }
            if (typeof context === "undefined") { context = null; }
            this.add(objectOrGroup1, Phaser.QuadTree.A_LIST);
            if(objectOrGroup2 != null) {
                this.add(objectOrGroup2, Phaser.QuadTree.B_LIST);
                Phaser.QuadTree._useBothLists = true;
            } else {
                Phaser.QuadTree._useBothLists = false;
            }
            Phaser.QuadTree._notifyCallback = notifyCallback;
            Phaser.QuadTree._processingCallback = processCallback;
            Phaser.QuadTree._callbackContext = context;
        };
        QuadTree.prototype.add = /**
        * Call this function to add an object to the root of the tree.
        * This function will recursively add all group members, but
        * not the groups themselves.
        *
        * @param {Basic} objectOrGroup	GameObjects are just added, Groups are recursed and their applicable members added accordingly.
        * @param {Number} list	A <code>uint</code> flag indicating the list to which you want to add the objects.  Options are <code>QuadTree.A_LIST</code> and <code>QuadTree.B_LIST</code>.
        */
        function (objectOrGroup, list) {
            Phaser.QuadTree._list = list;
            if(objectOrGroup.isGroup == true) {
                var i = 0;
                var basic;
                var members = objectOrGroup['members'];
                var l = objectOrGroup['length'];
                while(i < l) {
                    basic = members[i++];
                    if((basic != null) && basic.exists) {
                        if(basic.isGroup) {
                            this.add(basic, list);
                        } else {
                            Phaser.QuadTree._object = basic;
                            if(Phaser.QuadTree._object.exists && Phaser.QuadTree._object.allowCollisions) {
                                this.addObject();
                            }
                        }
                    }
                }
            } else {
                Phaser.QuadTree._object = objectOrGroup;
                if(Phaser.QuadTree._object.exists && Phaser.QuadTree._object.allowCollisions) {
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
            if(!this._canSubdivide || ((this._leftEdge >= Phaser.QuadTree._object.collisionMask.x) && (this._rightEdge <= Phaser.QuadTree._object.collisionMask.right) && (this._topEdge >= Phaser.QuadTree._object.collisionMask.y) && (this._bottomEdge <= Phaser.QuadTree._object.collisionMask.bottom))) {
                this.addToList();
                return;
            }
            //See if the selected object fits completely inside any of the quadrants
            if((Phaser.QuadTree._object.collisionMask.x > this._leftEdge) && (Phaser.QuadTree._object.collisionMask.right < this._midpointX)) {
                if((Phaser.QuadTree._object.collisionMask.y > this._topEdge) && (Phaser.QuadTree._object.collisionMask.bottom < this._midpointY)) {
                    if(this._northWestTree == null) {
                        this._northWestTree = new Phaser.QuadTree(this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
                    }
                    this._northWestTree.addObject();
                    return;
                }
                if((Phaser.QuadTree._object.collisionMask.y > this._midpointY) && (Phaser.QuadTree._object.collisionMask.bottom < this._bottomEdge)) {
                    if(this._southWestTree == null) {
                        this._southWestTree = new Phaser.QuadTree(this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
                    }
                    this._southWestTree.addObject();
                    return;
                }
            }
            if((Phaser.QuadTree._object.collisionMask.x > this._midpointX) && (Phaser.QuadTree._object.collisionMask.right < this._rightEdge)) {
                if((Phaser.QuadTree._object.collisionMask.y > this._topEdge) && (Phaser.QuadTree._object.collisionMask.bottom < this._midpointY)) {
                    if(this._northEastTree == null) {
                        this._northEastTree = new Phaser.QuadTree(this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
                    }
                    this._northEastTree.addObject();
                    return;
                }
                if((Phaser.QuadTree._object.collisionMask.y > this._midpointY) && (Phaser.QuadTree._object.collisionMask.bottom < this._bottomEdge)) {
                    if(this._southEastTree == null) {
                        this._southEastTree = new Phaser.QuadTree(this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
                    }
                    this._southEastTree.addObject();
                    return;
                }
            }
            //If it wasn't completely contained we have to check out the partial overlaps
            if((Phaser.QuadTree._object.collisionMask.right > this._leftEdge) && (Phaser.QuadTree._object.collisionMask.x < this._midpointX) && (Phaser.QuadTree._object.collisionMask.bottom > this._topEdge) && (Phaser.QuadTree._object.collisionMask.y < this._midpointY)) {
                if(this._northWestTree == null) {
                    this._northWestTree = new Phaser.QuadTree(this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
                }
                this._northWestTree.addObject();
            }
            if((Phaser.QuadTree._object.collisionMask.right > this._midpointX) && (Phaser.QuadTree._object.collisionMask.x < this._rightEdge) && (Phaser.QuadTree._object.collisionMask.bottom > this._topEdge) && (Phaser.QuadTree._object.collisionMask.y < this._midpointY)) {
                if(this._northEastTree == null) {
                    this._northEastTree = new Phaser.QuadTree(this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
                }
                this._northEastTree.addObject();
            }
            if((Phaser.QuadTree._object.collisionMask.right > this._midpointX) && (Phaser.QuadTree._object.collisionMask.x < this._rightEdge) && (Phaser.QuadTree._object.collisionMask.bottom > this._midpointY) && (Phaser.QuadTree._object.collisionMask.y < this._bottomEdge)) {
                if(this._southEastTree == null) {
                    this._southEastTree = new Phaser.QuadTree(this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
                }
                this._southEastTree.addObject();
            }
            if((Phaser.QuadTree._object.collisionMask.right > this._leftEdge) && (Phaser.QuadTree._object.collisionMask.x < this._midpointX) && (Phaser.QuadTree._object.collisionMask.bottom > this._midpointY) && (Phaser.QuadTree._object.collisionMask.y < this._bottomEdge)) {
                if(this._southWestTree == null) {
                    this._southWestTree = new Phaser.QuadTree(this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
                }
                this._southWestTree.addObject();
            }
        };
        QuadTree.prototype.addToList = /**
        * Internal function for recursively adding objects to leaf lists.
        */
        function () {
            var ot;
            if(Phaser.QuadTree._list == Phaser.QuadTree.A_LIST) {
                if(this._tailA.object != null) {
                    ot = this._tailA;
                    this._tailA = new Phaser.LinkedList();
                    ot.next = this._tailA;
                }
                this._tailA.object = Phaser.QuadTree._object;
            } else {
                if(this._tailB.object != null) {
                    ot = this._tailB;
                    this._tailB = new Phaser.LinkedList();
                    ot.next = this._tailB;
                }
                this._tailB.object = Phaser.QuadTree._object;
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
        * @return {Boolean} Whether or not any overlaps were found.
        */
        function () {
            var overlapProcessed = false;
            var iterator;
            if(this._headA.object != null) {
                iterator = this._headA;
                while(iterator != null) {
                    Phaser.QuadTree._object = iterator.object;
                    if(Phaser.QuadTree._useBothLists) {
                        Phaser.QuadTree._iterator = this._headB;
                    } else {
                        Phaser.QuadTree._iterator = iterator.next;
                    }
                    if(Phaser.QuadTree._object.exists && (Phaser.QuadTree._object.allowCollisions > 0) && (Phaser.QuadTree._iterator != null) && (Phaser.QuadTree._iterator.object != null) && Phaser.QuadTree._iterator.object.exists && this.overlapNode()) {
                        overlapProcessed = true;
                    }
                    iterator = iterator.next;
                }
            }
            //Advance through the tree by calling overlap on each child
            if((this._northWestTree != null) && this._northWestTree.execute()) {
                overlapProcessed = true;
            }
            if((this._northEastTree != null) && this._northEastTree.execute()) {
                overlapProcessed = true;
            }
            if((this._southEastTree != null) && this._southEastTree.execute()) {
                overlapProcessed = true;
            }
            if((this._southWestTree != null) && this._southWestTree.execute()) {
                overlapProcessed = true;
            }
            return overlapProcessed;
        };
        QuadTree.prototype.overlapNode = /**
        * A private for comparing an object against the contents of a node.
        *
        * @return {Boolean} Whether or not any overlaps were found.
        */
        function () {
            //Walk the list and check for overlaps
            var overlapProcessed = false;
            var checkObject;
            while(Phaser.QuadTree._iterator != null) {
                if(!Phaser.QuadTree._object.exists || (Phaser.QuadTree._object.allowCollisions <= 0)) {
                    break;
                }
                checkObject = Phaser.QuadTree._iterator.object;
                if((Phaser.QuadTree._object === checkObject) || !checkObject.exists || (checkObject.allowCollisions <= 0)) {
                    Phaser.QuadTree._iterator = Phaser.QuadTree._iterator.next;
                    continue;
                }
                if(Phaser.QuadTree._object.collisionMask.checkHullIntersection(checkObject.collisionMask)) {
                    //Execute callback functions if they exist
                    if((Phaser.QuadTree._processingCallback == null) || Phaser.QuadTree._processingCallback(Phaser.QuadTree._object, checkObject)) {
                        overlapProcessed = true;
                    }
                    if(overlapProcessed && (Phaser.QuadTree._notifyCallback != null)) {
                        if(Phaser.QuadTree._callbackContext !== null) {
                            Phaser.QuadTree._notifyCallback.call(Phaser.QuadTree._callbackContext, Phaser.QuadTree._object, checkObject);
                        } else {
                            Phaser.QuadTree._notifyCallback(Phaser.QuadTree._object, checkObject);
                        }
                    }
                }
                Phaser.QuadTree._iterator = Phaser.QuadTree._iterator.next;
            }
            return overlapProcessed;
        };
        return QuadTree;
    })(Phaser.Rectangle);
    Phaser.QuadTree = QuadTree;    
})(Phaser || (Phaser = {}));
