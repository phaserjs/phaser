module Phaser {

    /**
    * Constants used to define game object types (faster than doing typeof object checks in core loops)
    */
    export class Types {

        static RENDERER_AUTO_DETECT: number = 0;
        static RENDERER_HEADLESS: number = 1;
        static RENDERER_CANVAS: number = 2;
        static RENDERER_WEBGL: number = 3;

        static GROUP: number = 0;
        static SPRITE: number = 1;
        static GEOMSPRITE: number = 2;
        static PARTICLE: number = 3;
        static EMITTER: number = 4;
        static TILEMAP: number = 5;
        static SCROLLZONE: number = 6;

        static GEOM_POINT: number = 0;
        static GEOM_CIRCLE: number = 1;
        static GEOM_Rectangle: number = 2;
        static GEOM_LINE: number = 3;
        static GEOM_POLYGON: number = 4;

        static BODY_DISABLED: number = 0;
        static BODY_DYNAMIC: number = 1;
        static BODY_STATIC: number = 2;
        static BODY_KINEMATIC: number = 3;

        /**
         * Flag used to allow GameObjects to collide on their left side
         * @type {number}
         */
        static LEFT: number = 0x0001;

        /**
         * Flag used to allow GameObjects to collide on their right side
         * @type {number}
         */
        static RIGHT: number = 0x0010;

        /**
         * Flag used to allow GameObjects to collide on their top side
         * @type {number}
         */
        static UP: number = 0x0100;

        /**
         * Flag used to allow GameObjects to collide on their bottom side
         * @type {number}
         */
        static DOWN: number = 0x1000;

        /**
         * Flag used with GameObjects to disable collision
         * @type {number}
         */
        static NONE: number = 0;

        /**
         * Flag used to allow GameObjects to collide with a ceiling
         * @type {number}
         */
        static CEILING: number = Types.UP;

        /**
         * Flag used to allow GameObjects to collide with a floor
         * @type {number}
         */
        static FLOOR: number = Types.DOWN;

        /**
         * Flag used to allow GameObjects to collide with a wall (same as LEFT+RIGHT)
         * @type {number}
         */
        static WALL: number = Types.LEFT | Types.RIGHT;

        /**
         * Flag used to allow GameObjects to collide on any face
         * @type {number}
         */
        static ANY: number = Types.LEFT | Types.RIGHT | Types.UP | Types.DOWN;

    }

}
