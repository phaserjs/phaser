/// <reference path="../_definitions.ts" />
/**
* Phaser - Vec2Utils
*
* A collection of methods useful for manipulating and performing operations on 2D vectors.
*
*/
var Phaser;
(function (Phaser) {
    var Vec2Utils = (function () {
        function Vec2Utils() {
        }
        Vec2Utils.add = /**
        * Adds two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the sum of the two vectors.
        */
        function (a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x + b.x, a.y + b.y);
        };

        Vec2Utils.subtract = /**
        * Subtracts two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the difference of the two vectors.
        */
        function (a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x - b.x, a.y - b.y);
        };

        Vec2Utils.multiply = /**
        * Multiplies two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the sum of the two vectors multiplied.
        */
        function (a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x * b.x, a.y * b.y);
        };

        Vec2Utils.divide = /**
        * Divides two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the sum of the two vectors divided.
        */
        function (a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x / b.x, a.y / b.y);
        };

        Vec2Utils.scale = /**
        * Scales a 2D vector.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {number} s Scaling value.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the scaled vector.
        */
        function (a, s, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x * s, a.y * s);
        };

        Vec2Utils.multiplyAdd = /**
        * Adds two 2D vectors together and multiplies the result by the given scalar.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {number} s Scaling value.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the sum of the two vectors added and multiplied.
        */
        function (a, b, s, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x + b.x * s, a.y + b.y * s);
        };

        Vec2Utils.negative = /**
        * Return a negative vector.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the negative vector.
        */
        function (a, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(-a.x, -a.y);
        };

        Vec2Utils.perp = /**
        * Return a perpendicular vector (90 degrees rotation)
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the scaled vector.
        */
        function (a, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(-a.y, a.x);
        };

        Vec2Utils.rperp = /**
        * Return a perpendicular vector (-90 degrees rotation)
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is the scaled vector.
        */
        function (a, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.y, -a.x);
        };

        Vec2Utils.equals = /**
        * Checks if two 2D vectors are equal.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Boolean}
        */
        function (a, b) {
            return a.x == b.x && a.y == b.y;
        };

        Vec2Utils.epsilonEquals = /**
        *
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} epsilon
        * @return {Boolean}
        */
        function (a, b, epsilon) {
            return Math.abs(a.x - b.x) <= epsilon && Math.abs(a.y - b.y) <= epsilon;
        };

        Vec2Utils.distance = /**
        * Get the distance between two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        function (a, b) {
            return Math.sqrt(Vec2Utils.distanceSq(a, b));
        };

        Vec2Utils.distanceSq = /**
        * Get the distance squared between two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        function (a, b) {
            return ((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y));
        };

        Vec2Utils.project = /**
        * Project two 2D vectors onto another vector.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        function (a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            var amt = a.dot(b) / b.lengthSq();

            if (amt != 0) {
                out.setTo(amt * b.x, amt * b.y);
            }

            return out;
        };

        Vec2Utils.projectUnit = /**
        * Project this vector onto a vector of unit length.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        function (a, b, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            var amt = a.dot(b);

            if (amt != 0) {
                out.setTo(amt * b.x, amt * b.y);
            }

            return out;
        };

        Vec2Utils.normalRightHand = /**
        * Right-hand normalize (make unit length) a 2D vector.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        function (a, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.y * -1, a.x);
        };

        Vec2Utils.normalize = /**
        * Normalize (make unit length) a 2D vector.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        function (a, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            var m = a.length();

            if (m != 0) {
                out.setTo(a.x / m, a.y / m);
            }

            return out;
        };

        Vec2Utils.dot = /**
        * The dot product of two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        function (a, b) {
            return ((a.x * b.x) + (a.y * b.y));
        };

        Vec2Utils.cross = /**
        * The cross product of two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        function (a, b) {
            return ((a.x * b.y) - (a.y * b.x));
        };

        Vec2Utils.angle = /**
        * The angle between two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        function (a, b) {
            return Math.atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y);
        };

        Vec2Utils.angleSq = /**
        * The angle squared between two 2D vectors.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @return {Number}
        */
        function (a, b) {
            return a.subtract(b).angle(b.subtract(a));
        };

        Vec2Utils.rotateAroundOrigin = /**
        * Rotate a 2D vector around the origin to the given angle (theta).
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Number} theta The angle of rotation in radians.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        function (a, b, theta, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            var x = a.x - b.x;
            var y = a.y - b.y;
            return out.setTo(x * Math.cos(theta) - y * Math.sin(theta) + b.x, x * Math.sin(theta) + y * Math.cos(theta) + b.y);
        };

        Vec2Utils.rotate = /**
        * Rotate a 2D vector to the given angle (theta).
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} b Reference to a source Vec2 object.
        * @param {Number} theta The angle of rotation in radians.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2.
        */
        function (a, theta, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            var c = Math.cos(theta);
            var s = Math.sin(theta);

            return out.setTo(a.x * c - a.y * s, a.x * s + a.y * c);
        };

        Vec2Utils.clone = /**
        * Clone a 2D vector.
        *
        * @param {Vec2} a Reference to a source Vec2 object.
        * @param {Vec2} out The output Vec2 that is the result of the operation.
        * @return {Vec2} A Vec2 that is a copy of the source Vec2.
        */
        function (a, out) {
            if (typeof out === "undefined") { out = new Phaser.Vec2(); }
            return out.setTo(a.x, a.y);
        };
        return Vec2Utils;
    })();
    Phaser.Vec2Utils = Vec2Utils;
})(Phaser || (Phaser = {}));
