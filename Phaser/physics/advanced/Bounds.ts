/// <reference path="../../Game.ts" />
/// <reference path="../../math/Vec2.ts" />
/// <reference path="../../math/Vec2Utils.ts" />

/**
* Phaser - 2D AABB
*
* A 2D AABB object
*/

module Phaser.Physics.Advanced {

    export class Bounds {

        /**
        * Creates a new 2D AABB object.
        * @class Bounds
        * @constructor
        * @return {Bounds} This object
        **/
        constructor(mins?: Phaser.Vec2 = null, maxs?: Phaser.Vec2 = null) {

            if (mins)
            {
                this.mins = Phaser.Vec2Utils.clone(mins);
            }
            else
            {
                this.mins = new Phaser.Vec2(999999, 999999);
            }

            if (maxs)
            {
                this.maxs = Phaser.Vec2Utils.clone(maxs);
            }
            else
            {
                this.maxs = new Phaser.Vec2(999999, 999999);
            }

        }

        public mins: Phaser.Vec2;
        public maxs: Phaser.Vec2;

        public toString() {
            return ["mins:", this.mins.toString(), "maxs:", this.maxs.toString()].join(" ");
        }

        public setTo(mins: Phaser.Vec2, maxs: Phaser.Vec2) {

            this.mins.setTo(mins.x, mins.y);
            this.maxs.setTo(maxs.x, maxs.y);

        }

        public copy(b: Bounds): Bounds {

            this.mins.copyFrom(b.mins);
            this.maxs.copyFrom(b.maxs);

            return this;
        }

        public clear(): Bounds {

            this.mins.setTo(999999, 999999);
            this.maxs.setTo(-999999, -999999);

            return this;

        }

        public isEmpty(): bool {
            return (this.mins.x > this.maxs.x || this.mins.y > this.maxs.y);
        }

        /*
        public getCenter() {
            return vec2.scale(vec2.add(this.mins, this.maxs), 0.5);
        }

        public getExtent() {
            return vec2.scale(vec2.sub(this.maxs, this.mins), 0.5);
        }
        */

        public getPerimeter(): number {
            return (this.maxs.x - this.mins.x + this.maxs.y - this.mins.y) * 2;
        }

        public addPoint(p: Phaser.Vec2): Bounds {

            if (this.mins.x > p.x) this.mins.x = p.x;
            if (this.maxs.x < p.x) this.maxs.x = p.x;
            if (this.mins.y > p.y) this.mins.y = p.y;
            if (this.maxs.y < p.y) this.maxs.y = p.y;

            return this;
        }

        public addBounds(b: Bounds): Bounds {

            if (this.mins.x > b.mins.x) this.mins.x = b.mins.x;
            if (this.maxs.x < b.maxs.x) this.maxs.x = b.maxs.x;
            if (this.mins.y > b.mins.y) this.mins.y = b.mins.y;
            if (this.maxs.y < b.maxs.y) this.maxs.y = b.maxs.y;

            return this;
        }

        public addBounds2(mins, maxs) {
            if (this.mins.x > mins.x) this.mins.x = mins.x;
            if (this.maxs.x < maxs.x) this.maxs.x = maxs.x;
            if (this.mins.y > mins.y) this.mins.y = mins.y;
            if (this.maxs.y < maxs.y) this.maxs.y = maxs.y;
            return this;
        }

        public addExtents(center: Phaser.Vec2, extent_x: number, extent_y: number): Bounds {

            if (this.mins.x > center.x - extent_x) this.mins.x = center.x - extent_x;
            if (this.maxs.x < center.x + extent_x) this.maxs.x = center.x + extent_x;
            if (this.mins.y > center.y - extent_y) this.mins.y = center.y - extent_y;
            if (this.maxs.y < center.y + extent_y) this.maxs.y = center.y + extent_y;

            return this;

        }

        public expand(ax: number, ay: number): Bounds {

            this.mins.x -= ax;
            this.mins.y -= ay;
            this.maxs.x += ax;
            this.maxs.y += ay;

            return this;

        }

        public containPoint(p: Phaser.Vec2): bool {

            if (p.x < this.mins.x || p.x > this.maxs.x || p.y < this.mins.y || p.y > this.maxs.y)
            {
                return false;
            }

            return true;

        }

        public intersectsBounds(b: Bounds): bool {

            if (this.mins.x > b.maxs.x || this.maxs.x < b.mins.x || this.mins.y > b.maxs.y || this.maxs.y < b.mins.y)
            {
                return false;
            }

            console.log('intersects TRUE');
            console.log(this);
            console.log(b);

            return true;
        }

        public static expand(b: Bounds, ax, ay) {

            var b = new Bounds(b.mins, b.maxs);
            b.expand(ax, ay);
            return b;

        }

    }

}