/// <reference path="../Game.ts" />
/// <reference path="Vec2.ts" />
/// <reference path="Transform.ts" />
/**
* Phaser - TransformUtils
*
* A collection of methods useful for manipulating and performing operations on 2D Transforms.
*
*/
var Phaser;
(function (Phaser) {
    var TransformUtils = (function () {
        function TransformUtils() { }
        TransformUtils.rotate = function rotate(t, v, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            //return new vec2(v.x * this.c - v.y * this.s, v.x * this.s + v.y * this.c);
            return out.setTo(v.x * t.c - v.y * t.s, v.x * t.s + v.y * t.c);
        };
        TransformUtils.unrotate = function unrotate(t, v, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            //return new vec2(v.x * this.c + v.y * this.s, -v.x * this.s + v.y * this.c);
            return out.setTo(v.x * t.c + v.y * t.s, -v.x * t.s + v.y * t.c);
        };
        TransformUtils.transform = function transform(t, v, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            //return new vec2(v.x * this.c - v.y * this.s + this.t.x, v.x * this.s + v.y * this.c + this.t.y);
            return out.setTo(v.x * t.c - v.y * t.s + t.t.x, v.x * t.s + v.y * t.c + t.t.y);
        };
        TransformUtils.untransform = function untransform(t, v, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            var px = v.x - t.t.x;
            var py = v.y - t.t.y;
            //return new vec2(px * this.c + py * this.s, -px * this.s + py * this.c);
            return out.setTo(px * t.c + py * t.s, -px * t.s + py * t.c);
        };
        return TransformUtils;
    })();
    Phaser.TransformUtils = TransformUtils;    
})(Phaser || (Phaser = {}));
