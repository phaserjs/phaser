/// <reference path="../_definitions.ts" />

/**
* Phaser - QuadTree
*
* A fairly generic quad tree structure for rapid overlap checks. QuadTree is also configured for single or dual list operation.
* You can add items either to its A list or its B list. When you do an overlap check, you can compare the A list to itself,
* or the A list against the B list.  Handy for different things!
*/

module Phaser {

    export class QuadTree extends Rectangle {

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
        constructor(manager, x: number, y: number, width: number, height: number, parent: QuadTree = null) {

            super(x, y, width, height);

            QuadTree.physics = manager;

            this._headA = this._tailA = new Phaser.LinkedList();
            this._headB = this._tailB = new Phaser.LinkedList();

            //Copy the parent's children (if there are any)
            if (parent != null)
            {
                if (parent._headA.object != null)
                {
                    this._iterator = parent._headA;

                    while (this._iterator != null)
                    {
                        if (this._tailA.object != null)
                        {
                            this._ot = this._tailA;
                            this._tailA = new Phaser.LinkedList();
                            this._ot.next = this._tailA;
                        }

                        this._tailA.object = this._iterator.object;
                        this._iterator = this._iterator.next;
                    }
                }

                if (parent._headB.object != null)
                {
                    this._iterator = parent._headB;

                    while (this._iterator != null)
                    {
                        if (this._tailB.object != null)
                        {
                            this._ot = this._tailB;
                            this._tailB = new Phaser.LinkedList();
                            this._ot.next = this._tailB;
                        }

                        this._tailB.object = this._iterator.object;
                        this._iterator = this._iterator.next;
                    }
                }
            }
            else
            {
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

        //  Reused temporary vars to help avoid gc spikes
        private _iterator: Phaser.LinkedList;
        private _ot: Phaser.LinkedList;
        private _i;
        private _basic;
        private _members;
        private _l: number;
        private _overlapProcessed: boolean;
        private _checkObject;

        //public static physics: Phaser.Physics.Manager;
        public static physics;

        /**
         * Flag for specifying that you want to add an object to the A list.
         */
        public static A_LIST: number = 0;

        /**
         * Flag for specifying that you want to add an object to the B list.
         */
        public static B_LIST: number = 1;

        /**
         * Controls the granularity of the quad tree.  Default is 6 (decent performance on large and small worlds).
         */
        public static divisions: number;

        /**
         * Whether this branch of the tree can be subdivided or not.
         */
        private _canSubdivide: boolean;

        /**
         * Refers to the internal A and B linked lists,
         * which are used to store objects in the leaves.
         */
        private _headA: Phaser.LinkedList;

        /**
         * Refers to the internal A and B linked lists,
         * which are used to store objects in the leaves.
         */
        private _tailA: Phaser.LinkedList;

        /**
         * Refers to the internal A and B linked lists,
         * which are used to store objects in the leaves.
         */
        private _headB: Phaser.LinkedList;

        /**
         * Refers to the internal A and B linked lists,
         * which are used to store objects in the leaves.
         */
        private _tailB: Phaser.LinkedList;

        /**
         * Internal, governs and assists with the formation of the tree.
         */
        private static _min: number;

        /**
         * Internal, governs and assists with the formation of the tree.
         */
        private _northWestTree: QuadTree;

        /**
         * Internal, governs and assists with the formation of the tree.
         */
        private _northEastTree: QuadTree;

        /**
         * Internal, governs and assists with the formation of the tree.
         */
        private _southEastTree: QuadTree;

        /**
         * Internal, governs and assists with the formation of the tree.
         */
        private _southWestTree: QuadTree;

        /**
         * Internal, governs and assists with the formation of the tree.
         */
        private _leftEdge: number;

        /**
         * Internal, governs and assists with the formation of the tree.
         */
        private _rightEdge: number;

        /**
         * Internal, governs and assists with the formation of the tree.
         */
        private _topEdge: number;

        /**
         * Internal, governs and assists with the formation of the tree.
         */
        private _bottomEdge: number;

        /**
         * Internal, governs and assists with the formation of the tree.
         */
        private _halfWidth: number;

        /**
         * Internal, governs and assists with the formation of the tree.
         */
        private _halfHeight: number;

        /**
         * Internal, governs and assists with the formation of the tree.
         */
        private _midpointX: number;

        /**
         * Internal, governs and assists with the formation of the tree.
         */
        private _midpointY: number;

        /**
         * Internal, used to reduce recursive method parameters during object placement and tree formation.
         */
        private static _object;

        /**
         * Internal, used during tree processing and overlap checks.
         */
        private static _list: number;

        /**
         * Internal, used during tree processing and overlap checks.
         */
        private static _useBothLists: boolean;

        /**
         * Internal, used during tree processing and overlap checks.
         */
        private static _processingCallback;

        /**
         * Internal, used during tree processing and overlap checks.
         */
        private static _notifyCallback;

        /**
         * Internal, used during tree processing and overlap checks.
         */
        private static _callbackContext;

        /**
         * Internal, used during tree processing and overlap checks.
         */
        private static _iterator: Phaser.LinkedList;

        /**
         * Clean up memory.
         */
        public destroy() {

            this._tailA.destroy();
            this._tailB.destroy();
            this._headA.destroy();
            this._headB.destroy();

            this._tailA = null;
            this._tailB = null;
            this._headA = null;
            this._headB = null;

            if (this._northWestTree != null)
            {
                this._northWestTree.destroy();
            }

            if (this._northEastTree != null)
            {
                this._northEastTree.destroy();
            }

            if (this._southEastTree != null)
            {
                this._southEastTree.destroy();
            }

            if (this._southWestTree != null)
            {
                this._southWestTree.destroy();
            }

            this._northWestTree = null;
            this._northEastTree = null;
            this._southEastTree = null;
            this._southWestTree = null;

            QuadTree._object = null;
            QuadTree._processingCallback = null;
            QuadTree._notifyCallback = null;

        }

        /**
         * Load objects and/or groups into the quad tree, and register notify and processing callbacks.
         *
         * @param {} objectOrGroup1	Any object that is or extends IGameObject or Group.
         * @param {} objectOrGroup2	Any object that is or extends IGameObject or Group.  If null, the first parameter will be checked against itself.
         * @param {Function} notifyCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject)</code> that is called whenever two objects are found to overlap in world space, and either no processCallback is specified, or the processCallback returns true.
         * @param {Function} processCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject):bool</code> that is called whenever two objects are found to overlap in world space.  The notifyCallback is only called if this function returns true.  See GameObject.separate().
         * @param context The context in which the callbacks will be called
         */
        public load(objectOrGroup1, objectOrGroup2 = null, notifyCallback = null, processCallback = null, context = null) {

            this.add(objectOrGroup1, QuadTree.A_LIST);

            if (objectOrGroup2 != null)
            {
                this.add(objectOrGroup2, QuadTree.B_LIST);
                QuadTree._useBothLists = true;
            }
            else
            {
                QuadTree._useBothLists = false;
            }

            QuadTree._notifyCallback = notifyCallback;
            QuadTree._processingCallback = processCallback;
            QuadTree._callbackContext = context;

        }

        /**
         * Call this function to add an object to the root of the tree.
         * This function will recursively add all group members, but
         * not the groups themselves.
         *
         * @param {} objectOrGroup	GameObjects are just added, Groups are recursed and their applicable members added accordingly.
         * @param {Number} list	A <code>uint</code> flag indicating the list to which you want to add the objects.  Options are <code>QuadTree.A_LIST</code> and <code>QuadTree.B_LIST</code>.
         */
        public add(objectOrGroup, list: number) {

            QuadTree._list = list;

            if (objectOrGroup.type == Types.GROUP)
            {
                this._i = 0;
                this._members = <Group> objectOrGroup['members'];
                this._l = objectOrGroup['length'];

                while (this._i < this._l)
                {
                    this._basic = this._members[this._i++];

                    if (this._basic != null && this._basic.exists)
                    {
                        if (this._basic.type == Phaser.Types.GROUP)
                        {
                            this.add(this._basic, list);
                        }
                        else
                        {
                            QuadTree._object = this._basic;

                            if (QuadTree._object.exists && QuadTree._object.body.allowCollisions)
                            {
                                this.addObject();
                            }
                        }
                    }
                }
            }
            else
            {
                QuadTree._object = objectOrGroup;

                if (QuadTree._object.exists && QuadTree._object.body.allowCollisions)
                {
                    this.addObject();
                }
            }
        }

        /**
         * Internal function for recursively navigating and creating the tree
         * while adding objects to the appropriate nodes.
         */
        private addObject() {

            //If this quad (not its children) lies entirely inside this object, add it here
            if (!this._canSubdivide || ((this._leftEdge >= QuadTree._object.body.bounds.x) && (this._rightEdge <= QuadTree._object.body.bounds.right) && (this._topEdge >= QuadTree._object.body.bounds.y) && (this._bottomEdge <= QuadTree._object.body.bounds.bottom)))
            {
                this.addToList();
                return;
            }

            //See if the selected object fits completely inside any of the quadrants
            if ((QuadTree._object.body.bounds.x > this._leftEdge) && (QuadTree._object.body.bounds.right < this._midpointX))
            {
                if ((QuadTree._object.body.bounds.y > this._topEdge) && (QuadTree._object.body.bounds.bottom < this._midpointY))
                {
                    if (this._northWestTree == null)
                    {
                        this._northWestTree = new QuadTree(QuadTree.physics, this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
                    }

                    this._northWestTree.addObject();
                    return;
                }

                if ((QuadTree._object.body.bounds.y > this._midpointY) && (QuadTree._object.body.bounds.bottom < this._bottomEdge))
                {
                    if (this._southWestTree == null)
                    {
                        this._southWestTree = new QuadTree(QuadTree.physics, this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
                    }

                    this._southWestTree.addObject();
                    return;
                }
            }

            if ((QuadTree._object.body.bounds.x > this._midpointX) && (QuadTree._object.body.bounds.right < this._rightEdge))
            {
                if ((QuadTree._object.body.bounds.y > this._topEdge) && (QuadTree._object.body.bounds.bottom < this._midpointY))
                {
                    if (this._northEastTree == null)
                    {
                        this._northEastTree = new QuadTree(QuadTree.physics, this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
                    }

                    this._northEastTree.addObject();
                    return;
                }

                if ((QuadTree._object.body.bounds.y > this._midpointY) && (QuadTree._object.body.bounds.bottom < this._bottomEdge))
                {
                    if (this._southEastTree == null)
                    {
                        this._southEastTree = new QuadTree(QuadTree.physics, this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
                    }

                    this._southEastTree.addObject();
                    return;
                }
            }

            //If it wasn't completely contained we have to check out the partial overlaps
            if ((QuadTree._object.body.bounds.right > this._leftEdge) && (QuadTree._object.body.bounds.x < this._midpointX) && (QuadTree._object.body.bounds.bottom > this._topEdge) && (QuadTree._object.body.bounds.y < this._midpointY))
            {
                if (this._northWestTree == null)
                {
                    this._northWestTree = new QuadTree(QuadTree.physics, this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
                }

                this._northWestTree.addObject();
            }

            if ((QuadTree._object.body.bounds.right > this._midpointX) && (QuadTree._object.body.bounds.x < this._rightEdge) && (QuadTree._object.body.bounds.bottom > this._topEdge) && (QuadTree._object.body.bounds.y < this._midpointY))
            {
                if (this._northEastTree == null)
                {
                    this._northEastTree = new QuadTree(QuadTree.physics, this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
                }

                this._northEastTree.addObject();
            }

            if ((QuadTree._object.body.bounds.right > this._midpointX) && (QuadTree._object.body.bounds.x < this._rightEdge) && (QuadTree._object.body.bounds.bottom > this._midpointY) && (QuadTree._object.body.bounds.y < this._bottomEdge))
            {
                if (this._southEastTree == null)
                {
                    this._southEastTree = new QuadTree(QuadTree.physics, this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
                }

                this._southEastTree.addObject();
            }

            if ((QuadTree._object.body.bounds.right > this._leftEdge) && (QuadTree._object.body.bounds.x < this._midpointX) && (QuadTree._object.body.bounds.bottom > this._midpointY) && (QuadTree._object.body.bounds.y < this._bottomEdge))
            {
                if (this._southWestTree == null)
                {
                    this._southWestTree = new QuadTree(QuadTree.physics, this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
                }

                this._southWestTree.addObject();
            }

        }

        /**
         * Internal function for recursively adding objects to leaf lists.
         */
        private addToList() {

            if (QuadTree._list == QuadTree.A_LIST)
            {
                if (this._tailA.object != null)
                {
                    this._ot = this._tailA;
                    this._tailA = new LinkedList();
                    this._ot.next = this._tailA;
                }

                this._tailA.object = QuadTree._object;
            }
            else
            {
                if (this._tailB.object != null)
                {
                    this._ot = this._tailB;
                    this._tailB = new LinkedList();
                    this._ot.next = this._tailB;
                }

                this._tailB.object = QuadTree._object;
            }

            if (!this._canSubdivide)
            {
                return;
            }

            if (this._northWestTree != null)
            {
                this._northWestTree.addToList();
            }

            if (this._northEastTree != null)
            {
                this._northEastTree.addToList();
            }

            if (this._southEastTree != null)
            {
                this._southEastTree.addToList();
            }

            if (this._southWestTree != null)
            {
                this._southWestTree.addToList();
            }

        }

        /**
         * <code>QuadTree</code>'s other main function.  Call this after adding objects
         * using <code>QuadTree.load()</code> to compare the objects that you loaded.
         *
         * @return {Boolean} Whether or not any overlaps were found.
         */
        public execute(): boolean {

            this._overlapProcessed = false;

            if (this._headA.object != null)
            {
                this._iterator = this._headA;

                while (this._iterator != null)
                {
                    QuadTree._object = this._iterator.object;

                    if (QuadTree._useBothLists)
                    {
                        QuadTree._iterator = this._headB;
                    }
                    else
                    {
                        QuadTree._iterator = this._iterator.next;
                    }

                    if (QuadTree._object.exists && (QuadTree._object.body.allowCollisions > 0) && (QuadTree._iterator != null) && (QuadTree._iterator.object != null) && QuadTree._iterator.object.exists && this.overlapNode())
                    {
                        this._overlapProcessed = true;
                    }

                    this._iterator = this._iterator.next;

                }
            }

            //Advance through the tree by calling overlap on each child
            if ((this._northWestTree != null) && this._northWestTree.execute())
            {
                this._overlapProcessed = true;
            }

            if ((this._northEastTree != null) && this._northEastTree.execute())
            {
                this._overlapProcessed = true;
            }

            if ((this._southEastTree != null) && this._southEastTree.execute())
            {
                this._overlapProcessed = true;
            }

            if ((this._southWestTree != null) && this._southWestTree.execute())
            {
                this._overlapProcessed = true;
            }

            return this._overlapProcessed;

        }

        /**
         * A private for comparing an object against the contents of a node.
         *
         * @return {Boolean} Whether or not any overlaps were found.
         */
        private overlapNode(): boolean {

            //Walk the list and check for overlaps
            this._overlapProcessed = false;

            while (QuadTree._iterator != null)
            {
                if (!QuadTree._object.exists || (QuadTree._object.body.allowCollisions <= 0))
                {
                    break;
                }

                this._checkObject = QuadTree._iterator.object;

                if ((QuadTree._object === this._checkObject) || !this._checkObject.exists || (this._checkObject.body.allowCollisions <= 0))
                {
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

        }
    }

}