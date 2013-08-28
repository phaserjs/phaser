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
var Phaser;
(function (Phaser) {
    var Types = (function () {
        function Types() { }
        Types.RENDERER_AUTO_DETECT = 0;
        Types.RENDERER_HEADLESS = 1;
        Types.RENDERER_CANVAS = 2;
        Types.RENDERER_WEBGL = 3;
        Types.CAMERA_TYPE_ORTHOGRAPHIC = 0;
        Types.CAMERA_TYPE_ISOMETRIC = 1;
        Types.CAMERA_FOLLOW_LOCKON = 0;
        Types.CAMERA_FOLLOW_PLATFORMER = 1;
        Types.CAMERA_FOLLOW_TOPDOWN = 2;
        Types.CAMERA_FOLLOW_TOPDOWN_TIGHT = 3;
        Types.GROUP = 0;
        Types.SPRITE = 1;
        Types.GEOMSPRITE = 2;
        Types.PARTICLE = 3;
        Types.EMITTER = 4;
        Types.TILEMAP = 5;
        Types.SCROLLZONE = 6;
        Types.BUTTON = 7;
        Types.DYNAMICTEXTURE = 8;
        Types.GEOM_POINT = 0;
        Types.GEOM_CIRCLE = 1;
        Types.GEOM_RECTANGLE = 2;
        Types.GEOM_LINE = 3;
        Types.GEOM_POLYGON = 4;
        Types.BODY_DISABLED = 0;
        Types.BODY_STATIC = 1;
        Types.BODY_KINETIC = 2;
        Types.BODY_DYNAMIC = 3;
        Types.OUT_OF_BOUNDS_KILL = 0;
        Types.OUT_OF_BOUNDS_DESTROY = 1;
        Types.OUT_OF_BOUNDS_PERSIST = 2;
        Types.SORT_ASCENDING = -1;
        Types.SORT_DESCENDING = 1;
        Types.LEFT = 0x0001;
        Types.RIGHT = 0x0010;
        Types.UP = 0x0100;
        Types.DOWN = 0x1000;
        Types.NONE = 0;
        Types.CEILING = 0x0100;
        Types.FLOOR = 0x1000;
        Types.WALL = 0x0001 | 0x0010;
        Types.ANY = 0x0001 | 0x0010 | 0x0100 | 0x1000;
        return Types;
    })();
    Phaser.Types = Types;    
})(Phaser || (Phaser = {}));
