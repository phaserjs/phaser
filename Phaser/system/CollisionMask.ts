/// <reference path="../Game.ts" />

/**
* Phaser - CollisionMask
*/

module Phaser {

    export class CollisionMask {

        /**
         * CollisionMask constructor. Creates a new <code>CollisionMask</code> for the given GameObject.
         *
         * @param game {Phaser.Game} Current game instance.
         * @param parent {Phaser.GameObject} The GameObject this CollisionMask belongs to.
         * @param x {number} The initial x position of the CollisionMask.
         * @param y {number} The initial y position of the CollisionMask.
         * @param width {number} The width of the CollisionMask.
         * @param height {number} The height of the CollisionMask.
         */
        constructor(game: Game, parent: GameObject, x: number, y: number, width: number, height: number) {

            this._game = game;
            this._parent = parent;

            //  By default the CollisionMask is a quad
            this.type = CollisionMask.QUAD;

            this.quad = new Phaser.Quad(this._parent.x, this._parent.y, this._parent.width, this._parent.height);
            this.offset = new MicroPoint(0, 0);

            return this;

        }

        private _game;
        private _parent;

        /**
         * Geom type of this sprite. (available: UNASSIGNED, CIRCLE, LINE, POINT, RECTANGLE)
         * @type {number}
         */
        public type: number = 0;

        /**
         * Quad (a smaller version of Rectangle).
         * @type {number}
         */
        public static QUAD: number = 0;

        /**
         * Point.
         * @type {number}
         */
        public static POINT: number = 1;

        /**
         * Circle.
         * @type {number}
         */
        public static CIRCLE: number = 2;

        /**
         * Line.
         * @type {number}
         */
        public static LINE: number = 3;

        /**
         * Rectangle.
         * @type {number}
         */
        public static RECTANGLE: number = 4;

        /**
         * Polygon.
         * @type {number}
         */
        public static POLYGON: number = 5;

        /**
         * Rectangle shape container. A Rectangle instance.
         * @type {Rectangle}
         */
        public quad: Quad;

        /**
         * Point shape container. A Point instance.
         * @type {Point}
         */
        public point: Point;

        /**
         * Circle shape container. A Circle instance.
         * @type {Circle}
         */
        public circle: Circle;

        /**
         * Line shape container. A Line instance.
         * @type {Line}
         */
        public line: Line;

        /**
         * Rectangle shape container. A Rectangle instance.
         * @type {Rectangle}
         */
        public rect: Rectangle;

        /**
        * A value from the top-left of the GameObject frame that this collisionMask is offset to.
        * If the CollisionMask is a Quad/Rectangle the offset relates to the top-left of that Quad.
        * If the CollisionMask is a Circle the offset relates to the center of the circle.
        * @type {MicroPoint}
        */
        public offset: MicroPoint;



        public update() {

        }












        /**
         * Destroy all objects and references belonging to this CollisionMask
         */
        public destroy() {

            this._game = null;
            this._parent = null;
            this.quad = null;
            this.point = null;
            this.circle = null;
            this.rect = null;
            this.line = null;
            this.offset = null;

        }




    }

}