/**
* Phaser - Point
*
* The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis.
*/
module Phaser {
    class Point {
        /**
        * Creates a new Point. If you pass no parameters a Point is created set to (0,0).
        * @class Point
        * @constructor
        * @param {Number} x The horizontal position of this Point (default 0)
        * @param {Number} y The vertical position of this Point (default 0)
        **/
        constructor(x?: number, y?: number);
        public x: number;
        public y: number;
        /**
        * Copies the x and y properties from any given object to this Point.
        * @method copyFrom
        * @param {any} source - The object to copy from.
        * @return {Point} This Point object.
        **/
        public copyFrom(source: any): Point;
        /**
        * Inverts the x and y values of this Point
        * @method invert
        * @return {Point} This Point object.
        **/
        public invert(): Point;
        /**
        * Sets the x and y values of this MicroPoint object to the given coordinates.
        * @method setTo
        * @param {Number} x - The horizontal position of this point.
        * @param {Number} y - The vertical position of this point.
        * @return {MicroPoint} This MicroPoint object. Useful for chaining method calls.
        **/
        public setTo(x: number, y: number): Point;
        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        public toString(): string;
    }
}
/**
*	Rectangle
*
*	@desc 		A Rectangle object is an area defined by its position, as indicated by its top-left corner (x,y) and width and height.
*
*	@version 	1.6 - 24th May 2013
*	@author 	Richard Davey
*/
module Phaser {
    class Rectangle {
        /**
        * Creates a new Rectangle object with the top-left corner specified by the x and y parameters and with the specified width and height parameters. If you call this function without parameters, a Rectangle with x, y, width, and height properties set to 0 is created.
        * @class Rectangle
        * @constructor
        * @param {Number} x The x coordinate of the top-left corner of the Rectangle.
        * @param {Number} y The y coordinate of the top-left corner of the Rectangle.
        * @param {Number} width The width of the Rectangle in pixels.
        * @param {Number} height The height of the Rectangle in pixels.
        * @return {Rectangle} This Rectangle object
        **/
        constructor(x?: number, y?: number, width?: number, height?: number);
        /**
        * The x coordinate of the top-left corner of the Rectangle
        * @property x
        * @type Number
        **/
        public x: number;
        /**
        * The y coordinate of the top-left corner of the Rectangle
        * @property y
        * @type Number
        **/
        public y: number;
        /**
        * The width of the Rectangle in pixels
        * @property width
        * @type Number
        **/
        public width: number;
        /**
        * The height of the Rectangle in pixels
        * @property height
        * @type Number
        **/
        public height: number;
        /**
        * Half of the width of the Rectangle
        * @property halfWidth
        * @type Number
        **/
        public halfWidth : number;
        /**
        * Half of the height of the Rectangle
        * @property halfHeight
        * @type Number
        **/
        public halfHeight : number;
        /**
        * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
        * @method bottom
        * @return {Number}
        **/
        /**
        * The sum of the y and height properties. Changing the bottom property of a Rectangle object has no effect on the x, y and width properties, but does change the height property.
        * @method bottom
        * @param {Number} value
        **/
        public bottom : number;
        /**
        * Sets the bottom-right corner of the Rectangle, determined by the values of the given Point object.
        * @method bottomRight
        * @param {Point} value
        **/
        public bottomRight : Point;
        /**
        * The x coordinate of the left of the Rectangle. Changing the left property of a Rectangle object has no effect on the y and height properties. However it does affect the width property, whereas changing the x value does not affect the width property.
        * @method left
        * @ return {number}
        **/
        /**
        * The x coordinate of the left of the Rectangle. Changing the left property of a Rectangle object has no effect on the y and height properties.
        * However it does affect the width, whereas changing the x value does not affect the width property.
        * @method left
        * @param {Number} value
        **/
        public left : number;
        /**
        * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
        * However it does affect the width property.
        * @method right
        * @return {Number}
        **/
        /**
        * The sum of the x and width properties. Changing the right property of a Rectangle object has no effect on the x, y and height properties.
        * However it does affect the width property.
        * @method right
        * @param {Number} value
        **/
        public right : number;
        /**
        * The volume of the Rectangle derived from width * height
        * @method volume
        * @return {Number}
        **/
        public volume : number;
        /**
        * The perimeter size of the Rectangle. This is the sum of all 4 sides.
        * @method perimeter
        * @return {Number}
        **/
        public perimeter : number;
        /**
        * The y coordinate of the top of the Rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties.
        * However it does affect the height property, whereas changing the y value does not affect the height property.
        * @method top
        * @return {Number}
        **/
        /**
        * The y coordinate of the top of the Rectangle. Changing the top property of a Rectangle object has no effect on the x and width properties.
        * However it does affect the height property, whereas changing the y value does not affect the height property.
        * @method top
        * @param {Number} value
        **/
        public top : number;
        /**
        * The location of the Rectangles top-left corner, determined by the x and y coordinates of the Point.
        * @method topLeft
        * @param {Point} value
        **/
        public topLeft : Point;
        /**
        * Determines whether or not this Rectangle object is empty.
        * @method isEmpty
        * @return {Boolean} A value of true if the Rectangle objects width or height is less than or equal to 0; otherwise false.
        **/
        /**
        * Sets all of the Rectangle object's properties to 0. A Rectangle object is empty if its width or height is less than or equal to 0.
        * @method setEmpty
        * @return {Rectangle} This Rectangle object
        **/
        public empty : bool;
        /**
        * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
        * @method offset
        * @param {Number} dx Moves the x value of the Rectangle object by this amount.
        * @param {Number} dy Moves the y value of the Rectangle object by this amount.
        * @return {Rectangle} This Rectangle object.
        **/
        public offset(dx: number, dy: number): Rectangle;
        /**
        * Adjusts the location of the Rectangle object using a Point object as a parameter. This method is similar to the Rectangle.offset() method, except that it takes a Point object as a parameter.
        * @method offsetPoint
        * @param {Point} point A Point object to use to offset this Rectangle object.
        * @return {Rectangle} This Rectangle object.
        **/
        public offsetPoint(point: Point): Rectangle;
        /**
        * Sets the members of Rectangle to the specified values.
        * @method setTo
        * @param {Number} x The x coordinate of the top-left corner of the Rectangle.
        * @param {Number} y The y coordinate of the top-left corner of the Rectangle.
        * @param {Number} width The width of the Rectangle in pixels.
        * @param {Number} height The height of the Rectangle in pixels.
        * @return {Rectangle} This Rectangle object
        **/
        public setTo(x: number, y: number, width: number, height: number): Rectangle;
        /**
        * Copies the x, y, width and height properties from any given object to this Rectangle.
        * @method copyFrom
        * @param {any} source - The object to copy from.
        * @return {Rectangle} This Rectangle object.
        **/
        public copyFrom(source: any): Rectangle;
        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        public toString(): string;
    }
}
module Phaser {
    interface IGameObject {
        /**
        * Reference to the main game object
        */
        game: Game;
        /**
        * The type of game object.
        */
        type: number;
        /**
        * The ID of the Group this Sprite belongs to.
        */
        group: Group;
        /**
        * The name of the Game Object. Typically not set by Phaser, but extremely useful for debugging / logic.
        */
        name: string;
        /**
        * x value of the object.
        */
        x: number;
        /**
        * y value of the object.
        */
        y: number;
        /**
        * z-index value of the object.
        */
        z: number;
        /**
        * Controls if both <code>update</code> and render are called by the core game loop.
        */
        exists: bool;
        /**
        * Controls if <code>update()</code> is automatically called by the core game loop.
        */
        active: bool;
        /**
        * Controls if this is rendered or skipped during the core game loop.
        */
        visible: bool;
        /**
        * The animation manager component
        */
        animations: Components.AnimationManager;
        /**
        * Associated events
        */
        events;
        /**
        * The input component
        */
        input;
        /**
        * The texture used to render.
        */
        texture: Components.Texture;
        /**
        * The transform component.
        */
        transform: Components.Transform;
    }
}
/**
* Phaser - LinkedList
*
* A miniature linked list class. Useful for optimizing time-critical or highly repetitive tasks!
*/
module Phaser {
    class LinkedList {
        /**
        * Creates a new link, and sets <code>object</code> and <code>next</code> to <code>null</code>.
        */
        constructor();
        /**
        * Stores a reference to an <code>IGameObject</code>.
        */
        public object: IGameObject;
        /**
        * Stores a reference to the next link in the list.
        */
        public next: LinkedList;
        /**
        * Clean up memory.
        */
        public destroy(): void;
    }
}
/**
* Phaser - QuadTree
*
* A fairly generic quad tree structure for rapid overlap checks. QuadTree is also configured for single or dual list operation.
* You can add items either to its A list or its B list. When you do an overlap check, you can compare the A list to itself,
* or the A list against the B list.  Handy for different things!
*/
module Phaser {
    class QuadTree extends Rectangle {
        /**
        * Instantiate a new Quad Tree node.
        *
        * @param {Number} x			The X-coordinate of the point in space.
        * @param {Number} y			The Y-coordinate of the point in space.
        * @param {Number} width		Desired width of this node.
        * @param {Number} height		Desired height of this node.
        * @param {Number} parent		The parent branch or node.  Pass null to create a root.
        */
        constructor(manager: Physics.Manager, x: number, y: number, width: number, height: number, parent?: QuadTree);
        private _iterator;
        private _ot;
        private _i;
        private _basic;
        private _members;
        private _l;
        private _overlapProcessed;
        private _checkObject;
        static physics: Physics.Manager;
        /**
        * Flag for specifying that you want to add an object to the A list.
        */
        static A_LIST: number;
        /**
        * Flag for specifying that you want to add an object to the B list.
        */
        static B_LIST: number;
        /**
        * Controls the granularity of the quad tree.  Default is 6 (decent performance on large and small worlds).
        */
        static divisions: number;
        /**
        * Whether this branch of the tree can be subdivided or not.
        */
        private _canSubdivide;
        /**
        * Refers to the internal A and B linked lists,
        * which are used to store objects in the leaves.
        */
        private _headA;
        /**
        * Refers to the internal A and B linked lists,
        * which are used to store objects in the leaves.
        */
        private _tailA;
        /**
        * Refers to the internal A and B linked lists,
        * which are used to store objects in the leaves.
        */
        private _headB;
        /**
        * Refers to the internal A and B linked lists,
        * which are used to store objects in the leaves.
        */
        private _tailB;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private static _min;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _northWestTree;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _northEastTree;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _southEastTree;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _southWestTree;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _leftEdge;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _rightEdge;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _topEdge;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _bottomEdge;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _halfWidth;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _halfHeight;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _midpointX;
        /**
        * Internal, governs and assists with the formation of the tree.
        */
        private _midpointY;
        /**
        * Internal, used to reduce recursive method parameters during object placement and tree formation.
        */
        private static _object;
        /**
        * Internal, used during tree processing and overlap checks.
        */
        private static _list;
        /**
        * Internal, used during tree processing and overlap checks.
        */
        private static _useBothLists;
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
        private static _iterator;
        /**
        * Clean up memory.
        */
        public destroy(): void;
        /**
        * Load objects and/or groups into the quad tree, and register notify and processing callbacks.
        *
        * @param {} objectOrGroup1	Any object that is or extends IGameObject or Group.
        * @param {} objectOrGroup2	Any object that is or extends IGameObject or Group.  If null, the first parameter will be checked against itself.
        * @param {Function} notifyCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject)</code> that is called whenever two objects are found to overlap in world space, and either no processCallback is specified, or the processCallback returns true.
        * @param {Function} processCallback	A function with the form <code>myFunction(Object1:GameObject,Object2:GameObject):bool</code> that is called whenever two objects are found to overlap in world space.  The notifyCallback is only called if this function returns true.  See GameObject.separate().
        * @param context The context in which the callbacks will be called
        */
        public load(objectOrGroup1, objectOrGroup2?, notifyCallback?, processCallback?, context?): void;
        /**
        * Call this function to add an object to the root of the tree.
        * This function will recursively add all group members, but
        * not the groups themselves.
        *
        * @param {} objectOrGroup	GameObjects are just added, Groups are recursed and their applicable members added accordingly.
        * @param {Number} list	A <code>uint</code> flag indicating the list to which you want to add the objects.  Options are <code>QuadTree.A_LIST</code> and <code>QuadTree.B_LIST</code>.
        */
        public add(objectOrGroup, list: number): void;
        /**
        * Internal function for recursively navigating and creating the tree
        * while adding objects to the appropriate nodes.
        */
        private addObject();
        /**
        * Internal function for recursively adding objects to leaf lists.
        */
        private addToList();
        /**
        * <code>QuadTree</code>'s other main function.  Call this after adding objects
        * using <code>QuadTree.load()</code> to compare the objects that you loaded.
        *
        * @return {Boolean} Whether or not any overlaps were found.
        */
        public execute(): bool;
        /**
        * A private for comparing an object against the contents of a node.
        *
        * @return {Boolean} Whether or not any overlaps were found.
        */
        private overlapNode();
    }
}
/**
* Phaser - Vec2
*
* A Vector 2
*/
module Phaser {
    class Vec2 {
        /**
        * Creates a new Vec2 object.
        * @class Vec2
        * @constructor
        * @param {Number} x The x position of the vector
        * @param {Number} y The y position of the vector
        * @return {Vec2} This object
        **/
        constructor(x?: number, y?: number);
        /**
        * The x coordinate of the vector
        * @property x
        * @type Number
        **/
        public x: number;
        /**
        * The y coordinate of the vector
        * @property y
        * @type Number
        **/
        public y: number;
        /**
        * Copies the x and y properties from any given object to this Vec2.
        * @method copyFrom
        * @param {any} source - The object to copy from.
        * @return {Vec2} This Vec2 object.
        **/
        public copyFrom(source: any): Vec2;
        /**
        * Sets the x and y properties of the Vector.
        * @param {Number} x The x position of the vector
        * @param {Number} y The y position of the vector
        * @return {Vec2} This object
        **/
        public setTo(x: number, y: number): Vec2;
        /**
        * Add another vector to this one.
        *
        * @param {Vec2} other The other Vector.
        * @return {Vec2} This for chaining.
        */
        public add(a: Vec2): Vec2;
        /**
        * Subtract another vector from this one.
        *
        * @param {Vec2} other The other Vector.
        * @return {Vec2} This for chaining.
        */
        public subtract(v: Vec2): Vec2;
        /**
        * Multiply another vector with this one.
        *
        * @param {Vec2} other The other Vector.
        * @return {Vec2} This for chaining.
        */
        public multiply(v: Vec2): Vec2;
        /**
        * Divide this vector by another one.
        *
        * @param {Vec2} other The other Vector.
        * @return {Vec2} This for chaining.
        */
        public divide(v: Vec2): Vec2;
        /**
        * Get the length of this vector.
        *
        * @return {number} The length of this vector.
        */
        public length(): number;
        /**
        * Get the length squared of this vector.
        *
        * @return {number} The length^2 of this vector.
        */
        public lengthSq(): number;
        /**
        * Normalize this vector.
        *
        * @return {Vec2} This for chaining.
        */
        public normalize(): Vec2;
        /**
        * The dot product of two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @return {Number}
        */
        public dot(a: Vec2): number;
        /**
        * The cross product of two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @return {Number}
        */
        public cross(a: Vec2): number;
        /**
        * The projection magnitude of two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @return {Number}
        */
        public projectionLength(a: Vec2): number;
        /**
        * The angle between two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @return {Number}
        */
        public angle(a: Vec2): number;
        /**
        * Scale this vector.
        *
        * @param {number} x The scaling factor in the x direction.
        * @param {?number=} y The scaling factor in the y direction.  If this is not specified, the x scaling factor will be used.
        * @return {Vec2} This for chaining.
        */
        public scale(x: number, y?: number): Vec2;
        /**
        * Multiply this vector by the given scalar.
        *
        * @param {number} scalar
        * @return {Vec2} This for chaining.
        */
        public multiplyByScalar(scalar: number): Vec2;
        /**
        * Adds the given vector to this vector then multiplies by the given scalar.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {number} scalar
        * @return {Vec2} This for chaining.
        */
        public multiplyAddByScalar(a: Vec2, scalar: number): Vec2;
        /**
        * Divide this vector by the given scalar.
        *
        * @param {number} scalar
        * @return {Vec2} This for chaining.
        */
        public divideByScalar(scalar: number): Vec2;
        /**
        * Reverse this vector.
        *
        * @return {Vec2} This for chaining.
        */
        public reverse(): Vec2;
        /**
        * Check if both the x and y of this vector equal the given value.
        *
        * @return {Boolean}
        */
        public equals(value): bool;
        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the object.
        **/
        public toString(): string;
    }
}
/**
* Phaser - Circle
*
* A Circle object is an area defined by its position, as indicated by its center point (x,y) and diameter.
*/
module Phaser {
    class Circle {
        /**
        * Creates a new Circle object with the center coordinate specified by the x and y parameters and the diameter specified by the diameter parameter. If you call this function without parameters, a circle with x, y, diameter and radius properties set to 0 is created.
        * @class Circle
        * @constructor
        * @param {Number} [x] The x coordinate of the center of the circle.
        * @param {Number} [y] The y coordinate of the center of the circle.
        * @param {Number} [diameter] The diameter of the circle.
        * @return {Circle} This circle object
        **/
        constructor(x?: number, y?: number, diameter?: number);
        private _diameter;
        private _radius;
        /**
        * The x coordinate of the center of the circle
        * @property x
        * @type Number
        **/
        public x: number;
        /**
        * The y coordinate of the center of the circle
        * @property y
        * @type Number
        **/
        public y: number;
        /**
        * The diameter of the circle. The largest distance between any two points on the circle. The same as the radius * 2.
        * @method diameter
        * @return {Number}
        **/
        /**
        * The diameter of the circle. The largest distance between any two points on the circle. The same as the radius * 2.
        * @method diameter
        * @param {Number} The diameter of the circle.
        **/
        public diameter : number;
        /**
        * The radius of the circle. The length of a line extending from the center of the circle to any point on the circle itself. The same as half the diameter.
        * @method radius
        * @return {Number}
        **/
        /**
        * The radius of the circle. The length of a line extending from the center of the circle to any point on the circle itself. The same as half the diameter.
        * @method radius
        * @param {Number} The radius of the circle.
        **/
        public radius : number;
        /**
        * The circumference of the circle.
        * @method circumference
        * @return {Number}
        **/
        public circumference(): number;
        /**
        * The sum of the y and radius properties. Changing the bottom property of a Circle object has no effect on the x and y properties, but does change the diameter.
        * @method bottom
        * @return {Number}
        **/
        /**
        * The sum of the y and radius properties. Changing the bottom property of a Circle object has no effect on the x and y properties, but does change the diameter.
        * @method bottom
        * @param {Number} The value to adjust the height of the circle by.
        **/
        public bottom : number;
        /**
        * The x coordinate of the leftmost point of the circle. Changing the left property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
        * @method left
        * @return {Number} The x coordinate of the leftmost point of the circle.
        **/
        /**
        * The x coordinate of the leftmost point of the circle. Changing the left property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
        * @method left
        * @param {Number} The value to adjust the position of the leftmost point of the circle by.
        **/
        public left : number;
        /**
        * The x coordinate of the rightmost point of the circle. Changing the right property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
        * @method right
        * @return {Number}
        **/
        /**
        * The x coordinate of the rightmost point of the circle. Changing the right property of a Circle object has no effect on the x and y properties. However it does affect the diameter, whereas changing the x value does not affect the diameter property.
        * @method right
        * @param {Number} The amount to adjust the diameter of the circle by.
        **/
        public right : number;
        /**
        * The sum of the y minus the radius property. Changing the top property of a Circle object has no effect on the x and y properties, but does change the diameter.
        * @method bottom
        * @return {Number}
        **/
        /**
        * The sum of the y minus the radius property. Changing the top property of a Circle object has no effect on the x and y properties, but does change the diameter.
        * @method bottom
        * @param {Number} The amount to adjust the height of the circle by.
        **/
        public top : number;
        /**
        * Gets the area of this Circle.
        * @method area
        * @return {Number} This area of this circle.
        **/
        public area : number;
        /**
        * Sets the members of Circle to the specified values.
        * @method setTo
        * @param {Number} x The x coordinate of the center of the circle.
        * @param {Number} y The y coordinate of the center of the circle.
        * @param {Number} diameter The diameter of the circle in pixels.
        * @return {Circle} This circle object
        **/
        public setTo(x: number, y: number, diameter: number): Circle;
        /**
        * Copies the x, y and diameter properties from any given object to this Circle.
        * @method copyFrom
        * @param {any} source - The object to copy from.
        * @return {Circle} This Circle object.
        **/
        public copyFrom(source: any): Circle;
        /**
        * Determines whether or not this Circle object is empty.
        * @method empty
        * @return {Boolean} A value of true if the Circle objects diameter is less than or equal to 0; otherwise false.
        **/
        /**
        * Sets all of the Circle objects properties to 0. A Circle object is empty if its diameter is less than or equal to 0.
        * @method setEmpty
        * @return {Circle} This Circle object
        **/
        public empty : bool;
        /**
        * Adjusts the location of the Circle object, as determined by its center coordinate, by the specified amounts.
        * @method offset
        * @param {Number} dx Moves the x value of the Circle object by this amount.
        * @param {Number} dy Moves the y value of the Circle object by this amount.
        * @return {Circle} This Circle object.
        **/
        public offset(dx: number, dy: number): Circle;
        /**
        * Adjusts the location of the Circle object using a Point object as a parameter. This method is similar to the Circle.offset() method, except that it takes a Point object as a parameter.
        * @method offsetPoint
        * @param {Point} point A Point object to use to offset this Circle object.
        * @return {Circle} This Circle object.
        **/
        public offsetPoint(point: Point): Circle;
        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the instance.
        **/
        public toString(): string;
    }
}
module Phaser {
    /**
    * Constants used to define game object types (faster than doing typeof object checks in core loops)
    */
    class Types {
        static RENDERER_AUTO_DETECT: number;
        static RENDERER_HEADLESS: number;
        static RENDERER_CANVAS: number;
        static RENDERER_WEBGL: number;
        static GROUP: number;
        static SPRITE: number;
        static GEOMSPRITE: number;
        static PARTICLE: number;
        static EMITTER: number;
        static TILEMAP: number;
        static SCROLLZONE: number;
        static BUTTON: number;
        static GEOM_POINT: number;
        static GEOM_CIRCLE: number;
        static GEOM_Rectangle: number;
        static GEOM_LINE: number;
        static GEOM_POLYGON: number;
        static BODY_DISABLED: number;
        static BODY_STATIC: number;
        static BODY_KINETIC: number;
        static BODY_DYNAMIC: number;
        static OUT_OF_BOUNDS_KILL: number;
        static OUT_OF_BOUNDS_DESTROY: number;
        static OUT_OF_BOUNDS_PERSIST: number;
        /**
        * Flag used to allow GameObjects to collide on their left side
        * @type {number}
        */
        static LEFT: number;
        /**
        * Flag used to allow GameObjects to collide on their right side
        * @type {number}
        */
        static RIGHT: number;
        /**
        * Flag used to allow GameObjects to collide on their top side
        * @type {number}
        */
        static UP: number;
        /**
        * Flag used to allow GameObjects to collide on their bottom side
        * @type {number}
        */
        static DOWN: number;
        /**
        * Flag used with GameObjects to disable collision
        * @type {number}
        */
        static NONE: number;
        /**
        * Flag used to allow GameObjects to collide with a ceiling
        * @type {number}
        */
        static CEILING: number;
        /**
        * Flag used to allow GameObjects to collide with a floor
        * @type {number}
        */
        static FLOOR: number;
        /**
        * Flag used to allow GameObjects to collide with a wall (same as LEFT+RIGHT)
        * @type {number}
        */
        static WALL: number;
        /**
        * Flag used to allow GameObjects to collide on any face
        * @type {number}
        */
        static ANY: number;
    }
}
/**
* Phaser - RectangleUtils
*
* A collection of methods useful for manipulating and comparing Rectangle objects.
*
* TODO: Check docs + overlap + intersect + toPolygon?
*/
module Phaser {
    class RectangleUtils {
        /**
        * Get the location of the Rectangles top-left corner as a Point object.
        * @method getTopLeftAsPoint
        * @param {Rectangle} a - The Rectangle object.
        * @param {Point} out - Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Point} The new Point object.
        **/
        static getTopLeftAsPoint(a: Rectangle, out?: Point): Point;
        /**
        * Get the location of the Rectangles bottom-right corner as a Point object.
        * @method getTopLeftAsPoint
        * @param {Rectangle} a - The Rectangle object.
        * @param {Point} out - Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Point} The new Point object.
        **/
        static getBottomRightAsPoint(a: Rectangle, out?: Point): Point;
        /**
        * Increases the size of the Rectangle object by the specified amounts. The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
        * @method inflate
        * @param {Rectangle} a - The Rectangle object.
        * @param {Number} dx The amount to be added to the left side of the Rectangle.
        * @param {Number} dy The amount to be added to the bottom side of the Rectangle.
        * @return {Rectangle} This Rectangle object.
        **/
        static inflate(a: Rectangle, dx: number, dy: number): Rectangle;
        /**
        * Increases the size of the Rectangle object. This method is similar to the Rectangle.inflate() method except it takes a Point object as a parameter.
        * @method inflatePoint
        * @param {Rectangle} a - The Rectangle object.
        * @param {Point} point The x property of this Point object is used to increase the horizontal dimension of the Rectangle object. The y property is used to increase the vertical dimension of the Rectangle object.
        * @return {Rectangle} The Rectangle object.
        **/
        static inflatePoint(a: Rectangle, point: Point): Rectangle;
        /**
        * The size of the Rectangle object, expressed as a Point object with the values of the width and height properties.
        * @method size
        * @param {Rectangle} a - The Rectangle object.
        * @param {Point} output Optional Point object. If given the values will be set into the object, otherwise a brand new Point object will be created and returned.
        * @return {Point} The size of the Rectangle object
        **/
        static size(a: Rectangle, output?: Point): Point;
        /**
        * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
        * @method clone
        * @param {Rectangle} a - The Rectangle object.
        * @param {Rectangle} output Optional Rectangle object. If given the values will be set into the object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Rectangle}
        **/
        static clone(a: Rectangle, output?: Rectangle): Rectangle;
        /**
        * Determines whether the specified coordinates are contained within the region defined by this Rectangle object.
        * @method contains
        * @param {Rectangle} a - The Rectangle object.
        * @param {Number} x The x coordinate of the point to test.
        * @param {Number} y The y coordinate of the point to test.
        * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
        **/
        static contains(a: Rectangle, x: number, y: number): bool;
        /**
        * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object. This method is similar to the Rectangle.contains() method, except that it takes a Point object as a parameter.
        * @method containsPoint
        * @param {Rectangle} a - The Rectangle object.
        * @param {Point} point The point object being checked. Can be Point or any object with .x and .y values.
        * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
        **/
        static containsPoint(a: Rectangle, point: Point): bool;
        /**
        * Determines whether the first Rectangle object is fully contained within the second Rectangle object.
        * A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
        * @method containsRect
        * @param {Rectangle} a - The first Rectangle object.
        * @param {Rectangle} b - The second Rectangle object.
        * @return {Boolean} A value of true if the Rectangle object contains the specified point; otherwise false.
        **/
        static containsRect(a: Rectangle, b: Rectangle): bool;
        /**
        * Determines whether the two Rectangles are equal.
        * This method compares the x, y, width and height properties of each Rectangle.
        * @method equals
        * @param {Rectangle} a - The first Rectangle object.
        * @param {Rectangle} b - The second Rectangle object.
        * @return {Boolean} A value of true if the two Rectangles have exactly the same values for the x, y, width and height properties; otherwise false.
        **/
        static equals(a: Rectangle, b: Rectangle): bool;
        /**
        * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns the area of intersection as a Rectangle object. If the Rectangles do not intersect, this method returns an empty Rectangle object with its properties set to 0.
        * @method intersection
        * @param {Rectangle} a - The first Rectangle object.
        * @param {Rectangle} b - The second Rectangle object.
        * @param {Rectangle} output Optional Rectangle object. If given the intersection values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Rectangle} A Rectangle object that equals the area of intersection. If the Rectangles do not intersect, this method returns an empty Rectangle object; that is, a Rectangle with its x, y, width, and height properties set to 0.
        **/
        static intersection(a: Rectangle, b: Rectangle, out?: Rectangle): Rectangle;
        /**
        * Determines whether the two Rectangles intersect with each other.
        * This method checks the x, y, width, and height properties of the Rectangles.
        * @method intersects
        * @param {Rectangle} a - The first Rectangle object.
        * @param {Rectangle} b - The second Rectangle object.
        * @param {Number} tolerance A tolerance value to allow for an intersection test with padding, default to 0
        * @return {Boolean} A value of true if the specified object intersects with this Rectangle object; otherwise false.
        **/
        static intersects(a: Rectangle, b: Rectangle, tolerance?: number): bool;
        /**
        * Determines whether the object specified intersects (overlaps) with the given values.
        * @method intersectsRaw
        * @param {Number} left
        * @param {Number} right
        * @param {Number} top
        * @param {Number} bottomt
        * @param {Number} tolerance A tolerance value to allow for an intersection test with padding, default to 0
        * @return {Boolean} A value of true if the specified object intersects with the Rectangle; otherwise false.
        **/
        static intersectsRaw(a: Rectangle, left: number, right: number, top: number, bottom: number, tolerance?: number): bool;
        /**
        * Adds two Rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two Rectangles.
        * @method union
        * @param {Rectangle} a - The first Rectangle object.
        * @param {Rectangle} b - The second Rectangle object.
        * @param {Rectangle} output Optional Rectangle object. If given the new values will be set into this object, otherwise a brand new Rectangle object will be created and returned.
        * @return {Rectangle} A Rectangle object that is the union of the two Rectangles.
        **/
        static union(a: Rectangle, b: Rectangle, out?: Rectangle): Rectangle;
    }
}
/**
* Phaser - ColorUtils
*
* A collection of methods useful for manipulating color values.
*/
module Phaser {
    class ColorUtils {
        static game: Game;
        /**
        * Given an alpha and 3 color values this will return an integer representation of it
        *
        * @param alpha {number} The Alpha value (between 0 and 255)
        * @param red   {number} The Red channel value (between 0 and 255)
        * @param green {number} The Green channel value (between 0 and 255)
        * @param blue  {number} The Blue channel value (between 0 and 255)
        *
        * @return  A native color value integer (format: 0xAARRGGBB)
        */
        static getColor32(alpha: number, red: number, green: number, blue: number): number;
        /**
        * Given 3 color values this will return an integer representation of it
        *
        * @param red   {number} The Red channel value (between 0 and 255)
        * @param green {number} The Green channel value (between 0 and 255)
        * @param blue  {number} The Blue channel value (between 0 and 255)
        *
        * @return  A native color value integer (format: 0xRRGGBB)
        */
        static getColor(red: number, green: number, blue: number): number;
        /**
        * Get HSV color wheel values in an array which will be 360 elements in size
        *
        * @param	alpha	Alpha value for each color of the color wheel, between 0 (transparent) and 255 (opaque)
        *
        * @return	Array
        */
        static getHSVColorWheel(alpha?: number): any[];
        /**
        * Returns a Complementary Color Harmony for the given color.
        * <p>A complementary hue is one directly opposite the color given on the color wheel</p>
        * <p>Value returned in 0xAARRGGBB format with Alpha set to 255.</p>
        *
        * @param	color The color to base the harmony on
        *
        * @return 0xAARRGGBB format color value
        */
        static getComplementHarmony(color: number): number;
        /**
        * Returns an Analogous Color Harmony for the given color.
        * <p>An Analogous harmony are hues adjacent to each other on the color wheel</p>
        * <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
        *
        * @param	color The color to base the harmony on
        * @param	threshold Control how adjacent the colors will be (default +- 30 degrees)
        *
        * @return 	Object containing 3 properties: color1 (the original color), color2 (the warmer analogous color) and color3 (the colder analogous color)
        */
        static getAnalogousHarmony(color: number, threshold?: number): {
            color1: number;
            color2: number;
            color3: number;
            hue1: any;
            hue2: number;
            hue3: number;
        };
        /**
        * Returns an Split Complement Color Harmony for the given color.
        * <p>A Split Complement harmony are the two hues on either side of the color's Complement</p>
        * <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
        *
        * @param	color The color to base the harmony on
        * @param	threshold Control how adjacent the colors will be to the Complement (default +- 30 degrees)
        *
        * @return 	Object containing 3 properties: color1 (the original color), color2 (the warmer analogous color) and color3 (the colder analogous color)
        */
        static getSplitComplementHarmony(color: number, threshold?: number): any;
        /**
        * Returns a Triadic Color Harmony for the given color.
        * <p>A Triadic harmony are 3 hues equidistant from each other on the color wheel</p>
        * <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
        *
        * @param	color The color to base the harmony on
        *
        * @return 	Object containing 3 properties: color1 (the original color), color2 and color3 (the equidistant colors)
        */
        static getTriadicHarmony(color: number): any;
        /**
        * Returns a string containing handy information about the given color including string hex value,
        * RGB format information and HSL information. Each section starts on a newline, 3 lines in total.
        *
        * @param	color A color value in the format 0xAARRGGBB
        *
        * @return	string containing the 3 lines of information
        */
        static getColorInfo(color: number): string;
        /**
        * Return a string representation of the color in the format 0xAARRGGBB
        *
        * @param	color The color to get the string representation for
        *
        * @return	A string of length 10 characters in the format 0xAARRGGBB
        */
        static RGBtoHexstring(color: number): string;
        /**
        * Return a string representation of the color in the format #RRGGBB
        *
        * @param	color The color to get the string representation for
        *
        * @return	A string of length 10 characters in the format 0xAARRGGBB
        */
        static RGBtoWebstring(color: number): string;
        /**
        * Return a string containing a hex representation of the given color
        *
        * @param	color The color channel to get the hex value for, must be a value between 0 and 255)
        *
        * @return	A string of length 2 characters, i.e. 255 = FF, 0 = 00
        */
        static colorToHexstring(color: number): string;
        /**
        * Convert a HSV (hue, saturation, lightness) color space value to an RGB color
        *
        * @param	h 		Hue degree, between 0 and 359
        * @param	s 		Saturation, between 0.0 (grey) and 1.0
        * @param	v 		Value, between 0.0 (black) and 1.0
        * @param	alpha	Alpha value to set per color (between 0 and 255)
        *
        * @return 32-bit ARGB color value (0xAARRGGBB)
        */
        static HSVtoRGB(h: number, s: number, v: number, alpha?: number): number;
        /**
        * Convert an RGB color value to an object containing the HSV color space values: Hue, Saturation and Lightness
        *
        * @param	color In format 0xRRGGBB
        *
        * @return 	Object with the properties hue (from 0 to 360), saturation (from 0 to 1.0) and lightness (from 0 to 1.0, also available under .value)
        */
        static RGBtoHSV(color: number): any;
        /**
        *
        * @method interpolateColor
        * @param {Number} color1
        * @param {Number} color2
        * @param {Number} steps
        * @param {Number} currentStep
        * @param {Number} alpha
        * @return {Number}
        * @static
        */
        static interpolateColor(color1: number, color2: number, steps: number, currentStep: number, alpha?: number): number;
        /**
        *
        * @method interpolateColorWithRGB
        * @param {Number} color
        * @param {Number} r2
        * @param {Number} g2
        * @param {Number} b2
        * @param {Number} steps
        * @param {Number} currentStep
        * @return {Number}
        * @static
        */
        static interpolateColorWithRGB(color: number, r2: number, g2: number, b2: number, steps: number, currentStep: number): number;
        /**
        *
        * @method interpolateRGB
        * @param {Number} r1
        * @param {Number} g1
        * @param {Number} b1
        * @param {Number} r2
        * @param {Number} g2
        * @param {Number} b2
        * @param {Number} steps
        * @param {Number} currentStep
        * @return {Number}
        * @static
        */
        static interpolateRGB(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number, steps: number, currentStep: number): number;
        /**
        * Returns a random color value between black and white
        * <p>Set the min value to start each channel from the given offset.</p>
        * <p>Set the max value to restrict the maximum color used per channel</p>
        *
        * @param	min		The lowest value to use for the color
        * @param	max 	The highest value to use for the color
        * @param	alpha	The alpha value of the returning color (default 255 = fully opaque)
        *
        * @return 32-bit color value with alpha
        */
        static getRandomColor(min?: number, max?: number, alpha?: number): number;
        /**
        * Return the component parts of a color as an Object with the properties alpha, red, green, blue
        *
        * <p>Alpha will only be set if it exist in the given color (0xAARRGGBB)</p>
        *
        * @param	color in RGB (0xRRGGBB) or ARGB format (0xAARRGGBB)
        *
        * @return Object with properties: alpha, red, green, blue
        */
        static getRGB(color: number): any;
        /**
        *
        * @method getWebRGB
        * @param {Number} color
        * @return {Any}
        */
        static getWebRGB(color: number): any;
        /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Alpha component, as a value between 0 and 255
        *
        * @param	color	In the format 0xAARRGGBB
        *
        * @return	The Alpha component of the color, will be between 0 and 255 (0 being no Alpha, 255 full Alpha)
        */
        static getAlpha(color: number): number;
        /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Alpha component as a value between 0 and 1
        *
        * @param	color	In the format 0xAARRGGBB
        *
        * @return	The Alpha component of the color, will be between 0 and 1 (0 being no Alpha (opaque), 1 full Alpha (transparent))
        */
        static getAlphaFloat(color: number): number;
        /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Red component, as a value between 0 and 255
        *
        * @param	color	In the format 0xAARRGGBB
        *
        * @return	The Red component of the color, will be between 0 and 255 (0 being no color, 255 full Red)
        */
        static getRed(color: number): number;
        /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Green component, as a value between 0 and 255
        *
        * @param	color	In the format 0xAARRGGBB
        *
        * @return	The Green component of the color, will be between 0 and 255 (0 being no color, 255 full Green)
        */
        static getGreen(color: number): number;
        /**
        * Given a native color value (in the format 0xAARRGGBB) this will return the Blue component, as a value between 0 and 255
        *
        * @param	color	In the format 0xAARRGGBB
        *
        * @return	The Blue component of the color, will be between 0 and 255 (0 being no color, 255 full Blue)
        */
        static getBlue(color: number): number;
    }
}
/**
* Phaser - DynamicTexture
*
* A DynamicTexture can be thought of as a mini canvas into which you can draw anything.
* Game Objects can be assigned a DynamicTexture, so when they render in the world they do so
* based on the contents of the texture at the time. This allows you to create powerful effects
* once and have them replicated across as many game objects as you like.
*/
module Phaser {
    class DynamicTexture {
        /**
        * DynamicTexture constructor
        * Create a new <code>DynamicTexture</code>.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param width {number} Init width of this texture.
        * @param height {number} Init height of this texture.
        */
        constructor(game: Game, width: number, height: number);
        /**
        * Reference to game.
        */
        public game: Game;
        /**
        * The type of game object.
        */
        public type: number;
        private _sx;
        private _sy;
        private _sw;
        private _sh;
        private _dx;
        private _dy;
        private _dw;
        private _dh;
        /**
        * Controls the CSS3 Filters applied to the textures canvas object.
        * Only really useful if you attach this canvas to the DOM.
        * @type {Phaser.Components.CSS3Filters}
        */
        public css3: Components.CSS3Filters;
        /**
        * Bound of this texture with width and height info.
        * @type {Rectangle}
        */
        public bounds: Rectangle;
        /**
        * This class is actually a wrapper of canvas.
        * @type {HTMLCanvasElement}
        */
        public canvas: HTMLCanvasElement;
        /**
        * Canvas context of this object.
        * @type {CanvasRenderingContext2D}
        */
        public context: CanvasRenderingContext2D;
        /**
        * You can set a globalCompositeOperation that will be applied before the render method is called on this Sprite.
        * This is useful if you wish to apply an effect like 'lighten'.
        * If this value is set it will call a canvas context save and restore before and after the render pass, so use it sparingly.
        * Set to null to disable.
        */
        public globalCompositeOperation: string;
        /**
        * Get a color of a specific pixel.
        * @param x {number} X position of the pixel in this texture.
        * @param y {number} Y position of the pixel in this texture.
        * @return {number} A native color value integer (format: 0xRRGGBB)
        */
        public getPixel(x: number, y: number): number;
        /**
        * Get a color of a specific pixel (including alpha value).
        * @param x {number} X position of the pixel in this texture.
        * @param y {number} Y position of the pixel in this texture.
        * @return  A native color value integer (format: 0xAARRGGBB)
        */
        public getPixel32(x: number, y: number): number;
        /**
        * Get pixels in array in a specific Rectangle.
        * @param rect {Rectangle} The specific Rectangle.
        * @returns {array} CanvasPixelArray.
        */
        public getPixels(rect: Rectangle): ImageData;
        /**
        * Set color of a specific pixel.
        * @param x {number} X position of the target pixel.
        * @param y {number} Y position of the target pixel.
        * @param color {number} Native integer with color value. (format: 0xRRGGBB)
        */
        public setPixel(x: number, y: number, color: string): void;
        /**
        * Set color (with alpha) of a specific pixel.
        * @param x {number} X position of the target pixel.
        * @param y {number} Y position of the target pixel.
        * @param color {number} Native integer with color value. (format: 0xAARRGGBB)
        */
        public setPixel32(x: number, y: number, color: number): void;
        /**
        * Set image data to a specific Rectangle.
        * @param rect {Rectangle} Target Rectangle.
        * @param input {object} Source image data.
        */
        public setPixels(rect: Rectangle, input): void;
        /**
        * Fill a given Rectangle with specific color.
        * @param rect {Rectangle} Target Rectangle you want to fill.
        * @param color {number} A native number with color value. (format: 0xRRGGBB)
        */
        public fillRect(rect: Rectangle, color: number): void;
        /**
        *
        */
        public pasteImage(key: string, frame?: number, destX?: number, destY?: number, destWidth?: number, destHeight?: number): void;
        /**
        * Copy pixel from another DynamicTexture to this texture.
        * @param sourceTexture {DynamicTexture} Source texture object.
        * @param sourceRect {Rectangle} The specific region Rectangle to be copied to this in the source.
        * @param destPoint {Point} Top-left point the target image data will be paste at.
        */
        public copyPixels(sourceTexture: DynamicTexture, sourceRect: Rectangle, destPoint: Point): void;
        public add(sprite: Sprite): void;
        /**
        * Given an array of Sprites it will update each of them so that their canvas/contexts reference this DynamicTexture
        * @param objects {Array} An array of GameObjects, or objects that inherit from it such as Sprites
        */
        public assignCanvasToGameObjects(objects): void;
        /**
        * Clear the whole canvas.
        */
        public clear(): void;
        /**
        * Renders this DynamicTexture to the Stage at the given x/y coordinates
        *
        * @param x {number} The X coordinate to render on the stage to (given in screen coordinates, not world)
        * @param y {number} The Y coordinate to render on the stage to (given in screen coordinates, not world)
        */
        public render(x?: number, y?: number): void;
        public width : number;
        public height : number;
    }
}
/**
* Phaser - AnimationLoader
*
* Responsible for parsing sprite sheet and JSON data into the internal FrameData format that Phaser uses for animations.
*/
module Phaser {
    class AnimationLoader {
        /**
        * Parse a sprite sheet from asset data.
        * @param key {string} Asset key for the sprite sheet data.
        * @param frameWidth {number} Width of animation frame.
        * @param frameHeight {number} Height of animation frame.
        * @param frameMax {number} Number of animation frames.
        * @return {FrameData} Generated FrameData object.
        */
        static parseSpriteSheet(game: Game, key: string, frameWidth: number, frameHeight: number, frameMax: number): FrameData;
        /**
        * Parse frame datas from json.
        * @param json {object} Json data you want to parse.
        * @return {FrameData} Generated FrameData object.
        */
        static parseJSONData(game: Game, json): FrameData;
        static parseXMLData(game: Game, xml, format: number): FrameData;
    }
}
/**
* Phaser - Animation
*
* An Animation is a single animation. It is created by the AnimationManager and belongs to Sprite objects.
*/
module Phaser {
    class Animation {
        /**
        * Animation constructor
        * Create a new <code>Animation</code>.
        *
        * @param parent {Sprite} Owner sprite of this animation.
        * @param frameData {FrameData} The FrameData object contains animation data.
        * @param name {string} Unique name of this animation.
        * @param frames {number[]/string[]} An array of numbers or strings indicating what frames to play in what order.
        * @param delay {number} Time between frames in ms.
        * @param looped {boolean} Whether or not the animation is looped or just plays once.
        */
        constructor(game: Game, parent: Sprite, frameData: FrameData, name: string, frames, delay: number, looped: bool);
        /**
        * Local private reference to game.
        */
        private _game;
        /**
        * Local private reference to its owner sprite.
        * @type {Sprite}
        */
        private _parent;
        /**
        * Animation frame container.
        * @type {number[]}
        */
        private _frames;
        /**
        * Frame data of this animation.(parsed from sprite sheet)
        * @type {FrameData}
        */
        private _frameData;
        /**
        * Index of current frame.
        * @type {number}
        */
        private _frameIndex;
        /**
        * Time when switched to last frame (in ms).
        * @type number
        */
        private _timeLastFrame;
        /**
        * Time when this will switch to next frame (in ms).
        * @type number
        */
        private _timeNextFrame;
        /**
        * Name of this animation.
        * @type {string}
        */
        public name: string;
        /**
        * Currently played frame instance.
        * @type {Frame}
        */
        public currentFrame: Frame;
        /**
        * Whether or not this animation finished playing.
        * @type {boolean}
        */
        public isFinished: bool;
        /**
        * Whethor or not this animation is currently playing.
        * @type {boolean}
        */
        public isPlaying: bool;
        /**
        * Whether or not the animation is looped.
        * @type {boolean}
        */
        public looped: bool;
        /**
        * Time between frames in ms.
        * @type {number}
        */
        public delay: number;
        public frameTotal : number;
        public frame : number;
        /**
        * Play this animation.
        * @param frameRate {number} FrameRate you want to specify instead of using default.
        * @param loop {boolean} Whether or not the animation is looped or just plays once.
        */
        public play(frameRate?: number, loop?: bool): Animation;
        /**
        * Play this animation from the first frame.
        */
        public restart(): void;
        /**
        * Stop playing animation and set it finished.
        */
        public stop(): void;
        /**
        * Update animation frames.
        */
        public update(): bool;
        /**
        * Clean up animation memory.
        */
        public destroy(): void;
        /**
        * Animation complete callback method.
        */
        private onComplete();
    }
}
/**
* Phaser - Frame
*
* A Frame is a single frame of an animation and is part of a FrameData collection.
*/
module Phaser {
    class Frame {
        /**
        * Frame constructor
        * Create a new <code>Frame</code> with specific position, size and name.
        *
        * @param x {number} X position within the image to cut from.
        * @param y {number} Y position within the image to cut from.
        * @param width {number} Width of the frame.
        * @param height {number} Height of the frame.
        * @param name {string} Name of this frame.
        */
        constructor(x: number, y: number, width: number, height: number, name: string);
        /**
        * X position within the image to cut from.
        * @type {number}
        */
        public x: number;
        /**
        * Y position within the image to cut from.
        * @type {number}
        */
        public y: number;
        /**
        * Width of the frame.
        * @type {number}
        */
        public width: number;
        /**
        * Height of the frame.
        * @type {number}
        */
        public height: number;
        /**
        * Useful for Sprite Sheets.
        * @type {number}
        */
        public index: number;
        /**
        * Useful for Texture Atlas files. (is set to the filename value)
        */
        public name: string;
        /**
        * Rotated? (not yet implemented)
        */
        public rotated: bool;
        /**
        * Either cw or ccw, rotation is always 90 degrees.
        */
        public rotationDirection: string;
        /**
        * Was it trimmed when packed?
        * @type {boolean}
        */
        public trimmed: bool;
        /**
        * Width of the original sprite.
        * @type {number}
        */
        public sourceSizeW: number;
        /**
        * Height of the original sprite.
        * @type {number}
        */
        public sourceSizeH: number;
        /**
        * X position of the trimmed sprite inside original sprite.
        * @type {number}
        */
        public spriteSourceSizeX: number;
        /**
        * Y position of the trimmed sprite inside original sprite.
        * @type {number}
        */
        public spriteSourceSizeY: number;
        /**
        * Width of the trimmed sprite.
        * @type {number}
        */
        public spriteSourceSizeW: number;
        /**
        * Height of the trimmed sprite.
        * @type {number}
        */
        public spriteSourceSizeH: number;
        /**
        * Set rotation of this frame. (Not yet supported!)
        */
        public setRotation(rotated: bool, rotationDirection: string): void;
        /**
        * Set trim of the frame.
        * @param trimmed {boolean} Whether this frame trimmed or not.
        * @param actualWidth {number} Actual width of this frame.
        * @param actualHeight {number} Actual height of this frame.
        * @param destX {number} Destination x position.
        * @param destY {number} Destination y position.
        * @param destWidth {number} Destination draw width.
        * @param destHeight {number} Destination draw height.
        */
        public setTrim(trimmed: bool, actualWidth: number, actualHeight: number, destX: number, destY: number, destWidth: number, destHeight: number): void;
    }
}
/**
* Phaser - FrameData
*
* FrameData is a container for Frame objects, the internal representation of animation data in Phaser.
*/
module Phaser {
    class FrameData {
        /**
        * FrameData constructor
        */
        constructor();
        /**
        * Local frame container.
        */
        private _frames;
        /**
        * Local frameName<->index container.
        */
        private _frameNames;
        public total : number;
        /**
        * Add a new frame.
        * @param frame {Frame} The frame you want to add.
        * @return {Frame} The frame you just added.
        */
        public addFrame(frame: Frame): Frame;
        /**
        * Get a frame by its index.
        * @param index {number} Index of the frame you want to get.
        * @return {Frame} The frame you want.
        */
        public getFrame(index: number): Frame;
        /**
        * Get a frame by its name.
        * @param name {string} Name of the frame you want to get.
        * @return {Frame} The frame you want.
        */
        public getFrameByName(name: string): Frame;
        /**
        * Check whether there's a frame with given name.
        * @param name {string} Name of the frame you want to check.
        * @return {boolean} True if frame with given name found, otherwise return false.
        */
        public checkFrameName(name: string): bool;
        /**
        * Get ranges of frames in an array.
        * @param start {number} Start index of frames you want.
        * @param end {number} End index of frames you want.
        * @param [output] {Frame[]} result will be added into this array.
        * @return {Frame[]} Ranges of specific frames in an array.
        */
        public getFrameRange(start: number, end: number, output?: Frame[]): Frame[];
        /**
        * Get all indexes of frames by giving their name.
        * @param [output] {number[]} result will be added into this array.
        * @return {number[]} Indexes of specific frames in an array.
        */
        public getFrameIndexes(output?: number[]): number[];
        /**
        * Get the frame indexes by giving the frame names.
        * @param [output] {number[]} result will be added into this array.
        * @return {number[]} Names of specific frames in an array.
        */
        public getFrameIndexesByName(input: string[]): number[];
        /**
        * Get all frames in this frame data.
        * @return {Frame[]} All the frames in an array.
        */
        public getAllFrames(): Frame[];
        /**
        * Get All frames with specific ranges.
        * @param range {number[]} Ranges in an array.
        * @return {Frame[]} All frames in an array.
        */
        public getFrames(range: number[]): Frame[];
    }
}
/**
* Phaser - AnimationManager
*
* Any Sprite that has animation contains an instance of the AnimationManager, which is used to add, play and update
* sprite specific animations.
*/
module Phaser.Components {
    class AnimationManager {
        /**
        * AnimationManager constructor
        * Create a new <code>AnimationManager</code>.
        *
        * @param parent {Sprite} Owner sprite of this manager.
        */
        constructor(parent: Sprite);
        /**
        * Reference to Phaser.Game
        */
        public game: Game;
        /**
        * Local private reference to its parent game object.
        */
        private _parent;
        /**
        * Animation key-value container.
        */
        private _anims;
        /**
        * Index of current frame.
        * @type {number}
        */
        private _frameIndex;
        /**
        * Data contains animation frames.
        * @type {FrameData}
        */
        private _frameData;
        /**
        * When an animation frame changes you can choose to automatically update the physics bounds of the parent Sprite
        * to the width and height of the new frame. If you've set a specific physics bounds that you don't want changed during
        * animation then set this to false, otherwise leave it set to true.
        * @type {boolean}
        */
        public autoUpdateBounds: bool;
        /**
        * Keeps track of the current animation being played.
        */
        public currentAnim: Animation;
        /**
        * Keeps track of the current frame of animation.
        */
        public currentFrame: Frame;
        /**
        * Load animation frame data.
        * @param frameData Data to be loaded.
        */
        public loadFrameData(frameData: FrameData): void;
        /**
        * Add a new animation.
        * @param name {string} What this animation should be called (e.g. "run").
        * @param frames {any[]} An array of numbers/strings indicating what frames to play in what order (e.g. [1, 2, 3] or ['run0', 'run1', run2]).
        * @param frameRate {number} The speed in frames per second that the animation should play at (e.g. 60 fps).
        * @param loop {boolean} Whether or not the animation is looped or just plays once.
        * @param useNumericIndex {boolean} Use number indexes instead of string indexes?
        * @return {Animation} The Animation that was created
        */
        public add(name: string, frames?: any[], frameRate?: number, loop?: bool, useNumericIndex?: bool): Animation;
        /**
        * Check whether the frames is valid.
        * @param frames {any[]} Frames to be validated.
        * @param useNumericIndex {boolean} Does these frames use number indexes or string indexes?
        * @return {boolean} True if they're valid, otherwise return false.
        */
        private validateFrames(frames, useNumericIndex);
        /**
        * Play animation with specific name.
        * @param name {string} The string name of the animation you want to play.
        * @param frameRate {number} FrameRate you want to specify instead of using default.
        * @param loop {boolean} Whether or not the animation is looped or just plays once.
        */
        public play(name: string, frameRate?: number, loop?: bool): Animation;
        /**
        * Stop animation by name.
        * Current animation will be automatically set to the stopped one.
        */
        public stop(name: string): void;
        /**
        * Update animation and parent sprite's bounds.
        */
        public update(): void;
        public frameData : FrameData;
        public frameTotal : number;
        public frame : number;
        public frameName : string;
        /**
        * Removes all related references
        */
        public destroy(): void;
    }
}
/**
* Phaser - Mat3
*
* A 3x3 Matrix
*/
module Phaser {
    class Mat3 {
        /**
        * Creates a new Mat3 object.
        * @class Mat3
        * @constructor
        * @return {Mat3} This object
        **/
        constructor();
        private _a00;
        private _a01;
        private _a02;
        private _a10;
        private _a11;
        private _a12;
        private _a20;
        private _a21;
        private _a22;
        public data: number[];
        public a00 : number;
        public a01 : number;
        public a02 : number;
        public a10 : number;
        public a11 : number;
        public a12 : number;
        public a20 : number;
        public a21 : number;
        public a22 : number;
        /**
        * Copies the values from one Mat3 into this Mat3.
        * @method copyFromMat3
        * @param {any} source - The object to copy from.
        * @return {Mat3} This Mat3 object.
        **/
        public copyFromMat3(source: Mat3): Mat3;
        /**
        * Copies the upper-left 3x3 values into this Mat3.
        * @method copyFromMat4
        * @param {any} source - The object to copy from.
        * @return {Mat3} This Mat3 object.
        **/
        public copyFromMat4(source: any): Mat3;
        /**
        * Clones this Mat3 into a new Mat3
        * @param {Mat3} out The output Mat3, if none is given a new Mat3 object will be created.
        * @return {Mat3} The new Mat3
        **/
        public clone(out?: Mat3): Mat3;
        /**
        * Sets this Mat3 to the identity matrix.
        * @method identity
        * @param {any} source - The object to copy from.
        * @return {Mat3} This Mat3 object.
        **/
        public identity(): Mat3;
        /**
        * Translates this Mat3 by the given vector
        **/
        public translate(v: Vec2): Mat3;
        private setTemps();
        /**
        * Rotates this Mat3 by the given angle (given in radians)
        **/
        public rotate(rad: number): Mat3;
        /**
        * Scales this Mat3 by the given vector
        **/
        public scale(v: Vec2): Mat3;
        public setTo(a00: number, a01: number, a02: number, a10: number, a11: number, a12: number, a20: number, a21: number, a22: number): Mat3;
        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the object.
        **/
        public toString(): string;
    }
}
/**
* Phaser - Components - Transform
*/
module Phaser.Components {
    class Transform {
        /**
        * Creates a new Transform component
        * @param parent The game object using this transform
        */
        constructor(parent);
        private _rotation;
        private _pos;
        private _scale;
        private _size;
        private _halfSize;
        private _offset;
        private _origin;
        private _sc;
        private _scA;
        private _angle;
        private _distance;
        private _prevRotation;
        /**
        * The center of the Sprite in world coordinates, after taking scaling and rotation into consideration
        */
        public center: Point;
        /**
        * The upper-left corner of the Sprite in world coordinates, after taking scaling and rotation into consideration
        */
        public upperLeft: Point;
        /**
        * The upper-right corner of the Sprite in world coordinates, after taking scaling and rotation into consideration
        */
        public upperRight: Point;
        /**
        * The bottom-left corner of the Sprite in world coordinates, after taking scaling and rotation into consideration
        */
        public bottomLeft: Point;
        /**
        * The bottom-right corner of the Sprite in world coordinates, after taking scaling and rotation into consideration
        */
        public bottomRight: Point;
        /**
        * The local transform matrix
        */
        public local: Mat3;
        /**
        * Populates the transform cache. Called by the parent object on creation.
        */
        public setCache(): void;
        /**
        * Updates the local transform matrix and the cache values if anything has changed in the parent.
        */
        public update(): void;
        /**
        * Reference to Phaser.Game
        */
        public game: Game;
        /**
        * Reference to the parent object (Sprite, Group, etc)
        */
        public parent: Sprite;
        /**
        * Scale of the object. A scale of 1.0 is the original size. 0.5 half size. 2.0 double sized.
        */
        public scale: Vec2;
        /**
        * Skew the object along the x and y axis. A skew value of 0 is no skew.
        */
        public skew: Vec2;
        /**
        * The influence of camera movement upon the object, if supported.
        */
        public scrollFactor: Vec2;
        /**
        * The origin is the point around which scale and rotation takes place and defaults to the top-left of the sprite.
        */
        public origin: Vec2;
        /**
        * This value is added to the rotation of the object.
        * For example if you had a texture drawn facing straight up then you could set
        * rotationOffset to 90 and it would correspond correctly with Phasers right-handed coordinate system.
        * @type {number}
        */
        public rotationOffset: number;
        /**
        * The rotation of the object in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
        */
        public rotation: number;
        /**
        * The distance from the center of the transform to the rotation origin.
        */
        public distance : number;
        /**
        * The angle between the center of the transform to the rotation origin.
        */
        public angleToCenter : number;
        /**
        * The offset on the X axis of the origin
        */
        public offsetX : number;
        /**
        * The offset on the Y axis of the origin
        */
        public offsetY : number;
        /**
        * Half the width of the parent sprite, taking into consideration scaling
        */
        public halfWidth : number;
        /**
        * Half the height of the parent sprite, taking into consideration scaling
        */
        public halfHeight : number;
        /**
        * The equivalent of Math.sin(rotation + rotationOffset)
        */
        public sin : number;
        /**
        * The equivalent of Math.cos(rotation + rotationOffset)
        */
        public cos : number;
    }
}
/**
* Phaser - Components - Input
*
* Input detection component
*/
module Phaser.Components.Sprite {
    class Input {
        /**
        * Sprite Input component constructor
        * @param parent The Sprite using this Input component
        */
        constructor(parent: Sprite);
        /**
        * Reference to Phaser.Game
        */
        public game: Game;
        /**
        * Local private reference to its parent game object.
        */
        private _parent;
        private _pointerData;
        /**
        * If enabled the Input component will be updated by the parent Sprite
        * @type {Boolean}
        */
        public enabled: bool;
        /**
        * The PriorityID controls which Sprite receives an Input event first if they should overlap.
        */
        public priorityID: number;
        /**
        * The index of this Input component entry in the Game.Input manager.
        */
        public indexID: number;
        private _dragPoint;
        private _draggedPointerID;
        public dragOffset: Point;
        public isDragged: bool;
        public dragFromCenter: bool;
        public dragPixelPerfect: bool;
        public dragPixelPerfectAlpha: number;
        public allowHorizontalDrag: bool;
        public allowVerticalDrag: bool;
        public bringToTop: bool;
        public snapOnDrag: bool;
        public snapOnRelease: bool;
        public snapOffset: Point;
        public snapX: number;
        public snapY: number;
        /**
        * Is this sprite allowed to be dragged by the mouse? true = yes, false = no
        * @default false
        */
        public draggable: bool;
        /**
        * A region of the game world within which the sprite is restricted during drag
        * @default null
        */
        public boundsRect: Rectangle;
        /**
        * An Sprite the bounds of which this sprite is restricted during drag
        * @default null
        */
        public boundsSprite: Sprite;
        /**
        * The Input component can monitor either the physics body of the Sprite or the frameBounds
        * If checkBody is set to true it will monitor the bounds of the physics body.
        * @type {Boolean}
        */
        public checkBody: bool;
        /**
        * Turn the mouse pointer into a hand image by temporarily setting the CSS style of the Game canvas
        * on Input over. Only works on desktop browsers or browsers with a visible input pointer.
        * @type {Boolean}
        */
        public useHandCursor: bool;
        /**
        * If this object is set to consume the pointer event then it will stop all propogation from this object on.
        * For example if you had a stack of 6 sprites with the same priority IDs and one consumed the event, none of the others would receive it.
        * @type {Boolean}
        */
        public consumePointerEvent: bool;
        /**
        * The x coordinate of the Input pointer, relative to the top-left of the parent Sprite.
        * This value is only set when the pointer is over this Sprite.
        * @type {number}
        */
        public pointerX(pointer?: number): number;
        /**
        * The y coordinate of the Input pointer, relative to the top-left of the parent Sprite
        * This value is only set when the pointer is over this Sprite.
        * @type {number}
        */
        public pointerY(pointer?: number): number;
        /**
        * If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true
        * @property isDown
        * @type {Boolean}
        **/
        public pointerDown(pointer?: number): bool;
        /**
        * If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true
        * @property isUp
        * @type {Boolean}
        **/
        public pointerUp(pointer?: number): bool;
        /**
        * A timestamp representing when the Pointer first touched the touchscreen.
        * @property timeDown
        * @type {Number}
        **/
        public pointerTimeDown(pointer?: number): bool;
        /**
        * A timestamp representing when the Pointer left the touchscreen.
        * @property timeUp
        * @type {Number}
        **/
        public pointerTimeUp(pointer?: number): bool;
        /**
        * Is the Pointer over this Sprite
        * @property isOver
        * @type {Boolean}
        **/
        public pointerOver(pointer?: number): bool;
        /**
        * Is the Pointer outside of this Sprite
        * @property isOut
        * @type {Boolean}
        **/
        public pointerOut(pointer?: number): bool;
        /**
        * A timestamp representing when the Pointer first touched the touchscreen.
        * @property timeDown
        * @type {Number}
        **/
        public pointerTimeOver(pointer?: number): bool;
        /**
        * A timestamp representing when the Pointer left the touchscreen.
        * @property timeUp
        * @type {Number}
        **/
        public pointerTimeOut(pointer?: number): bool;
        /**
        * Is this sprite being dragged by the mouse or not?
        * @default false
        */
        public pointerDragged(pointer?: number): bool;
        public start(priority?: number, checkBody?: bool, useHandCursor?: bool): Sprite;
        public reset(): void;
        public stop(): void;
        /**
        * Clean up memory.
        */
        public destroy(): void;
        /**
        * Checks if the given pointer is over this Sprite. All checks are done in world coordinates.
        */
        public checkPointerOver(pointer: Pointer): bool;
        /**
        * Update
        */
        public update(pointer: Pointer): bool;
        public _pointerOverHandler(pointer: Pointer): void;
        public _pointerOutHandler(pointer: Pointer): void;
        public _touchedHandler(pointer: Pointer): bool;
        public _releasedHandler(pointer: Pointer): void;
        /**
        * Updates the Pointer drag on this Sprite.
        */
        private updateDrag(pointer);
        /**
        * Returns true if the pointer has entered the Sprite within the specified delay time (defaults to 500ms, half a second)
        * @param delay The time below which the pointer is considered as just over.
        * @returns {boolean}
        */
        public justOver(pointer?: number, delay?: number): bool;
        /**
        * Returns true if the pointer has left the Sprite within the specified delay time (defaults to 500ms, half a second)
        * @param delay The time below which the pointer is considered as just out.
        * @returns {boolean}
        */
        public justOut(pointer?: number, delay?: number): bool;
        /**
        * Returns true if the pointer has entered the Sprite within the specified delay time (defaults to 500ms, half a second)
        * @param delay The time below which the pointer is considered as just over.
        * @returns {boolean}
        */
        public justPressed(pointer?: number, delay?: number): bool;
        /**
        * Returns true if the pointer has left the Sprite within the specified delay time (defaults to 500ms, half a second)
        * @param delay The time below which the pointer is considered as just out.
        * @returns {boolean}
        */
        public justReleased(pointer?: number, delay?: number): bool;
        /**
        * If the pointer is currently over this Sprite this returns how long it has been there for in milliseconds.
        * @returns {number} The number of milliseconds the pointer has been over the Sprite, or -1 if not over.
        */
        public overDuration(pointer?: number): number;
        /**
        * If the pointer is currently over this Sprite this returns how long it has been there for in milliseconds.
        * @returns {number} The number of milliseconds the pointer has been pressed down on the Sprite, or -1 if not over.
        */
        public downDuration(pointer?: number): number;
        /**
        * Make this Sprite draggable by the mouse. You can also optionally set mouseStartDragCallback and mouseStopDragCallback
        *
        * @param	lockCenter			If false the Sprite will drag from where you click it minus the dragOffset. If true it will center itself to the tip of the mouse pointer.
        * @param	bringToTop			If true the Sprite will be bought to the top of the rendering list in its current Group.
        * @param	pixelPerfect		If true it will use a pixel perfect test to see if you clicked the Sprite. False uses the bounding box.
        * @param	alphaThreshold		If using pixel perfect collision this specifies the alpha level from 0 to 255 above which a collision is processed (default 255)
        * @param	boundsRect			If you want to restrict the drag of this sprite to a specific FlxRect, pass the FlxRect here, otherwise it's free to drag anywhere
        * @param	boundsSprite		If you want to restrict the drag of this sprite to within the bounding box of another sprite, pass it here
        */
        public enableDrag(lockCenter?: bool, bringToTop?: bool, pixelPerfect?: bool, alphaThreshold?: number, boundsRect?: Rectangle, boundsSprite?: Sprite): void;
        /**
        * Stops this sprite from being able to be dragged. If it is currently the target of an active drag it will be stopped immediately. Also disables any set callbacks.
        */
        public disableDrag(): void;
        /**
        * Called by Pointer when drag starts on this Sprite. Should not usually be called directly.
        */
        public startDrag(pointer: Pointer): void;
        /**
        * Called by Pointer when drag is stopped on this Sprite. Should not usually be called directly.
        */
        public stopDrag(pointer: Pointer): void;
        /**
        * Restricts this sprite to drag movement only on the given axis. Note: If both are set to false the sprite will never move!
        *
        * @param	allowHorizontal		To enable the sprite to be dragged horizontally set to true, otherwise false
        * @param	allowVertical		To enable the sprite to be dragged vertically set to true, otherwise false
        */
        public setDragLock(allowHorizontal?: bool, allowVertical?: bool): void;
        /**
        * Make this Sprite snap to the given grid either during drag or when it's released.
        * For example 16x16 as the snapX and snapY would make the sprite snap to every 16 pixels.
        *
        * @param	snapX		The width of the grid cell in pixels
        * @param	snapY		The height of the grid cell in pixels
        * @param	onDrag		If true the sprite will snap to the grid while being dragged
        * @param	onRelease	If true the sprite will snap to the grid when released
        */
        public enableSnap(snapX: number, snapY: number, onDrag?: bool, onRelease?: bool): void;
        /**
        * Stops the sprite from snapping to a grid during drag or release.
        */
        public disableSnap(): void;
        /**
        * Bounds Rect check for the sprite drag
        */
        private checkBoundsRect();
        /**
        * Parent Sprite Bounds check for the sprite drag
        */
        private checkBoundsSprite();
        /**
        * Render debug infos. (including name, bounds info, position and some other properties)
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        public renderDebugInfo(x: number, y: number, color?: string): void;
    }
}
/**
* Phaser - Components - Events
*
* Signals that are dispatched by the Sprite and its various components
*/
module Phaser.Components.Sprite {
    class Events {
        /**
        * The Events component is a collection of events fired by the parent game object and its components.
        * @param parent The game object using this Input component
        */
        constructor(parent: Sprite);
        /**
        * Reference to Phaser.Game
        */
        public game: Game;
        /**
        * Local private reference to its parent game object.
        */
        private _parent;
        /**
        * Dispatched by the Group this Sprite is added to.
        */
        public onAddedToGroup: Signal;
        /**
        * Dispatched by the Group this Sprite is removed from.
        */
        public onRemovedFromGroup: Signal;
        /**
        * Dispatched when this Sprite is killed.
        */
        public onKilled: Signal;
        /**
        * Dispatched when this Sprite is revived.
        */
        public onRevived: Signal;
        /**
        * Dispatched by the Input component when a pointer moves over an Input enabled sprite.
        */
        public onInputOver: Signal;
        /**
        * Dispatched by the Input component when a pointer moves out of an Input enabled sprite.
        */
        public onInputOut: Signal;
        /**
        * Dispatched by the Input component when a pointer is pressed down on an Input enabled sprite.
        */
        public onInputDown: Signal;
        /**
        * Dispatched by the Input component when a pointer is released over an Input enabled sprite
        */
        public onInputUp: Signal;
        /**
        * Dispatched by the Input component when the Sprite starts being dragged
        */
        public onDragStart: Signal;
        /**
        * Dispatched by the Input component when the Sprite stops being dragged
        */
        public onDragStop: Signal;
        /**
        * Dispatched by the Animation component when the Sprite starts being animated
        */
        public onAnimationStart: Signal;
        /**
        * Dispatched by the Animation component when the Sprite animation completes
        */
        public onAnimationComplete: Signal;
        /**
        * Dispatched by the Animation component when the Sprite animation loops
        */
        public onAnimationLoop: Signal;
        /**
        * Dispatched by the Sprite when it first leaves the world bounds
        */
        public onOutOfBounds: Signal;
    }
}
/**
* Phaser - Vec2Utils
*
* A collection of methods useful for manipulating and performing operations on 2D vectors.
*
*/
module Phaser {
    class Vec2Utils {
        /**
        * Adds two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the sum of the two vectors.
        */
        static add(a: Vec2, b: Vec2, out?: Vec2): Vec2;
        /**
        * Subtracts two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the difference of the two vectors.
        */
        static subtract(a: Vec2, b: Vec2, out?: Vec2): Vec2;
        /**
        * Multiplies two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the sum of the two vectors multiplied.
        */
        static multiply(a: Vec2, b: Vec2, out?: Vec2): Vec2;
        /**
        * Divides two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the sum of the two vectors divided.
        */
        static divide(a: Vec2, b: Vec2, out?: Vec2): Vec2;
        /**
        * Scales a 2D vector.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {number} s Scaling value.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the scaled vector.
        */
        static scale(a: Vec2, s: number, out?: Vec2): Vec2;
        /**
        * Adds two 2D vectors together and multiplies the result by the given scalar.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {number} s Scaling value.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the sum of the two vectors added and multiplied.
        */
        static multiplyAdd(a: Vec2, b: Vec2, s: number, out?: Vec2): Vec2;
        /**
        * Return a negative vector.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the negative vector.
        */
        static negative(a: Vec2, out?: Vec2): Vec2;
        /**
        * Return a perpendicular vector (90 degrees rotation)
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the scaled vector.
        */
        static perp(a: Vec2, out?: Vec2): Vec2;
        /**
        * Return a perpendicular vector (-90 degrees rotation)
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the scaled vector.
        */
        static rperp(a: Vec2, out?: Vec2): Vec2;
        /**
        * Checks if two 2D vectors are equal.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Boolean}
        */
        static equals(a: Vec2, b: Vec2): bool;
        /**
        *
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} epsilon
        * @return {Boolean}
        */
        static epsilonEquals(a: Vec2, b: Vec2, epsilon: number): bool;
        /**
        * Get the distance between two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        static distance(a: Vec2, b: Vec2): number;
        /**
        * Get the distance squared between two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        static distanceSq(a: Vec2, b: Vec2): number;
        /**
        * Project two 2D vectors onto another vector.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        static project(a: Vec2, b: Vec2, out?: Vec2): Vec2;
        /**
        * Project this vector onto a vector of unit length.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        static projectUnit(a: Vec2, b: Vec2, out?: Vec2): Vec2;
        /**
        * Right-hand normalize (make unit length) a 2D vector.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        static normalRightHand(a: Vec2, out?: Vec2): Vec2;
        /**
        * Normalize (make unit length) a 2D vector.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        static normalize(a: Vec2, out?: Vec2): Vec2;
        /**
        * The dot product of two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        static dot(a: Vec2, b: Vec2): number;
        /**
        * The cross product of two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        static cross(a: Vec2, b: Vec2): number;
        /**
        * The angle between two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        static angle(a: Vec2, b: Vec2): number;
        /**
        * The angle squared between two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        static angleSq(a: Vec2, b: Vec2): number;
        /**
        * Rotate a 2D vector around the origin to the given angle (theta).
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Number} theta The angle of rotation in radians.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        static rotateAroundOrigin(a: Vec2, b: Vec2, theta: number, out?: Vec2): Vec2;
        /**
        * Rotate a 2D vector to the given angle (theta).
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Number} theta The angle of rotation in radians.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        static rotate(a: Vec2, theta: number, out?: Vec2): Vec2;
        /**
        * Clone a 2D vector.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is a copy of the source Vec2.
        */
        static clone(a: Vec2, out?: Vec2): Vec2;
    }
}
/**
* Phaser - CircleUtils
*
* A collection of methods useful for manipulating and comparing Circle objects.
*
* TODO:
*/
module Phaser {
    class CircleUtils {
        /**
        * Returns a new Circle object with the same values for the x, y, width, and height properties as the original Circle object.
        * @method clone
        * @param {Circle} a - The Circle object.
        * @param {Circle} [optional] out Optional Circle object. If given the values will be set into the object, otherwise a brand new Circle object will be created and returned.
        * @return {Phaser.Circle}
        **/
        static clone(a: Circle, out?: Circle): Circle;
        /**
        * Return true if the given x/y coordinates are within the Circle object.
        * If you need details about the intersection then use Phaser.Intersect.circleContainsPoint instead.
        * @method contains
        * @param {Circle} a - The Circle object.
        * @param {Number} The X value of the coordinate to test.
        * @param {Number} The Y value of the coordinate to test.
        * @return {Boolean} True if the coordinates are within this circle, otherwise false.
        **/
        static contains(a: Circle, x: number, y: number): bool;
        /**
        * Return true if the coordinates of the given Point object are within this Circle object.
        * If you need details about the intersection then use Phaser.Intersect.circleContainsPoint instead.
        * @method containsPoint
        * @param {Circle} a - The Circle object.
        * @param {Point} The Point object to test.
        * @return {Boolean} True if the coordinates are within this circle, otherwise false.
        **/
        static containsPoint(a: Circle, point: Point): bool;
        /**
        * Return true if the given Circle is contained entirely within this Circle object.
        * If you need details about the intersection then use Phaser.Intersect.circleToCircle instead.
        * @method containsCircle
        * @param {Circle} The Circle object to test.
        * @return {Boolean} True if the coordinates are within this circle, otherwise false.
        **/
        static containsCircle(a: Circle, b: Circle): bool;
        /**
        * Returns the distance from the center of the Circle object to the given object (can be Circle, Point or anything with x/y properties)
        * @method distanceBetween
        * @param {Circle} a - The Circle object.
        * @param {Circle} b - The target object. Must have visible x and y properties that represent the center of the object.
        * @param {Boolean} [optional] round - Round the distance to the nearest integer (default false)
        * @return {Number} The distance between this Point object and the destination Point object.
        **/
        static distanceBetween(a: Circle, target: any, round?: bool): number;
        /**
        * Determines whether the two Circle objects match. This method compares the x, y and diameter properties.
        * @method equals
        * @param {Circle} a - The first Circle object.
        * @param {Circle} b - The second Circle object.
        * @return {Boolean} A value of true if the object has exactly the same values for the x, y and diameter properties as this Circle object; otherwise false.
        **/
        static equals(a: Circle, b: Circle): bool;
        /**
        * Determines whether the two Circle objects intersect.
        * This method checks the radius distances between the two Circle objects to see if they intersect.
        * @method intersects
        * @param {Circle} a - The first Circle object.
        * @param {Circle} b - The second Circle object.
        * @return {Boolean} A value of true if the specified object intersects with this Circle object; otherwise false.
        **/
        static intersects(a: Circle, b: Circle): bool;
        /**
        * Returns a Point object containing the coordinates of a point on the circumference of the Circle based on the given angle.
        * @method circumferencePoint
        * @param {Circle} a - The first Circle object.
        * @param {Number} angle The angle in radians (unless asDegrees is true) to return the point from.
        * @param {Boolean} asDegrees Is the given angle in radians (false) or degrees (true)?
        * @param {Phaser.Point} [optional] output An optional Point object to put the result in to. If none specified a new Point object will be created.
        * @return {Phaser.Point} The Point object holding the result.
        **/
        static circumferencePoint(a: Circle, angle: number, asDegrees?: bool, out?: Point): Point;
        static intersectsRectangle(c: Circle, r: Rectangle): bool;
    }
}
/**
* Phaser - ArcadePhysics Manager
*
*/
module Phaser.Physics {
    class ArcadePhysics {
        constructor(game: Game, width: number, height: number);
        /**
        * Local reference to Game.
        */
        public game: Game;
        /**
        * Physics object pool
        */
        public members: Group;
        private _drag;
        private _delta;
        private _velocityDelta;
        private _length;
        private _distance;
        private _tangent;
        private _separatedX;
        private _separatedY;
        private _overlap;
        private _maxOverlap;
        private _obj1Velocity;
        private _obj2Velocity;
        private _obj1NewVelocity;
        private _obj2NewVelocity;
        private _average;
        private _quadTree;
        private _quadTreeResult;
        public bounds: Rectangle;
        public gravity: Vec2;
        public drag: Vec2;
        public bounce: Vec2;
        public angularDrag: number;
        /**
        * The overlap bias is used when calculating hull overlap before separation - change it if you have especially small or large GameObjects
        * @type {number}
        */
        static OVERLAP_BIAS: number;
        /**
        * The overlap bias is used when calculating hull overlap before separation - change it if you have especially small or large GameObjects
        * @type {number}
        */
        static TILE_OVERLAP: bool;
        /**
        * @type {number}
        */
        public worldDivisions: number;
        public updateMotion(body: Body): void;
        /**
        * A tween-like function that takes a starting velocity and some other factors and returns an altered velocity.
        *
        * @param {number} Velocity Any component of velocity (e.g. 20).
        * @param {number} Acceleration Rate at which the velocity is changing.
        * @param {number} Drag Really kind of a deceleration, this is how much the velocity changes if Acceleration is not set.
        * @param {number} Max An absolute value cap for the velocity.
        *
        * @return {number} The altered Velocity value.
        */
        public computeVelocity(velocity: number, gravity?: number, acceleration?: number, drag?: number, max?: number): number;
        /**
        * The core Collision separation method.
        * @param body1 The first Physics.Body to separate
        * @param body2 The second Physics.Body to separate
        * @returns {boolean} Returns true if the bodies were separated, otherwise false.
        */
        public separate(body1: Body, body2: Body): bool;
        public checkHullIntersection(body1: Body, body2: Body): bool;
        /**
        * Separates the two objects on their x axis
        * @param object1 The first GameObject to separate
        * @param object2 The second GameObject to separate
        * @returns {boolean} Whether the objects in fact touched and were separated along the X axis.
        */
        public separateBodyX(body1: Body, body2: Body): bool;
        /**
        * Separates the two objects on their y axis
        * @param object1 The first GameObject to separate
        * @param object2 The second GameObject to separate
        * @returns {boolean} Whether the objects in fact touched and were separated along the Y axis.
        */
        public separateBodyY(body1: Body, body2: Body): bool;
        /**
        * Checks for overlaps between two objects using the world QuadTree. Can be Sprite vs. Sprite, Sprite vs. Group or Group vs. Group.
        * Note: Does not take the objects scrollFactor into account. All overlaps are check in world space.
        * @param object1 The first Sprite or Group to check. If null the world.group is used.
        * @param object2 The second Sprite or Group to check.
        * @param notifyCallback A callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you passed them to Collision.overlap.
        * @param processCallback A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then notifyCallback will only be called if processCallback returns true.
        * @param context The context in which the callbacks will be called
        * @returns {boolean} true if the objects overlap, otherwise false.
        */
        public overlap(object1?, object2?, notifyCallback?, processCallback?, context?): bool;
        /**
        * Collision resolution specifically for GameObjects vs. Tiles.
        * @param object The GameObject to separate
        * @param tile The Tile to separate
        * @returns {boolean} Whether the objects in fact touched and were separated
        */
        public separateTile(object: Sprite, x: number, y: number, width: number, height: number, mass: number, collideLeft: bool, collideRight: bool, collideUp: bool, collideDown: bool, separateX: bool, separateY: bool): bool;
    }
}
/**
* Phaser - ArcadePhysics - Body
*/
module Phaser.Physics {
    class Body {
        constructor(sprite: Sprite, type: number);
        /**
        * Reference to Phaser.Game
        */
        public game: Game;
        /**
        * Reference to the parent Sprite
        */
        public sprite: Sprite;
        /**
        * The type of Body (disabled, dynamic, static or kinematic)
        * Disabled = skips all physics operations / tests (default)
        * Dynamic = gives and receives impacts
        * Static = gives but doesn't receive impacts, cannot be moved by physics
        * Kinematic = gives impacts, but never receives, can be moved by physics
        * @type {number}
        */
        public type: number;
        public gravity: Vec2;
        public bounce: Vec2;
        public velocity: Vec2;
        public acceleration: Vec2;
        public drag: Vec2;
        public maxVelocity: Vec2;
        public angularVelocity: number;
        public angularAcceleration: number;
        public angularDrag: number;
        public maxAngular: number;
        /**
        * Orientation of the object.
        * @type {number}
        */
        public facing: number;
        public touching: number;
        public allowCollisions: number;
        public wasTouching: number;
        public mass: number;
        public position: Vec2;
        public oldPosition: Vec2;
        public offset: Vec2;
        public bounds: Rectangle;
        private _width;
        private _height;
        public x : number;
        public y : number;
        public width : number;
        public height : number;
        public preUpdate(): void;
        public postUpdate(): void;
        public hullWidth : number;
        public hullHeight : number;
        public hullX : number;
        public hullY : number;
        public deltaXAbs : number;
        public deltaYAbs : number;
        public deltaX : number;
        public deltaY : number;
        public render(context: CanvasRenderingContext2D): void;
        /**
        * Render debug infos. (including name, bounds info, position and some other properties)
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        public renderDebugInfo(x: number, y: number, color?: string): void;
    }
}
/**
* Phaser - Sprite
*/
module Phaser {
    class Sprite implements IGameObject {
        /**
        * Create a new <code>Sprite</code>.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param [x] {number} the initial x position of the sprite.
        * @param [y] {number} the initial y position of the sprite.
        * @param [key] {string} Key of the graphic you want to load for this sprite.
        * @param [bodyType] {number} The physics body type of the object (defaults to BODY_DISABLED, i.e. no physics)
        * @param [shapeType] {number} The physics shape the body will consist of (either Box (0) or Circle (1), for custom types see body.addShape)
        */
        constructor(game: Game, x?: number, y?: number, key?: string, frame?, bodyType?: number, shapeType?: number);
        /**
        * Reference to the main game object
        */
        public game: Game;
        /**
        * The type of game object.
        */
        public type: number;
        /**
        * The name of game object.
        */
        public name: string;
        /**
        * The Group this Sprite belongs to.
        */
        public group: Group;
        /**
        * Controls if both <code>update</code> and render are called by the core game loop.
        */
        public exists: bool;
        /**
        * Controls if <code>update()</code> is automatically called by the core game loop.
        */
        public active: bool;
        /**
        * Controls if this Sprite is rendered or skipped during the core game loop.
        */
        public visible: bool;
        /**
        * A useful state for many game objects. Kill and revive both flip this switch.
        */
        public alive: bool;
        /**
        * Is the Sprite out of the world bounds or not?
        */
        public outOfBounds: bool;
        /**
        * The action to be taken when the sprite is fully out of the world bounds
        * Defaults to Phaser.Types.OUT_OF_BOUNDS_PERSIST
        */
        public outOfBoundsAction: number;
        /**
        * Sprite physics body.
        */
        public body: Physics.Body;
        /**
        * The texture used to render the Sprite.
        */
        public texture: Components.Texture;
        /**
        * The Sprite transform component.
        */
        public transform: Components.Transform;
        /**
        * The Input component
        */
        public input: Components.Sprite.Input;
        /**
        * The Events component
        */
        public events: Components.Sprite.Events;
        /**
        * This manages animations of the sprite. You can modify animations though it. (see AnimationManager)
        * @type AnimationManager
        */
        public animations: Components.AnimationManager;
        /**
        * A Rectangle that defines the size and placement of the Sprite in the game world,
        * after taking into consideration both scrollFactor and scaling.
        */
        public worldView: Rectangle;
        /**
        * A Rectangle that maps to the placement of this sprite with respect to a specific Camera.
        * This value is constantly updated and modified during the internal render pass, it is not meant to be accessed directly.
        */
        public cameraView: Rectangle;
        /**
        * A local tween variable. Used by the TweenManager when setting a tween on this sprite or a property of it.
        */
        public tween: Tween;
        /**
        * A boolean representing if the Sprite has been modified in any way via a scale, rotate, flip or skew.
        */
        public modified: bool;
        /**
        * x value of the object.
        */
        public x: number;
        /**
        * y value of the object.
        */
        public y: number;
        /**
        * z order value of the object.
        */
        public z: number;
        /**
        * Render iteration counter
        */
        public renderOrderID: number;
        /**
        * The rotation of the sprite in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
        */
        /**
        * Set the rotation of the sprite in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
        * The value is automatically wrapped to be between 0 and 360.
        */
        public rotation : number;
        /**
        * Brings this Sprite to the top of its current Group, if set.
        */
        public bringToTop(): void;
        /**
        * The scale of the Sprite. A value of 1 is original scale. 0.5 is half size. 2 is double the size.
        * This is a reference to Sprite.transform.scale
        */
        public scale: Vec2;
        /**
        * The crop rectangle allows you to control which part of the sprite texture is rendered without distorting it.
        * Set to null to disable, set to a Phaser.Rectangle object to control the region that will be rendered, anything outside the rectangle is ignored.
        * @type {Phaser.Rectangle}
        */
        public crop: Rectangle;
        /**
        * The origin of the Sprite around which rotation and positioning takes place.
        * This is a reference to Sprite.transform.origin
        */
        public origin: Vec2;
        /**
        * The alpha of the Sprite between 0 and 1, a value of 1 being fully opaque.
        */
        /**
        * The alpha of the Sprite between 0 and 1, a value of 1 being fully opaque.
        */
        public alpha : number;
        /**
        * Get the animation frame number.
        */
        /**
        * Set the animation frame by frame number.
        */
        public frame : number;
        /**
        * Get the animation frame name.
        */
        /**
        * Set the animation frame by frame name.
        */
        public frameName : string;
        public width : number;
        public height : number;
        /**
        * Pre-update is called right before update() on each object in the game loop.
        */
        public preUpdate(): void;
        /**
        * Override this function to update your sprites position and appearance.
        */
        public update(): void;
        /**
        * Automatically called after update() by the game loop for all 'alive' objects.
        */
        public postUpdate(): void;
        /**
        * Clean up memory.
        */
        public destroy(): void;
        /**
        * Handy for "killing" game objects.
        * Default behavior is to flag them as nonexistent AND dead.
        * However, if you want the "corpse" to remain in the game,
        * like to animate an effect or whatever, you should override this,
        * setting only alive to false, and leaving exists true.
        */
        public kill(removeFromGroup?: bool): void;
        /**
        * Handy for bringing game objects "back to life". Just sets alive and exists back to true.
        * In practice, this is most often called by <code>Object.reset()</code>.
        */
        public revive(): void;
    }
}
/**
* Phaser - SpriteUtils
*
* A collection of methods useful for manipulating and checking Sprites.
*/
module Phaser {
    class SpriteUtils {
        static _tempPoint: Point;
        static _sin: number;
        static _cos: number;
        /**
        * Updates a Sprites cameraView Rectangle based on the given camera, sprite world position and rotation
        * @param camera {Camera} The Camera to use in the view
        * @param sprite {Sprite} The Sprite that will have its cameraView property modified
        * @return {Rectangle} A reference to the Sprite.cameraView property
        */
        static updateCameraView(camera: Camera, sprite: Sprite): Rectangle;
        static getAsPoints(sprite: Sprite): Point[];
        /**
        * Checks to see if the given x and y coordinates overlaps this <code>Sprite</code>, taking scaling and rotation into account.
        * The coordinates must be given in world space, not local or camera space.
        *
        * @param sprite {Sprite} The Sprite to check. It will take scaling and rotation into account.
        * @param x {Number} The x coordinate in world space.
        * @param y {Number} The y coordinate in world space.
        *
        * @return   Whether or not the point overlaps this object.
        */
        static overlapsXY(sprite: Sprite, x: number, y: number): bool;
        /**
        * Checks to see if the given point overlaps this <code>Sprite</code>, taking scaling and rotation into account.
        * The point must be given in world space, not local or camera space.
        *
        * @param sprite {Sprite} The Sprite to check. It will take scaling and rotation into account.
        * @param point {Point} The point in world space you want to check.
        *
        * @return   Whether or not the point overlaps this object.
        */
        static overlapsPoint(sprite: Sprite, point: Point): bool;
        /**
        * Check and see if this object is currently on screen.
        *
        * @param camera {Camera} Specify which game camera you want. If null getScreenXY() will just grab the first global camera.
        *
        * @return {boolean} Whether the object is on screen or not.
        */
        static onScreen(sprite: Sprite, camera?: Camera): bool;
        /**
        * Call this to figure out the on-screen position of the object.
        *
        * @param point {Point} Takes a <code>Point</code> object and assigns the post-scrolled X and Y values of this object to it.
        * @param camera {Camera} Specify which game camera you want.  If null getScreenXY() will just grab the first global camera.
        *
        * @return {Point} The <code>Point</code> you passed in, or a new <code>Point</code> if you didn't pass one, containing the screen X and Y position of this object.
        */
        static getScreenXY(sprite: Sprite, point?: Point, camera?: Camera): Point;
        /**
        * Handy for reviving game objects.
        * Resets their existence flags and position.
        *
        * @param x {number} The new X position of this object.
        * @param y {number} The new Y position of this object.
        */
        static reset(sprite: Sprite, x: number, y: number): void;
        /**
        * Set the world bounds that this GameObject can exist within. By default a GameObject can exist anywhere
        * in the world. But by setting the bounds (which are given in world dimensions, not screen dimensions)
        * it can be stopped from leaving the world, or a section of it.
        *
        * @param x {number} x position of the bound
        * @param y {number} y position of the bound
        * @param width {number} width of its bound
        * @param height {number} height of its bound
        */
        static setBounds(x: number, y: number, width: number, height: number): void;
    }
}
/**
* Phaser - Components - Texture
*
* The Texture being used to render the object (Sprite, Group background, etc). Either Image based on a DynamicTexture.
*/
module Phaser.Components {
    class Texture {
        /**
        * Creates a new Texture component
        * @param parent The object using this Texture to render.
        * @param key An optional Game.Cache key to load an image from
        */
        constructor(parent);
        /**
        * Private _width - use the width getter/setter instead
        */
        private _width;
        /**
        * Private _height - use the height getter/setter instead
        */
        private _height;
        /**
        * Reference to Phaser.Game
        */
        public game: Game;
        /**
        * Reference to the parent object (Sprite, Group, etc)
        */
        public parent;
        /**
        * Reference to the Image stored in the Game.Cache that is used as the texture for the Sprite.
        */
        public imageTexture;
        /**
        * Reference to the DynamicTexture that is used as the texture for the Sprite.
        * @type {DynamicTexture}
        */
        public dynamicTexture: DynamicTexture;
        /**
        * The load status of the texture image.
        * @type {boolean}
        */
        public loaded: bool;
        /**
        * An Array of Cameras to which this texture won't render
        * @type {Array}
        */
        public cameraBlacklist: number[];
        /**
        * Whether the texture background is opaque or not. If set to true the object is filled with
        * the value of Texture.backgroundColor every frame. Normally you wouldn't enable this but
        * for some effects it can be handy.
        * @type {boolean}
        */
        public opaque: bool;
        /**
        * Opacity of the Sprite texture where 1 is opaque (default) and 0 is fully transparent.
        * @type {number}
        */
        public alpha: number;
        /**
        * The Background Color of the Sprite if Texture.opaque is set to true.
        * Given in css color string format, i.e. 'rgb(0,0,0)' or '#ff0000'.
        * @type {string}
        */
        public backgroundColor: string;
        /**
        * You can set a globalCompositeOperation that will be applied before the render method is called on this Sprite.
        * This is useful if you wish to apply an effect like 'lighten'.
        * If this value is set it will call a canvas context save and restore before and after the render pass, so use it sparingly.
        * Set to null to disable.
        */
        public globalCompositeOperation: string;
        /**
        * A reference to the Canvas this Sprite renders to.
        * @type {HTMLCanvasElement}
        */
        public canvas: HTMLCanvasElement;
        /**
        * A reference to the Canvas Context2D this Sprite renders to.
        * @type {CanvasRenderingContext2D}
        */
        public context: CanvasRenderingContext2D;
        /**
        * The Cache key used for the Image Texture.
        */
        public cacheKey: string;
        /**
        * The Texture being used to render the Sprite. Either an Image Texture from the Cache or a DynamicTexture.
        */
        public texture;
        /**
        * Controls if the Sprite is rendered rotated or not.
        * If renderRotation is false then the object can still rotate but it will never be rendered rotated.
        * @type {boolean}
        */
        public renderRotation: bool;
        /**
        * The direction the animation frame is facing (can be Phaser.Types.RIGHT, LEFT, UP, DOWN).
        * Very useful when hooking animation to Sprite directions.
        */
        public facing: number;
        /**
        * Flip the graphic horizontally (defaults to false)
        * @type {boolean}
        */
        public flippedX: bool;
        /**
        * Flip the graphic vertically (defaults to false)
        * @type {boolean}
        */
        public flippedY: bool;
        /**
        * Is the texture a DynamicTexture?
        * @type {boolean}
        */
        public isDynamic: bool;
        /**
        * The crop rectangle allows you to control which part of the sprite texture is rendered without distorting it.
        * Set to null to disable, set to a Phaser.Rectangle object to control the region that will be rendered, anything outside the rectangle is ignored.
        * @type {Phaser.Rectangle}
        */
        public crop: Rectangle;
        /**
        * Updates the texture being used to render the Sprite.
        * Called automatically by SpriteUtils.loadTexture and SpriteUtils.loadDynamicTexture.
        */
        public setTo(image?, dynamic?: DynamicTexture);
        /**
        * Sets a new graphic from the game cache to use as the texture for this Sprite.
        * The graphic can be SpriteSheet or Texture Atlas. If you need to use a DynamicTexture see loadDynamicTexture.
        * @param key {string} Key of the graphic you want to load for this sprite.
        * @param clearAnimations {boolean} If this Sprite has a set of animation data already loaded you can choose to keep or clear it with this boolean
        * @param updateBody {boolean} Update the physics body dimensions to match the newly loaded texture/frame?
        */
        public loadImage(key: string, clearAnimations?: bool, updateBody?: bool): void;
        /**
        * Load a DynamicTexture as its texture.
        * @param texture {DynamicTexture} The texture object to be used by this sprite.
        */
        public loadDynamicTexture(texture: DynamicTexture): void;
        /**
        * The width of the texture. If an animation it will be the frame width, not the width of the sprite sheet.
        * If using a DynamicTexture it will be the width of the dynamic texture itself.
        * @type {number}
        */
        public width : number;
        /**
        * The height of the texture. If an animation it will be the frame height, not the height of the sprite sheet.
        * If using a DynamicTexture it will be the height of the dynamic texture itself.
        * @type {number}
        */
        public height : number;
    }
}
/**
* Phaser - Group
*
* This class is used for organising, updating and sorting game objects.
*/
module Phaser {
    class Group {
        constructor(game: Game, maxSize?: number);
        /**
        * Internal tracker for the maximum capacity of the group.
        * Default is 0, or no max capacity.
        */
        private _maxSize;
        /**
        * Internal helper variable for recycling objects a la <code>Emitter</code>.
        */
        private _marker;
        /**
        * Helper for sort.
        */
        private _sortIndex;
        /**
        * Helper for sort.
        */
        private _sortOrder;
        /**
        * Temp vars to help avoid gc spikes
        */
        private _member;
        private _length;
        private _i;
        private _prevAlpha;
        private _count;
        /**
        * This keeps track of the z value of any game object added to this Group
        */
        private _zCounter;
        /**
        * Reference to the main game object
        */
        public game: Game;
        /**
        * The type of game object.
        */
        public type: number;
        /**
        * The unique Group ID
        */
        public ID: number;
        /**
        * The z value of this Group (within its parent Group, if any)
        */
        public z: number;
        /**
        * The Group this Group is a child of (if any).
        */
        public group: Group;
        /**
        * Optional texture used in the background of the Camera.
        */
        public texture: Components.Texture;
        /**
        * The transform component.
        */
        public transform: Components.Transform;
        /**
        * A boolean representing if the Group has been modified in any way via a scale, rotate, flip or skew.
        */
        public modified: bool;
        /**
        * If this Group exists or not. Can be set to false to skip certain loop checks.
        */
        public exists: bool;
        /**
        * Controls if this Group (and all of its contents) are rendered or skipped during the core game loop.
        */
        public visible: bool;
        /**
        * Use with <code>sort()</code> to sort in ascending order.
        */
        static ASCENDING: number;
        /**
        * Use with <code>sort()</code> to sort in descending order.
        */
        static DESCENDING: number;
        /**
        * Array of all the objects that exist in this group.
        */
        public members;
        /**
        * The number of entries in the members array.
        * For performance and safety you should check this variable
        * instead of members.length unless you really know what you're doing!
        */
        public length: number;
        /**
        * Gets the next z index value for children of this Group
        */
        public getNextZIndex(): number;
        /**
        * Override this function to handle any deleting or "shutdown" type operations you might need,
        * such as removing traditional children like Basic objects.
        */
        public destroy(): void;
        /**
        * Calls update on all members of this Group who have a status of active=true and exists=true
        * You can also call Object.update directly, which will bypass the active/exists check.
        */
        public update(): void;
        /**
        * Calls update on all members of this Group who have a status of active=true and exists=true
        * You can also call Object.postUpdate directly, which will bypass the active/exists check.
        */
        public postUpdate(): void;
        /**
        * Calls render on all members of this Group who have a status of visible=true and exists=true
        * You can also call Object.render directly, which will bypass the visible/exists check.
        */
        public render(camera: Camera): void;
        /**
        * Calls render on all members of this Group regardless of their visible status and also ignores the camera blacklist.
        * Use this when the Group objects render to hidden canvases for example.
        */
        public directRender(camera: Camera): void;
        /**
        * The maximum capacity of this group.  Default is 0, meaning no max capacity, and the group can just grow.
        */
        /**
        * @private
        */
        public maxSize : number;
        /**
        * Adds a new Game Object to the group.
        * Group will try to replace a null member of the array first.
        * Failing that, Group will add it to the end of the member array,
        * assuming there is room for it, and doubling the size of the array if necessary.
        *
        * <p>WARNING: If the group has a maxSize that has already been met,
        * the object will NOT be added to the group!</p>
        *
        * @param {Basic} Object The object you want to add to the group.
        * @return {Basic} The same object that was passed in.
        */
        public add(object): any;
        /**
        * Create a new Sprite within this Group at the specified position.
        *
        * @param x {number} X position of the new sprite.
        * @param y {number} Y position of the new sprite.
        * @param [key] {string} The image key as defined in the Game.Cache to use as the texture for this sprite
        * @param [frame] {string|number} If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
        * @param [bodyType] {number} The physics body type of the object (defaults to BODY_DISABLED)
        * @returns {Sprite} The newly created sprite object.
        */
        public addNewSprite(x: number, y: number, key?: string, frame?, bodyType?: number): Sprite;
        /**
        * Sets all of the game object properties needed to exist within this Group.
        */
        private setObjectIDs(object, zIndex?);
        /**
        * Recycling is designed to help you reuse game objects without always re-allocating or "newing" them.
        *
        * <p>If you specified a maximum size for this group (like in Emitter),
        * then recycle will employ what we're calling "rotating" recycling.
        * Recycle() will first check to see if the group is at capacity yet.
        * If group is not yet at capacity, recycle() returns a new object.
        * If the group IS at capacity, then recycle() just returns the next object in line.</p>
        *
        * <p>If you did NOT specify a maximum size for this group,
        * then recycle() will employ what we're calling "grow-style" recycling.
        * Recycle() will return either the first object with exists == false,
        * or, finding none, add a new object to the array,
        * doubling the size of the array if necessary.</p>
        *
        * <p>WARNING: If this function needs to create a new object,
        * and no object class was provided, it will return null
        * instead of a valid object!</p>
        *
        * @param {class} ObjectClass The class type you want to recycle (e.g. Basic, EvilRobot, etc). Do NOT "new" the class in the parameter!
        *
        * @return {any} A reference to the object that was created.  Don't forget to cast it back to the Class you want (e.g. myObject = myGroup.recycle(myObjectClass) as myObjectClass;).
        */
        public recycle(objectClass?);
        /**
        * Removes an object from the group.
        *
        * @param {Basic} object The Game Object you want to remove.
        * @param {boolean} splice Whether the object should be cut from the array entirely or not.
        *
        * @return {Basic} The removed object.
        */
        public remove(object, splice?: bool);
        /**
        * Replaces an existing game object in this Group with a new one.
        *
        * @param {Basic} oldObject	The object you want to replace.
        * @param {Basic} newObject	The new object you want to use instead.
        *
        * @return {Basic} The new object.
        */
        public replace(oldObject, newObject);
        /**
        * Swaps two existing game object in this Group with each other.
        *
        * @param {Basic} child1 The first object to swap.
        * @param {Basic} child2 The second object to swap.
        *
        * @return {Basic} True if the two objects successfully swapped position.
        */
        public swap(child1, child2, sort?: bool): bool;
        public bringToTop(child): bool;
        /**
        * Call this function to sort the group according to a particular value and order.
        * For example, to sort game objects for Zelda-style overlaps you might call
        * <code>myGroup.sort("y",Group.ASCENDING)</code> at the bottom of your
        * <code>State.update()</code> override.  To sort all existing objects after
        * a big explosion or bomb attack, you might call <code>myGroup.sort("exists",Group.DESCENDING)</code>.
        *
        * @param {string} index The <code>string</code> name of the member variable you want to sort on.  Default value is "z".
        * @param {number} order A <code>Group</code> constant that defines the sort order.  Possible values are <code>Group.ASCENDING</code> and <code>Group.DESCENDING</code>.  Default value is <code>Group.ASCENDING</code>.
        */
        public sort(index?: string, order?: number): void;
        /**
        * Helper function for the sort process.
        *
        * @param {Basic} Obj1 The first object being sorted.
        * @param {Basic} Obj2 The second object being sorted.
        *
        * @return {number} An integer value: -1 (Obj1 before Obj2), 0 (same), or 1 (Obj1 after Obj2).
        */
        public sortHandler(obj1, obj2): number;
        /**
        * Go through and set the specified variable to the specified value on all members of the group.
        *
        * @param {string} VariableName	The string representation of the variable name you want to modify, for example "visible" or "scrollFactor".
        * @param {Object} Value The value you want to assign to that variable.
        * @param {boolean} Recurse	Default value is true, meaning if <code>setAll()</code> encounters a member that is a group, it will call <code>setAll()</code> on that group rather than modifying its variable.
        */
        public setAll(variableName: string, value: Object, recurse?: bool): void;
        /**
        * Go through and call the specified function on all members of the group.
        * Currently only works on functions that have no required parameters.
        *
        * @param {string} FunctionName	The string representation of the function you want to call on each object, for example "kill()" or "init()".
        * @param {boolean} Recurse	Default value is true, meaning if <code>callAll()</code> encounters a member that is a group, it will call <code>callAll()</code> on that group rather than calling the group's function.
        */
        public callAll(functionName: string, recurse?: bool): void;
        /**
        * @param {function} callback
        * @param {boolean} recursive
        */
        public forEach(callback, recursive?: bool): void;
        /**
        * @param {any} context
        * @param {function} callback
        * @param {boolean} recursive
        */
        public forEachAlive(context, callback, recursive?: bool): void;
        /**
        * Call this function to retrieve the first object with exists == false in the group.
        * This is handy for recycling in general, e.g. respawning enemies.
        *
        * @param {any} [ObjectClass] An optional parameter that lets you narrow the results to instances of this particular class.
        *
        * @return {any} A <code>Basic</code> currently flagged as not existing.
        */
        public getFirstAvailable(objectClass?);
        /**
        * Call this function to retrieve the first index set to 'null'.
        * Returns -1 if no index stores a null object.
        *
        * @return {number} An <code>int</code> indicating the first null slot in the group.
        */
        public getFirstNull(): number;
        /**
        * Call this function to retrieve the first object with exists == true in the group.
        * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
        *
        * @return {Basic} A <code>Basic</code> currently flagged as existing.
        */
        public getFirstExtant();
        /**
        * Call this function to retrieve the first object with dead == false in the group.
        * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
        *
        * @return {Basic} A <code>Basic</code> currently flagged as not dead.
        */
        public getFirstAlive();
        /**
        * Call this function to retrieve the first object with dead == true in the group.
        * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
        *
        * @return {Basic} A <code>Basic</code> currently flagged as dead.
        */
        public getFirstDead();
        /**
        * Call this function to find out how many members of the group are not dead.
        *
        * @return {number} The number of <code>Basic</code>s flagged as not dead.  Returns -1 if group is empty.
        */
        public countLiving(): number;
        /**
        * Call this function to find out how many members of the group are dead.
        *
        * @return {number} The number of <code>Basic</code>s flagged as dead.  Returns -1 if group is empty.
        */
        public countDead(): number;
        /**
        * Returns a member at random from the group.
        *
        * @param {number} StartIndex Optional offset off the front of the array. Default value is 0, or the beginning of the array.
        * @param {number} Length Optional restriction on the number of values you want to randomly select from.
        *
        * @return {Basic} A <code>Basic</code> from the members list.
        */
        public getRandom(startIndex?: number, length?: number);
        /**
        * Remove all instances of <code>Basic</code> subclass (Basic, Block, etc) from the list.
        * WARNING: does not destroy() or kill() any of these objects!
        */
        public clear(): void;
        /**
        * Calls kill on the group's members and then on the group itself.
        */
        public kill(): void;
    }
}
/**
* Phaser - SignalBinding
*
* An object that represents a binding between a Signal and a listener function.
* Based on JS Signals by Miller Medeiros. Converted by TypeScript by Richard Davey.
* Released under the MIT license
* http://millermedeiros.github.com/js-signals/
*/
module Phaser {
    class SignalBinding {
        /**
        * Object that represents a binding between a Signal and a listener function.
        * <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>
        * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
        * @author Miller Medeiros
        * @constructor
        * @internal
        * @name SignalBinding
        * @param {Signal} signal Reference to Signal object that listener is currently bound to.
        * @param {Function} listener Handler function bound to the signal.
        * @param {boolean} isOnce If binding should be executed just once.
        * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
        * @param {Number} [priority] The priority level of the event listener. (default = 0).
        */
        constructor(signal: Signal, listener, isOnce: bool, listenerContext, priority?: number);
        /**
        * Handler function bound to the signal.
        * @type Function
        * @private
        */
        private _listener;
        /**
        * If binding should be executed just once.
        * @type boolean
        * @private
        */
        private _isOnce;
        /**
        * Context on which listener will be executed (object that should represent the `this` variable inside listener function).
        * @memberOf SignalBinding.prototype
        * @name context
        * @type Object|undefined|null
        */
        public context;
        /**
        * Reference to Signal object that listener is currently bound to.
        * @type Signal
        * @private
        */
        private _signal;
        /**
        * Listener priority
        * @type Number
        */
        public priority: number;
        /**
        * If binding is active and should be executed.
        * @type boolean
        */
        public active: bool;
        /**
        * Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute`. (curried parameters)
        * @type Array|null
        */
        public params;
        /**
        * Call listener passing arbitrary parameters.
        * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p>
        * @param {Array} [paramsArr] Array of parameters that should be passed to the listener
        * @return {*} Value returned by the listener.
        */
        public execute(paramsArr?: any[]);
        /**
        * Detach binding from signal.
        * - alias to: mySignal.remove(myBinding.getListener());
        * @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
        */
        public detach();
        /**
        * @return {Boolean} `true` if binding is still bound to the signal and have a listener.
        */
        public isBound(): bool;
        /**
        * @return {boolean} If SignalBinding will only be executed once.
        */
        public isOnce(): bool;
        /**
        * @return {Function} Handler function bound to the signal.
        */
        public getListener();
        /**
        * @return {Signal} Signal that listener is currently bound to.
        */
        public getSignal(): Signal;
        /**
        * Delete instance properties
        * @private
        */
        public _destroy(): void;
        /**
        * @return {string} String representation of the object.
        */
        public toString(): string;
    }
}
/**
* Phaser - Signal
*
* A Signal is used for object communication via a custom broadcaster instead of Events.
* Based on JS Signals by Miller Medeiros. Converted by TypeScript by Richard Davey.
* Released under the MIT license
* http://millermedeiros.github.com/js-signals/
*/
module Phaser {
    class Signal {
        /**
        *
        * @property _bindings
        * @type Array
        * @private
        */
        private _bindings;
        /**
        *
        * @property _prevParams
        * @type Any
        * @private
        */
        private _prevParams;
        /**
        * Signals Version Number
        * @property VERSION
        * @type String
        * @const
        */
        static VERSION: string;
        /**
        * If Signal should keep record of previously dispatched parameters and
        * automatically execute listener during `add()`/`addOnce()` if Signal was
        * already dispatched before.
        * @type boolean
        */
        public memorize: bool;
        /**
        * @type boolean
        * @private
        */
        private _shouldPropagate;
        /**
        * If Signal is active and should broadcast events.
        * <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
        * @type boolean
        */
        public active: bool;
        /**
        *
        * @method validateListener
        * @param {Any} listener
        * @param {Any} fnName
        */
        public validateListener(listener, fnName): void;
        /**
        * @param {Function} listener
        * @param {boolean} isOnce
        * @param {Object} [listenerContext]
        * @param {Number} [priority]
        * @return {SignalBinding}
        * @private
        */
        private _registerListener(listener, isOnce, listenerContext, priority);
        /**
        *
        * @method _addBinding
        * @param {SignalBinding} binding
        * @private
        */
        private _addBinding(binding);
        /**
        *
        * @method _indexOfListener
        * @param {Function} listener
        * @return {number}
        * @private
        */
        private _indexOfListener(listener, context);
        /**
        * Check if listener was attached to Signal.
        * @param {Function} listener
        * @param {Object} [context]
        * @return {boolean} if Signal has the specified listener.
        */
        public has(listener, context?: any): bool;
        /**
        * Add a listener to the signal.
        * @param {Function} listener Signal handler function.
        * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
        * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
        * @return {SignalBinding} An Object representing the binding between the Signal and listener.
        */
        public add(listener, listenerContext?: any, priority?: number): SignalBinding;
        /**
        * Add listener to the signal that should be removed after first execution (will be executed only once).
        * @param {Function} listener Signal handler function.
        * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
        * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
        * @return {SignalBinding} An Object representing the binding between the Signal and listener.
        */
        public addOnce(listener, listenerContext?: any, priority?: number): SignalBinding;
        /**
        * Remove a single listener from the dispatch queue.
        * @param {Function} listener Handler function that should be removed.
        * @param {Object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
        * @return {Function} Listener handler function.
        */
        public remove(listener, context?: any);
        /**
        * Remove all listeners from the Signal.
        */
        public removeAll(): void;
        /**
        * @return {number} Number of listeners attached to the Signal.
        */
        public getNumListeners(): number;
        /**
        * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
        * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
        * @see Signal.prototype.disable
        */
        public halt(): void;
        /**
        * Dispatch/Broadcast Signal to all listeners added to the queue.
        * @param {...*} [params] Parameters that should be passed to each handler.
        */
        public dispatch(...paramsArr: any[]): void;
        /**
        * Forget memorized arguments.
        * @see Signal.memorize
        */
        public forget(): void;
        /**
        * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
        * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
        */
        public dispose(): void;
        /**
        * @return {string} String representation of the object.
        */
        public toString(): string;
    }
}
/**
* Phaser - Loader
*
* The Loader handles loading all external content such as Images, Sounds, Texture Atlases and data files.
* It uses a combination of Image() loading and xhr and provides for progress and completion callbacks.
*/
module Phaser {
    class Loader {
        /**
        * Loader constructor
        *
        * @param game {Phaser.Game} Current game instance.
        * @param callback {function} This will be called when assets completely loaded.
        */
        constructor(game: Game, callback);
        /**
        * Local private reference to game.
        */
        private _game;
        /**
        * Array stors assets keys. So you can get that asset by its unique key.
        */
        private _keys;
        /**
        * Contains all the assets file infos.
        */
        private _fileList;
        /**
        * Game initialial assets loading callback.
        */
        private _gameCreateComplete;
        private _onComplete;
        private _onFileLoad;
        /**
        * Indicates assets loading progress. (from 0 to 100)
        * @type {number}
        */
        private _progressChunk;
        private _xhr;
        /**
        * Length of assets queue.
        * @type {number}
        */
        private _queueSize;
        /**
        * True if game is completely loaded.
        * @type {boolean}
        */
        public hasLoaded: bool;
        /**
        * Loading progress (from 0 to 100)
        * @type {number}
        */
        public progress: number;
        /**
        * The crossOrigin value applied to loaded images
        * @type {string}
        */
        public crossOrigin: string;
        /**
        * TextureAtlas data format constants
        */
        static TEXTURE_ATLAS_JSON_ARRAY: number;
        static TEXTURE_ATLAS_JSON_HASH: number;
        static TEXTURE_ATLAS_XML_STARLING: number;
        /**
        * Reset loader, this will remove all loaded assets.
        */
        public reset(): void;
        public queueSize : number;
        /**
        * Add a new image asset loading request with key and url.
        * @param key {string} Unique asset key of this image file.
        * @param url {string} URL of image file.
        */
        public image(key: string, url: string, overwrite?: bool): void;
        /**
        * Add a new sprite sheet loading request.
        * @param key {string} Unique asset key of the sheet file.
        * @param url {string} URL of sheet file.
        * @param frameWidth {number} Width of each single frame.
        * @param frameHeight {number} Height of each single frame.
        * @param frameMax {number} How many frames in this sprite sheet.
        */
        public spritesheet(key: string, url: string, frameWidth: number, frameHeight: number, frameMax?: number): void;
        /**
        * Add a new texture atlas loading request.
        * @param key {string} Unique asset key of the texture atlas file.
        * @param textureURL {string} The url of the texture atlas image file.
        * @param [atlasURL] {string} The url of the texture atlas data file (json/xml)
        * @param [atlasData] {object} A JSON or XML data object.
        * @param [format] {number} A value describing the format of the data.
        */
        public atlas(key: string, textureURL: string, atlasURL?: string, atlasData?, format?: number): void;
        /**
        * Add a new audio file loading request.
        * @param key {string} Unique asset key of the audio file.
        * @param urls {Array} An array containing the URLs of the audio files, i.e.: [ 'jump.mp3', 'jump.ogg', 'jump.m4a' ]
        * @param autoDecode {boolean} When using Web Audio the audio files can either be decoded at load time or run-time. They can't be played until they are decoded, but this let's you control when that happens. Decoding is a non-blocking async process.
        */
        public audio(key: string, urls: string[], autoDecode?: bool): void;
        /**
        * Add a new text file loading request.
        * @param key {string} Unique asset key of the text file.
        * @param url {string} URL of text file.
        */
        public text(key: string, url: string): void;
        /**
        * Remove loading request of a file.
        * @param key {string} Key of the file you want to remove.
        */
        public removeFile(key: string): void;
        /**
        * Remove all file loading requests.
        */
        public removeAll(): void;
        /**
        * Load assets.
        * @param onFileLoadCallback {function} Called when each file loaded successfully.
        * @param onCompleteCallback {function} Called when all assets completely loaded.
        */
        public start(onFileLoadCallback?, onCompleteCallback?): void;
        /**
        * Load files. Private method ONLY used by loader.
        */
        private loadFile();
        private getAudioURL(urls);
        /**
        * Error occured when load a file.
        * @param key {string} Key of the error loading file.
        */
        private fileError(key);
        /**
        * Called when a file is successfully loaded.
        * @param key {string} Key of the successfully loaded file.
        */
        private fileComplete(key);
        /**
        * Successfully loaded a JSON file.
        * @param key {string} Key of the loaded JSON file.
        */
        private jsonLoadComplete(key);
        /**
        * Error occured when load a JSON.
        * @param key {string} Key of the error loading JSON file.
        */
        private dataLoadError(key);
        private xmlLoadComplete(key);
        /**
        * Handle loading next file.
        * @param previousKey {string} Key of previous loaded asset.
        * @param success {boolean} Whether the previous asset loaded successfully or not.
        */
        private nextFile(previousKey, success);
        /**
        * Check whether asset exists with a specific key.
        * @param key {string} Key of the asset you want to check.
        * @return {boolean} Return true if exists, otherwise return false.
        */
        private checkKeyExists(key);
    }
}
/**
* Phaser - Net
*
*
*/
module Phaser {
    class Net {
        /**
        * Net constructor
        */
        constructor(game: Game);
        /**
        * Local reference to the current Phaser.Game.
        */
        public game: Game;
        /**
        * Compares the given domain name against the hostname of the browser containing the game.
        * If the domain name is found it returns true.
        * You can specify a part of a domain, for example 'google' would match 'google.com', 'google.co.uk', etc.
        * Do not include 'http://' at the start.
        */
        public checkDomainName(domain: string): bool;
        /**
        * Updates a value on the Query String and returns it in full.
        * If the value doesn't already exist it is set.
        * If the value exists it is replaced with the new value given. If you don't provide a new value it is removed from the query string.
        * Optionally you can redirect to the new url, or just return it as a string.
        */
        public updateQueryString(key: string, value: string, redirect?: bool, url?: string): string;
        /**
        * Returns the Query String as an object.
        * If you specify a parameter it will return just the value of that parameter, should it exist.
        */
        public getQueryString(parameter?: string): {};
        private decodeURI(value);
    }
}
/**
* Phaser - Cache
*
* A game only has one instance of a Cache and it is used to store all externally loaded assets such
* as images, sounds and data files as a result of Loader calls. Cache items use string based keys for look-up.
*/
module Phaser {
    class Cache {
        /**
        * Cache constructor
        */
        constructor(game: Game);
        /**
        * Local private reference to game.
        */
        private _game;
        /**
        * Canvas key-value container.
        * @type {object}
        */
        private _canvases;
        /**
        * Image key-value container.
        * @type {object}
        */
        private _images;
        /**
        * Sound key-value container.
        * @type {object}
        */
        private _sounds;
        /**
        * Text key-value container.
        * @type {object}
        */
        private _text;
        /**
        * Add a new canvas.
        * @param key {string} Asset key for this canvas.
        * @param canvas {HTMLCanvasElement} Canvas DOM element.
        * @param context {CanvasRenderingContext2D} Render context of this canvas.
        */
        public addCanvas(key: string, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void;
        /**
        * Add a new sprite sheet.
        * @param key {string} Asset key for the sprite sheet.
        * @param url {string} URL of this sprite sheet file.
        * @param data {object} Extra sprite sheet data.
        * @param frameWidth {number} Width of the sprite sheet.
        * @param frameHeight {number} Height of the sprite sheet.
        * @param frameMax {number} How many frames stored in the sprite sheet.
        */
        public addSpriteSheet(key: string, url: string, data, frameWidth: number, frameHeight: number, frameMax: number): void;
        /**
        * Add a new texture atlas.
        * @param key  {string} Asset key for the texture atlas.
        * @param url  {string} URL of this texture atlas file.
        * @param data {object} Extra texture atlas data.
        * @param atlasData {object} Texture atlas frames data.
        */
        public addTextureAtlas(key: string, url: string, data, atlasData, format: number): void;
        /**
        * Add a new image.
        * @param key {string} Asset key for the image.
        * @param url {string} URL of this image file.
        * @param data {object} Extra image data.
        */
        public addImage(key: string, url: string, data): void;
        /**
        * Add a new sound.
        * @param key {string} Asset key for the sound.
        * @param url {string} URL of this sound file.
        * @param data {object} Extra sound data.
        */
        public addSound(key: string, url: string, data, webAudio?: bool, audioTag?: bool): void;
        public reloadSound(key: string): void;
        public onSoundUnlock: Signal;
        public reloadSoundComplete(key: string): void;
        public updateSound(key: string, property: string, value): void;
        /**
        * Add a new decoded sound.
        * @param key {string} Asset key for the sound.
        * @param data {object} Extra sound data.
        */
        public decodedSound(key: string, data): void;
        /**
        * Add a new text data.
        * @param key {string} Asset key for the text data.
        * @param url {string} URL of this text data file.
        * @param data {object} Extra text data.
        */
        public addText(key: string, url: string, data): void;
        /**
        * Get canvas by key.
        * @param key Asset key of the canvas you want.
        * @return {object} The canvas you want.
        */
        public getCanvas(key: string);
        /**
        * Get image data by key.
        * @param key Asset key of the image you want.
        * @return {object} The image data you want.
        */
        public getImage(key: string);
        /**
        * Get frame data by key.
        * @param key Asset key of the frame data you want.
        * @return {object} The frame data you want.
        */
        public getFrameData(key: string): FrameData;
        /**
        * Get sound by key.
        * @param key Asset key of the sound you want.
        * @return {object} The sound you want.
        */
        public getSound(key: string);
        /**
        * Get sound data by key.
        * @param key Asset key of the sound you want.
        * @return {object} The sound data you want.
        */
        public getSoundData(key: string);
        /**
        * Check whether an asset is decoded sound.
        * @param key Asset key of the sound you want.
        * @return {object} The sound data you want.
        */
        public isSoundDecoded(key: string): bool;
        /**
        * Check whether an asset is decoded sound.
        * @param key Asset key of the sound you want.
        * @return {object} The sound data you want.
        */
        public isSoundReady(key: string): bool;
        /**
        * Check whether an asset is sprite sheet.
        * @param key Asset key of the sprite sheet you want.
        * @return {object} The sprite sheet data you want.
        */
        public isSpriteSheet(key: string): bool;
        /**
        * Get text data by key.
        * @param key Asset key of the text data you want.
        * @return {object} The text data you want.
        */
        public getText(key: string);
        /**
        * Returns an array containing all of the keys of Images in the Cache.
        * @return {Array} The string based keys in the Cache.
        */
        public getImageKeys(): any[];
        /**
        * Returns an array containing all of the keys of Sounds in the Cache.
        * @return {Array} The string based keys in the Cache.
        */
        public getSoundKeys(): any[];
        /**
        * Returns an array containing all of the keys of Text Files in the Cache.
        * @return {Array} The string based keys in the Cache.
        */
        public getTextKeys(): any[];
        public removeCanvas(key: string): void;
        public removeImage(key: string): void;
        public removeSound(key: string): void;
        public removeText(key: string): void;
        /**
        * Clean up cache memory.
        */
        public destroy(): void;
    }
}
/**
* Phaser - GameMath
*
* Adds a set of extra Math functions used through-out Phaser.
* Includes methods written by Dylan Engelman and Adam Saltsman.
*/
module Phaser {
    class GameMath {
        constructor(game: Game);
        public game: Game;
        static sinA: number[];
        static cosA: number[];
        static PI: number;
        static PI_2: number;
        static PI_4: number;
        static PI_8: number;
        static PI_16: number;
        static TWO_PI: number;
        static THREE_PI_2: number;
        static E: number;
        static LN10: number;
        static LN2: number;
        static LOG10E: number;
        static LOG2E: number;
        static SQRT1_2: number;
        static SQRT2: number;
        static DEG_TO_RAD: number;
        static RAD_TO_DEG: number;
        static B_16: number;
        static B_31: number;
        static B_32: number;
        static B_48: number;
        static B_53: number;
        static B_64: number;
        static ONE_THIRD: number;
        static TWO_THIRDS: number;
        static ONE_SIXTH: number;
        static COS_PI_3: number;
        static SIN_2PI_3: number;
        static CIRCLE_ALPHA: number;
        static ON: bool;
        static OFF: bool;
        static SHORT_EPSILON: number;
        static PERC_EPSILON: number;
        static EPSILON: number;
        static LONG_EPSILON: number;
        public cosTable: any[];
        public sinTable: any[];
        public fuzzyEqual(a: number, b: number, epsilon?: number): bool;
        public fuzzyLessThan(a: number, b: number, epsilon?: number): bool;
        public fuzzyGreaterThan(a: number, b: number, epsilon?: number): bool;
        public fuzzyCeil(val: number, epsilon?: number): number;
        public fuzzyFloor(val: number, epsilon?: number): number;
        public average(...args: any[]): number;
        public slam(value: number, target: number, epsilon?: number): number;
        /**
        * ratio of value to a range
        */
        public percentageMinMax(val: number, max: number, min?: number): number;
        /**
        * a value representing the sign of the value.
        * -1 for negative, +1 for positive, 0 if value is 0
        */
        public sign(n: number): number;
        public truncate(n: number): number;
        public shear(n: number): number;
        /**
        * wrap a value around a range, similar to modulus with a floating minimum
        */
        public wrap(val: number, max: number, min?: number): number;
        /**
        * arithmetic version of wrap... need to decide which is more efficient
        */
        public arithWrap(value: number, max: number, min?: number): number;
        /**
        * force a value within the boundaries of two values
        *
        * if max < min, min is returned
        */
        public clamp(input: number, max: number, min?: number): number;
        /**
        * Snap a value to nearest grid slice, using rounding.
        *
        * example if you have an interval gap of 5 and a position of 12... you will snap to 10. Where as 14 will snap to 15
        *
        * @param input - the value to snap
        * @param gap - the interval gap of the grid
        * @param [start] - optional starting offset for gap
        */
        public snapTo(input: number, gap: number, start?: number): number;
        /**
        * Snap a value to nearest grid slice, using floor.
        *
        * example if you have an interval gap of 5 and a position of 12... you will snap to 10. As will 14 snap to 10... but 16 will snap to 15
        *
        * @param input - the value to snap
        * @param gap - the interval gap of the grid
        * @param [start] - optional starting offset for gap
        */
        public snapToFloor(input: number, gap: number, start?: number): number;
        /**
        * Snap a value to nearest grid slice, using ceil.
        *
        * example if you have an interval gap of 5 and a position of 12... you will snap to 15. As will 14 will snap to 15... but 16 will snap to 20
        *
        * @param input - the value to snap
        * @param gap - the interval gap of the grid
        * @param [start] - optional starting offset for gap
        */
        public snapToCeil(input: number, gap: number, start?: number): number;
        /**
        * Snaps a value to the nearest value in an array.
        */
        public snapToInArray(input: number, arr: number[], sort?: bool): number;
        /**
        * roundTo some place comparative to a 'base', default is 10 for decimal place
        *
        * 'place' is represented by the power applied to 'base' to get that place
        *
        * @param value - the value to round
        * @param place - the place to round to
        * @param base - the base to round in... default is 10 for decimal
        *
        * e.g.
        *
        * 2000/7 ~= 285.714285714285714285714 ~= (bin)100011101.1011011011011011
        *
        * roundTo(2000/7,3) == 0
        * roundTo(2000/7,2) == 300
        * roundTo(2000/7,1) == 290
        * roundTo(2000/7,0) == 286
        * roundTo(2000/7,-1) == 285.7
        * roundTo(2000/7,-2) == 285.71
        * roundTo(2000/7,-3) == 285.714
        * roundTo(2000/7,-4) == 285.7143
        * roundTo(2000/7,-5) == 285.71429
        *
        * roundTo(2000/7,3,2)  == 288       -- 100100000
        * roundTo(2000/7,2,2)  == 284       -- 100011100
        * roundTo(2000/7,1,2)  == 286       -- 100011110
        * roundTo(2000/7,0,2)  == 286       -- 100011110
        * roundTo(2000/7,-1,2) == 285.5     -- 100011101.1
        * roundTo(2000/7,-2,2) == 285.75    -- 100011101.11
        * roundTo(2000/7,-3,2) == 285.75    -- 100011101.11
        * roundTo(2000/7,-4,2) == 285.6875  -- 100011101.1011
        * roundTo(2000/7,-5,2) == 285.71875 -- 100011101.10111
        *
        * note what occurs when we round to the 3rd space (8ths place), 100100000, this is to be assumed
        * because we are rounding 100011.1011011011011011 which rounds up.
        */
        public roundTo(value: number, place?: number, base?: number): number;
        public floorTo(value: number, place?: number, base?: number): number;
        public ceilTo(value: number, place?: number, base?: number): number;
        /**
        * a one dimensional linear interpolation of a value.
        */
        public interpolateFloat(a: number, b: number, weight: number): number;
        /**
        * convert radians to degrees
        */
        public radiansToDegrees(angle: number): number;
        /**
        * convert degrees to radians
        */
        public degreesToRadians(angle: number): number;
        /**
        * Find the angle of a segment from (x1, y1) -> (x2, y2 )
        */
        public angleBetween(x1: number, y1: number, x2: number, y2: number): number;
        /**
        * set an angle within the bounds of -PI to PI
        */
        public normalizeAngle(angle: number, radians?: bool): number;
        /**
        * closest angle between two angles from a1 to a2
        * absolute value the return for exact angle
        */
        public nearestAngleBetween(a1: number, a2: number, radians?: bool): number;
        /**
        * normalizes independent and then sets dep to the nearest value respective to independent
        *
        * for instance if dep=-170 and ind=170 then 190 will be returned as an alternative to -170
        */
        public normalizeAngleToAnother(dep: number, ind: number, radians?: bool): number;
        /**
        * normalize independent and dependent and then set dependent to an angle relative to 'after/clockwise' independent
        *
        * for instance dep=-170 and ind=170, then 190 will be reutrned as alternative to -170
        */
        public normalizeAngleAfterAnother(dep: number, ind: number, radians?: bool): number;
        /**
        * normalizes indendent and dependent and then sets dependent to an angle relative to 'before/counterclockwise' independent
        *
        * for instance dep = 190 and ind = 170, then -170 will be returned as an alternative to 190
        */
        public normalizeAngleBeforeAnother(dep: number, ind: number, radians?: bool): number;
        /**
        * interpolate across the shortest arc between two angles
        */
        public interpolateAngles(a1: number, a2: number, weight: number, radians?: bool, ease?): number;
        /**
        * Compute the logarithm of any value of any base
        *
        * a logarithm is the exponent that some constant (base) would have to be raised to
        * to be equal to value.
        *
        * i.e.
        * 4 ^ x = 16
        * can be rewritten as to solve for x
        * logB4(16) = x
        * which with this function would be
        * LoDMath.logBaseOf(16,4)
        *
        * which would return 2, because 4^2 = 16
        */
        public logBaseOf(value: number, base: number): number;
        /**
        * Greatest Common Denominator using Euclid's algorithm
        */
        public GCD(m: number, n: number): number;
        /**
        * Lowest Common Multiple
        */
        public LCM(m: number, n: number): number;
        /**
        * Factorial - N!
        *
        * simple product series
        *
        * by definition:
        * 0! == 1
        */
        public factorial(value: number): number;
        /**
        * gamma function
        *
        * defined: gamma(N) == (N - 1)!
        */
        public gammaFunction(value: number): number;
        /**
        * falling factorial
        *
        * defined: (N)! / (N - x)!
        *
        * written subscript: (N)x OR (base)exp
        */
        public fallingFactorial(base: number, exp: number): number;
        /**
        * rising factorial
        *
        * defined: (N + x - 1)! / (N - 1)!
        *
        * written superscript N^(x) OR base^(exp)
        */
        public risingFactorial(base: number, exp: number): number;
        /**
        * binomial coefficient
        *
        * defined: N! / (k!(N-k)!)
        * reduced: N! / (N-k)! == (N)k (fallingfactorial)
        * reduced: (N)k / k!
        */
        public binCoef(n: number, k: number): number;
        /**
        * rising binomial coefficient
        *
        * as one can notice in the analysis of binCoef(...) that
        * binCoef is the (N)k divided by k!. Similarly rising binCoef
        * is merely N^(k) / k!
        */
        public risingBinCoef(n: number, k: number): number;
        /**
        * Generate a random boolean result based on the chance value
        * <p>
        * Returns true or false based on the chance value (default 50%). For example if you wanted a player to have a 30% chance
        * of getting a bonus, call chanceRoll(30) - true means the chance passed, false means it failed.
        * </p>
        * @param chance The chance of receiving the value. A number between 0 and 100 (effectively 0% to 100%)
        * @return true if the roll passed, or false
        */
        public chanceRoll(chance?: number): bool;
        /**
        * Adds the given amount to the value, but never lets the value go over the specified maximum
        *
        * @param value The value to add the amount to
        * @param amount The amount to add to the value
        * @param max The maximum the value is allowed to be
        * @return The new value
        */
        public maxAdd(value: number, amount: number, max: number): number;
        /**
        * Subtracts the given amount from the value, but never lets the value go below the specified minimum
        *
        * @param value The base value
        * @param amount The amount to subtract from the base value
        * @param min The minimum the value is allowed to be
        * @return The new value
        */
        public minSub(value: number, amount: number, min: number): number;
        /**
        * Adds value to amount and ensures that the result always stays between 0 and max, by wrapping the value around.
        * <p>Values must be positive integers, and are passed through Math.abs</p>
        *
        * @param value The value to add the amount to
        * @param amount The amount to add to the value
        * @param max The maximum the value is allowed to be
        * @return The wrapped value
        */
        public wrapValue(value: number, amount: number, max: number): number;
        /**
        * Randomly returns either a 1 or -1
        *
        * @return	1 or -1
        */
        public randomSign(): number;
        /**
        * Returns true if the number given is odd.
        *
        * @param	n	The number to check
        *
        * @return	True if the given number is odd. False if the given number is even.
        */
        public isOdd(n: number): bool;
        /**
        * Returns true if the number given is even.
        *
        * @param	n	The number to check
        *
        * @return	True if the given number is even. False if the given number is odd.
        */
        public isEven(n: number): bool;
        /**
        * Keeps an angle value between -180 and +180<br>
        * Should be called whenever the angle is updated on the Sprite to stop it from going insane.
        *
        * @param	angle	The angle value to check
        *
        * @return	The new angle value, returns the same as the input angle if it was within bounds
        */
        public wrapAngle(angle: number): number;
        /**
        * Keeps an angle value between the given min and max values
        *
        * @param	angle	The angle value to check. Must be between -180 and +180
        * @param	min		The minimum angle that is allowed (must be -180 or greater)
        * @param	max		The maximum angle that is allowed (must be 180 or less)
        *
        * @return	The new angle value, returns the same as the input angle if it was within bounds
        */
        public angleLimit(angle: number, min: number, max: number): number;
        /**
        * @method linear
        * @param {Any} v
        * @param {Any} k
        * @public
        */
        public linearInterpolation(v, k);
        /**
        * @method Bezier
        * @param {Any} v
        * @param {Any} k
        * @public
        */
        public bezierInterpolation(v, k): number;
        /**
        * @method CatmullRom
        * @param {Any} v
        * @param {Any} k
        * @public
        */
        public catmullRomInterpolation(v, k);
        /**
        * @method Linear
        * @param {Any} p0
        * @param {Any} p1
        * @param {Any} t
        * @public
        */
        public linear(p0, p1, t);
        /**
        * @method Bernstein
        * @param {Any} n
        * @param {Any} i
        * @public
        */
        public bernstein(n, i): number;
        /**
        * @method CatmullRom
        * @param {Any} p0
        * @param {Any} p1
        * @param {Any} p2
        * @param {Any} p3
        * @param {Any} t
        * @public
        */
        public catmullRom(p0, p1, p2, p3, t);
        public difference(a: number, b: number): number;
        /**
        * The global random number generator seed (for deterministic behavior in recordings and saves).
        */
        public globalSeed: number;
        /**
        * Generates a random number.  Deterministic, meaning safe
        * to use if you want to record replays in random environments.
        *
        * @return	A <code>Number</code> between 0 and 1.
        */
        public random(): number;
        /**
        * Generates a random number based on the seed provided.
        *
        * @param	Seed	A number between 0 and 1, used to generate a predictable random number (very optional).
        *
        * @return	A <code>Number</code> between 0 and 1.
        */
        public srand(Seed: number): number;
        /**
        * Fetch a random entry from the given array.
        * Will return null if random selection is missing, or array has no entries.
        *
        * @param	objects		An array of objects.
        * @param	startIndex	Optional offset off the front of the array. Default value is 0, or the beginning of the array.
        * @param	length		Optional restriction on the number of values you want to randomly select from.
        *
        * @return	The random object that was selected.
        */
        public getRandom(objects, startIndex?: number, length?: number);
        /**
        * Round down to the next whole number. E.g. floor(1.7) == 1, and floor(-2.7) == -2.
        *
        * @param	Value	Any number.
        *
        * @return	The rounded value of that number.
        */
        public floor(Value: number): number;
        /**
        * Round up to the next whole number.  E.g. ceil(1.3) == 2, and ceil(-2.3) == -3.
        *
        * @param	Value	Any number.
        *
        * @return	The rounded value of that number.
        */
        public ceil(Value: number): number;
        /**
        * Generate a sine and cosine table simultaneously and extremely quickly. Based on research by Franky of scene.at
        * <p>
        * The parameters allow you to specify the length, amplitude and frequency of the wave. Once you have called this function
        * you should get the results via getSinTable() and getCosTable(). This generator is fast enough to be used in real-time.
        * </p>
        * @param length 		The length of the wave
        * @param sinAmplitude 	The amplitude to apply to the sine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
        * @param cosAmplitude 	The amplitude to apply to the cosine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
        * @param frequency 	The frequency of the sine and cosine table data
        * @return	Returns the sine table
        * @see getSinTable
        * @see getCosTable
        */
        public sinCosGenerator(length: number, sinAmplitude?: number, cosAmplitude?: number, frequency?: number): any[];
        /**
        * Shifts through the sin table data by one value and returns it.
        * This effectively moves the position of the data from the start to the end of the table.
        * @return	The sin value.
        */
        public shiftSinTable(): number;
        /**
        * Shifts through the cos table data by one value and returns it.
        * This effectively moves the position of the data from the start to the end of the table.
        * @return	The cos value.
        */
        public shiftCosTable(): number;
        /**
        * Shuffles the data in the given array into a new order
        * @param array The array to shuffle
        * @return The array
        */
        public shuffleArray(array);
        /**
        * Returns the distance from this Point object to the given Point object.
        * @method distanceFrom
        * @param {Point} target - The destination Point object.
        * @param {Boolean} round - Round the distance to the nearest integer (default false)
        * @return {Number} The distance between this Point object and the destination Point object.
        **/
        public distanceBetween(x1: number, y1: number, x2: number, y2: number): number;
        /**
        * Finds the length of the given vector
        *
        * @param	dx
        * @param	dy
        *
        * @return
        */
        public vectorLength(dx: number, dy: number): number;
        /**
        * Rotates the point around the x/y coordinates given to the desired rotation and distance
        * @param point {Object} Any object with exposed x and y properties
        * @param x {number} The x coordinate of the anchor point
        * @param y {number} The y coordinate of the anchor point
        * @param {Number} rotation The rotation in radians (unless asDegrees is true) to return the point from.
        * @param {Boolean} asDegrees Is the given rotation in radians (false) or degrees (true)?
        * @param {Number} distance An optional distance constraint between the point and the anchor
        * @return The modified point object
        */
        public rotatePoint(point, x1: number, y1: number, rotation: number, asDegrees?: bool, distance?: number);
    }
}
/**
* Phaser - RandomDataGenerator
*
* An extremely useful repeatable random data generator. Access it via Game.rnd
* Based on Nonsense by Josh Faul https://github.com/jocafa/Nonsense
* Random number generator from http://baagoe.org/en/wiki/Better_random_numbers_for_javascript
*/
module Phaser {
    class RandomDataGenerator {
        /**
        * @constructor
        * @param {Array} seeds
        * @return {Phaser.RandomDataGenerator}
        */
        constructor(seeds?: string[]);
        /**
        * @property s0
        * @type Any
        * @private
        */
        private s0;
        /**
        * @property s1
        * @type Any
        * @private
        */
        private s1;
        /**
        * @property s2
        * @type Any
        * @private
        */
        private s2;
        /**
        * @property c
        * @type Number
        * @private
        */
        private c;
        /**
        * @method uint32
        * @private
        */
        private uint32();
        /**
        * @method fract32
        * @private
        */
        private fract32();
        /**
        * @method rnd
        * @private
        */
        private rnd();
        /**
        * @method hash
        * @param {Any} data
        * @private
        */
        private hash(data);
        /**
        * Reset the seed of the random data generator
        * @method sow
        * @param {Array} seeds
        */
        public sow(seeds?: string[]): void;
        /**
        * Returns a random integer between 0 and 2^32
        * @method integer
        * @return {Number}
        */
        public integer : number;
        /**
        * Returns a random real number between 0 and 1
        * @method frac
        * @return {Number}
        */
        public frac : number;
        /**
        * Returns a random real number between 0 and 2^32
        * @method real
        * @return {Number}
        */
        public real : number;
        /**
        * Returns a random integer between min and max
        * @method integerInRange
        * @param {Number} min
        * @param {Number} max
        * @return {Number}
        */
        public integerInRange(min: number, max: number): number;
        /**
        * Returns a random real number between min and max
        * @method realInRange
        * @param {Number} min
        * @param {Number} max
        * @return {Number}
        */
        public realInRange(min: number, max: number): number;
        /**
        * Returns a random real number between -1 and 1
        * @method normal
        * @return {Number}
        */
        public normal : number;
        /**
        * Returns a valid v4 UUID hex string (from https://gist.github.com/1308368)
        * @method uuid
        * @return {String}
        */
        public uuid : string;
        /**
        * Returns a random member of `array`
        * @method pick
        * @param {Any} array
        */
        public pick(array);
        /**
        * Returns a random member of `array`, favoring the earlier entries
        * @method weightedPick
        * @param {Any} array
        */
        public weightedPick(array);
        /**
        * Returns a random timestamp between min and max, or between the beginning of 2000 and the end of 2020 if min and max aren't specified
        * @method timestamp
        * @param {Number} min
        * @param {Number} max
        */
        public timestamp(min?: number, max?: number): number;
        /**
        * Returns a random angle between -180 and 180
        * @method angle
        */
        public angle : number;
    }
}
/**
* Phaser - CameraFX
*
* CameraFX controls all special effects applied to game Cameras.
*/
module Phaser {
    class CameraFX {
        constructor(game: Game, parent);
        /**
        * The essential reference to the main game object.
        */
        private _game;
        /**
        * A reference to the object that owns this FXManager instance.
        */
        private _parent;
        /**
        * The array in which we keep all of the registered FX
        */
        private _fx;
        /**
        * Holds the size of the _fx array
        */
        private _length;
        /**
        * Controls whether any of the FX have preUpdate, update or postUpdate called
        */
        public active: bool;
        /**
        * Controls whether any of the FX have preRender, render or postRender called
        */
        public visible: bool;
        /**
        * Adds a new FX to the FXManager.
        * The effect must be an object with at least one of the following methods: preUpdate, postUpdate, preRender, render or postRender.
        * A new instance of the effect will be created and a reference to Game will be passed to the object constructor.
        * @param {object} effect
        * @return {any}
        */
        public add(effect): any;
        /**
        * Pre-update is called at the start of the objects update cycle, before any other updates have taken place.
        */
        public preUpdate(): void;
        /**
        * Post-update is called at the end of the objects update cycle, after other update logic has taken place.
        */
        public postUpdate(): void;
        /**
        * Pre-render is called at the start of the object render cycle, before any transforms have taken place.
        * It happens directly AFTER a canvas context.save has happened if added to a Camera.
        * @param {Camera} camera
        * @param {number} cameraX
        * @param {number} cameraY
        * @param {number} cameraWidth
        * @param {number} cameraHeight
        */
        public preRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
        /**
        * render is called during the objects render cycle, right after all transforms have finished, but before any children/image data is rendered.
        * @param {Camera} camera
        * @param {number} cameraX
        * @param {number} cameraY
        * @param {number} cameraWidth
        * @param {number} cameraHeight
        */
        public render(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
        /**
        * Post-render is called during the objects render cycle, after the children/image data has been rendered.
        * It happens directly BEFORE a canvas context.restore has happened if added to a Camera.
        */
        public postRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
        /**
        * Clear down this FXManager and null out references
        */
        public destroy(): void;
    }
}
/**
* Phaser - Camera
*
* A Camera is your view into the game world. It has a position, size, scale and rotation and renders only those objects
* within its field of view. The game automatically creates a single Stage sized camera on boot, but it can be changed and
* additional cameras created via the CameraManager.
*/
module Phaser {
    class Camera {
        /**
        * Instantiates a new camera at the specified location, with the specified size and zoom level.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param id {number} Unique identity.
        * @param x {number} X location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
        * @param y {number} Y location of the camera's display in pixels. Uses native, 1:1 resolution, ignores zoom.
        * @param width {number} The width of the camera display in pixels.
        * @param height {number} The height of the camera display in pixels.
        */
        constructor(game: Game, id: number, x: number, y: number, width: number, height: number);
        private _target;
        /**
        * Local private reference to Game.
        */
        public game: Game;
        /**
        * Optional texture used in the background of the Camera.
        */
        public texture: Components.Texture;
        /**
        * The transform component.
        */
        public transform: Components.Transform;
        /**
        * Camera "follow" style preset: camera has no deadzone, just tracks the focus object directly.
        * @type {number}
        */
        static STYLE_LOCKON: number;
        /**
        * Camera "follow" style preset: camera deadzone is narrow but tall.
        * @type {number}
        */
        static STYLE_PLATFORMER: number;
        /**
        * Camera "follow" style preset: camera deadzone is a medium-size square around the focus object.
        * @type {number}
        */
        static STYLE_TOPDOWN: number;
        /**
        * Camera "follow" style preset: camera deadzone is a small square around the focus object.
        * @type {number}
        */
        static STYLE_TOPDOWN_TIGHT: number;
        /**
        * Identity of this camera.
        */
        public ID: number;
        /**
        * Controls if this camera is clipped or not when rendering. You shouldn't usually set this value directly.
        */
        public clip: bool;
        /**
        * Camera view Rectangle in world coordinate.
        * @type {Rectangle}
        */
        public worldView: Rectangle;
        /**
        * Visible / renderable area (changes if the camera resizes/moves around the stage)
        * @type {Rectangle}
        */
        public screenView: Rectangle;
        /**
        * Camera worldBounds.
        * @type {Rectangle}
        */
        public worldBounds: Rectangle;
        /**
        * A boolean representing if the Camera has been modified in any way via a scale, rotate, flip or skew.
        */
        public modified: bool;
        /**
        * Sprite moving inside this Rectangle will not cause camera moving.
        * @type {Rectangle}
        */
        public deadzone: Rectangle;
        /**
        * Disable the automatic camera canvas clipping when Camera is non-Stage sized.
        * @type {Boolean}
        */
        public disableClipping: bool;
        /**
        * Whether this camera is visible or not. (default is true)
        * @type {boolean}
        */
        public visible: bool;
        /**
        * The z value of this Camera. Cameras are rendered in z-index order by the Renderer.
        */
        public z: number;
        /**
        * Effects manager.
        * @type {CameraFX}
        */
        public fx: CameraFX;
        /**
        * Hides an object from this Camera. Hidden objects are not rendered.
        * The object must implement a public cameraBlacklist property.
        *
        * @param object {Sprite/Group} The object this camera should ignore.
        */
        public hide(object): void;
        /**
        * Returns true if the object is hidden from this Camera.
        *
        * @param object {Sprite/Group} The object to check.
        */
        public isHidden(object): bool;
        /**
        * Un-hides an object previously hidden to this Camera.
        * The object must implement a public cameraBlacklist property.
        *
        * @param object {Sprite/Group} The object this camera should display.
        */
        public show(object): void;
        /**
        * Tells this camera object what sprite to track.
        * @param target {Sprite} The object you want the camera to track. Set to null to not follow anything.
        * @param [style] {number} Leverage one of the existing "deadzone" presets. If you use a custom deadzone, ignore this parameter and manually specify the deadzone after calling follow().
        */
        public follow(target: Sprite, style?: number): void;
        /**
        * Move the camera focus to this location instantly.
        * @param x {number} X position.
        * @param y {number} Y position.
        */
        public focusOnXY(x: number, y: number): void;
        /**
        * Move the camera focus to this location instantly.
        * @param point {any} Point you want to focus.
        */
        public focusOn(point): void;
        /**
        * Specify the boundaries of the world or where the camera is allowed to move.
        *
        * @param x      {number} The smallest X value of your world (usually 0).
        * @param y      {number} The smallest Y value of your world (usually 0).
        * @param width  {number} The largest X value of your world (usually the world width).
        * @param height {number} The largest Y value of your world (usually the world height).
        */
        public setBounds(x?: number, y?: number, width?: number, height?: number): void;
        /**
        * Update focusing and scrolling.
        */
        public update(): void;
        /**
        * Update focusing and scrolling.
        */
        public postUpdate(): void;
        /**
        * Render debug infos. (including id, position, rotation, scrolling factor, worldBounds and some other properties)
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        public renderDebugInfo(x: number, y: number, color?: string): void;
        /**
        * Destroys this camera, associated FX and removes itself from the CameraManager.
        */
        public destroy(): void;
        public x : number;
        public y : number;
        public width : number;
        public height : number;
        public setPosition(x: number, y: number): void;
        public setSize(width: number, height: number): void;
        /**
        * The angle of the Camera in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
        */
        /**
        * Set the angle of the Camera in degrees. Phaser uses a right-handed coordinate system, where 0 points to the right.
        * The value is automatically wrapped to be between 0 and 360.
        */
        public rotation : number;
        private checkClip();
    }
}
/**
* Phaser - CameraManager
*
* Your game only has one CameraManager instance and it's responsible for looking after, creating and destroying
* all of the cameras in the world.
*/
module Phaser {
    class CameraManager {
        /**
        * CameraManager constructor
        * This will create a new <code>Camera</code> with position and size.
        *
        * @param x {number} X Position of the created camera.
        * @param y {number} y Position of the created camera.
        * @param width {number} Width of the created camera.
        * @param height {number} Height of the created camera.
        */
        constructor(game: Game, x: number, y: number, width: number, height: number);
        /**
        * Local private reference to Game.
        */
        private _game;
        /**
        * Local container for storing cameras.
        */
        private _cameras;
        /**
        * Local helper stores index of next created camera.
        */
        private _cameraInstance;
        /**
        * Helper for sort.
        */
        private _sortIndex;
        /**
        * Helper for sort.
        */
        private _sortOrder;
        static CAMERA_TYPE_ORTHOGRAPHIC: number;
        static CAMERA_TYPE_ISOMETRIC: number;
        /**
        * Currently used camera.
        */
        public current: Camera;
        /**
        * The default created camera.
        */
        public defaultCamera: Camera;
        /**
        * Get all the cameras.
        *
        * @returns {Camera[]} An array contains all the cameras.
        */
        public getAll(): Camera[];
        /**
        * Update cameras.
        */
        public update(): void;
        /**
        * postUpdate cameras.
        */
        public postUpdate(): void;
        /**
        * Create a new camera with specific position and size.
        *
        * @param x {number} X position of the new camera.
        * @param y {number} Y position of the new camera.
        * @param width {number} Width of the new camera.
        * @param height {number} Height of the new camera.
        * @returns {Camera} The newly created camera object.
        */
        public addCamera(x: number, y: number, width: number, height: number, type?: number): Camera;
        /**
        * Remove a new camera with its id.
        *
        * @param id {number} ID of the camera you want to remove.
        * @returns {boolean} True if successfully removed the camera, otherwise return false.
        */
        public removeCamera(id: number): bool;
        public swap(camera1: Camera, camera2: Camera, sort?: bool): bool;
        /**
        * Call this function to sort the Cameras according to a particular value and order (default is their Z value).
        * The order in which they are sorted determines the render order. If sorted on z then Cameras with a lower z-index value render first.
        *
        * @param {string} index The <code>string</code> name of the Camera variable you want to sort on. Default value is "z".
        * @param {number} order A <code>Group</code> constant that defines the sort order. Possible values are <code>Group.ASCENDING</code> and <code>Group.DESCENDING</code>.  Default value is <code>Group.ASCENDING</code>.
        */
        public sort(index?: string, order?: number): void;
        /**
        * Helper function for the sort process.
        *
        * @param {Basic} Obj1 The first object being sorted.
        * @param {Basic} Obj2 The second object being sorted.
        *
        * @return {number} An integer value: -1 (Obj1 before Obj2), 0 (same), or 1 (Obj1 after Obj2).
        */
        public sortHandler(obj1, obj2): number;
        /**
        * Clean up memory.
        */
        public destroy(): void;
    }
}
/**
* Phaser - Easing - Back
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Back {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Easing - Bounce
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Bounce {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Easing - Circular
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Circular {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Easing - Cubic
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Cubic {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Easing - Elastic
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Elastic {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Easing - Exponential
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Exponential {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Easing - Linear
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Linear {
        static None(k);
    }
}
/**
* Phaser - Easing - Quadratic
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Quadratic {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Easing - Quartic
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Quartic {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Easing - Quintic
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Quintic {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Easing - Sinusoidal
*
* For use with Phaser.Tween
*/
module Phaser.Easing {
    class Sinusoidal {
        static In(k): number;
        static Out(k): number;
        static InOut(k): number;
    }
}
/**
* Phaser - Tween
*
* Based heavily on tween.js by sole (https://github.com/sole/tween.js) converted to TypeScript and integrated into Phaser
*/
module Phaser {
    class Tween {
        /**
        * Tween constructor
        * Create a new <code>Tween</code>.
        *
        * @param object {object} Target object will be affected by this tween.
        * @param game {Phaser.Game} Current game instance.
        */
        constructor(object, game: Game);
        /**
        * Local private reference to game.
        */
        private _game;
        /**
        * Manager of this tween.
        * @type {Phaser.TweenManager}
        */
        private _manager;
        /**
        * Reference to the target object.
        * @type {object}
        */
        private _object;
        private _pausedTime;
        /**
        * Start values container.
        * @type {object}
        */
        private _valuesStart;
        /**
        * End values container.
        * @type {object}
        */
        private _valuesEnd;
        /**
        * How long this tween will perform.
        * @type {number}
        */
        private _duration;
        private _delayTime;
        private _startTime;
        private _tempElapsed;
        private _tempValue;
        /**
        * Will this tween automatically restart when it completes?
        * @type {boolean}
        */
        private _loop;
        /**
        * A yoyo tween is one that plays once fully, then reverses back to the original tween values before completing.
        * @type {boolean}
        */
        private _yoyo;
        private _yoyoCount;
        /**
        * Easing function which actually updating this tween.
        * @type {function}
        */
        private _easingFunction;
        private _interpolationFunction;
        /**
        * Contains chained tweens.
        * @type {Tweens[]}
        */
        private _chainedTweens;
        /**
        * Signal to be dispatched when this tween start.
        * @type {Phaser.Signal}
        */
        public onStart: Signal;
        /**
        * Signal to be dispatched when this tween updating.
        * @type {Phaser.Signal}
        */
        public onUpdate: Signal;
        /**
        * Signal to be dispatched when this tween completed.
        * @type {Phaser.Signal}
        */
        public onComplete: Signal;
        /**
        * Configure the Tween
        * @param properties {object} Propertis you want to tween.
        * @param [duration] {number} duration of this tween.
        * @param [ease] {any} Easing function.
        * @param [autoStart] {boolean} Whether this tween will start automatically or not.
        * @param [delay] {number} delay before this tween will start, defaults to 0 (no delay)
        * @param [loop] {boolean} Should the tween automatically restart once complete? (ignores any chained tweens)
        * @return {Tween} Itself.
        */
        public to(properties, duration?: number, ease?: any, autoStart?: bool, delay?: number, loop?: bool, yoyo?: bool): Tween;
        public loop(value: bool): Tween;
        public yoyo(value: bool): Tween;
        public isRunning: bool;
        /**
        * Start to tween.
        */
        public start(looped?: bool): Tween;
        public reverse(): Tween;
        public reset(): Tween;
        public clear(): Tween;
        /**
        * Stop tweening.
        */
        public stop(): Tween;
        public parent : Game;
        public delay : number;
        public easing : any;
        public interpolation : any;
        /**
        * Add another chained tween, which will start automatically when the one before it completes.
        * @param tween {Phaser.Tween} Tween object you want to chain with this.
        * @return {Phaser.Tween} Itselfe.
        */
        public chain(tween: Tween): Tween;
        /**
        * Update tweening.
        * @param time {number} Current time from game clock.
        * @return {boolean} Return false if this completed and no need to update, otherwise return true.
        */
        public update(time): bool;
    }
}
/**
* Phaser - Particle
*
* This is a simple particle class that extends a Sprite to have a slightly more
* specialised behaviour. It is used exclusively by the Emitter class and can be extended as required.
*/
module Phaser {
    class Particle extends Sprite {
        /**
        * Instantiate a new particle.  Like <code>Sprite</code>, all meaningful creation
        * happens during <code>loadGraphic()</code> or <code>makeGraphic()</code> or whatever.
        */
        constructor(game: Game);
        /**
        * How long this particle lives before it disappears.
        * NOTE: this is a maximum, not a minimum; the object
        * could get recycled before its lifespan is up.
        */
        public lifespan: number;
        /**
        * The particle's main update logic.  Basically it checks to see if it should be dead yet.
        */
        public update(): void;
        /**
        * Triggered whenever this object is launched by a <code>Emitter</code>.
        * You can override this to add custom behavior like a sound or AI or something.
        */
        public onEmit(): void;
    }
}
/**
* Phaser - Emitter
*
* Emitter is a lightweight particle emitter. It can be used for one-time explosions or for
* continuous effects like rain and fire. All it really does is launch Particle objects out
* at set intervals, and fixes their positions and velocities accorindgly.
*/
module Phaser {
    class Emitter extends Group {
        /**
        * Creates a new <code>Emitter</code> object at a specific position.
        * Does NOT automatically generate or attach particles!
        *
        * @param x {number} The X position of the emitter.
        * @param y {number} The Y position of the emitter.
        * @param [size] {number} Specifies a maximum capacity for this emitter.
        */
        constructor(game: Game, x?: number, y?: number, size?: number);
        /**
        * The X position of the top left corner of the emitter in world space.
        */
        public x: number;
        /**
        * The Y position of the top left corner of emitter in world space.
        */
        public y: number;
        /**
        * The width of the emitter.  Particles can be randomly generated from anywhere within this box.
        */
        public width: number;
        /**
        * The height of the emitter.  Particles can be randomly generated from anywhere within this box.
        */
        public height: number;
        /**
        *
        */
        public alive: bool;
        /**
        *
        */
        public active: bool;
        /**
        * The minimum possible velocity of a particle.
        * The default value is (-100,-100).
        */
        public minParticleSpeed: Vec2;
        /**
        * The maximum possible velocity of a particle.
        * The default value is (100,100).
        */
        public maxParticleSpeed: Vec2;
        /**
        * The X and Y drag component of particles launched from the emitter.
        */
        public particleDrag: Vec2;
        /**
        * The minimum possible angular velocity of a particle.  The default value is -360.
        * NOTE: rotating particles are more expensive to draw than non-rotating ones!
        */
        public minRotation: number;
        /**
        * The maximum possible angular velocity of a particle.  The default value is 360.
        * NOTE: rotating particles are more expensive to draw than non-rotating ones!
        */
        public maxRotation: number;
        /**
        * Sets the <code>acceleration.y</code> member of each particle to this value on launch.
        */
        public gravity: number;
        /**
        * Determines whether the emitter is currently emitting particles.
        * It is totally safe to directly toggle this.
        */
        public on: bool;
        /**
        * How often a particle is emitted (if emitter is started with Explode == false).
        */
        public frequency: number;
        /**
        * How long each particle lives once it is emitted.
        * Set lifespan to 'zero' for particles to live forever.
        */
        public lifespan: number;
        /**
        * How much each particle should bounce.  1 = full bounce, 0 = no bounce.
        */
        public bounce: number;
        /**
        * Set your own particle class type here.
        * Default is <code>Particle</code>.
        */
        public particleClass;
        /**
        * Internal helper for deciding how many particles to launch.
        */
        private _quantity;
        /**
        * Internal helper for the style of particle emission (all at once, or one at a time).
        */
        private _explode;
        /**
        * Internal helper for deciding when to launch particles or kill them.
        */
        private _timer;
        /**
        * Internal counter for figuring out how many particles to launch.
        */
        private _counter;
        /**
        * Internal point object, handy for reusing for memory mgmt purposes.
        */
        private _point;
        /**
        * Clean up memory.
        */
        public destroy(): void;
        /**
        * This function generates a new array of particle sprites to attach to the emitter.
        *
        * @param graphics If you opted to not pre-configure an array of Sprite objects, you can simply pass in a particle image or sprite sheet.
        * @param quantity {number} The number of particles to generate when using the "create from image" option.
        * @param multiple {boolean} Whether the image in the Graphics param is a single particle or a bunch of particles (if it's a bunch, they need to be square!).
        * @param collide {number}  Whether the particles should be flagged as not 'dead' (non-colliding particles are higher performance).  0 means no collisions, 0-1 controls scale of particle's bounding box.
        *
        * @return  This Emitter instance (nice for chaining stuff together, if you're into that).
        */
        public makeParticles(graphics, quantity?: number, multiple?: bool, collide?: number): Emitter;
        public preUpdate(): void;
        public postUpdate(): void;
        /**
        * Called automatically by the game loop, decides when to launch particles and when to "die".
        */
        public update(): void;
        /**
        * Call this function to turn off all the particles and the emitter.
        */
        public kill(): void;
        /**
        * Handy for bringing game objects "back to life". Just sets alive and exists back to true.
        * In practice, this is most often called by <code>Object.reset()</code>.
        */
        public revive(): void;
        /**
        * Call this function to start emitting particles.
        *
        * @param explode {boolean} Whether the particles should all burst out at once.
        * @param lifespan {number} How long each particle lives once emitted. 0 = forever.
        * @param frequency {number} Ignored if Explode is set to true. Frequency is how often to emit a particle. 0 = never emit, 0.1 = 1 particle every 0.1 seconds, 5 = 1 particle every 5 seconds.
        * @param quantity {number} How many particles to launch. 0 = "all of the particles".
        */
        public start(explode?: bool, lifespan?: number, frequency?: number, quantity?: number): void;
        /**
        * This function can be used both internally and externally to emit the next particle.
        */
        public emitParticle(): void;
        /**
        * A more compact way of setting the width and height of the emitter.
        *
        * @param width {number} The desired width of the emitter (particles are spawned randomly within these dimensions).
        * @param height {number} The desired height of the emitter.
        */
        public setSize(width: number, height: number): void;
        /**
        * A more compact way of setting the X velocity range of the emitter.
        *
        * @param Min {number} The minimum value for this range.
        * @param Max {number} The maximum value for this range.
        */
        public setXSpeed(min?: number, max?: number): void;
        /**
        * A more compact way of setting the Y velocity range of the emitter.
        *
        * @param Min {number} The minimum value for this range.
        * @param Max {number} The maximum value for this range.
        */
        public setYSpeed(min?: number, max?: number): void;
        /**
        * A more compact way of setting the angular velocity constraints of the emitter.
        *
        * @param Min {number} The minimum value for this range.
        * @param Max {number} The maximum value for this range.
        */
        public setRotation(min?: number, max?: number): void;
        /**
        * Change the emitter's midpoint to match the midpoint of a <code>Object</code>.
        *
        * @param Object {object} The <code>Object</code> that you want to sync up with.
        */
        public at(object: Sprite): void;
    }
}
/**
* Phaser - Button
*/
module Phaser {
    class Button extends Sprite {
        /**
        * Create a new <code>Button</code> object.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param [x] {number} X position of the button.
        * @param [y] {number} Y position of the button.
        * @param [key] {string} The image key as defined in the Game.Cache to use as the texture for this button.
        * @param [callback] {function} The function to call when this button is pressed
        * @param [callbackContext] {object} The context in which the callback will be called (usually 'this')
        * @param [overFrame] {string|number} This is the frame or frameName that will be set when this button is in an over state. Give either a number to use a frame ID or a string for a frame name.
        * @param [outFrame] {string|number} This is the frame or frameName that will be set when this button is in an out state. Give either a number to use a frame ID or a string for a frame name.
        * @param [downFrame] {string|number} This is the frame or frameName that will be set when this button is in a down state. Give either a number to use a frame ID or a string for a frame name.
        */
        constructor(game: Game, x?: number, y?: number, key?: string, callback?, callbackContext?, overFrame?, outFrame?, downFrame?);
        private _onOverFrameName;
        private _onOutFrameName;
        private _onDownFrameName;
        private _onUpFrameName;
        private _onOverFrameID;
        private _onOutFrameID;
        private _onDownFrameID;
        private _onUpFrameID;
        /**
        * Dispatched when a pointer moves over an Input enabled sprite.
        */
        public onInputOver: Signal;
        /**
        * Dispatched when a pointer moves out of an Input enabled sprite.
        */
        public onInputOut: Signal;
        /**
        * Dispatched when a pointer is pressed down on an Input enabled sprite.
        */
        public onInputDown: Signal;
        /**
        * Dispatched when a pointer is released over an Input enabled sprite
        */
        public onInputUp: Signal;
        private onInputOverHandler(pointer);
        private onInputOutHandler(pointer);
        private onInputDownHandler(pointer);
        private onInputUpHandler(pointer);
        public priorityID : number;
        public useHandCursor : bool;
    }
}
/**
* Phaser - ScrollRegion
*
* Creates a scrolling region within a ScrollZone.
* It is scrolled via the scrollSpeed.x/y properties.
*/
module Phaser {
    class ScrollRegion {
        /**
        * ScrollRegion constructor
        * Create a new <code>ScrollRegion</code>.
        *
        * @param x {number} X position in world coordinate.
        * @param y {number} Y position in world coordinate.
        * @param width {number} Width of this object.
        * @param height {number} Height of this object.
        * @param speedX {number} X-axis scrolling speed.
        * @param speedY {number} Y-axis scrolling speed.
        */
        constructor(x: number, y: number, width: number, height: number, speedX: number, speedY: number);
        private _A;
        private _B;
        private _C;
        private _D;
        private _bounds;
        private _scroll;
        private _anchorWidth;
        private _anchorHeight;
        private _inverseWidth;
        private _inverseHeight;
        /**
        * Will this region be rendered? (default to true)
        * @type {boolean}
        */
        public visible: bool;
        /**
        * Region scrolling speed.
        * @type {Vec2}
        */
        public scrollSpeed: Vec2;
        /**
        * Update region scrolling with tick time.
        * @param delta {number} Elapsed time since last update.
        */
        public update(delta: number): void;
        /**
        * Render this region to specific context.
        * @param context {CanvasRenderingContext2D} Canvas context this region will be rendered to.
        * @param texture {object} The texture to be rendered.
        * @param dx {number} X position in world coordinate.
        * @param dy {number} Y position in world coordinate.
        * @param width {number} Width of this region to be rendered.
        * @param height {number} Height of this region to be rendered.
        */
        public render(context: CanvasRenderingContext2D, texture, dx: number, dy: number, dw: number, dh: number): void;
        /**
        * Crop part of the texture and render it to the given context.
        * @param context {CanvasRenderingContext2D} Canvas context the texture will be rendered to.
        * @param texture {object} Texture to be rendered.
        * @param srcX {number} Target region top-left x coordinate in the texture.
        * @param srcX {number} Target region top-left y coordinate in the texture.
        * @param srcW {number} Target region width in the texture.
        * @param srcH {number} Target region height in the texture.
        * @param destX {number} Render region top-left x coordinate in the context.
        * @param destX {number} Render region top-left y coordinate in the context.
        * @param destW {number} Target region width in the context.
        * @param destH {number} Target region height in the context.
        * @param offsetX {number} X offset to the context.
        * @param offsetY {number} Y offset to the context.
        */
        private crop(context, texture, srcX, srcY, srcW, srcH, destX, destY, destW, destH, offsetX, offsetY);
    }
}
/**
* Phaser - ScrollZone
*
* Creates a scrolling region of the given width and height from an image in the cache.
* The ScrollZone can be positioned anywhere in-world like a normal game object, re-act to physics, collision, etc.
* The image within it is scrolled via ScrollRegions and their scrollSpeed.x/y properties.
* If you create a scroll zone larger than the given source image it will create a DynamicTexture and fill it with a pattern of the source image.
*/
module Phaser {
    class ScrollZone extends Sprite {
        /**
        * ScrollZone constructor
        * Create a new <code>ScrollZone</code>.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param key {string} Asset key for image texture of this object.
        * @param x {number} X position in world coordinate.
        * @param y {number} Y position in world coordinate.
        * @param [width] {number} width of this object.
        * @param [height] {number} height of this object.
        */
        constructor(game: Game, key: string, x?: number, y?: number, width?: number, height?: number);
        /**
        * Current region this zone is scrolling.
        * @type {ScrollRegion}
        */
        public currentRegion: ScrollRegion;
        /**
        * Array contains all added regions.
        * @type {ScrollRegion[]}
        */
        public regions: ScrollRegion[];
        /**
        * Add a new region to this zone.
        * @param x {number} X position of the new region.
        * @param y {number} Y position of the new region.
        * @param width {number} Width of the new region.
        * @param height {number} Height of the new region.
        * @param [speedX] {number} x-axis scrolling speed.
        * @param [speedY] {number} y-axis scrolling speed.
        * @return {ScrollRegion} The newly added region.
        */
        public addRegion(x: number, y: number, width: number, height: number, speedX?: number, speedY?: number): ScrollRegion;
        /**
        * Set scrolling speed of current region.
        * @param x {number} X speed of current region.
        * @param y {number} Y speed of current region.
        */
        public setSpeed(x: number, y: number): ScrollZone;
        /**
        * Update regions.
        */
        public update(): void;
        /**
        * Create repeating texture with _texture, and store it into the _dynamicTexture.
        * Used to create texture when texture image is small than size of the zone.
        */
        private createRepeatingTexture(regionWidth, regionHeight);
    }
}
/**
* Phaser - TilemapLayer
*
* A Tilemap Layer. Tiled format maps can have multiple overlapping layers.
*/
module Phaser {
    class TilemapLayer {
        /**
        * TilemapLayer constructor
        * Create a new <code>TilemapLayer</code>.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param parent {Tilemap} The tilemap that contains this layer.
        * @param key {string} Asset key for this map.
        * @param mapFormat {number} Format of this map data, available: Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON.
        * @param name {string} Name of this layer, so you can get this layer by its name.
        * @param tileWidth {number} Width of tiles in this map.
        * @param tileHeight {number} Height of tiles in this map.
        */
        constructor(game: Game, parent: Tilemap, key: string, mapFormat: number, name: string, tileWidth: number, tileHeight: number);
        private _tempTileX;
        private _tempTileY;
        private _tempTileW;
        private _tempTileH;
        private _tempTileBlock;
        private _tempBlockResults;
        /**
        * Local private reference to game.
        */
        public game: Game;
        /**
        * The tilemap that contains this layer.
        * @type {Tilemap}
        */
        public parent: Tilemap;
        /**
        * The texture used to render the Sprite.
        */
        public texture: Components.Texture;
        /**
        * The Sprite transform component.
        */
        public transform: Components.Transform;
        public tileOffsets;
        /**
        * The alpha of the Sprite between 0 and 1, a value of 1 being fully opaque.
        */
        public alpha: number;
        /**
        * Name of this layer, so you can get this layer by its name.
        * @type {string}
        */
        public name: string;
        /**
        * Controls whether update() and draw() are automatically called.
        * @type {boolean}
        */
        public exists: bool;
        /**
        * Controls whether draw() are automatically called.
        * @type {boolean}
        */
        public visible: bool;
        /**
        * Properties of this map layer. (normally set by map editors)
        */
        public properties: {};
        /**
        * Map data in a 2d array, its element is a index number for that tile.
        * @type {number[][]}
        */
        public mapData;
        /**
        * Format of this map data, available: Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON.
        */
        public mapFormat: number;
        /**
        * It's width and height are in tiles instead of pixels.
        * @type {Rectangle}
        */
        public boundsInTiles: Rectangle;
        /**
        * Width of each tile.
        * @type {number}
        */
        public tileWidth: number;
        /**
        * Height of a single tile.
        * @type {number}
        */
        public tileHeight: number;
        /**
        * How many tiles in each row.
        * Read-only variable, do NOT recommend changing after the map is loaded!
        * @type {number}
        */
        public widthInTiles: number;
        /**
        * How many tiles in each column.
        * Read-only variable, do NOT recommend changing after the map is loaded!
        * @type {number}
        */
        public heightInTiles: number;
        /**
        * Read-only variable, do NOT recommend changing after the map is loaded!
        * @type {number}
        */
        public widthInPixels: number;
        /**
        * Read-only variable, do NOT recommend changing after the map is loaded!
        * @type {number}
        */
        public heightInPixels: number;
        /**
        * Distance between REAL tiles to the tileset texture bound.
        * @type {number}
        */
        public tileMargin: number;
        /**
        * Distance between every 2 neighbor tile in the tileset texture.
        * @type {number}
        */
        public tileSpacing: number;
        /**
        * Set a specific tile with its x and y in tiles.
        * @param x {number} X position of this tile in world coordinates.
        * @param y {number} Y position of this tile in world coordinates.
        * @param index {number} The index of this tile type in the core map data.
        */
        public putTileWorldXY(x: number, y: number, index: number): void;
        /**
        * Set a specific tile with its x and y in tiles.
        * @param x {number} X position of this tile.
        * @param y {number} Y position of this tile.
        * @param index {number} The index of this tile type in the core map data.
        */
        public putTile(x: number, y: number, index: number): void;
        /**
        * Swap tiles with 2 kinds of indexes.
        * @param tileA {number} First tile index.
        * @param tileB {number} Second tile index.
        * @param [x] {number} specify a Rectangle of tiles to operate. The x position in tiles of Rectangle's left-top corner.
        * @param [y] {number} specify a Rectangle of tiles to operate. The y position in tiles of Rectangle's left-top corner.
        * @param [width] {number} specify a Rectangle of tiles to operate. The width in tiles.
        * @param [height] {number} specify a Rectangle of tiles to operate. The height in tiles.
        */
        public swapTile(tileA: number, tileB: number, x?: number, y?: number, width?: number, height?: number): void;
        /**
        * Fill a tile block with a specific tile index.
        * @param index {number} Index of tiles you want to fill with.
        * @param [x] {number} x position (in tiles) of block's left-top corner.
        * @param [y] {number} y position (in tiles) of block's left-top corner.
        * @param [width] {number} width of block.
        * @param [height] {number} height of block.
        */
        public fillTile(index: number, x?: number, y?: number, width?: number, height?: number): void;
        /**
        * Set random tiles to a specific tile block.
        * @param tiles {number[]} Tiles with indexes in this array will be randomly set to the given block.
        * @param [x] {number} x position (in tiles) of block's left-top corner.
        * @param [y] {number} y position (in tiles) of block's left-top corner.
        * @param [width] {number} width of block.
        * @param [height] {number} height of block.
        */
        public randomiseTiles(tiles: number[], x?: number, y?: number, width?: number, height?: number): void;
        /**
        * Replace one kind of tiles to another kind.
        * @param tileA {number} Index of tiles you want to replace.
        * @param tileB {number} Index of tiles you want to set.
        * @param [x] {number} x position (in tiles) of block's left-top corner.
        * @param [y] {number} y position (in tiles) of block's left-top corner.
        * @param [width] {number} width of block.
        * @param [height] {number} height of block.
        */
        public replaceTile(tileA: number, tileB: number, x?: number, y?: number, width?: number, height?: number): void;
        /**
        * Get a tile block with specific position and size.(both are in tiles)
        * @param x {number} X position of block's left-top corner.
        * @param y {number} Y position of block's left-top corner.
        * @param width {number} Width of block.
        * @param height {number} Height of block.
        */
        public getTileBlock(x: number, y: number, width: number, height: number): any[];
        /**
        * Get a tile with specific position (in world coordinate). (thus you give a position of a point which is within the tile)
        * @param x {number} X position of the point in target tile.
        * @param x {number} Y position of the point in target tile.
        */
        public getTileFromWorldXY(x: number, y: number): number;
        /**
        * Get tiles overlaps the given object.
        * @param object {GameObject} Tiles you want to get that overlaps this.
        * @return {array} Array with tiles informations. (Each contains x, y and the tile.)
        */
        public getTileOverlaps(object: Sprite);
        /**
        * Get a tile block with its position and size. (This method does not return, it'll set result to _tempTileBlock)
        * @param x {number} X position of block's left-top corner.
        * @param y {number} Y position of block's left-top corner.
        * @param width {number} Width of block.
        * @param height {number} Height of block.
        * @param collisionOnly {boolean} Whethor or not ONLY return tiles which will collide (its allowCollisions value is not Collision.NONE).
        */
        private getTempBlock(x, y, width, height, collisionOnly?);
        /**
        * Get the tile index of specific position (in tiles).
        * @param x {number} X position of the tile.
        * @param y {number} Y position of the tile.
        * @return {number} Index of the tile at that position. Return null if there isn't a tile there.
        */
        public getTileIndex(x: number, y: number): number;
        /**
        * Add a column of tiles into the layer.
        * @param column {string[]/number[]} An array of tile indexes to be added.
        */
        public addColumn(column): void;
        /**
        * Update boundsInTiles with widthInTiles and heightInTiles.
        */
        public updateBounds(): void;
        /**
        * Parse tile offsets from map data.
        * @return {number} length of tileOffsets array.
        */
        public parseTileOffsets(): number;
    }
}
/**
* Phaser - Tile
*
* A Tile is a single representation of a tile within a Tilemap
*/
module Phaser {
    class Tile {
        /**
        * Tile constructor
        * Create a new <code>Tile</code>.
        *
        * @param tilemap {Tilemap} the tilemap this tile belongs to.
        * @param index {number} The index of this tile type in the core map data.
        * @param width {number} Width of the tile.
        * @param height number} Height of the tile.
        */
        constructor(game: Game, tilemap: Tilemap, index: number, width: number, height: number);
        /**
        * Local private reference to game.
        */
        private _game;
        /**
        * You can give this Tile a friendly name to help with debugging. Never used internally.
        * @type {string}
        */
        public name: string;
        /**
        * The virtual mass of the tile.
        * @type {number}
        */
        public mass: number;
        /**
        * Tile width.
        * @type {number}
        */
        public width: number;
        /**
        * Tile height.
        * @type {number}
        */
        public height: number;
        /**
        * Bit field of flags (use with UP, DOWN, LEFT, RIGHT, etc) indicating collision directions.
        * @type {number}
        */
        public allowCollisions: number;
        /**
        * Indicating collide with any object on the left.
        * @type {boolean}
        */
        public collideLeft: bool;
        /**
        * Indicating collide with any object on the right.
        * @type {boolean}
        */
        public collideRight: bool;
        /**
        * Indicating collide with any object on the top.
        * @type {boolean}
        */
        public collideUp: bool;
        /**
        * Indicating collide with any object on the bottom.
        * @type {boolean}
        */
        public collideDown: bool;
        /**
        * Enable separation at x-axis.
        * @type {boolean}
        */
        public separateX: bool;
        /**
        * Enable separation at y-axis.
        * @type {boolean}
        */
        public separateY: bool;
        /**
        * A reference to the tilemap this tile object belongs to.
        * @type {Tilemap}
        */
        public tilemap: Tilemap;
        /**
        * The index of this tile type in the core map data.
        * For example, if your map only has 16 kinds of tiles in it,
        * this number is usually between 0 and 15.
        * @type {number}
        */
        public index: number;
        /**
        * Clean up memory.
        */
        public destroy(): void;
        /**
        * Set collision configs.
        * @param collision {number} Bit field of flags. (see Tile.allowCollision)
        * @param resetCollisions {boolean} Reset collision flags before set.
        * @param separateX {boolean} Enable seprate at x-axis.
        * @param separateY {boolean} Enable seprate at y-axis.
        */
        public setCollision(collision: number, resetCollisions: bool, separateX: bool, separateY: bool): void;
        /**
        * Reset collision status flags.
        */
        public resetCollision(): void;
        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the object.
        **/
        public toString(): string;
    }
}
/**
* Phaser - Tilemap
*
* This GameObject allows for the display of a tilemap within the game world. Tile maps consist of an image, tile data and a size.
* Internally it creates a TilemapLayer for each layer in the tilemap.
*/
module Phaser {
    class Tilemap {
        /**
        * Tilemap constructor
        * Create a new <code>Tilemap</code>.
        *
        * @param game {Phaser.Game} Current game instance.
        * @param key {string} Asset key for this map.
        * @param mapData {string} Data of this map. (a big 2d array, normally in csv)
        * @param format {number} Format of this map data, available: Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON.
        * @param resizeWorld {boolean} Resize the world bound automatically based on this tilemap?
        * @param tileWidth {number} Width of tiles in this map.
        * @param tileHeight {number} Height of tiles in this map.
        */
        constructor(game: Game, key: string, mapData: string, format: number, resizeWorld?: bool, tileWidth?: number, tileHeight?: number);
        private _tempCollisionData;
        /**
        * Reference to the main game object
        */
        public game: Game;
        /**
        * The type of game object.
        */
        public type: number;
        /**
        * The name of game object.
        */
        public name: string;
        /**
        * The Group this Sprite belongs to.
        */
        public group: Group;
        /**
        * Controls if both <code>update</code> and render are called by the core game loop.
        */
        public exists: bool;
        /**
        * Controls if <code>update()</code> is automatically called by the core game loop.
        */
        public active: bool;
        /**
        * Controls if this Sprite is rendered or skipped during the core game loop.
        */
        public visible: bool;
        /**
        * A useful state for many game objects. Kill and revive both flip this switch.
        */
        public alive: bool;
        /**
        * The texture used to render the Sprite.
        */
        public texture: Components.Texture;
        /**
        * The Sprite transform component.
        */
        public transform: Components.Transform;
        /**
        * z order value of the object.
        */
        public z: number;
        /**
        * Render iteration counter
        */
        public renderOrderID: number;
        /**
        * Tilemap data format enum: CSV.
        * @type {number}
        */
        static FORMAT_CSV: number;
        /**
        * Tilemap data format enum: Tiled JSON.
        * @type {number}
        */
        static FORMAT_TILED_JSON: number;
        /**
        * Array contains tile objects of this map.
        * @type {Tile[]}
        */
        public tiles: Tile[];
        /**
        * Array contains tilemap layer objects of this map.
        * @type {TilemapLayer[]}
        */
        public layers: TilemapLayer[];
        /**
        * Current tilemap layer.
        * @type {TilemapLayer}
        */
        public currentLayer: TilemapLayer;
        /**
        * The tilemap layer for collision.
        * @type {TilemapLayer}
        */
        public collisionLayer: TilemapLayer;
        /**
        * Tilemap collision callback.
        * @type {function}
        */
        public collisionCallback;
        /**
        * Context for the collision callback called with.
        */
        public collisionCallbackContext;
        /**
        * Format of this tilemap data. Available values: Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON.
        * @type {number}
        */
        public mapFormat: number;
        /**
        * Inherited methods for overriding.
        */
        public preUpdate(): void;
        public update(): void;
        public postUpdate(): void;
        public destroy(): void;
        /**
        * Parset csv map data and generate tiles.
        * @param data {string} CSV map data.
        * @param key {string} Asset key for tileset image.
        * @param tileWidth {number} Width of its tile.
        * @param tileHeight {number} Height of its tile.
        */
        private parseCSV(data, key, tileWidth, tileHeight);
        /**
        * Parse JSON map data and generate tiles.
        * @param data {string} JSON map data.
        * @param key {string} Asset key for tileset image.
        */
        private parseTiledJSON(data, key);
        /**
        * Create tiles of given quantity.
        * @param qty {number} Quentity of tiles to be generated.
        */
        private generateTiles(qty);
        public widthInPixels : number;
        public heightInPixels : number;
        /**
        * Set callback to be called when this tilemap collides.
        * @param context {object} Callback will be called with this context.
        * @param callback {function} Callback function.
        */
        public setCollisionCallback(context, callback): void;
        /**
        * Set collision configs of tiles in a range index.
        * @param start {number} First index of tiles.
        * @param end {number} Last index of tiles.
        * @param collision {number} Bit field of flags. (see Tile.allowCollision)
        * @param resetCollisions {boolean} Reset collision flags before set.
        * @param separateX {boolean} Enable seprate at x-axis.
        * @param separateY {boolean} Enable seprate at y-axis.
        */
        public setCollisionRange(start: number, end: number, collision?: number, resetCollisions?: bool, separateX?: bool, separateY?: bool): void;
        /**
        * Set collision configs of tiles with given index.
        * @param values {number[]} Index array which contains all tile indexes. The tiles with those indexes will be setup with rest parameters.
        * @param collision {number} Bit field of flags. (see Tile.allowCollision)
        * @param resetCollisions {boolean} Reset collision flags before set.
        * @param separateX {boolean} Enable seprate at x-axis.
        * @param separateY {boolean} Enable seprate at y-axis.
        */
        public setCollisionByIndex(values: number[], collision?: number, resetCollisions?: bool, separateX?: bool, separateY?: bool): void;
        /**
        * Get the tile by its index.
        * @param value {number} Index of the tile you want to get.
        * @return {Tile} The tile with given index.
        */
        public getTileByIndex(value: number): Tile;
        /**
        * Get the tile located at specific position and layer.
        * @param x {number} X position of this tile located.
        * @param y {number} Y position of this tile located.
        * @param [layer] {number} layer of this tile located.
        * @return {Tile} The tile with specific properties.
        */
        public getTile(x: number, y: number, layer?: number): Tile;
        /**
        * Get the tile located at specific position (in world coordinate) and layer. (thus you give a position of a point which is within the tile)
        * @param x {number} X position of the point in target tile.
        * @param x {number} Y position of the point in target tile.
        * @param [layer] {number} layer of this tile located.
        * @return {Tile} The tile with specific properties.
        */
        public getTileFromWorldXY(x: number, y: number, layer?: number): Tile;
        /**
        * Gets the tile underneath the Input.x/y position
        * @param layer The layer to check, defaults to 0
        * @returns {Tile}
        */
        public getTileFromInputXY(layer?: number): Tile;
        /**
        * Get tiles overlaps the given object.
        * @param object {GameObject} Tiles you want to get that overlaps this.
        * @return {array} Array with tiles information. (Each contains x, y and the tile.)
        */
        public getTileOverlaps(object: Sprite);
        /**
        * Check whether this tilemap collides with the given game object or group of objects.
        * @param objectOrGroup {function} Target object of group you want to check.
        * @param callback {function} This is called if objectOrGroup collides the tilemap.
        * @param context {object} Callback will be called with this context.
        * @return {boolean} Return true if this collides with given object, otherwise return false.
        */
        public collide(objectOrGroup?, callback?, context?): void;
        /**
        * Check whether this tilemap collides with the given game object.
        * @param object {GameObject} Target object you want to check.
        * @return {boolean} Return true if this collides with given object, otherwise return false.
        */
        public collideGameObject(object: Sprite): bool;
        /**
        * Set a tile to a specific layer.
        * @param x {number} X position of this tile.
        * @param y {number} Y position of this tile.
        * @param index {number} The index of this tile type in the core map data.
        * @param [layer] {number} which layer you want to set the tile to.
        */
        public putTile(x: number, y: number, index: number, layer?: number): void;
    }
}
/**
* Phaser - GameObjectFactory
*
* A quick way to create new world objects and add existing objects to the current world.
*/
module Phaser {
    class GameObjectFactory {
        /**
        * GameObjectFactory constructor
        * @param game {Game} A reference to the current Game.
        */
        constructor(game: Game);
        /**
        * Local private reference to Game
        */
        private _game;
        /**
        * Local private reference to World
        */
        private _world;
        /**
        * Create a new camera with specific position and size.
        *
        * @param x {number} X position of the new camera.
        * @param y {number} Y position of the new camera.
        * @param width {number} Width of the new camera.
        * @param height {number} Height of the new camera.
        * @returns {Camera} The newly created camera object.
        */
        public camera(x: number, y: number, width: number, height: number): Camera;
        /**
        * Create a new Button game object.
        *
        * @param [x] {number} X position of the button.
        * @param [y] {number} Y position of the button.
        * @param [key] {string} The image key as defined in the Game.Cache to use as the texture for this button.
        * @param [callback] {function} The function to call when this button is pressed
        * @param [callbackContext] {object} The context in which the callback will be called (usually 'this')
        * @param [overFrame] {string|number} This is the frame or frameName that will be set when this button is in an over state. Give either a number to use a frame ID or a string for a frame name.
        * @param [outFrame] {string|number} This is the frame or frameName that will be set when this button is in an out state. Give either a number to use a frame ID or a string for a frame name.
        * @param [downFrame] {string|number} This is the frame or frameName that will be set when this button is in a down state. Give either a number to use a frame ID or a string for a frame name.
        * @returns {Button} The newly created button object.
        */
        public button(x?: number, y?: number, key?: string, callback?, callbackContext?, overFrame?, outFrame?, downFrame?): Button;
        /**
        * Create a new Sprite with specific position and sprite sheet key.
        *
        * @param x {number} X position of the new sprite.
        * @param y {number} Y position of the new sprite.
        * @param [key] {string} The image key as defined in the Game.Cache to use as the texture for this sprite
        * @param [frame] {string|number} If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
        * @param [bodyType] {number} The physics body type of the object (defaults to BODY_DISABLED)
        * @returns {Sprite} The newly created sprite object.
        */
        public sprite(x: number, y: number, key?: string, frame?, bodyType?: number): Sprite;
        public audio(key: string, volume?: number, loop?: bool): Sound;
        /**
        * Create a new Sprite with the physics automatically created and set to DYNAMIC. The Sprite position offset is set to its center.
        *
        * @param x {number} X position of the new sprite.
        * @param y {number} Y position of the new sprite.
        * @param [key] {string} The image key as defined in the Game.Cache to use as the texture for this sprite
        * @param [frame] {string|number} If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
        * @param [bodyType] {number} The physics body type of the object (defaults to BODY_DYNAMIC)
        * @param [shapeType] The default body shape is either 0 for a Box or 1 for a Circle. See Sprite.body.addShape for custom shapes (polygons, etc)
        * @returns {Sprite} The newly created sprite object.
        */
        public physicsSprite(x: number, y: number, key?: string, frame?, bodyType?: number, shapeType?: number): Sprite;
        /**
        * Create a new DynamicTexture with specific size.
        *
        * @param width {number} Width of the texture.
        * @param height {number} Height of the texture.
        * @returns {DynamicTexture} The newly created dynamic texture object.
        */
        public dynamicTexture(width: number, height: number): DynamicTexture;
        /**
        * Create a new object container.
        *
        * @param maxSize {number} Optional, capacity of this group.
        * @returns {Group} The newly created group.
        */
        public group(maxSize?: number): Group;
        /**
        * Create a new Particle.
        *
        * @return {Particle} The newly created particle object.
        */
        public particle(): Particle;
        /**
        * Create a new Emitter.
        *
        * @param x {number} Optional, x position of the emitter.
        * @param y {number} Optional, y position of the emitter.
        * @param size {number} Optional, size of this emitter.
        * @return {Emitter} The newly created emitter object.
        */
        public emitter(x?: number, y?: number, size?: number): Emitter;
        /**
        * Create a new ScrollZone object with image key, position and size.
        *
        * @param key {string} Key to a image you wish this object to use.
        * @param x {number} X position of this object.
        * @param y {number} Y position of this object.
        * @param width number} Width of this object.
        * @param height {number} Height of this object.
        * @returns {ScrollZone} The newly created scroll zone object.
        */
        public scrollZone(key: string, x?: number, y?: number, width?: number, height?: number): ScrollZone;
        /**
        * Create a new Tilemap.
        *
        * @param key {string} Key for tileset image.
        * @param mapData {string} Data of this tilemap.
        * @param format {number} Format of map data. (Tilemap.FORMAT_CSV or Tilemap.FORMAT_TILED_JSON)
        * @param [resizeWorld] {boolean} resize the world to make same as tilemap?
        * @param [tileWidth] {number} width of each tile.
        * @param [tileHeight] {number} height of each tile.
        * @return {Tilemap} The newly created tilemap object.
        */
        public tilemap(key: string, mapData: string, format: number, resizeWorld?: bool, tileWidth?: number, tileHeight?: number): Tilemap;
        /**
        * Create a tween object for a specific object. The object can be any JavaScript object or Phaser object such as Sprite.
        *
        * @param obj {object} Object the tween will be run on.
        * @param [localReference] {bool} If true the tween will be stored in the object.tween property so long as it exists. If already set it'll be over-written.
        * @return {Phaser.Tween} The newly created tween object.
        */
        public tween(obj, localReference?: bool): Tween;
        /**
        * Add an existing Sprite to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param sprite The Sprite to add to the Game World
        * @return {Phaser.Sprite} The Sprite object
        */
        public existingSprite(sprite: Sprite): Sprite;
        /**
        * Add an existing Group to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param group The Group to add to the Game World
        * @return {Phaser.Group} The Group object
        */
        public existingGroup(group: Group): Group;
        /**
        * Add an existing Button to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param button The Button to add to the Game World
        * @return {Phaser.Button} The Button object
        */
        public existingButton(button: Button): Button;
        /**
        * Add an existing Emitter to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param emitter The Emitter to add to the Game World
        * @return {Phaser.Emitter} The Emitter object
        */
        public existingEmitter(emitter: Emitter): Emitter;
        /**
        * Add an existing ScrollZone to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param scrollZone The ScrollZone to add to the Game World
        * @return {Phaser.ScrollZone} The ScrollZone object
        */
        public existingScrollZone(scrollZone: ScrollZone): ScrollZone;
        /**
        * Add an existing Tilemap to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param tilemap The Tilemap to add to the Game World
        * @return {Phaser.Tilemap} The Tilemap object
        */
        public existingTilemap(tilemap: Tilemap): Tilemap;
        /**
        * Add an existing Tween to the current world.
        * Note: This doesn't check or update the objects reference to Game. If that is wrong, all kinds of things will break.
        *
        * @param tween The Tween to add to the Game World
        * @return {Phaser.Tween} The Tween object
        */
        public existingTween(tween: Tween): Tween;
    }
}
/**
* Phaser - Sound
*
* A Sound file, used by the Game.SoundManager for playback.
*/
module Phaser {
    class Sound {
        /**
        * Sound constructor
        * @param [volume] {number} volume of this sound when playing.
        * @param [loop] {boolean} loop this sound when playing? (Default to false)
        */
        constructor(game: Game, key: string, volume?: number, loop?: bool);
        private soundHasUnlocked(key);
        /**
        * Local reference to the current Phaser.Game.
        */
        public game: Game;
        /**
        * Reference to AudioContext instance.
        */
        public context;
        /**
        * Reference to gain node of SoundManager.
        */
        public masterGainNode;
        /**
        * GainNode of this sound.
        */
        public gainNode;
        /**
        * Decoded data buffer / Audio tag.
        */
        private _buffer;
        /**
        * Volume of this sound.
        */
        private _volume;
        /**
        * The real sound object (buffer source).
        */
        private _sound;
        private _muteVolume;
        private _muted;
        private _tempPosition;
        private _tempVolume;
        private _tempLoop;
        private _tempMarker;
        public usingWebAudio: bool;
        public usingAudioTag: bool;
        public name: string;
        public autoplay: bool;
        public totalDuration: number;
        public startTime: number;
        public currentTime: number;
        public duration: number;
        public stopTime: number;
        public position: number;
        public paused: bool;
        public loop: bool;
        public isPlaying: bool;
        public key: string;
        public markers;
        public currentMarker: string;
        public onDecoded: Signal;
        public onPlay: Signal;
        public onPause: Signal;
        public onResume: Signal;
        public onLoop: Signal;
        public onStop: Signal;
        public onMute: Signal;
        public onMarkerComplete: Signal;
        public pendingPlayback: bool;
        public isDecoding : bool;
        public isDecoded : bool;
        public addMarker(name: string, start: number, stop: number, volume?: number, loop?: bool): void;
        public removeMarker(name: string): void;
        public update(): void;
        public override: bool;
        /**
        * Play this sound, or a marked section of it.
        * @param marker {string} Assets key of the sound you want to play.
        * @param [volume] {number} volume of the sound you want to play.
        * @param [loop] {boolean} loop when it finished playing? (Default to false)
        * @return {Sound} The playing sound object.
        */
        public play(marker?: string, position?: number, volume?: number, loop?: bool, forceRestart?: bool): void;
        public restart(marker?: string, position?: number, volume?: number, loop?: bool): void;
        public pause(): void;
        public resume(): void;
        /**
        * Stop playing this sound.
        */
        public stop(): void;
        /**
        * Mute sounds.
        */
        public mute : bool;
        public volume : number;
        /**
        * Renders the Pointer.circle object onto the stage in green if down or red if up.
        * @method renderDebug
        */
        public renderDebug(x: number, y: number): void;
    }
}
/**
* Phaser - SoundManager
*
*/
module Phaser {
    class SoundManager {
        /**
        * SoundManager constructor
        * Create a new <code>SoundManager</code>.
        */
        constructor(game: Game);
        public usingWebAudio: bool;
        public usingAudioTag: bool;
        public noAudio: bool;
        /**
        * Local reference to the current Phaser.Game.
        */
        public game: Game;
        /**
        * Reference to AudioContext instance.
        */
        public context;
        /**
        * The Master Gain node through which all sounds
        */
        public masterGain;
        /**
        * Volume of sounds.
        * @type {number}
        */
        private _volume;
        private _sounds;
        private _muteVolume;
        private _muted;
        public channels: number;
        public touchLocked: bool;
        private _unlockSource;
        public unlock(): void;
        /**
        * A global audio mute toggle.
        */
        public mute : bool;
        /**
        * The global audio volume. A value between 0 (silence) and 1 (full volume)
        */
        public volume : number;
        public stopAll(): void;
        public pauseAll(): void;
        public resumeAll(): void;
        /**
        * Decode a sound with its assets key.
        * @param key {string} Assets key of the sound to be decoded.
        * @param [sound] {Sound} its bufer will be set to decoded data.
        */
        public decode(key: string, sound?: Sound): void;
        public onSoundDecode: Signal;
        public update(): void;
        public add(key: string, volume?: number, loop?: bool): Sound;
    }
}
/**
* Phaser
*
* v1.0.0 - August 12th 2013
*
* A feature-packed 2D canvas game framework born from the firey pits of Flixel and Kiwi.
*
* Richard Davey (@photonstorm)
*
* Many thanks to Adam Saltsman (@ADAMATOMIC) for releasing Flixel, from both which Phaser
* and my love of game development took a lot of inspiration.
*
* "If you want your children to be intelligent,  read them fairy tales."
* "If you want them to be more intelligent, read them more fairy tales."
*                                                     -- Albert Einstein
*/
module Phaser {
    var VERSION: string;
}
/**
* Phaser - Components - CSS3Filters
*
* Allows for easy addition and modification of CSS3 Filters on DOM objects (typically the Game.Stage.canvas).
*/
module Phaser.Components {
    class CSS3Filters {
        /**
        * Creates a new CSS3 Filter component
        * @param parent The DOM object to apply the filters to.
        */
        constructor(parent);
        /**
        * Reference to the parent DOM object (stage.canvas for example)
        */
        public parent;
        private _blur;
        private _grayscale;
        private _sepia;
        private _brightness;
        private _contrast;
        private _hueRotate;
        private _invert;
        private _opacity;
        private _saturate;
        private setFilter(local, prefix, value, unit);
        /**
        * Applies a Gaussian blur to the DOM element. The value of ‘radius’ defines the value of the standard deviation to the Gaussian function,
        * or how many pixels on the screen blend into each other, so a larger value will create more blur.
        * If no parameter is provided, then a value 0 is used. The parameter is specified as a CSS length, but does not accept percentage values.
        */
        public blur : number;
        /**
        * Converts the input image to grayscale. The value of ‘amount’ defines the proportion of the conversion.
        * A value of 100% is completely grayscale. A value of 0% leaves the input unchanged.
        * Values between 0% and 100% are linear multipliers on the effect. If the ‘amount’ parameter is missing, a value of 100% is used.
        */
        public grayscale : number;
        /**
        * Converts the input image to sepia. The value of ‘amount’ defines the proportion of the conversion.
        * A value of 100% is completely sepia. A value of 0 leaves the input unchanged.
        * Values between 0% and 100% are linear multipliers on the effect. If the ‘amount’ parameter is missing, a value of 100% is used.
        */
        public sepia : number;
        /**
        * Applies a linear multiplier to input image, making it appear more or less bright.
        * A value of 0% will create an image that is completely black. A value of 100% leaves the input unchanged.
        * Other values are linear multipliers on the effect. Values of an amount over 100% are allowed, providing brighter results.
        * If the ‘amount’ parameter is missing, a value of 100% is used.
        */
        public brightness : number;
        /**
        * Adjusts the contrast of the input. A value of 0% will create an image that is completely black.
        * A value of 100% leaves the input unchanged. Values of amount over 100% are allowed, providing results with less contrast.
        * If the ‘amount’ parameter is missing, a value of 100% is used.
        */
        public contrast : number;
        /**
        * Applies a hue rotation on the input image. The value of ‘angle’ defines the number of degrees around the color circle
        * the input samples will be adjusted. A value of 0deg leaves the input unchanged. If the ‘angle’ parameter is missing,
        * a value of 0deg is used. Maximum value is 360deg.
        */
        public hueRotate : number;
        /**
        * Inverts the samples in the input image. The value of ‘amount’ defines the proportion of the conversion.
        * A value of 100% is completely inverted. A value of 0% leaves the input unchanged.
        * Values between 0% and 100% are linear multipliers on the effect. If the ‘amount’ parameter is missing, a value of 100% is used.
        */
        public invert : number;
        /**
        * Applies transparency to the samples in the input image. The value of ‘amount’ defines the proportion of the conversion.
        * A value of 0% is completely transparent. A value of 100% leaves the input unchanged.
        * Values between 0% and 100% are linear multipliers on the effect. This is equivalent to multiplying the input image samples by amount.
        * If the ‘amount’ parameter is missing, a value of 100% is used.
        * This function is similar to the more established opacity property; the difference is that with filters, some browsers provide hardware acceleration for better performance.
        */
        public opacity : number;
        /**
        * Saturates the input image. The value of ‘amount’ defines the proportion of the conversion.
        * A value of 0% is completely un-saturated. A value of 100% leaves the input unchanged.
        * Other values are linear multipliers on the effect. Values of amount over 100% are allowed, providing super-saturated results.
        * If the ‘amount’ parameter is missing, a value of 100% is used.
        */
        public saturate : number;
    }
}
/**
* Phaser - StageScaleMode
*
* This class controls the scaling of your game. On mobile devices it will also remove the URL bar and allow
* you to maintain proportion and aspect ratio.
* The resizing method is based on a technique taken from Viewporter v2.0 by Zynga Inc. http://github.com/zynga/viewporter
*/
module Phaser {
    class StageScaleMode {
        /**
        * StageScaleMode constructor
        */
        constructor(game: Game, width: number, height: number);
        /**
        * Local private reference to game.
        */
        private _game;
        /**
        * Stage height when start the game.
        * @type {number}
        */
        private _startHeight;
        private _iterations;
        private _check;
        /**
        * Specifies that the game be visible in the specified area without trying to preserve the original aspect ratio.
        * @type {number}
        */
        static EXACT_FIT: number;
        /**
        * Specifies that the size of the game be fixed, so that it remains unchanged even if the size of the window changes.
        * @type {number}
        */
        static NO_SCALE: number;
        /**
        * Specifies that the entire game be visible in the specified area without distortion while maintaining the original aspect ratio.
        * @type {number}
        */
        static SHOW_ALL: number;
        /**
        * If the game should be forced to use Landscape mode, this is set to true by Game.Stage
        * @type {Boolean}
        */
        public forceLandscape: bool;
        /**
        * If the game should be forced to use Portrait mode, this is set to true by Game.Stage
        * @type {Boolean}
        */
        public forcePortrait: bool;
        /**
        * If the game should be forced to use a specific orientation and the device currently isn't in that orientation this is set to true.
        * @type {Boolean}
        */
        public incorrectOrientation: bool;
        /**
        * If you wish to align your game in the middle of the page then you can set this value to true.
        * It will place a re-calculated margin-left pixel value onto the canvas element which is updated on orientation/resizing.
        * It doesn't care about any other DOM element that may be on the page, it literally just sets the margin.
        * @type {Boolean}
        */
        public pageAlignHorizontally: bool;
        /**
        * If you wish to align your game in the middle of the page then you can set this value to true.
        * It will place a re-calculated margin-left pixel value onto the canvas element which is updated on orientation/resizing.
        * It doesn't care about any other DOM element that may be on the page, it literally just sets the margin.
        * @type {Boolean}
        */
        public pageAlignVeritcally: bool;
        /**
        * Minimum width the canvas should be scaled to (in pixels)
        * @type {number}
        */
        public minWidth: number;
        /**
        * Maximum width the canvas should be scaled to (in pixels).
        * If null it will scale to whatever width the browser can handle.
        * @type {number}
        */
        public maxWidth: number;
        /**
        * Minimum height the canvas should be scaled to (in pixels)
        * @type {number}
        */
        public minHeight: number;
        /**
        * Maximum height the canvas should be scaled to (in pixels).
        * If null it will scale to whatever height the browser can handle.
        * @type {number}
        */
        public maxHeight: number;
        /**
        * Width of the stage after calculation.
        * @type {number}
        */
        public width: number;
        /**
        * Height of the stage after calculation.
        * @type {number}
        */
        public height: number;
        /**
        * Asperct ratio of the scaled game size (width / height)
        * @type {number}
        */
        public aspectRatio: number;
        /**
        * The maximum number of times it will try to resize the canvas to fill the browser (default is 10)
        * @type {number}
        */
        public maxIterations: number;
        /**
        * The scale factor of the scaled game width
        * @type {Vec2}
        */
        public scaleFactor: Vec2;
        /**
        * Window orientation angle (90 and -90 are landscape, 0 and 80 are portrait)
        * @type {number}
        */
        public orientation: number;
        /**
        * A Signal that is dispatched when the device enters landscape orientation from portrait
        * @type {Signal}
        */
        public enterLandscape: Signal;
        /**
        * A Signal that is dispatched when the device enters portrait orientation from landscape
        * @type {Signal}
        */
        public enterPortrait: Signal;
        public isFullScreen : bool;
        public startFullScreen(): void;
        public stopFullScreen(): void;
        /**
        * The core update loop, called by Phaser.Stage
        */
        public update(): void;
        private checkOrientationState();
        public isPortrait : bool;
        public isLandscape : bool;
        /**
        * Handle window.orientationchange events
        */
        private checkOrientation(event);
        /**
        * Handle window.resize events
        */
        private checkResize(event);
        /**
        * Re-calculate scale mode and update screen size.
        */
        private refresh();
        /**
        * Set screen size automatically based on the scaleMode.
        */
        public setScreenSize(force?: bool): void;
        private setSize();
        private setMaximum();
        private setShowAll();
        private setExactFit();
    }
}
/**
* Phaser - BootScreen
*
* The BootScreen is displayed when Phaser is started without any default functions or State
*/
module Phaser {
    class BootScreen {
        /**
        * BootScreen constructor
        * Create a new <code>BootScreen</code> with specific width and height.
        *
        * @param width {number} Screen canvas width.
        * @param height {number} Screen canvas height.
        */
        constructor(game: Game);
        /**
        * Local private reference to game.
        */
        private _game;
        /**
        * Engine logo.
        */
        private _logo;
        /**
        * Engine logo image data.
        */
        private _logoData;
        /**
        * Background gradient effect color 1.
        */
        private _color1;
        /**
        * Background gradient effect color 2.
        */
        private _color2;
        /**
        * Fade effect tween.
        * @type {Phaser.Tween}
        */
        private _fade;
        /**
        * Update color and fade.
        */
        public update(): void;
        /**
        * Render BootScreen.
        */
        public render(): void;
        /**
        * Start color fading cycle.
        */
        private colorCycle();
    }
}
/**
* Phaser - PauseScreen
*
* The PauseScreen is displayed whenever the game loses focus or the player switches to another browser tab.
*/
module Phaser {
    class PauseScreen {
        /**
        * PauseScreen constructor
        * Create a new <code>PauseScreen</code> with specific width and height.
        *
        * @param width {number} Screen canvas width.
        * @param height {number} Screen canvas height.
        */
        constructor(game: Game, width: number, height: number);
        /**
        * Local private reference to game.
        */
        private _game;
        /**
        * Canvas element used by engine.
        * @type {HTMLCanvasElement}
        */
        private _canvas;
        /**
        * Render context of stage's canvas.
        * @type {CanvasRenderingContext2D}
        */
        private _context;
        /**
        * Background color.
        */
        private _color;
        /**
        * Fade effect tween.
        * @type {Phaser.Tween}
        */
        private _fade;
        /**
        * Called when the game enters pause mode.
        */
        public onPaused(): void;
        /**
        * Called when the game resume from pause mode.
        */
        public onResume(): void;
        /**
        * Update background color.
        */
        public update(): void;
        /**
        * Render PauseScreen.
        */
        public render(): void;
        /**
        * Start fadeOut effect.
        */
        private fadeOut();
        /**
        * Start fadeIn effect.
        */
        private fadeIn();
    }
}
/**
* Phaser - OrientationScreen
*
* The Orientation Screen is displayed whenever the device is turned to an unsupported orientation.
*/
module Phaser {
    class OrientationScreen {
        /**
        * OrientationScreen constructor
        * Create a new <code>OrientationScreen</code> with specific width and height.
        *
        * @param width {number} Screen canvas width.
        * @param height {number} Screen canvas height.
        */
        constructor(game: Game);
        /**
        * Local reference to game.
        */
        public game: Game;
        private _showOnLandscape;
        private _showOnPortrait;
        /**
        * Landscape Image. If you only want your game to work in Portrait mode, and display an image when in Landscape,
        * then set this to be the key of an image previously loaded into the Game.Cache.
        * @type {Cache Reference}
        */
        public landscapeImage;
        /**
        * Portrait Image. If you only want your game to work in Landscape mode, and display an image when in Portrait,
        * then set this to be the key of an image previously loaded into the Game.Cache.
        * @type {Cache Reference}
        */
        public portraitImage;
        public enable(onLandscape: bool, onPortrait: bool, imageKey: string): void;
        /**
        * Update
        */
        public update(): void;
        /**
        * Render
        */
        public render(): void;
    }
}
/**
* Phaser - Stage
*
* The Stage is the canvas on which everything is displayed. This class handles display within the web browser, focus handling,
* resizing, scaling and pause/boot screens.
*/
module Phaser {
    class Stage {
        /**
        * Stage constructor
        *
        * Create a new <code>Stage</code> with specific width and height.
        *
        * @param parent {number} ID of parent DOM element.
        * @param width {number} Width of the stage.
        * @param height {number} Height of the stage.
        */
        constructor(game: Game, parent: string, width: number, height: number);
        /**
        * Local private reference to game.
        */
        private _game;
        /**
        * Background color of the stage (defaults to black). Set via the public backgroundColor property.
        * @type {string}
        */
        private _backgroundColor;
        /**
        * This will be displayed when Phaser is started without any default functions or State
        * @type {BootScreen}
        */
        public bootScreen;
        /**
        * This will be displayed whenever the game loses focus or the player switches to another browser tab.
        * @type {PauseScreen}
        */
        public pauseScreen;
        /**
        * This will be displayed whenever the device is turned to an unsupported orientation.
        * @type {OrientationScreen}
        */
        public orientationScreen;
        /**
        * Controls the CSS3 Filters applied to the Stages canvas object.
        * @type {Phaser.Components.CSS3Filters}
        */
        public css3: Components.CSS3Filters;
        /**
        * Bound of this stage.
        * @type {Rectangle}
        */
        public bounds: Rectangle;
        /**
        * Asperct ratio, thus: width / height.
        * @type {number}
        */
        public aspectRatio: number;
        /**
        * Clear the whole stage every frame? (Default to true)
        * @type {boolean}
        */
        public clear: bool;
        /**
        * Canvas element used by engine.
        * @type {HTMLCanvasElement}
        */
        public canvas: HTMLCanvasElement;
        /**
        * Render context of stage's canvas.
        * @type {CanvasRenderingContext2D}
        */
        public context: CanvasRenderingContext2D;
        /**
        * Do not use pause screen when game is paused?
        * (Default to false, aka always use PauseScreen)
        * @type {boolean}
        */
        public disablePauseScreen: bool;
        /**
        * Do not use boot screen when engine starts?
        * (Default to false, aka always use BootScreen)
        * @type {boolean}
        */
        public disableBootScreen: bool;
        /**
        * Offset from this stage to the canvas element.
        * @type {MicroPoint}
        */
        public offset: Point;
        /**
        * This object manages scaling of the game, see(StageScaleMode).
        * @type {StageScaleMode}
        */
        public scale: StageScaleMode;
        /**
        * Which mode will the game be scaled.
        * Available: StageScaleMode.EXACT_FIT, StageScaleMode.NO_SCALE, StageScaleMode.SHOW_ALL.
        * @type {number}
        */
        public scaleMode: number;
        /**
        * If set to true the game will never pause when the browser or browser tab loses focuses
        * @type {boolean}
        */
        public disableVisibilityChange: bool;
        /**
        * Stage boot
        */
        public boot(): void;
        /**
        * Update stage for rendering. This will handle scaling, clearing
        * and PauseScreen/BootScreen updating and rendering.
        */
        public update(): void;
        /**
        * This method is called when the canvas elements visibility is changed.
        */
        private visibilityChange(event);
        public enableOrientationCheck(forceLandscape: bool, forcePortrait: bool, imageKey?: string): void;
        public setImageRenderingCrisp(): void;
        public pauseGame(): void;
        public resumeGame(): void;
        /**
        * Get the DOM offset values of the given element
        */
        public getOffset(element, populateOffset?: bool): Point;
        /**
        * Canvas strokeStyle.
        * @type {string}
        */
        public strokeStyle: string;
        /**
        * Canvas lineWidth.
        * @type {number}
        */
        public lineWidth: number;
        /**
        * Canvas fillStyle.
        * @type {string}
        */
        public fillStyle: string;
        /**
        * Save current canvas properties (strokeStyle, lineWidth and fillStyle) for later using.
        */
        public saveCanvasValues(): void;
        /**
        * Restore current canvas values (strokeStyle, lineWidth and fillStyle) with saved values.
        */
        public restoreCanvasValues(): void;
        public backgroundColor : string;
        public x : number;
        public y : number;
        public width : number;
        public height : number;
        public centerX : number;
        public centerY : number;
        public randomX : number;
        public randomY : number;
    }
}
/**
* Phaser - Time
*
* This is the game clock and it manages elapsed time and calculation of delta values, used for game object motion.
*/
module Phaser {
    class Time {
        /**
        * Time constructor
        * Create a new <code>Time</code>.
        *
        * @param game {Phaser.Game} Current game instance.
        */
        constructor(game: Game);
        /**
        * Local private reference to game.
        */
        private _game;
        /**
        * Time when this object created.
        * @param {number}
        */
        private _started;
        /**
        * Time scale factor.
        * Set it to 0.5 for slow motion, to 2.0 makes game twice faster.
        * @type {number}
        */
        public timeScale: number;
        /**
        * Elapsed since last frame.
        * @type {number}
        */
        public elapsed: number;
        /**
        * Game time counter.
        * @property time
        * @type {number}
        */
        public time: number;
        /**
        * Time of current frame.
        * @property now
        * @type {number}
        */
        public now: number;
        /**
        * Elapsed time since last frame.
        * @property delta
        * @type {number}
        */
        public delta: number;
        /**
        *
        * @method totalElapsedSeconds
        * @return {Number}
        */
        public totalElapsedSeconds : number;
        /**
        * Frames per second.
        * @type {number}
        */
        public fps: number;
        /**
        * Minimal fps.
        * @type {number}
        */
        public fpsMin: number;
        /**
        * Maximal fps.
        * @type {number}
        */
        public fpsMax: number;
        /**
        * Mininal duration between 2 frames.
        * @type {number}
        */
        public msMin: number;
        /**
        * Maximal duration between 2 frames.
        * @type {number}
        */
        public msMax: number;
        /**
        * How many frames in last second.
        * @type {number}
        */
        public frames: number;
        /**
        * Time of last second.
        * @type {number}
        */
        private _timeLastSecond;
        /**
        * Update clock and calculate the fps.
        * This is called automatically by Game._raf
        * @method update
        * @param {number} raf The current timestamp, either performance.now or Date.now
        */
        public update(raf: number): void;
        /**
        * How long has passed since given time.
        * @method elapsedSince
        * @param {number} since The time you want to measure.
        * @return {number} Duration between given time and now.
        */
        public elapsedSince(since: number): number;
        /**
        * How long has passed since give time (in seconds).
        * @method elapsedSecondsSince
        * @param {number} since The time you want to measure (in seconds).
        * @return {number} Duration between given time and now (in seconds).
        */
        public elapsedSecondsSince(since: number): number;
        /**
        * Set the start time to now.
        * @method reset
        */
        public reset(): void;
    }
}
/**
* Phaser - TweenManager
*
* The Game has a single instance of the TweenManager through which all Tween objects are created and updated.
* Tweens are hooked into the game clock and pause system, adjusting based on the game state.
* TweenManager is based heavily on tween.js by sole (http://soledadpenades.com).
* I converted it to TypeScript, swapped the callbacks for signals and patched a few issues with regard
* to properties and completion errors. Please see https://github.com/sole/tween.js for a full list of contributors.
*/
module Phaser {
    class TweenManager {
        /**
        * TweenManager constructor
        * @param game {Game} A reference to the current Game.
        */
        constructor(game: Game);
        /**
        * Local private reference to Game
        */
        private _game;
        /**
        * Local private array which is the container of all tween objects.
        */
        private _tweens;
        /**
        * Get all the tween objects in an array.
        * @return {Phaser.Tween[]} Array with all tween objects.
        */
        public getAll(): Tween[];
        /**
        * Remove all tween objects.
        */
        public removeAll(): void;
        /**
        * Create a tween object for a specific object. The object can be any JavaScript object or Phaser object such as Sprite.
        *
        * @param obj {object} Object the tween will be run on.
        * @param [localReference] {bool} If true the tween will be stored in the object.tween property so long as it exists. If already set it'll be over-written.
        * @return {Phaser.Tween} The newly created tween object.
        */
        public create(object, localReference?: bool): Tween;
        /**
        * Add a new tween into the TweenManager.
        *
        * @param tween {Phaser.Tween} The tween object you want to add.
        * @return {Phaser.Tween} The tween object you added to the manager.
        */
        public add(tween: Tween): Tween;
        /**
        * Remove a tween from this manager.
        *
        * @param tween {Phaser.Tween} The tween object you want to remove.
        */
        public remove(tween: Tween): void;
        /**
        * Update all the tween objects you added to this manager.
        *
        * @return {boolean} Return false if there's no tween to update, otherwise return true.
        */
        public update(): bool;
    }
}
/**
* Phaser - Physics Manager
*
* Eventually this will handle switching between the default ArcadePhysics manager or the new AdvancedPhysics manager.
* For now we direct everything through ArcadePhysics.
*/
module Phaser.Physics {
    class Manager {
        constructor(game: Game);
        /**
        * Local reference to Game.
        */
        public game: Game;
        /**
        * Instance of the ArcadePhysics manager.
        */
        public arcade: ArcadePhysics;
        public gravity: Vec2;
        public bounds: Rectangle;
        /**
        * Called by the main Game.loop
        */
        public update(): void;
    }
}
/**
* Phaser - World
*
* "This world is but a canvas to our imagination." - Henry David Thoreau
*
* A game has only one world. The world is an abstract place in which all game objects live. It is not bound
* by stage limits and can be any size or dimension. You look into the world via cameras and all game objects
* live within the world at world-based coordinates. By default a world is created the same size as your Stage.
*/
module Phaser {
    class World {
        /**
        * World constructor
        * Create a new <code>World</code> with specific width and height.
        *
        * @param width {number} Width of the world bound.
        * @param height {number} Height of the world bound.
        */
        constructor(game: Game, width: number, height: number);
        /**
        * Local private reference to game.
        */
        private _game;
        /**
        * Camera manager of this world.
        * @type {CameraManager}
        */
        public cameras: CameraManager;
        /**
        * Object container stores every object created with `create*` methods.
        * @type {Group}
        */
        public group: Group;
        /**
        * Bound of this world that objects can not escape from.
        * @type {Rectangle}
        */
        public bounds: Rectangle;
        /**
        * The Gravity of the World (defaults to 0,0, or no gravity at all)
        * @type {Vec2}
        */
        public gravity: Vec2;
        /**
        * Object container stores every object created with `create*` methods.
        * @type {Group}
        */
        private _groupCounter;
        public getNextGroupID(): number;
        /**
        * Called once by Game during the boot process.
        */
        public boot(): void;
        /**
        * This is called automatically every frame, and is where main logic happens.
        */
        public update(): void;
        /**
        * This is called automatically every frame, and is where main logic happens.
        */
        public postUpdate(): void;
        /**
        * Clean up memory.
        */
        public destroy(): void;
        /**
        * Updates the size of this world.
        *
        * @param width {number} New width of the world.
        * @param height {number} New height of the world.
        * @param [updateCameraBounds] {boolean} Update camera bounds automatically or not. Default to true.
        */
        public setSize(width: number, height: number, updateCameraBounds?: bool): void;
        public width : number;
        public height : number;
        public centerX : number;
        public centerY : number;
        public randomX : number;
        public randomY : number;
        /**
        * Get all the cameras.
        *
        * @returns {array} An array contains all the cameras.
        */
        public getAllCameras(): Camera[];
    }
}
/**
* Phaser - Device
*
* Detects device support capabilities. Using some elements from System.js by MrDoob and Modernizr
* https://github.com/Modernizr/Modernizr/blob/master/feature-detects/audio.js
*/
module Phaser {
    class Device {
        /**
        * Device constructor
        */
        constructor();
        /**
        * Is running desktop?
        * @type {boolean}
        */
        public desktop: bool;
        /**
        * Is running on iOS?
        * @type {boolean}
        */
        public iOS: bool;
        /**
        * Is running on android?
        * @type {boolean}
        */
        public android: bool;
        /**
        * Is running on chromeOS?
        * @type {boolean}
        */
        public chromeOS: bool;
        /**
        * Is running on linux?
        * @type {boolean}
        */
        public linux: bool;
        /**
        * Is running on maxOS?
        * @type {boolean}
        */
        public macOS: bool;
        /**
        * Is running on windows?
        * @type {boolean}
        */
        public windows: bool;
        /**
        * Is canvas available?
        * @type {boolean}
        */
        public canvas: bool;
        /**
        * Is file available?
        * @type {boolean}
        */
        public file: bool;
        /**
        * Is fileSystem available?
        * @type {boolean}
        */
        public fileSystem: bool;
        /**
        * Is localStorage available?
        * @type {boolean}
        */
        public localStorage: bool;
        /**
        * Is webGL available?
        * @type {boolean}
        */
        public webGL: bool;
        /**
        * Is worker available?
        * @type {boolean}
        */
        public worker: bool;
        /**
        * Is touch available?
        * @type {boolean}
        */
        public touch: bool;
        /**
        * Is mspointer available?
        * @type {boolean}
        */
        public mspointer: bool;
        /**
        * Is css3D available?
        * @type {boolean}
        */
        public css3D: bool;
        /**
        * Is running in arora?
        * @type {boolean}
        */
        public arora: bool;
        /**
        * Is running in chrome?
        * @type {boolean}
        */
        public chrome: bool;
        /**
        * Is running in epiphany?
        * @type {boolean}
        */
        public epiphany: bool;
        /**
        * Is running in firefox?
        * @type {boolean}
        */
        public firefox: bool;
        /**
        * Is running in ie?
        * @type {boolean}
        */
        public ie: bool;
        /**
        * Version of ie?
        * @type Number
        */
        public ieVersion: number;
        /**
        * Is running in mobileSafari?
        * @type {boolean}
        */
        public mobileSafari: bool;
        /**
        * Is running in midori?
        * @type {boolean}
        */
        public midori: bool;
        /**
        * Is running in opera?
        * @type {boolean}
        */
        public opera: bool;
        /**
        * Is running in safari?
        * @type {boolean}
        */
        public safari: bool;
        public webApp: bool;
        /**
        * Are Audio tags available?
        * @type {boolean}
        */
        public audioData: bool;
        /**
        * Is the WebAudio API available?
        * @type {boolean}
        */
        public webAudio: bool;
        /**
        * Can this device play ogg files?
        * @type {boolean}
        */
        public ogg: bool;
        /**
        * Can this device play opus files?
        * @type {boolean}
        */
        public opus: bool;
        /**
        * Can this device play mp3 files?
        * @type {boolean}
        */
        public mp3: bool;
        /**
        * Can this device play wav files?
        * @type {boolean}
        */
        public wav: bool;
        /**
        * Can this device play m4a files?
        * @type {boolean}
        */
        public m4a: bool;
        /**
        * Can this device play webm files?
        * @type {boolean}
        */
        public webm: bool;
        /**
        * Is running on iPhone?
        * @type {boolean}
        */
        public iPhone: bool;
        /**
        * Is running on iPhone4?
        * @type {boolean}
        */
        public iPhone4: bool;
        /**
        * Is running on iPad?
        * @type {boolean}
        */
        public iPad: bool;
        /**
        * PixelRatio of the host device?
        * @type Number
        */
        public pixelRatio: number;
        /**
        * Check which OS is game running on.
        * @private
        */
        private _checkOS();
        /**
        * Check HTML5 features of the host environment.
        * @private
        */
        private _checkFeatures();
        /**
        * Check what browser is game running in.
        * @private
        */
        private _checkBrowser();
        public canPlayAudio(type: string): bool;
        /**
        * Check audio support.
        * @private
        */
        private _checkAudio();
        /**
        * Check PixelRatio of devices.
        * @private
        */
        private _checkDevice();
        /**
        * Check whether the host environment support 3D CSS.
        * @private
        */
        private _checkCSS3D();
        public isConsoleOpen(): bool;
        /**
        * Get all informations of host device.
        * @return {string} Informations in a string.
        */
        public getAll(): string;
    }
}
/**
* Phaser - RequestAnimationFrame
*
* Abstracts away the use of RAF or setTimeOut for the core game update loop. The callback can be re-mapped on the fly.
*/
module Phaser {
    class RequestAnimationFrame {
        /**
        * Constructor
        * @param {Any} callback
        * @return {RequestAnimationFrame} This object.
        */
        constructor(game: Game, callback);
        /**
        * Local private reference to game.
        */
        private _game;
        /**
        * The function to be called each frame. Will be called in the context of _game
        * @property callback
        * @type Any
        **/
        public callback;
        /**
        *
        * @property _timeOutID
        * @type Any
        * @private
        **/
        private _timeOutID;
        /**
        *
        * @property _isSetTimeOut
        * @type Boolean
        * @private
        **/
        private _isSetTimeOut;
        /**
        *
        * @method usingSetTimeOut
        * @return Boolean
        **/
        public isUsingSetTimeOut(): bool;
        /**
        *
        * @method usingRAF
        * @return Boolean
        **/
        public isUsingRAF(): bool;
        /**
        *
        * @property isRunning
        * @type Boolean
        **/
        public isRunning: bool;
        /**
        * Starts the requestAnimatioFrame running or setTimeout if unavailable in browser
        * @method start
        * @param {Any} [callback]
        **/
        public start(callback?): void;
        /**
        * Stops the requestAnimationFrame from running
        * @method stop
        **/
        public stop(): void;
        /**
        * The update method for the requestAnimationFrame
        * @method RAFUpdate
        **/
        public RAFUpdate(time: number): void;
        /**
        * The update method for the setTimeout
        * @method SetTimeoutUpdate
        **/
        public SetTimeoutUpdate(): void;
    }
}
/**
* Phaser - PointUtils
*
* A collection of methods useful for manipulating and comparing Point objects.
*
* TODO: interpolate & polar
*/
module Phaser {
    class PointUtils {
        /**
        * Adds the coordinates of two points together to create a new point.
        * @method add
        * @param {Point} a - The first Point object.
        * @param {Point} b - The second Point object.
        * @param {Point} out - Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Point} The new Point object.
        **/
        static add(a: Point, b: Point, out?: Point): Point;
        /**
        * Subtracts the coordinates of two points to create a new point.
        * @method subtract
        * @param {Point} a - The first Point object.
        * @param {Point} b - The second Point object.
        * @param {Point} out - Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Point} The new Point object.
        **/
        static subtract(a: Point, b: Point, out?: Point): Point;
        /**
        * Multiplies the coordinates of two points to create a new point.
        * @method subtract
        * @param {Point} a - The first Point object.
        * @param {Point} b - The second Point object.
        * @param {Point} out - Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Point} The new Point object.
        **/
        static multiply(a: Point, b: Point, out?: Point): Point;
        /**
        * Divides the coordinates of two points to create a new point.
        * @method subtract
        * @param {Point} a - The first Point object.
        * @param {Point} b - The second Point object.
        * @param {Point} out - Optional Point to store the value in, if not supplied a new Point object will be created.
        * @return {Point} The new Point object.
        **/
        static divide(a: Point, b: Point, out?: Point): Point;
        /**
        * Clamps the Point object values to be between the given min and max
        * @method clamp
        * @param {Point} a - The point.
        * @param {number} The minimum value to clamp this Point to
        * @param {number} The maximum value to clamp this Point to
        * @return {Point} This Point object.
        **/
        static clamp(a: Point, min: number, max: number): Point;
        /**
        * Clamps the x value of the given Point object to be between the min and max values.
        * @method clampX
        * @param {Point} a - The point.
        * @param {number} The minimum value to clamp this Point to
        * @param {number} The maximum value to clamp this Point to
        * @return {Point} This Point object.
        **/
        static clampX(a: Point, min: number, max: number): Point;
        /**
        * Clamps the y value of the given Point object to be between the min and max values.
        * @method clampY
        * @param {Point} a - The point.
        * @param {number} The minimum value to clamp this Point to
        * @param {number} The maximum value to clamp this Point to
        * @return {Point} This Point object.
        **/
        static clampY(a: Point, min: number, max: number): Point;
        /**
        * Creates a copy of the given Point.
        * @method clone
        * @param {Point} output Optional Point object. If given the values will be set into this object, otherwise a brand new Point object will be created and returned.
        * @return {Point} The new Point object.
        **/
        static clone(a: Point, output?: Point): Point;
        /**
        * Returns the distance between the two given Point objects.
        * @method distanceBetween
        * @param {Point} a - The first Point object.
        * @param {Point} b - The second Point object.
        * @param {Boolean} round - Round the distance to the nearest integer (default false)
        * @return {Number} The distance between the two Point objects.
        **/
        static distanceBetween(a: Point, b: Point, round?: bool): number;
        /**
        * Determines whether the two given Point objects are equal. They are considered equal if they have the same x and y values.
        * @method equals
        * @param {Point} a - The first Point object.
        * @param {Point} b - The second Point object.
        * @return {Boolean} A value of true if the Points are equal, otherwise false.
        **/
        static equals(a: Point, b: Point): bool;
        /**
        * Rotates a Point around the x/y coordinates given to the desired angle.
        * @param a {Point} The Point object to rotate.
        * @param x {number} The x coordinate of the anchor point
        * @param y {number} The y coordinate of the anchor point
        * @param {Number} angle The angle in radians (unless asDegrees is true) to rotate the Point to.
        * @param {Boolean} asDegrees Is the given rotation in radians (false) or degrees (true)?
        * @param {Number} distance An optional distance constraint between the Point and the anchor.
        * @return The modified point object
        */
        static rotate(a: Point, x: number, y: number, angle: number, asDegrees?: bool, distance?: number): Point;
        /**
        * Rotates a Point around the given Point to the desired angle.
        * @param a {Point} The Point object to rotate.
        * @param b {Point} The Point object to serve as point of rotation.
        * @param x {number} The x coordinate of the anchor point
        * @param y {number} The y coordinate of the anchor point
        * @param {Number} angle The angle in radians (unless asDegrees is true) to rotate the Point to.
        * @param {Boolean} asDegrees Is the given rotation in radians (false) or degrees (true)?
        * @param {Number} distance An optional distance constraint between the Point and the anchor.
        * @return The modified point object
        */
        static rotateAroundPoint(a: Point, b: Point, angle: number, asDegrees?: bool, distance?: number): Point;
    }
}
/**
* Phaser - Pointer
*
* A Pointer object is used by the Touch and MSPoint managers and represents a single finger on the touch screen.
*/
module Phaser {
    class Pointer {
        /**
        * Constructor
        * @param {Phaser.Game} game.
        * @return {Phaser.Pointer} This object.
        */
        constructor(game: Game, id: number);
        private _highestRenderOrderID;
        private _highestRenderObject;
        private _highestInputPriorityID;
        /**
        * Local private reference to game.
        * @property game
        * @type {Phaser.Game}
        * @private
        **/
        public game: Game;
        /**
        * Local private variable to store the status of dispatching a hold event
        * @property _holdSent
        * @type {Boolean}
        * @private
        */
        private _holdSent;
        /**
        * Local private variable storing the short-term history of pointer movements
        * @property _history
        * @type {Array}
        * @private
        */
        private _history;
        /**
        * Local private variable storing the time at which the next history drop should occur
        * @property _lastDrop
        * @type {Number}
        * @private
        */
        private _nextDrop;
        private _stateReset;
        /**
        * The Pointer ID (a number between 1 and 10, 0 is reserved for the mouse pointer specifically)
        * @property id
        * @type {Number}
        */
        public id: number;
        /**
        * An identification number for each touch point.
        * When a touch point becomes active, it is assigned an identifier that is distinct from any other active touch point.
        * While the touch point remains active, all events that refer to it are assigned the same identifier.
        * @property identifier
        * @type {Number}
        */
        public identifier: number;
        /**
        * Is this Pointer active or not? An active Pointer is one that is in contact with the touch screen.
        * @property active
        * @type {Boolean}
        */
        public active: bool;
        /**
        * A Vector object containing the initial position when the Pointer was engaged with the screen.
        * @property positionDown
        * @type {Vec2}
        **/
        public positionDown: Vec2;
        /**
        * A Vector object containing the current position of the Pointer on the screen.
        * @property position
        * @type {Vec2}
        **/
        public position: Vec2;
        /**
        * A Circle object centered on the x/y screen coordinates of the Pointer.
        * Default size of 44px (Apple's recommended "finger tip" size)
        * @property circle
        * @type {Circle}
        **/
        public circle: Circle;
        /**
        *
        * @property withinGame
        * @type {Boolean}
        */
        public withinGame: bool;
        /**
        * If this Pointer is a mouse the button property holds the value of which mouse button was pressed down
        * @property button
        * @type {Number}
        */
        public button: number;
        /**
        * The horizontal coordinate of point relative to the viewport in pixels, excluding any scroll offset
        * @property clientX
        * @type {Number}
        */
        public clientX: number;
        /**
        * The vertical coordinate of point relative to the viewport in pixels, excluding any scroll offset
        * @property clientY
        * @type {Number}
        */
        public clientY: number;
        /**
        * The horizontal coordinate of point relative to the viewport in pixels, including any scroll offset
        * @property pageX
        * @type {Number}
        */
        public pageX: number;
        /**
        * The vertical coordinate of point relative to the viewport in pixels, including any scroll offset
        * @property pageY
        * @type {Number}
        */
        public pageY: number;
        /**
        * The horizontal coordinate of point relative to the screen in pixels
        * @property screenX
        * @type {Number}
        */
        public screenX: number;
        /**
        * The vertical coordinate of point relative to the screen in pixels
        * @property screenY
        * @type {Number}
        */
        public screenY: number;
        /**
        * The horizontal coordinate of point relative to the game element. This value is automatically scaled based on game size.
        * @property x
        * @type {Number}
        */
        public x: number;
        /**
        * The vertical coordinate of point relative to the game element. This value is automatically scaled based on game size.
        * @property y
        * @type {Number}
        */
        public y: number;
        /**
        * The Element on which the touch point started when it was first placed on the surface, even if the touch point has since moved outside the interactive area of that element.
        * @property target
        * @type {Any}
        */
        public target;
        /**
        * If the Pointer is a mouse this is true, otherwise false
        * @property isMouse
        * @type {Boolean}
        **/
        public isMouse: bool;
        /**
        * If the Pointer is touching the touchscreen, or the mouse button is held down, isDown is set to true
        * @property isDown
        * @type {Boolean}
        **/
        public isDown: bool;
        /**
        * If the Pointer is not touching the touchscreen, or the mouse button is up, isUp is set to true
        * @property isUp
        * @type {Boolean}
        **/
        public isUp: bool;
        /**
        * A timestamp representing when the Pointer first touched the touchscreen.
        * @property timeDown
        * @type {Number}
        **/
        public timeDown: number;
        /**
        * A timestamp representing when the Pointer left the touchscreen.
        * @property timeUp
        * @type {Number}
        **/
        public timeUp: number;
        /**
        * A timestamp representing when the Pointer was last tapped or clicked
        * @property previousTapTime
        * @type {Number}
        **/
        public previousTapTime: number;
        /**
        * The total number of times this Pointer has been touched to the touchscreen
        * @property totalTouches
        * @type {Number}
        **/
        public totalTouches: number;
        /**
        * The number of miliseconds since the last click
        * @property msSinceLastClick
        * @type {Number}
        **/
        public msSinceLastClick: number;
        /**
        * How long the Pointer has been depressed on the touchscreen. If not currently down it returns -1.
        * @property duration
        * @type {Number}
        **/
        public duration : number;
        /**
        * The Game Object this Pointer is currently over / touching / dragging.
        * @property targetObject
        * @type {Any}
        **/
        public targetObject;
        /**
        * Gets the X value of this Pointer in world coordinates based on the given camera.
        * @param {Camera} [camera]
        */
        public worldX(camera?: Camera): number;
        /**
        * Gets the Y value of this Pointer in world coordinates based on the given camera.
        * @param {Camera} [camera]
        */
        public worldY(camera?: Camera): number;
        /**
        * Called when the Pointer is pressed onto the touchscreen
        * @method start
        * @param {Any} event
        */
        public start(event): Pointer;
        public update(): void;
        /**
        * Called when the Pointer is moved on the touchscreen
        * @method move
        * @param {Any} event
        */
        public move(event): Pointer;
        /**
        * Called when the Pointer leaves the target area
        * @method leave
        * @param {Any} event
        */
        public leave(event): void;
        /**
        * Called when the Pointer leaves the touchscreen
        * @method stop
        * @param {Any} event
        */
        public stop(event): Pointer;
        /**
        * The Pointer is considered justPressed if the time it was pressed onto the touchscreen or clicked is less than justPressedRate
        * @method justPressed
        * @param {Number} [duration].
        * @return {Boolean}
        */
        public justPressed(duration?: number): bool;
        /**
        * The Pointer is considered justReleased if the time it left the touchscreen is less than justReleasedRate
        * @method justReleased
        * @param {Number} [duration].
        * @return {Boolean}
        */
        public justReleased(duration?: number): bool;
        /**
        * Resets the Pointer properties. Called by Input.reset when you perform a State change.
        * @method reset
        */
        public reset(): void;
        /**
        * Renders the Pointer.circle object onto the stage in green if down or red if up.
        * @method renderDebug
        */
        public renderDebug(hideIfUp?: bool): void;
        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {String} a string representation of the instance.
        **/
        public toString(): string;
    }
}
/**
* Phaser - MSPointer
*
* The MSPointer class handles touch interactions with the game and the resulting Pointer objects.
* It will work only in Internet Explorer 10 and Windows Store or Windows Phone 8 apps using JavaScript.
* http://msdn.microsoft.com/en-us/library/ie/hh673557(v=vs.85).aspx
*/
module Phaser {
    class MSPointer {
        /**
        * Constructor
        * @param {Game} game.
        * @return {MSPointer} This object.
        */
        constructor(game: Game);
        /**
        * Local private reference to game.
        * @property _game
        * @type Game
        * @private
        **/
        private _game;
        /**
        * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
        * @type {Boolean}
        */
        public disabled: bool;
        /**
        * Starts the event listeners running
        * @method start
        */
        public start(): void;
        /**
        *
        * @method onPointerDown
        * @param {Any} event
        **/
        private onPointerDown(event);
        /**
        *
        * @method onPointerMove
        * @param {Any} event
        **/
        private onPointerMove(event);
        /**
        *
        * @method onPointerUp
        * @param {Any} event
        **/
        private onPointerUp(event);
        /**
        * Stop the event listeners
        * @method stop
        */
        public stop(): void;
    }
}
/**
* Phaser - Gestures
*
* The Gesture class monitors for gestures and dispatches the resulting signals when they occur.
* Note: Android 2.x only supports 1 touch event at once, no multi-touch
*/
module Phaser {
    class Gestures {
        /**
        * Constructor
        * @param {Game} game.
        * @return {Touch} This object.
        */
        constructor(game: Game);
        /**
        * Local private reference to game.
        * @property _game
        * @type {Game}
        * @private
        **/
        private _game;
        private _p1;
        private _p2;
        private _p3;
        private _p4;
        private _p5;
        private _p6;
        private _p7;
        private _p8;
        private _p9;
        private _p10;
        public start(): void;
    }
}
/**
* Phaser - Mouse
*
* The Mouse class handles mouse interactions with the game and the resulting events.
*/
module Phaser {
    class Mouse {
        constructor(game: Game);
        /**
        * Local private reference to game.
        * @property _game
        * @type {Phaser.Game}
        * @private
        **/
        private _game;
        static LEFT_BUTTON: number;
        static MIDDLE_BUTTON: number;
        static RIGHT_BUTTON: number;
        /**
        * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
        * @type {Boolean}
        */
        public disabled: bool;
        /**
        * Custom callback useful for hooking into a 3rd party library. Will be passed the mouse event as the only parameter.
        * Callbacks are fired even if this component is disabled and before the event propagation is disabled.
        */
        public callbackContext;
        public mouseDownCallback;
        public mouseMoveCallback;
        public mouseUpCallback;
        /**
        * Starts the event listeners running
        * @method start
        */
        public start(): void;
        /**
        * @param {MouseEvent} event
        */
        public onMouseDown(event: MouseEvent): void;
        /**
        * @param {MouseEvent} event
        */
        public onMouseMove(event: MouseEvent): void;
        /**
        * @param {MouseEvent} event
        */
        public onMouseUp(event: MouseEvent): void;
        /**
        * Stop the event listeners
        * @method stop
        */
        public stop(): void;
    }
}
/**
* Phaser - Keyboard
*
* The Keyboard class handles keyboard interactions with the game and the resulting events.
* The avoid stealing all browser input we don't use event.preventDefault. If you would like to trap a specific key however
* then use the addKeyCapture() method.
*/
module Phaser {
    class Keyboard {
        constructor(game: Game);
        private _game;
        private _keys;
        private _capture;
        /**
        * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
        * @type {Boolean}
        */
        public disabled: bool;
        public start(): void;
        /**
        * By default when a key is pressed Phaser will not stop the event from propagating up to the browser.
        * There are some keys this can be annoying for, like the arrow keys or space bar, which make the browser window scroll.
        * You can use addKeyCapture to consume the keyboard event for specific keys so it doesn't bubble up to the the browser.
        * Pass in either a single keycode or an array of keycodes.
        * @param {Any} keycode
        */
        public addKeyCapture(keycode): void;
        /**
        * @param {Number} keycode
        */
        public removeKeyCapture(keycode: number): void;
        public clearCaptures(): void;
        /**
        * @param {KeyboardEvent} event
        */
        public onKeyDown(event: KeyboardEvent): void;
        /**
        * @param {KeyboardEvent} event
        */
        public onKeyUp(event: KeyboardEvent): void;
        public reset(): void;
        /**
        * @param {Number} keycode
        * @param {Number} [duration]
        * @return {Boolean}
        */
        public justPressed(keycode: number, duration?: number): bool;
        /**
        * @param {Number} keycode
        * @param {Number} [duration]
        * @return {Boolean}
        */
        public justReleased(keycode: number, duration?: number): bool;
        /**
        * @param {Number} keycode
        * @return {Boolean}
        */
        public isDown(keycode: number): bool;
        static A: number;
        static B: number;
        static C: number;
        static D: number;
        static E: number;
        static F: number;
        static G: number;
        static H: number;
        static I: number;
        static J: number;
        static K: number;
        static L: number;
        static M: number;
        static N: number;
        static O: number;
        static P: number;
        static Q: number;
        static R: number;
        static S: number;
        static T: number;
        static U: number;
        static V: number;
        static W: number;
        static X: number;
        static Y: number;
        static Z: number;
        static ZERO: number;
        static ONE: number;
        static TWO: number;
        static THREE: number;
        static FOUR: number;
        static FIVE: number;
        static SIX: number;
        static SEVEN: number;
        static EIGHT: number;
        static NINE: number;
        static NUMPAD_0: number;
        static NUMPAD_1: number;
        static NUMPAD_2: number;
        static NUMPAD_3: number;
        static NUMPAD_4: number;
        static NUMPAD_5: number;
        static NUMPAD_6: number;
        static NUMPAD_7: number;
        static NUMPAD_8: number;
        static NUMPAD_9: number;
        static NUMPAD_MULTIPLY: number;
        static NUMPAD_ADD: number;
        static NUMPAD_ENTER: number;
        static NUMPAD_SUBTRACT: number;
        static NUMPAD_DECIMAL: number;
        static NUMPAD_DIVIDE: number;
        static F1: number;
        static F2: number;
        static F3: number;
        static F4: number;
        static F5: number;
        static F6: number;
        static F7: number;
        static F8: number;
        static F9: number;
        static F10: number;
        static F11: number;
        static F12: number;
        static F13: number;
        static F14: number;
        static F15: number;
        static COLON: number;
        static EQUALS: number;
        static UNDERSCORE: number;
        static QUESTION_MARK: number;
        static TILDE: number;
        static OPEN_BRACKET: number;
        static BACKWARD_SLASH: number;
        static CLOSED_BRACKET: number;
        static QUOTES: number;
        static BACKSPACE: number;
        static TAB: number;
        static CLEAR: number;
        static ENTER: number;
        static SHIFT: number;
        static CONTROL: number;
        static ALT: number;
        static CAPS_LOCK: number;
        static ESC: number;
        static SPACEBAR: number;
        static PAGE_UP: number;
        static PAGE_DOWN: number;
        static END: number;
        static HOME: number;
        static LEFT: number;
        static UP: number;
        static RIGHT: number;
        static DOWN: number;
        static INSERT: number;
        static DELETE: number;
        static HELP: number;
        static NUM_LOCK: number;
    }
}
/**
* Phaser - Touch
*
* The Touch class handles touch interactions with the game and the resulting Pointer objects.
* http://www.w3.org/TR/touch-events/
* https://developer.mozilla.org/en-US/docs/DOM/TouchList
* http://www.html5rocks.com/en/mobile/touchandmouse/
* Note: Android 2.x only supports 1 touch event at once, no multi-touch
*/
module Phaser {
    class Touch {
        /**
        * Constructor
        * @param {Game} game.
        * @return {Touch} This object.
        */
        constructor(game: Game);
        /**
        * Local private reference to game.
        * @property _game
        * @type {Phaser.Game}
        * @private
        **/
        private _game;
        /**
        * You can disable all Input by setting disabled = true. While set all new input related events will be ignored.
        * @type {Boolean}
        */
        public disabled: bool;
        /**
        * Custom callback useful for hooking into a 3rd party library. Will be passed the touch event as the only parameter.
        * Callbacks are fired even if this component is disabled and before the event propogation is disabled.
        */
        public callbackContext;
        public touchStartCallback;
        public touchMoveCallback;
        public touchEndCallback;
        public touchEnterCallback;
        public touchLeaveCallback;
        public touchCancelCallback;
        /**
        * Starts the event listeners running
        * @method start
        */
        public start(): void;
        /**
        * Prevent iOS bounce-back (doesn't work?)
        * @method consumeTouchMove
        * @param {Any} event
        **/
        private consumeTouchMove(event);
        /**
        *
        * @method onTouchStart
        * @param {Any} event
        **/
        private onTouchStart(event);
        /**
        * Touch cancel - touches that were disrupted (perhaps by moving into a plugin or browser chrome)
        * Occurs for example on iOS when you put down 4 fingers and the app selector UI appears
        * @method onTouchCancel
        * @param {Any} event
        **/
        private onTouchCancel(event);
        /**
        * For touch enter and leave its a list of the touch points that have entered or left the target
        * Doesn't appear to be supported by most browsers yet
        * @method onTouchEnter
        * @param {Any} event
        **/
        private onTouchEnter(event);
        /**
        * For touch enter and leave its a list of the touch points that have entered or left the target
        * Doesn't appear to be supported by most browsers yet
        * @method onTouchLeave
        * @param {Any} event
        **/
        private onTouchLeave(event);
        /**
        *
        * @method onTouchMove
        * @param {Any} event
        **/
        private onTouchMove(event);
        /**
        *
        * @method onTouchEnd
        * @param {Any} event
        **/
        private onTouchEnd(event);
        /**
        * Stop the event listeners
        * @method stop
        */
        public stop(): void;
    }
}
/**
* Phaser - Input
*
* A game specific Input manager that looks after the mouse, keyboard and touch objects.
* This is updated by the core game loop.
*/
module Phaser {
    class Input {
        constructor(game: Game);
        /**
        * Local private reference to game.
        */
        private _game;
        /**
        * A 1x1 sized canvas used for pixel-perfect checks
        * @type {HTMLCanvasElement}
        */
        public hitCanvas: HTMLCanvasElement;
        /**
        * The context of the 1x1 pixel check canvas
        * @type {CanvasRenderingContext2D}
        */
        public hitContext: CanvasRenderingContext2D;
        /**
        * A vector object representing the previous position of the Pointer.
        * @property vector
        * @type {Vec2}
        **/
        private _oldPosition;
        /**
        * X coordinate of the most recent Pointer event
        * @type {Number}
        * @private
        */
        private _x;
        /**
        * X coordinate of the most recent Pointer event
        * @type {Number}
        * @private
        */
        private _y;
        /**
        * You can disable all Input by setting Input.disabled = true. While set all new input related events will be ignored.
        * If you need to disable just one type of input, for example mouse, use Input.mouse.disabled = true instead
        * @type {Boolean}
        */
        public disabled: bool;
        /**
        * Controls the expected behaviour when using a mouse and touch together on a multi-input device
        */
        public multiInputOverride: number;
        /**
        * Static defining the behaviour expected on a multi-input device system.
        * With this setting when the mouse is used it updates the Input.x/y globals regardless if another pointer is active or not
        */
        static MOUSE_OVERRIDES_TOUCH: number;
        /**
        * Static defining the behaviour expected on a multi-input device system.
        * With this setting when the mouse is used it only updates the Input.x/y globals if no other pointer is active
        */
        static TOUCH_OVERRIDES_MOUSE: number;
        /**
        * Static defining the behaviour expected on a multi-input device system.
        * With this setting when the mouse is used it updates the Input.x/y globals at the same time as any active Pointer objects might
        */
        static MOUSE_TOUCH_COMBINE: number;
        /**
        * The camera being used for mouse and touch based pointers to calculate their world coordinates.
        * @property camera
        * @type {Camera}
        **/
        public camera: Camera;
        /**
        * Phaser.Mouse handler
        * @type {Mouse}
        */
        public mouse: Mouse;
        /**
        * Phaser.Keyboard handler
        * @type {Keyboard}
        */
        public keyboard: Keyboard;
        /**
        * Phaser.Touch handler
        * @type {Touch}
        */
        public touch: Touch;
        /**
        * Phaser.MSPointer handler
        * @type {MSPointer}
        */
        public mspointer: MSPointer;
        /**
        * Phaser.Gestures handler
        * @type {Gestures}
        */
        public gestures: Gestures;
        /**
        * A vector object representing the current position of the Pointer.
        * @property vector
        * @type {Vec2}
        **/
        public position: Vec2;
        /**
        * A vector object representing the speed of the Pointer. Only really useful in single Pointer games,
        * otherwise see the Pointer objects directly.
        * @property vector
        * @type {Vec2}
        **/
        public speed: Vec2;
        /**
        * A Circle object centered on the x/y screen coordinates of the Input.
        * Default size of 44px (Apples recommended "finger tip" size) but can be changed to anything
        * @property circle
        * @type {Circle}
        **/
        public circle: Circle;
        /**
        * The scale by which all input coordinates are multiplied, calculated by the StageScaleMode.
        * In an un-scaled game the values will be x: 1 and y: 1.
        * @type {Vec2}
        */
        public scale: Vec2;
        /**
        * The maximum number of Pointers allowed to be active at any one time.
        * For lots of games it's useful to set this to 1
        * @type {Number}
        */
        public maxPointers: number;
        /**
        * The current number of active Pointers.
        * @type {Number}
        */
        public currentPointers: number;
        /**
        * A Signal dispatched when a mouse/Pointer object is pressed
        * @type {Phaser.Signal}
        */
        public onDown: Signal;
        /**
        * A Signal dispatched when a mouse/Pointer object is released
        * @type {Phaser.Signal}
        */
        public onUp: Signal;
        /**
        * A Signal dispatched when a Pointer object (including the mouse) is tapped: pressed and released quickly.
        * The signal sends 2 parameters. The Pointer that caused it and a boolean depending if the tap was a single tap or a double tap.
        * @type {Phaser.Signal}
        */
        public onTap: Signal;
        /**
        * A Signal dispatched when a Pointer object (including the mouse) is held down
        * @type {Phaser.Signal}
        */
        public onHold: Signal;
        /**
        * The number of milliseconds that the Pointer has to be pressed down and then released to be considered a tap or click
        * @property tapRate
        * @type {Number}
        **/
        public tapRate: number;
        /**
        * The number of milliseconds between taps of the same Pointer for it to be considered a double tap / click
        * @property doubleTapRate
        * @type {Number}
        **/
        public doubleTapRate: number;
        /**
        * The number of milliseconds that the Pointer has to be pressed down for it to fire a onHold event
        * @property holdRate
        * @type {Number}
        **/
        public holdRate: number;
        /**
        * The number of milliseconds below which the Pointer is considered justPressed
        * @property justPressedRate
        * @type {Number}
        **/
        public justPressedRate: number;
        /**
        * The number of milliseconds below which the Pointer is considered justReleased
        * @property justReleasedRate
        * @type {Number}
        **/
        public justReleasedRate: number;
        /**
        * Sets if the Pointer objects should record a history of x/y coordinates they have passed through.
        * The history is cleared each time the Pointer is pressed down.
        * The history is updated at the rate specified in Input.pollRate
        * @property recordPointerHistory
        * @type {Boolean}
        **/
        public recordPointerHistory: bool;
        /**
        * The rate in milliseconds at which the Pointer objects should update their tracking history
        * @property recordRate
        * @type {Number}
        */
        public recordRate: number;
        /**
        * The total number of entries that can be recorded into the Pointer objects tracking history.
        * If the Pointer is tracking one event every 100ms, then a trackLimit of 100 would store the last 10 seconds worth of history.
        * @property recordLimit
        * @type {Number}
        */
        public recordLimit: number;
        /**
        * A Pointer object specifically used by the Mouse
        * @property mousePointer
        * @type {Pointer}
        **/
        public mousePointer: Pointer;
        /**
        * A Pointer object
        * @property pointer1
        * @type {Pointer}
        **/
        public pointer1: Pointer;
        /**
        * A Pointer object
        * @property pointer2
        * @type {Pointer}
        **/
        public pointer2: Pointer;
        /**
        * A Pointer object
        * @property pointer3
        * @type {Pointer}
        **/
        public pointer3: Pointer;
        /**
        * A Pointer object
        * @property pointer4
        * @type {Pointer}
        **/
        public pointer4: Pointer;
        /**
        * A Pointer object
        * @property pointer5
        * @type {Pointer}
        **/
        public pointer5: Pointer;
        /**
        * A Pointer object
        * @property pointer6
        * @type {Pointer}
        **/
        public pointer6: Pointer;
        /**
        * A Pointer object
        * @property pointer7
        * @type {Pointer}
        **/
        public pointer7: Pointer;
        /**
        * A Pointer object
        * @property pointer8
        * @type {Pointer}
        **/
        public pointer8: Pointer;
        /**
        * A Pointer object
        * @property pointer9
        * @type {Pointer}
        **/
        public pointer9: Pointer;
        /**
        * A Pointer object
        * @property pointer10
        * @type {Pointer}
        **/
        public pointer10: Pointer;
        /**
        * The most recently active Pointer object.
        * When you've limited max pointers to 1 this will accurately be either the first finger touched or mouse.
        * @property activePointer
        * @type {Pointer}
        **/
        public activePointer: Pointer;
        public inputObjects: any[];
        public totalTrackedObjects: number;
        /**
        * The X coordinate of the most recently active pointer.
        * This value takes game scaling into account automatically. See Pointer.screenX/clientX for source values.
        * @property x
        * @type {Number}
        **/
        public x : number;
        /**
        * The Y coordinate of the most recently active pointer.
        * This value takes game scaling into account automatically. See Pointer.screenY/clientY for source values.
        * @property y
        * @type {Number}
        **/
        public y : number;
        /**
        * Add a new Pointer object to the Input Manager. By default Input creates 5 pointer objects for you. If you need more
        * use this to create a new one, up to a maximum of 10.
        * @method addPointer
        * @return {Pointer} A reference to the new Pointer object
        **/
        public addPointer(): Pointer;
        /**
        * Starts the Input Manager running
        * @method start
        **/
        public boot(): void;
        /**
        * Adds a new game object to be tracked by the Input Manager. Called by the Sprite.Input component, should not usually be called directly.
        * @method addGameObject
        **/
        public addGameObject(object): void;
        /**
        * Removes a game object from the Input Manager. Called by the Sprite.Input component, should not usually be called directly.
        * @method removeGameObject
        **/
        public removeGameObject(index: number): void;
        /**
        * Updates the Input Manager. Called by the core Game loop.
        * @method update
        **/
        public update(): void;
        /**
        * Reset all of the Pointers and Input states
        * @method reset
        * @param hard {Boolean} A soft reset (hard = false) won't reset any signals that might be bound. A hard reset will.
        **/
        public reset(hard?: bool): void;
        public resetSpeed(x: number, y: number): void;
        /**
        * Get the total number of inactive Pointers
        * @method totalInactivePointers
        * @return {Number} The number of Pointers currently inactive
        **/
        public totalInactivePointers : number;
        /**
        * Recalculates the total number of active Pointers
        * @method totalActivePointers
        * @return {Number} The number of Pointers currently active
        **/
        public totalActivePointers : number;
        /**
        * Find the first free Pointer object and start it, passing in the event data.
        * @method startPointer
        * @param {Any} event The event data from the Touch event
        * @return {Pointer} The Pointer object that was started or null if no Pointer object is available
        **/
        public startPointer(event): Pointer;
        /**
        * Updates the matching Pointer object, passing in the event data.
        * @method updatePointer
        * @param {Any} event The event data from the Touch event
        * @return {Pointer} The Pointer object that was updated or null if no Pointer object is available
        **/
        public updatePointer(event): Pointer;
        /**
        * Stops the matching Pointer object, passing in the event data.
        * @method stopPointer
        * @param {Any} event The event data from the Touch event
        * @return {Pointer} The Pointer object that was stopped or null if no Pointer object is available
        **/
        public stopPointer(event): Pointer;
        /**
        * Get the next Pointer object whos active property matches the given state
        * @method getPointer
        * @param {Boolean} state The state the Pointer should be in (false for inactive, true for active)
        * @return {Pointer} A Pointer object or null if no Pointer object matches the requested state.
        **/
        public getPointer(state?: bool): Pointer;
        /**
        * Get the Pointer object whos identified property matches the given identifier value
        * @method getPointerFromIdentifier
        * @param {Number} identifier The Pointer.identifier value to search for
        * @return {Pointer} A Pointer object or null if no Pointer object matches the requested identifier.
        **/
        public getPointerFromIdentifier(identifier: number): Pointer;
        /**
        * @param {Camera} [camera]
        */
        public getWorldX(camera?: Camera): number;
        /**
        * @param {Camera} [camera]
        */
        public getWorldY(camera?: Camera): number;
        /**
        * @param {Number} x
        * @param {Number} y
        * @param {String} [color]
        */
        public renderDebugInfo(x: number, y: number, color?: string): void;
        /**
        * Get the distance between two Pointer objects
        * @method getDistance
        * @param {Pointer} pointer1
        * @param {Pointer} pointer2
        **/
        public getDistance(pointer1: Pointer, pointer2: Pointer): number;
        /**
        * Get the angle between two Pointer objects
        * @method getAngle
        * @param {Pointer} pointer1
        * @param {Pointer} pointer2
        **/
        public getAngle(pointer1: Pointer, pointer2: Pointer): number;
        public pixelPerfectCheck(sprite: Sprite, pointer: Pointer, alpha?: number): bool;
    }
}
module Phaser {
    interface IRenderer {
        render();
        renderGameObject(object);
        renderSprite(camera: Camera, sprite: Sprite): bool;
        renderScrollZone(camera: Camera, sprite: ScrollZone): bool;
        renderCircle(camera: Camera, circle: Circle, context, outline?: bool, fill?: bool, lineColor?: string, fillColor?: string, lineWidth?: number);
        preRenderGroup(camera: Camera, group: Group);
        postRenderGroup(camera: Camera, group: Group);
        preRenderCamera(camera: Camera);
        postRenderCamera(camera: Camera);
        inCamera(camera: Camera, sprite: Sprite): bool;
    }
}
module Phaser {
    class HeadlessRenderer implements IRenderer {
        constructor(game: Game);
        private _game;
        public render(): void;
        public inCamera(camera: Camera, sprite: Sprite): bool;
        public renderGameObject(object): void;
        public renderSprite(camera: Camera, sprite: Sprite): bool;
        public renderScrollZone(camera: Camera, scrollZone: ScrollZone): bool;
        public renderCircle(camera: Camera, circle: Circle, context, outline?: bool, fill?: bool, lineColor?: string, fillColor?: string, lineWidth?: number): bool;
        public preRenderCamera(camera: Camera): void;
        public postRenderCamera(camera: Camera): void;
        public preRenderGroup(camera: Camera, group: Group): void;
        public postRenderGroup(camera: Camera, group: Group): void;
    }
}
module Phaser {
    class CanvasRenderer implements IRenderer {
        constructor(game: Game);
        /**
        * The essential reference to the main game object
        */
        private _game;
        private _ga;
        private _sx;
        private _sy;
        private _sw;
        private _sh;
        private _dx;
        private _dy;
        private _dw;
        private _dh;
        private _fx;
        private _fy;
        private _tx;
        private _ty;
        private _sin;
        private _cos;
        private _maxX;
        private _maxY;
        private _startX;
        private _startY;
        private _columnData;
        private _cameraList;
        private _camera;
        private _groupLength;
        private _count;
        public renderTotal: number;
        public render(): void;
        public renderGameObject(object): void;
        public preRenderGroup(camera: Camera, group: Group): bool;
        public postRenderGroup(camera: Camera, group: Group): void;
        /**
        * Check whether this object is visible in a specific camera Rectangle.
        * @param camera {Rectangle} The Rectangle you want to check.
        * @return {boolean} Return true if bounds of this sprite intersects the given Rectangle, otherwise return false.
        */
        public inCamera(camera: Camera, sprite: Sprite): bool;
        public inScreen(camera: Camera): bool;
        /**
        * Render this sprite to specific camera. Called by game loop after update().
        * @param camera {Camera} Camera this sprite will be rendered to.
        * @return {boolean} Return false if not rendered, otherwise return true.
        */
        public preRenderCamera(camera: Camera): bool;
        public postRenderCamera(camera: Camera): void;
        public renderCircle(camera: Camera, circle: Circle, context, outline?: bool, fill?: bool, lineColor?: string, fillColor?: string, lineWidth?: number): bool;
        /**
        * Render this sprite to specific camera. Called by game loop after update().
        * @param camera {Camera} Camera this sprite will be rendered to.
        * @return {boolean} Return false if not rendered, otherwise return true.
        */
        public renderSprite(camera: Camera, sprite: Sprite): bool;
        public renderScrollZone(camera: Camera, scrollZone: ScrollZone): bool;
        /**
        * Render a tilemap to a specific camera.
        * @param camera {Camera} The camera this tilemap will be rendered to.
        */
        public renderTilemap(camera: Camera, tilemap: Tilemap): bool;
    }
}
/**
* Phaser - DebugUtils
*
* A collection of methods for displaying debug information about game objects.
*/
module Phaser {
    class DebugUtils {
        static game: Game;
        /**
        * Render context of stage's canvas.
        * @type {CanvasRenderingContext2D}
        */
        static context: CanvasRenderingContext2D;
        /**
        * Render debug infos. (including name, bounds info, position and some other properties)
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        static renderSpriteInfo(sprite: Sprite, x: number, y: number, color?: string): void;
        static renderSpriteBounds(sprite: Sprite, camera?: Camera, color?: string): void;
        static renderRectangle(rect: Rectangle, fillStyle?: string): void;
        static renderCircle(circle: Circle, fillStyle?: string): void;
        /**
        * Render text
        * @param x {number} X position of the debug info to be rendered.
        * @param y {number} Y position of the debug info to be rendered.
        * @param [color] {number} color of the debug info to be rendered. (format is css color string)
        */
        static renderText(text: string, x: number, y: number, color?: string): void;
    }
}
/**
* Phaser - Game
*
* This is where the magic happens. The Game object is the heart of your game,
* providing quick access to common functions and handling the boot process.
*
* "Hell, there are no rules here - we're trying to accomplish something."
*                                                       Thomas A. Edison
*/
module Phaser {
    class Game {
        /**
        * Game constructor
        *
        * Instantiate a new <code>Phaser.Game</code> object.
        *
        * @param callbackContext Which context will the callbacks be called with.
        * @param parent {string} ID of its parent DOM element.
        * @param width {number} The width of your game in game pixels.
        * @param height {number} The height of your game in game pixels.
        * @param initCallback {function} Init callback invoked when init default screen.
        * @param createCallback {function} Create callback invoked when create default screen.
        * @param updateCallback {function} Update callback invoked when update default screen.
        * @param renderCallback {function} Render callback invoked when render default screen.
        * @param destroyCallback {function} Destroy callback invoked when state is destroyed.
        */
        constructor(callbackContext, parent?: string, width?: number, height?: number, initCallback?, createCallback?, updateCallback?, renderCallback?, destroyCallback?);
        /**
        * Game loop trigger wrapper.
        */
        public _raf: RequestAnimationFrame;
        /**
        * Milliseconds of time per step of the game loop.
        * @type {number}
        */
        private _step;
        /**
        * Whether load complete loading or not.
        * @type {boolean}
        */
        private _loadComplete;
        /**
        * Game is paused?
        * @type {boolean}
        */
        private _paused;
        /**
        * The state to be switched to in the next frame.
        * @type {State}
        */
        private _pendingState;
        /**
        * The current State object (defaults to null)
        * @type {State}
        */
        public state;
        /**
        * Context for calling the callbacks.
        */
        public callbackContext;
        /**
        * This will be called when init states. (loading assets...)
        * @type {function}
        */
        public onInitCallback;
        /**
        * This will be called when create states. (setup states...)
        * @type {function}
        */
        public onCreateCallback;
        /**
        * This will be called when State is updated, this doesn't happen during load (see onLoadUpdateCallback)
        * @type {function}
        */
        public onUpdateCallback;
        /**
        * This will be called when the State is rendered, this doesn't happen during load (see onLoadRenderCallback)
        * @type {function}
        */
        public onRenderCallback;
        /**
        * This will be called before the State is rendered and before the stage is cleared
        * @type {function}
        */
        public onPreRenderCallback;
        /**
        * This will be called when the State is updated but only during the load process
        * @type {function}
        */
        public onLoadUpdateCallback;
        /**
        * This will be called when the State is rendered but only during the load process
        * @type {function}
        */
        public onLoadRenderCallback;
        /**
        * This will be called when states paused.
        * @type {function}
        */
        public onPausedCallback;
        /**
        * This will be called when the state is destroyed (i.e. swapping to a new state)
        * @type {function}
        */
        public onDestroyCallback;
        /**
        * Reference to the GameObject Factory.
        * @type {GameObjectFactory}
        */
        public add: GameObjectFactory;
        /**
        * Reference to the assets cache.
        * @type {Cache}
        */
        public cache: Cache;
        /**
        * Reference to the input manager
        * @type {Input}
        */
        public input: Input;
        /**
        * Reference to the assets loader.
        * @type {Loader}
        */
        public load: Loader;
        /**
        * Reference to the math helper.
        * @type {GameMath}
        */
        public math: GameMath;
        /**
        * Reference to the network class.
        * @type {Net}
        */
        public net: Net;
        /**
        * Reference to the sound manager.
        * @type {SoundManager}
        */
        public sound: SoundManager;
        /**
        * Reference to the stage.
        * @type {Stage}
        */
        public stage: Stage;
        /**
        * Reference to game clock.
        * @type {Time}
        */
        public time: Time;
        /**
        * Reference to the tween manager.
        * @type {TweenManager}
        */
        public tweens: TweenManager;
        /**
        * Reference to the world.
        * @type {World}
        */
        public world: World;
        /**
        * Reference to the physics manager.
        * @type {Physics.Manager}
        */
        public physics: Physics.Manager;
        /**
        * Instance of repeatable random data generator helper.
        * @type {RandomDataGenerator}
        */
        public rnd: RandomDataGenerator;
        /**
        * Contains device information and capabilities.
        * @type {Device}
        */
        public device: Device;
        /**
        * Reference to the render manager
        * @type {RenderManager}
        */
        public renderer: IRenderer;
        /**
        * Whether the game engine is booted, aka available.
        * @type {boolean}
        */
        public isBooted: bool;
        /**
        * Is game running or paused?
        * @type {boolean}
        */
        public isRunning: bool;
        /**
        * Initialize engine sub modules and start the game.
        * @param parent {string} ID of parent Dom element.
        * @param width {number} Width of the game screen.
        * @param height {number} Height of the game screen.
        */
        private boot(parent, width, height);
        public setRenderer(type: number): void;
        /**
        * Called when the load has finished after init was run.
        */
        private loadComplete();
        /**
        * The bootLoop is called while the game is still booting (waiting for the DOM and resources to be available)
        */
        private bootLoop();
        /**
        * The pausedLoop is called when the game is paused.
        */
        private pausedLoop();
        /**
        * Game loop method will be called when it's running.
        */
        private loop();
        /**
        * Start current state.
        */
        private startState();
        /**
        * Set the most common state callbacks (init, create, update, render).
        * @param initCallback {function} Init callback invoked when init state.
        * @param createCallback {function} Create callback invoked when create state.
        * @param updateCallback {function} Update callback invoked when update state.
        * @param renderCallback {function} Render callback invoked when render state.
        * @param destroyCallback {function} Destroy callback invoked when state is destroyed.
        */
        public setCallbacks(initCallback?, createCallback?, updateCallback?, renderCallback?, destroyCallback?): void;
        /**
        * Switch to a new State.
        * @param state {State} The state you want to switch to.
        * @param [clearWorld] {boolean} clear everything in the world? (Default to true)
        * @param [clearCache] {boolean} clear asset cache? (Default to false and ONLY available when clearWorld=true)
        */
        public switchState(state, clearWorld?: bool, clearCache?: bool): void;
        /**
        * Nuke the entire game from orbit
        */
        public destroy(): void;
        public paused : bool;
        /**
        * Checks for overlaps between two objects using the world QuadTree. Can be GameObject vs. GameObject, GameObject vs. Group or Group vs. Group.
        * Note: Does not take the objects scrollFactor into account. All overlaps are check in world space.
        * @param object1 The first GameObject or Group to check. If null the world.group is used.
        * @param object2 The second GameObject or Group to check.
        * @param notifyCallback A callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you passed them to Collision.overlap.
        * @param processCallback A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then notifyCallback will only be called if processCallback returns true.
        * @param context The context in which the callbacks will be called
        * @returns {boolean} true if the objects overlap, otherwise false.
        */
        public collide(objectOrGroup1?, objectOrGroup2?, notifyCallback?, context?): bool;
        public camera : Camera;
    }
}
/**
* Phaser - Components - Debug
*
*
*/
module Phaser.Components {
    class Debug {
        /**
        * Render bound of this sprite for debugging? (default to false)
        * @type {boolean}
        */
        public renderDebug: bool;
        /**
        * Color of the Sprite when no image is present. Format is a css color string.
        * @type {string}
        */
        public fillColor: string;
        /**
        * Color of bound when render debug. (see renderDebug) Format is a css color string.
        * @type {string}
        */
        public renderDebugColor: string;
        /**
        * Color of points when render debug. (see renderDebug) Format is a css color string.
        * @type {string}
        */
        public renderDebugPointColor: string;
    }
}
/**
* Phaser - Line
*
* A Line object is an infinte line through space. The two sets of x/y coordinates define the Line Segment.
*/
module Phaser {
    class Line {
        /**
        *
        * @constructor
        * @param {Number} x1
        * @param {Number} y1
        * @param {Number} x2
        * @param {Number} y2
        * @return {Phaser.Line} This Object
        */
        constructor(x1?: number, y1?: number, x2?: number, y2?: number);
        /**
        *
        * @property x1
        * @type {Number}
        */
        public x1: number;
        /**
        *
        * @property y1
        * @type {Number}
        */
        public y1: number;
        /**
        *
        * @property x2
        * @type {Number}
        */
        public x2: number;
        /**
        *
        * @property y2
        * @type {Number}
        */
        public y2: number;
        /**
        *
        * @method clone
        * @param {Phaser.Line} [output]
        * @return {Phaser.Line}
        */
        public clone(output?: Line): Line;
        /**
        *
        * @method copyFrom
        * @param {Phaser.Line} source
        * @return {Phaser.Line}
        */
        public copyFrom(source: Line): Line;
        /**
        *
        * @method copyTo
        * @param {Phaser.Line} target
        * @return {Phaser.Line}
        */
        public copyTo(target: Line): Line;
        /**
        *
        * @method setTo
        * @param {Number} x1
        * @param {Number} y1
        * @param {Number} x2
        * @param {Number} y2
        * @return {Phaser.Line}
        */
        public setTo(x1?: number, y1?: number, x2?: number, y2?: number): Line;
        public width : number;
        public height : number;
        /**
        *
        * @method length
        * @return {Number}
        */
        public length : number;
        /**
        *
        * @method getY
        * @param {Number} x
        * @return {Number}
        */
        public getY(x: number): number;
        /**
        *
        * @method angle
        * @return {Number}
        */
        public angle : number;
        /**
        *
        * @method slope
        * @return {Number}
        */
        public slope : number;
        /**
        *
        * @method perpSlope
        * @return {Number}
        */
        public perpSlope : number;
        /**
        *
        * @method yIntercept
        * @return {Number}
        */
        public yIntercept : number;
        /**
        *
        * @method isPointOnLine
        * @param {Number} x
        * @param {Number} y
        * @return {Boolean}
        */
        public isPointOnLine(x: number, y: number): bool;
        /**
        *
        * @method isPointOnLineSegment
        * @param {Number} x
        * @param {Number} y
        * @return {Boolean}
        */
        public isPointOnLineSegment(x: number, y: number): bool;
        /**
        *
        * @method intersectLineLine
        * @param {Any} line
        * @return {Any}
        */
        public intersectLineLine(line): any;
        /**
        *
        * @method perp
        * @param {Number} x
        * @param {Number} y
        * @param {Phaser.Line} [output]
        * @return {Phaser.Line}
        */
        public perp(x: number, y: number, output?: Line): Line;
        /**
        *
        * @method toString
        * @return {String}
        */
        public toString(): string;
    }
}
/**
* Phaser - Mat3Utils
*
* A collection of methods useful for manipulating and performing operations on Mat3 objects.
*
*/
module Phaser {
    class Mat3Utils {
        /**
        * Transpose the values of a Mat3
        **/
        static transpose(source: Mat3, dest?: Mat3): Mat3;
        /**
        * Inverts a Mat3
        **/
        static invert(source: Mat3): Mat3;
        /**
        * Calculates the adjugate of a Mat3
        **/
        static adjoint(source: Mat3): Mat3;
        /**
        * Calculates the adjugate of a Mat3
        **/
        static determinant(source: Mat3): number;
        /**
        * Multiplies two Mat3s
        **/
        static multiply(source: Mat3, b: Mat3): Mat3;
        static fromQuaternion(): void;
        static normalFromMat4(): void;
    }
}
/**
* Phaser - 2D Transform
*
* A 2D Transform
*/
module Phaser {
    class Transform {
        /**
        * Creates a new 2D Transform object.
        * @class Transform
        * @constructor
        * @return {Transform} This object
        **/
        constructor(pos: Vec2, angle: number);
        public t: Vec2;
        public c: number;
        public s: number;
        public angle: number;
        public toString(): string;
        public setTo(pos: Vec2, angle: number): Transform;
        public setRotation(angle: number): Transform;
        public setPosition(p: Vec2): Transform;
        public identity(): Transform;
    }
}
/**
* Phaser - TransformUtils
*
* A collection of methods useful for manipulating and performing operations on 2D Transforms.
*
*/
module Phaser {
    class TransformUtils {
        static rotate(t: Transform, v: Vec2, out?: Vec2): Vec2;
        static unrotate(t: Transform, v: Vec2, out?: Vec2): Vec2;
        static transform(t: Transform, v: Vec2, out?: Vec2): Vec2;
        static untransform(t: Transform, v: Vec2, out?: Vec2): Vec2;
    }
}
/**
* Phaser - Motion
*
* The Motion class contains lots of useful functions for moving game objects around in world space.
*/
module Phaser {
    class Motion {
        constructor(game: Game);
        public game: Game;
        /**
        * Given the angle and speed calculate the velocity and return it as a Point
        *
        * @param {number} angle The angle (in degrees) calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        * @param {number} speed The speed it will move, in pixels per second sq
        *
        * @return {Point} A Point where Point.x contains the velocity x value and Point.y contains the velocity y value
        */
        public velocityFromAngle(angle: number, speed: number): Point;
        /**
        * Sets the source Sprite x/y velocity so it will move directly towards the destination Sprite at the speed given (in pixels per second)<br>
        * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
        * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
        * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
        * If you need the object to accelerate, see accelerateTowardsObject() instead
        * Note: Doesn't take into account acceleration, maxVelocity or drag (if you set drag or acceleration too high this object may not move at all)
        *
        * @param {Sprite} source The Sprite on which the velocity will be set
        * @param {Sprite} dest The Sprite where the source object will move to
        * @param {number} speed The speed it will move, in pixels per second (default is 60 pixels/sec)
        * @param {number} maxTime Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
        */
        public moveTowardsObject(source: Sprite, dest: Sprite, speed?: number, maxTime?: number): void;
        /**
        * Sets the x/y acceleration on the source Sprite so it will move towards the destination Sprite at the speed given (in pixels per second)<br>
        * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
        * If you don't need acceleration look at moveTowardsObject() instead.
        *
        * @param {Sprite} source The Sprite on which the acceleration will be set
        * @param {Sprite} dest The Sprite where the source object will move towards
        * @param {number} speed The speed it will accelerate in pixels per second
        * @param {number} xSpeedMax The maximum speed in pixels per second in which the sprite can move horizontally
        * @param {number} ySpeedMax The maximum speed in pixels per second in which the sprite can move vertically
        */
        public accelerateTowardsObject(source: Sprite, dest: Sprite, speed: number, xSpeedMax: number, ySpeedMax: number): void;
        /**
        * Move the given Sprite towards the mouse pointer coordinates at a steady velocity
        * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
        * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
        * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
        *
        * @param {Sprite} source The Sprite to move
        * @param {number} speed The speed it will move, in pixels per second (default is 60 pixels/sec)
        * @param {number} maxTime Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
        */
        public moveTowardsMouse(source: Sprite, speed?: number, maxTime?: number): void;
        /**
        * Sets the x/y acceleration on the source Sprite so it will move towards the mouse coordinates at the speed given (in pixels per second)<br>
        * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
        * If you don't need acceleration look at moveTowardsMouse() instead.
        *
        * @param {Sprite} source The Sprite on which the acceleration will be set
        * @param {number} speed The speed it will accelerate in pixels per second
        * @param {number} xSpeedMax The maximum speed in pixels per second in which the sprite can move horizontally
        * @param {number} ySpeedMax The maximum speed in pixels per second in which the sprite can move vertically
        */
        public accelerateTowardsMouse(source: Sprite, speed: number, xSpeedMax: number, ySpeedMax: number): void;
        /**
        * Sets the x/y velocity on the source Sprite so it will move towards the target coordinates at the speed given (in pixels per second)<br>
        * If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
        * Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
        * The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
        *
        * @param {Sprite} source The Sprite to move
        * @param {Point} target The Point coordinates to move the source Sprite towards
        * @param {number} speed The speed it will move, in pixels per second (default is 60 pixels/sec)
        * @param {number} maxTime Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
        */
        public moveTowardsPoint(source: Sprite, target: Point, speed?: number, maxTime?: number): void;
        /**
        * Sets the x/y acceleration on the source Sprite so it will move towards the target coordinates at the speed given (in pixels per second)<br>
        * You must give a maximum speed value, beyond which the Sprite won't go any faster.<br>
        * If you don't need acceleration look at moveTowardsPoint() instead.
        *
        * @param {Sprite} source The Sprite on which the acceleration will be set
        * @param {Point} target The Point coordinates to move the source Sprite towards
        * @param {number} speed The speed it will accelerate in pixels per second
        * @param {number} xSpeedMax The maximum speed in pixels per second in which the sprite can move horizontally
        * @param {number} ySpeedMax The maximum speed in pixels per second in which the sprite can move vertically
        */
        public accelerateTowardsPoint(source: Sprite, target: Point, speed: number, xSpeedMax: number, ySpeedMax: number): void;
        /**
        * Find the distance between two Sprites, taking their origin into account
        *
        * @param {Sprite} a The first Sprite
        * @param {Sprite} b The second Sprite
        * @return {number} int Distance (in pixels)
        */
        public distanceBetween(a: Sprite, b: Sprite): number;
        /**
        * Find the distance from an Sprite to the given Point, taking the source origin into account
        *
        * @param {Sprite} a The Sprite
        * @param {Point} target The Point
        * @return {number} Distance (in pixels)
        */
        public distanceToPoint(a: Sprite, target: Point): number;
        /**
        * Find the distance (in pixels, rounded) from the object x/y and the mouse x/y
        *
        * @param {Sprite} a  Sprite to test against
        * @return {number} The distance between the given sprite and the mouse coordinates
        */
        public distanceToMouse(a: Sprite): number;
        /**
        * Find the angle (in radians) between an Sprite and an Point. The source sprite takes its x/y and origin into account.
        * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        *
        * @param {Sprite} a The Sprite to test from
        * @param {Point} target The Point to angle the Sprite towards
        * @param {boolean} asDegrees If you need the value in degrees instead of radians, set to true
        *
        * @return {number} The angle (in radians unless asDegrees is true)
        */
        public angleBetweenPoint(a: Sprite, target: Point, asDegrees?: bool): number;
        /**
        * Find the angle (in radians) between the two Sprite, taking their x/y and origin into account.
        * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        *
        * @param {Sprite} a The Sprite to test from
        * @param {Sprite} b The Sprite to test to
        * @param {boolean} asDegrees If you need the value in degrees instead of radians, set to true
        *
        * @return {number} The angle (in radians unless asDegrees is true)
        */
        public angleBetween(a: Sprite, b: Sprite, asDegrees?: bool): number;
        /**
        * Given the Sprite and speed calculate the velocity and return it as an Point based on the direction the sprite is facing
        *
        * @param {Sprite} parent The Sprite to get the facing value from
        * @param {number} speed The speed it will move, in pixels per second sq
        *
        * @return {Point} An Point where Point.x contains the velocity x value and Point.y contains the velocity y value
        */
        public velocityFromFacing(parent: Sprite, speed: number): Point;
        /**
        * Find the angle (in radians) between an Sprite and the mouse, taking their x/y and origin into account.
        * The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
        *
        * @param {Sprite} a The Object to test from
        * @param {boolean} asDegrees If you need the value in degrees instead of radians, set to true
        *
        * @return {number} The angle (in radians unless asDegrees is true)
        */
        public angleBetweenMouse(a: Sprite, asDegrees?: bool): number;
    }
}
/**
* Phaser - PixelUtils
*
* A collection of methods useful for manipulating pixels.
*/
module Phaser {
    class PixelUtils {
        static boot(): void;
        /**
        * Canvas element used in 1x1 pixel checks.
        * @type {HTMLCanvasElement}
        */
        static pixelCanvas: HTMLCanvasElement;
        /**
        * Render context of pixelCanvas
        * @type {CanvasRenderingContext2D}
        */
        static pixelContext: CanvasRenderingContext2D;
        static getPixel(key: string, x: number, y: number): number;
    }
}
/**
* Phaser - IntersectResult
*
* A light-weight result object to hold the results of an intersection. For when you need more than just true/false.
*/
module Phaser {
    class IntersectResult {
        /**
        * Did they intersect or not?
        * @property result
        * @type {Boolean}
        */
        public result: bool;
        /**
        * @property x
        * @type {Number}
        */
        public x: number;
        /**
        * @property y
        * @type {Number}
        */
        public y: number;
        /**
        * @property x1
        * @type {Number}
        */
        public x1: number;
        /**
        * @property y1
        * @type {Number}
        */
        public y1: number;
        /**
        * @property x2
        * @type {Number}
        */
        public x2: number;
        /**
        * @property y2
        * @type {Number}
        */
        public y2: number;
        /**
        * @property width
        * @type {Number}
        */
        public width: number;
        /**
        * @property height
        * @type {Number}
        */
        public height: number;
        /**
        *
        * @method setTo
        * @param {Number} x1
        * @param {Number} y1
        * @param {Number} [x2]
        * @param {Number} [y2]
        * @param {Number} [width]
        * @param {Number} [height]
        */
        public setTo(x1: number, y1: number, x2?: number, y2?: number, width?: number, height?: number): void;
    }
}
/**
* Phaser - State
*
* This is a base State class which can be extended if you are creating your game using TypeScript.
*/
module Phaser {
    class State {
        /**
        * State constructor
        * Create a new <code>State</code>.
        */
        constructor(game: Game);
        /**
        * Reference to Game.
        */
        public game: Game;
        /**
        * Currently used camera.
        * @type {Camera}
        */
        public camera: Camera;
        /**
        * Reference to the assets cache.
        * @type {Cache}
        */
        public cache: Cache;
        /**
        * Reference to the GameObject Factory.
        * @type {GameObjectFactory}
        */
        public add: GameObjectFactory;
        /**
        * Reference to the input manager
        * @type {Input}
        */
        public input: Input;
        /**
        * Reference to the assets loader.
        * @type {Loader}
        */
        public load: Loader;
        /**
        * Reference to the math helper.
        * @type {GameMath}
        */
        public math: GameMath;
        /**
        * Reference to the sound manager.
        * @type {SoundManager}
        */
        public sound: SoundManager;
        /**
        * Reference to the stage.
        * @type {Stage}
        */
        public stage: Stage;
        /**
        * Reference to game clock.
        * @type {Time}
        */
        public time: Time;
        /**
        * Reference to the tween manager.
        * @type {TweenManager}
        */
        public tweens: TweenManager;
        /**
        * Reference to the world.
        * @type {World}
        */
        public world: World;
        /**
        * Override this method to add some load operations.
        * If you need to use the loader, you may need to use them here.
        */
        public init(): void;
        /**
        * This method is called after the game engine successfully switches states.
        * Feel free to add any setup code here.(Do not load anything here, override init() instead)
        */
        public create(): void;
        /**
        * Put update logic here.
        */
        public update(): void;
        /**
        * Put render operations here.
        */
        public render(): void;
        /**
        * This method will be called when game paused.
        */
        public paused(): void;
        /**
        * This method will be called when the state is destroyed
        */
        public destroy(): void;
    }
}
