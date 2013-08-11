/// <reference path="../../_definitions.ts" />

/**
* Phaser - Physics - Projection
*/

module Phaser.Physics.Projection {

    export class AABBFull {

        public static Collide(x: number, y: number, obj: Phaser.Physics.AABB, t: Phaser.Physics.TileMapCell) {

            var l = Math.sqrt(x * x + y * y);

            obj.reportCollisionVsWorld(x, y, x / l, y / l, t);

            return Phaser.Physics.AABB.COL_AXIS;

        }

    }

}