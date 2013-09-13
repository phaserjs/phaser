/// <reference path="_definitions.ts" />

/**
 * Types
 *
 * This file contains all constants used through-out Phaser.
 *
 * @package    Phaser.Types
 * @author     Richard Davey <rich@photonstorm.com>
 * @copyright  2013 Photon Storm Ltd.
 * @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
 */

module Phaser {

    export class Types {

        static RENDERER_AUTO_DETECT: number = 0;
        static RENDERER_HEADLESS: number = 1;
        static RENDERER_CANVAS: number = 2;
        static RENDERER_WEBGL: number = 3;

        static CAMERA_TYPE_ORTHOGRAPHIC: number = 0;
        static CAMERA_TYPE_ISOMETRIC: number = 1;

        /**
         * Camera "follow" style preset: camera has no deadzone, just tracks the focus object directly.
         * @type {number}
         */
        public static CAMERA_FOLLOW_LOCKON: number = 0;

        /**
         * Camera "follow" style preset: camera deadzone is narrow but tall.
         * @type {number}
         */
        public static CAMERA_FOLLOW_PLATFORMER: number = 1;

        /**
         * Camera "follow" style preset: camera deadzone is a medium-size square around the focus object.
         * @type {number}
         */
        public static CAMERA_FOLLOW_TOPDOWN: number = 2;

        /**
         * Camera "follow" style preset: camera deadzone is a small square around the focus object.
         * @type {number}
         */
        public static CAMERA_FOLLOW_TOPDOWN_TIGHT: number = 3;

        static GROUP: number = 0;
        static SPRITE: number = 1;
        static GEOMSPRITE: number = 2;
        static PARTICLE: number = 3;
        static EMITTER: number = 4;
        static TILEMAP: number = 5;
        static SCROLLZONE: number = 6;
        static BUTTON: number = 7;
        static DYNAMICTEXTURE: number = 8;

        static GEOM_POINT: number = 0;
        static GEOM_CIRCLE: number = 1;
        static GEOM_RECTANGLE: number = 2;
        static GEOM_LINE: number = 3;
        static GEOM_POLYGON: number = 4;

        static BODY_DISABLED: number = 0;
        static BODY_STATIC: number = 1;
        static BODY_KINETIC: number = 2;
        static BODY_DYNAMIC: number = 3;

        static OUT_OF_BOUNDS_KILL: number = 0;
        static OUT_OF_BOUNDS_DESTROY: number = 1;
        static OUT_OF_BOUNDS_PERSIST: number = 2;

        /**
         * Use with <code>sort()</code> to sort in ascending order.
         */
        static SORT_ASCENDING: number = -1;

        /**
         * Use with <code>sort()</code> to sort in descending order.
         */
        static SORT_DESCENDING: number = 1;

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
        static CEILING: number = 0x0100;

        /**
         * Flag used to allow GameObjects to collide with a floor
         * @type {number}
         */
        static FLOOR: number = 0x1000;

        /**
         * Flag used to allow GameObjects to collide with a wall (same as LEFT+RIGHT)
         * @type {number}
         */
        static WALL: number = 0x0001 | 0x0010;

        /**
         * Flag used to allow GameObjects to collide on any face
         * @type {number}
         */
        static ANY: number = 0x0001 | 0x0010 | 0x0100 | 0x1000;

    }

}
