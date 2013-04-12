/// <reference path="../Rectangle.ts" />
/// <reference path="../Basic.ts" />
/// <reference path="LinkedList.ts" />

/**
 * A fairly generic quad tree structure for rapid overlap checks.
 * QuadTree is also configured for single or dual list operation.
 * You can add items either to its A list or its B list.
 * When you do an overlap check, you can compare the A list to itself,
 * or the A list against the B list.  Handy for different things!
 */
class QuadTree extends Rectangle {

    /**
     * Instantiate a new Quad Tree node.
     * 
     * @param	X			The X-coordinate of the point in space.
     * @param	Y			The Y-coordinate of the point in space.
     * @param	Width		Desired width of this node.
     * @param	Height		Desired height of this node.
     * @param	Parent		The parent branch or node.  Pass null to create a root.
     */
    constructor(X: number, Y: number, Width: number, Height: number, Parent: QuadTree = null) {

        super(X, Y, Width, Height);

        //console.log('-------- QuadTree',X,Y,Width,Height);

        this._headA = this._tailA = new LinkedList();
        this._headB = this._tailB = new LinkedList();

        //Copy the parent's children (if there are any)
        if (Parent != null)
        {
            //console.log('Parent not null');
            var iterator: LinkedList;
            var ot: LinkedList;

            if (Parent._headA.object != null)
            {
                iterator = Parent._headA;
                //console.log('iterator set to parent headA');

                while (iterator != null)
                {
                    if (this._tailA.object != null)
                    {
                        ot = this._tailA;
                        this._tailA = new LinkedList();
                        ot.next = this._tailA;
                    }

                    this._tailA.object = iterator.object;
                    iterator = iterator.next;
                }
            }

            if (Parent._headB.object != null)
            {
                iterator = Parent._headB;
                //console.log('iterator set to parent headB');

                while (iterator != null)
                {
                    if (this._tailB.object != null)
                    {
                        ot = this._tailB;
                        this._tailB = new LinkedList();
                        ot.next = this._tailB;
                    }

                    this._tailB.object = iterator.object;
                    iterator = iterator.next;
                }
            }
        }
        else
        {
            QuadTree._min = (this.width + this.height) / (2 * QuadTree.divisions);
        }

        this._canSubdivide = (this.width > QuadTree._min) || (this.height > QuadTree._min);

        //console.log('canSubdivided', this._canSubdivide);

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
    private _canSubdivide: bool;

    /**
     * Refers to the internal A and B linked lists,
     * which are used to store objects in the leaves.
     */
    private _headA: LinkedList;

    /**
     * Refers to the internal A and B linked lists,
     * which are used to store objects in the leaves.
     */
    private _tailA: LinkedList;

    /**
     * Refers to the internal A and B linked lists,
     * which are used to store objects in the leaves.
     */
    private _headB: LinkedList;

    /**
     * Refers to the internal A and B linked lists,
     * which are used to store objects in the leaves.
     */
    private _tailB: LinkedList;

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
     * Internal, used to reduce recursive method parameters during object placement and tree formation.
     */
    private static _objectLeftEdge: number;

    /**
     * Internal, used to reduce recursive method parameters during object placement and tree formation.
     */
    private static _objectTopEdge: number;

    /**
     * Internal, used to reduce recursive method parameters during object placement and tree formation.
     */
    private static _objectRightEdge: number;

    /**
     * Internal, used to reduce recursive method parameters during object placement and tree formation.
     */
    private static _objectBottomEdge: number;

    /**
     * Internal, used during tree processing and overlap checks.
     */
    private static _list: number;

    /**
     * Internal, used during tree processing and overlap checks.
     */
    private static _useBothLists: bool;

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
    private static _iterator: LinkedList;

    /**
     * Internal, helpers for comparing actual object-to-object overlap - see <code>overlapNode()</code>.
     */
    private static _objectHullX: number;

    /**
     * Internal, helpers for comparing actual object-to-object overlap - see <code>overlapNode()</code>.
     */
    private static _objectHullY: number;

    /**
     * Internal, helpers for comparing actual object-to-object overlap - see <code>overlapNode()</code>.
     */
    private static _objectHullWidth: number;

    /**
     * Internal, helpers for comparing actual object-to-object overlap - see <code>overlapNode()</code>.
     */
    private static _objectHullHeight: number;

    /**
     * Internal, helpers for comparing actual object-to-object overlap - see <code>overlapNode()</code>.
     */
    private static _checkObjectHullX: number;

    /**
     * Internal, helpers for comparing actual object-to-object overlap - see <code>overlapNode()</code>.
     */
    private static _checkObjectHullY: number;

    /**
     * Internal, helpers for comparing actual object-to-object overlap - see <code>overlapNode()</code>.
     */
    private static _checkObjectHullWidth: number;

    /**
     * Internal, helpers for comparing actual object-to-object overlap - see <code>overlapNode()</code>.
     */
    private static _checkObjectHullHeight: number;

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
     * @param ObjectOrGroup1	Any object that is or extends GameObject or Group.
     * @param ObjectOrGroup2	Any object that is or extends GameObject or Group.  If null, the first parameter will be checked against itself.
     * @param NotifyCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject)</code> that is called whenever two objects are found to overlap in world space, and either no ProcessCallback is specified, or the ProcessCallback returns true. 
     * @param ProcessCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject):bool</code> that is called whenever two objects are found to overlap in world space.  The NotifyCallback is only called if this function returns true.  See GameObject.separate(). 
     */
    public load(ObjectOrGroup1: Basic, ObjectOrGroup2: Basic = null, NotifyCallback = null, ProcessCallback = null) {

        //console.log('quadtree load', QuadTree.divisions, ObjectOrGroup1, ObjectOrGroup2);

        this.add(ObjectOrGroup1, QuadTree.A_LIST);

        if (ObjectOrGroup2 != null)
        {
            this.add(ObjectOrGroup2, QuadTree.B_LIST);
            QuadTree._useBothLists = true;
        }
        else
        {
            QuadTree._useBothLists = false;
        }

        QuadTree._notifyCallback = NotifyCallback;
        QuadTree._processingCallback = ProcessCallback;

        //console.log('use both', QuadTree._useBothLists);
        //console.log('------------ end of load');

    }

    /**
     * Call this function to add an object to the root of the tree.
     * This function will recursively add all group members, but
     * not the groups themselves.
     * 
     * @param	ObjectOrGroup	GameObjects are just added, Groups are recursed and their applicable members added accordingly.
     * @param	List			A <code>uint</code> flag indicating the list to which you want to add the objects.  Options are <code>QuadTree.A_LIST</code> and <code>QuadTree.B_LIST</code>.
     */
    public add(ObjectOrGroup: Basic, List: number) {

        QuadTree._list = List;

        if (ObjectOrGroup.isGroup == true)
        {
            var i: number = 0;
            var basic: Basic;
            var members = <Group> ObjectOrGroup['members'];
            var l: number = ObjectOrGroup['length'];

            while (i < l)
            {
                basic = members[i++];

                if ((basic != null) && basic.exists)
                {
                    if (basic.isGroup)
                    {
                        this.add(basic, List);
                    }
                    else
                    {
                        QuadTree._object = basic;

                        if (QuadTree._object.exists && QuadTree._object.allowCollisions)
                        {
                            QuadTree._objectLeftEdge = QuadTree._object.x;
                            QuadTree._objectTopEdge = QuadTree._object.y;
                            QuadTree._objectRightEdge = QuadTree._object.x + QuadTree._object.width;
                            QuadTree._objectBottomEdge = QuadTree._object.y + QuadTree._object.height;
                            this.addObject();
                        }
                    }
                }
            }
        }
        else
        {
            QuadTree._object = ObjectOrGroup;

            //console.log('add - not group:', ObjectOrGroup.name);

            if (QuadTree._object.exists && QuadTree._object.allowCollisions)
            {
                QuadTree._objectLeftEdge = QuadTree._object.x;
                QuadTree._objectTopEdge = QuadTree._object.y;
                QuadTree._objectRightEdge = QuadTree._object.x + QuadTree._object.width;
                QuadTree._objectBottomEdge = QuadTree._object.y + QuadTree._object.height;
                //console.log('object properties', QuadTree._objectLeftEdge, QuadTree._objectTopEdge, QuadTree._objectRightEdge, QuadTree._objectBottomEdge);
                this.addObject();
            }
        }
    }

    /**
     * Internal function for recursively navigating and creating the tree
     * while adding objects to the appropriate nodes.
     */
    private addObject() {

        //console.log('addObject');

        //If this quad (not its children) lies entirely inside this object, add it here
        if (!this._canSubdivide || ((this._leftEdge >= QuadTree._objectLeftEdge) && (this._rightEdge <= QuadTree._objectRightEdge) && (this._topEdge >= QuadTree._objectTopEdge) && (this._bottomEdge <= QuadTree._objectBottomEdge)))
        {
            //console.log('add To List');
            this.addToList();
            return;
        }

        //See if the selected object fits completely inside any of the quadrants
        if ((QuadTree._objectLeftEdge > this._leftEdge) && (QuadTree._objectRightEdge < this._midpointX))
        {
            if ((QuadTree._objectTopEdge > this._topEdge) && (QuadTree._objectBottomEdge < this._midpointY))
            {
                //console.log('Adding NW tree');

                if (this._northWestTree == null)
                {
                    this._northWestTree = new QuadTree(this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
                }

                this._northWestTree.addObject();
                return;
            }

            if ((QuadTree._objectTopEdge > this._midpointY) && (QuadTree._objectBottomEdge < this._bottomEdge))
            {
                //console.log('Adding SW tree');

                if (this._southWestTree == null)
                {
                    this._southWestTree = new QuadTree(this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
                }

                this._southWestTree.addObject();
                return;
            }
        }

        if ((QuadTree._objectLeftEdge > this._midpointX) && (QuadTree._objectRightEdge < this._rightEdge))
        {
            if ((QuadTree._objectTopEdge > this._topEdge) && (QuadTree._objectBottomEdge < this._midpointY))
            {
                //console.log('Adding NE tree');

                if (this._northEastTree == null)
                {
                    this._northEastTree = new QuadTree(this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
                }

                this._northEastTree.addObject();
                return;
            }

            if ((QuadTree._objectTopEdge > this._midpointY) && (QuadTree._objectBottomEdge < this._bottomEdge))
            {
                //console.log('Adding SE tree');

                if (this._southEastTree == null)
                {
                    this._southEastTree = new QuadTree(this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
                }

                this._southEastTree.addObject();
                return;
            }
        }

        //If it wasn't completely contained we have to check out the partial overlaps
        if ((QuadTree._objectRightEdge > this._leftEdge) && (QuadTree._objectLeftEdge < this._midpointX) && (QuadTree._objectBottomEdge > this._topEdge) && (QuadTree._objectTopEdge < this._midpointY))
        {
            if (this._northWestTree == null)
            {
                this._northWestTree = new QuadTree(this._leftEdge, this._topEdge, this._halfWidth, this._halfHeight, this);
            }

            //console.log('added to north west partial tree');
            this._northWestTree.addObject();
        }

        if ((QuadTree._objectRightEdge > this._midpointX) && (QuadTree._objectLeftEdge < this._rightEdge) && (QuadTree._objectBottomEdge > this._topEdge) && (QuadTree._objectTopEdge < this._midpointY))
        {
            if (this._northEastTree == null)
            {
                this._northEastTree = new QuadTree(this._midpointX, this._topEdge, this._halfWidth, this._halfHeight, this);
            }

            //console.log('added to north east partial tree');
            this._northEastTree.addObject();
        }

        if ((QuadTree._objectRightEdge > this._midpointX) && (QuadTree._objectLeftEdge < this._rightEdge) && (QuadTree._objectBottomEdge > this._midpointY) && (QuadTree._objectTopEdge < this._bottomEdge))
        {
            if (this._southEastTree == null)
            {
                this._southEastTree = new QuadTree(this._midpointX, this._midpointY, this._halfWidth, this._halfHeight, this);
            }

            //console.log('added to south east partial tree');
            this._southEastTree.addObject();
        }

        if ((QuadTree._objectRightEdge > this._leftEdge) && (QuadTree._objectLeftEdge < this._midpointX) && (QuadTree._objectBottomEdge > this._midpointY) && (QuadTree._objectTopEdge < this._bottomEdge))
        {
            if (this._southWestTree == null)
            {
                this._southWestTree = new QuadTree(this._leftEdge, this._midpointY, this._halfWidth, this._halfHeight, this);
            }

            //console.log('added to south west partial tree');
            this._southWestTree.addObject();
        }

    }

    /**
     * Internal function for recursively adding objects to leaf lists.
     */
    private addToList() {

        //console.log('Adding to List');

        var ot: LinkedList;

        if (QuadTree._list == QuadTree.A_LIST)
        {
            //console.log('A LIST');
            if (this._tailA.object != null)
            {
                ot = this._tailA;
                this._tailA = new LinkedList();
                ot.next = this._tailA;
            }

            this._tailA.object = QuadTree._object;
        }
        else
        {
            //console.log('B LIST');
            if (this._tailB.object != null)
            {
                ot = this._tailB;
                this._tailB = new LinkedList();
                ot.next = this._tailB;
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
     * @return	Whether or not any overlaps were found.
     */
    public execute(): bool {

        //console.log('quadtree execute');
        
        var overlapProcessed: bool = false;
        var iterator: LinkedList;

        if (this._headA.object != null)
        {
            //console.log('---------------------------------------------------');
            //console.log('headA iterator');

            iterator = this._headA;

            while (iterator != null)
            {
                QuadTree._object = iterator.object;

                if (QuadTree._useBothLists)
                {
                    QuadTree._iterator = this._headB;
                }
                else
                {
                    QuadTree._iterator = iterator.next;
                }

                if (QuadTree._object.exists && (QuadTree._object.allowCollisions > 0) && (QuadTree._iterator != null) && (QuadTree._iterator.object != null) && QuadTree._iterator.object.exists && this.overlapNode())
                {
                    //console.log('headA iterator overlapped true');
                    overlapProcessed = true;
                }

                iterator = iterator.next;

            }
        }

        //Advance through the tree by calling overlap on each child
        if ((this._northWestTree != null) && this._northWestTree.execute())
        {
            //console.log('NW quadtree execute');
            overlapProcessed = true;
        }
        
        if ((this._northEastTree != null) && this._northEastTree.execute())
        {
            //console.log('NE quadtree execute');
            overlapProcessed = true;
        }
        
        if ((this._southEastTree != null) && this._southEastTree.execute())
        {
            //console.log('SE quadtree execute');
            overlapProcessed = true;
        }
        
        if ((this._southWestTree != null) && this._southWestTree.execute())
        {
            //console.log('SW quadtree execute');
            overlapProcessed = true;
        }

        return overlapProcessed;

    }

    /**
     * An private for comparing an object against the contents of a node.
     * 
     * @return	Whether or not any overlaps were found.
     */
    private overlapNode(): bool {

        //console.log('overlapNode');

        //Walk the list and check for overlaps
        var overlapProcessed: bool = false;
        var checkObject;

        while (QuadTree._iterator != null)
        {
            if (!QuadTree._object.exists || (QuadTree._object.allowCollisions <= 0))
            {
                //console.log('break 1');
                break;
            }

            checkObject = QuadTree._iterator.object;

            if ((QuadTree._object === checkObject) || !checkObject.exists || (checkObject.allowCollisions <= 0))
            {
                //console.log('break 2');
                QuadTree._iterator = QuadTree._iterator.next;
                continue;
            }

            //calculate bulk hull for QuadTree._object
            QuadTree._objectHullX = (QuadTree._object.x < QuadTree._object.last.x) ? QuadTree._object.x : QuadTree._object.last.x;
            QuadTree._objectHullY = (QuadTree._object.y < QuadTree._object.last.y) ? QuadTree._object.y : QuadTree._object.last.y;
            QuadTree._objectHullWidth = QuadTree._object.x - QuadTree._object.last.x;
            QuadTree._objectHullWidth = QuadTree._object.width + ((QuadTree._objectHullWidth > 0) ? QuadTree._objectHullWidth : -QuadTree._objectHullWidth);
            QuadTree._objectHullHeight = QuadTree._object.y - QuadTree._object.last.y;
            QuadTree._objectHullHeight = QuadTree._object.height + ((QuadTree._objectHullHeight > 0) ? QuadTree._objectHullHeight : -QuadTree._objectHullHeight);

            //calculate bulk hull for checkObject
            QuadTree._checkObjectHullX = (checkObject.x < checkObject.last.x) ? checkObject.x : checkObject.last.x;
            QuadTree._checkObjectHullY = (checkObject.y < checkObject.last.y) ? checkObject.y : checkObject.last.y;
            QuadTree._checkObjectHullWidth = checkObject.x - checkObject.last.x;
            QuadTree._checkObjectHullWidth = checkObject.width + ((QuadTree._checkObjectHullWidth > 0) ? QuadTree._checkObjectHullWidth : -QuadTree._checkObjectHullWidth);
            QuadTree._checkObjectHullHeight = checkObject.y - checkObject.last.y;
            QuadTree._checkObjectHullHeight = checkObject.height + ((QuadTree._checkObjectHullHeight > 0) ? QuadTree._checkObjectHullHeight : -QuadTree._checkObjectHullHeight);

            //check for intersection of the two hulls
            if ((QuadTree._objectHullX + QuadTree._objectHullWidth > QuadTree._checkObjectHullX) && (QuadTree._objectHullX < QuadTree._checkObjectHullX + QuadTree._checkObjectHullWidth) && (QuadTree._objectHullY + QuadTree._objectHullHeight > QuadTree._checkObjectHullY) && (QuadTree._objectHullY < QuadTree._checkObjectHullY + QuadTree._checkObjectHullHeight))
            {
                //console.log('intersection!');

                //Execute callback functions if they exist
                if ((QuadTree._processingCallback == null) || QuadTree._processingCallback(QuadTree._object, checkObject))
                {
                    overlapProcessed = true;
                }

                if (overlapProcessed && (QuadTree._notifyCallback != null))
                {
                    QuadTree._notifyCallback(QuadTree._object, checkObject);
                }
            }

            QuadTree._iterator = QuadTree._iterator.next;

        }

        return overlapProcessed;

    }
}
