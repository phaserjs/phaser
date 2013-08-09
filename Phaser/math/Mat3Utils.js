/// <reference path="../_definitions.ts" />
/**
* Phaser - Mat3Utils
*
* A collection of methods useful for manipulating and performing operations on Mat3 objects.
*
*/
var Phaser;
(function (Phaser) {
    var Mat3Utils = (function () {
        function Mat3Utils() {
        }
        Mat3Utils.transpose = /**
        * Transpose the values of a Mat3
        **/
        function (source, dest) {
            if (typeof dest === "undefined") { dest = null; }
            if (dest === null) {
                //  Transpose ourselves
                var a01 = source.data[1];
                var a02 = source.data[2];
                var a12 = source.data[5];

                source.data[1] = source.data[3];
                source.data[2] = source.data[6];
                source.data[3] = a01;
                source.data[5] = source.data[7];
                source.data[6] = a02;
                source.data[7] = a12;
            } else {
                source.data[0] = dest.data[0];
                source.data[1] = dest.data[3];
                source.data[2] = dest.data[6];
                source.data[3] = dest.data[1];
                source.data[4] = dest.data[4];
                source.data[5] = dest.data[7];
                source.data[6] = dest.data[2];
                source.data[7] = dest.data[5];
                source.data[8] = dest.data[8];
            }

            return source;
        };

        Mat3Utils.invert = /**
        * Inverts a Mat3
        **/
        function (source) {
            var a00 = source.data[0];
            var a01 = source.data[1];
            var a02 = source.data[2];
            var a10 = source.data[3];
            var a11 = source.data[4];
            var a12 = source.data[5];
            var a20 = source.data[6];
            var a21 = source.data[7];
            var a22 = source.data[8];

            var b01 = a22 * a11 - a12 * a21;
            var b11 = -a22 * a10 + a12 * a20;
            var b21 = a21 * a10 - a11 * a20;

            //  Determinant
            var det = a00 * b01 + a01 * b11 + a02 * b21;

            if (!det) {
                return null;
            }

            det = 1.0 / det;

            source.data[0] = b01 * det;
            source.data[1] = (-a22 * a01 + a02 * a21) * det;
            source.data[2] = (a12 * a01 - a02 * a11) * det;
            source.data[3] = b11 * det;
            source.data[4] = (a22 * a00 - a02 * a20) * det;
            source.data[5] = (-a12 * a00 + a02 * a10) * det;
            source.data[6] = b21 * det;
            source.data[7] = (-a21 * a00 + a01 * a20) * det;
            source.data[8] = (a11 * a00 - a01 * a10) * det;

            return source;
        };

        Mat3Utils.adjoint = /**
        * Calculates the adjugate of a Mat3
        **/
        function (source) {
            var a00 = source.data[0];
            var a01 = source.data[1];
            var a02 = source.data[2];
            var a10 = source.data[3];
            var a11 = source.data[4];
            var a12 = source.data[5];
            var a20 = source.data[6];
            var a21 = source.data[7];
            var a22 = source.data[8];

            source.data[0] = (a11 * a22 - a12 * a21);
            source.data[1] = (a02 * a21 - a01 * a22);
            source.data[2] = (a01 * a12 - a02 * a11);
            source.data[3] = (a12 * a20 - a10 * a22);
            source.data[4] = (a00 * a22 - a02 * a20);
            source.data[5] = (a02 * a10 - a00 * a12);
            source.data[6] = (a10 * a21 - a11 * a20);
            source.data[7] = (a01 * a20 - a00 * a21);
            source.data[8] = (a00 * a11 - a01 * a10);

            return source;
        };

        Mat3Utils.determinant = /**
        * Calculates the adjugate of a Mat3
        **/
        function (source) {
            var a00 = source.data[0];
            var a01 = source.data[1];
            var a02 = source.data[2];
            var a10 = source.data[3];
            var a11 = source.data[4];
            var a12 = source.data[5];
            var a20 = source.data[6];
            var a21 = source.data[7];
            var a22 = source.data[8];

            return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
        };

        Mat3Utils.multiply = /**
        * Multiplies two Mat3s
        **/
        function (source, b) {
            var a00 = source.data[0];
            var a01 = source.data[1];
            var a02 = source.data[2];
            var a10 = source.data[3];
            var a11 = source.data[4];
            var a12 = source.data[5];
            var a20 = source.data[6];
            var a21 = source.data[7];
            var a22 = source.data[8];

            var b00 = b.data[0];
            var b01 = b.data[1];
            var b02 = b.data[2];
            var b10 = b.data[3];
            var b11 = b.data[4];
            var b12 = b.data[5];
            var b20 = b.data[6];
            var b21 = b.data[7];
            var b22 = b.data[8];

            source.data[0] = b00 * a00 + b01 * a10 + b02 * a20;
            source.data[1] = b00 * a01 + b01 * a11 + b02 * a21;
            source.data[2] = b00 * a02 + b01 * a12 + b02 * a22;

            source.data[3] = b10 * a00 + b11 * a10 + b12 * a20;
            source.data[4] = b10 * a01 + b11 * a11 + b12 * a21;
            source.data[5] = b10 * a02 + b11 * a12 + b12 * a22;

            source.data[6] = b20 * a00 + b21 * a10 + b22 * a20;
            source.data[7] = b20 * a01 + b21 * a11 + b22 * a21;
            source.data[8] = b20 * a02 + b21 * a12 + b22 * a22;

            return source;
        };

        Mat3Utils.fromQuaternion = function () {
        };
        Mat3Utils.normalFromMat4 = function () {
        };
        return Mat3Utils;
    })();
    Phaser.Mat3Utils = Mat3Utils;
})(Phaser || (Phaser = {}));
