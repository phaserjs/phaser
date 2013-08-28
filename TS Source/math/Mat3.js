/// <reference path="../_definitions.ts" />
/**
* Phaser - Mat3
*
* A 3x3 Matrix
*/
var Phaser;
(function (Phaser) {
    var Mat3 = (function () {
        /**
        * Creates a new Mat3 object.
        * @class Mat3
        * @constructor
        * @return {Mat3} This object
        **/
        function Mat3() {
            this.data = [
                1, 
                0, 
                0, 
                0, 
                1, 
                0, 
                0, 
                0, 
                1
            ];
        }
        Object.defineProperty(Mat3.prototype, "a00", {
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.data[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mat3.prototype, "a01", {
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.data[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mat3.prototype, "a02", {
            get: function () {
                return this.data[2];
            },
            set: function (value) {
                this.data[2] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mat3.prototype, "a10", {
            get: function () {
                return this.data[3];
            },
            set: function (value) {
                this.data[3] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mat3.prototype, "a11", {
            get: function () {
                return this.data[4];
            },
            set: function (value) {
                this.data[4] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mat3.prototype, "a12", {
            get: function () {
                return this.data[5];
            },
            set: function (value) {
                this.data[5] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mat3.prototype, "a20", {
            get: function () {
                return this.data[6];
            },
            set: function (value) {
                this.data[6] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mat3.prototype, "a21", {
            get: function () {
                return this.data[7];
            },
            set: function (value) {
                this.data[7] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mat3.prototype, "a22", {
            get: function () {
                return this.data[8];
            },
            set: function (value) {
                this.data[8] = value;
            },
            enumerable: true,
            configurable: true
        });
        Mat3.prototype.copyFromMat3 = /**
        * Copies the values from one Mat3 into this Mat3.
        * @method copyFromMat3
        * @param {any} source - The object to copy from.
        * @return {Mat3} This Mat3 object.
        **/
        function (source) {
            this.data[0] = source.data[0];
            this.data[1] = source.data[1];
            this.data[2] = source.data[2];
            this.data[3] = source.data[3];
            this.data[4] = source.data[4];
            this.data[5] = source.data[5];
            this.data[6] = source.data[6];
            this.data[7] = source.data[7];
            this.data[8] = source.data[8];
            return this;
        };
        Mat3.prototype.copyFromMat4 = /**
        * Copies the upper-left 3x3 values into this Mat3.
        * @method copyFromMat4
        * @param {any} source - The object to copy from.
        * @return {Mat3} This Mat3 object.
        **/
        function (source) {
            this.data[0] = source[0];
            this.data[1] = source[1];
            this.data[2] = source[2];
            this.data[3] = source[4];
            this.data[4] = source[5];
            this.data[5] = source[6];
            this.data[6] = source[8];
            this.data[7] = source[9];
            this.data[8] = source[10];
            return this;
        };
        Mat3.prototype.clone = /**
        * Clones this Mat3 into a new Mat3
        * @param {Mat3} out The output Mat3, if none is given a new Mat3 object will be created.
        * @return {Mat3} The new Mat3
        **/
        function (out) {
            if (typeof out === "undefined") { out = new Phaser.Mat3(); }
            out[0] = this.data[0];
            out[1] = this.data[1];
            out[2] = this.data[2];
            out[3] = this.data[3];
            out[4] = this.data[4];
            out[5] = this.data[5];
            out[6] = this.data[6];
            out[7] = this.data[7];
            out[8] = this.data[8];
            return out;
        };
        Mat3.prototype.identity = /**
        * Sets this Mat3 to the identity matrix.
        * @method identity
        * @param {any} source - The object to copy from.
        * @return {Mat3} This Mat3 object.
        **/
        function () {
            return this.setTo(1, 0, 0, 0, 1, 0, 0, 0, 1);
        };
        Mat3.prototype.translate = /**
        * Translates this Mat3 by the given vector
        **/
        function (v) {
            this.a20 = v.x * this.a00 + v.y * this.a10 + this.a20;
            this.a21 = v.x * this.a01 + v.y * this.a11 + this.a21;
            this.a22 = v.x * this.a02 + v.y * this.a12 + this.a22;
            return this;
        };
        Mat3.prototype.setTemps = function () {
            this._a00 = this.data[0];
            this._a01 = this.data[1];
            this._a02 = this.data[2];
            this._a10 = this.data[3];
            this._a11 = this.data[4];
            this._a12 = this.data[5];
            this._a20 = this.data[6];
            this._a21 = this.data[7];
            this._a22 = this.data[8];
        };
        Mat3.prototype.rotate = /**
        * Rotates this Mat3 by the given angle (given in radians)
        **/
        function (rad) {
            this.setTemps();
            var s = Phaser.GameMath.sinA[rad];
            var c = Phaser.GameMath.cosA[rad];
            this.data[0] = c * this._a00 + s * this._a10;
            this.data[1] = c * this._a01 + s * this._a10;
            this.data[2] = c * this._a02 + s * this._a12;
            this.data[3] = c * this._a10 - s * this._a00;
            this.data[4] = c * this._a11 - s * this._a01;
            this.data[5] = c * this._a12 - s * this._a02;
            return this;
        };
        Mat3.prototype.scale = /**
        * Scales this Mat3 by the given vector
        **/
        function (v) {
            this.data[0] = v.x * this.data[0];
            this.data[1] = v.x * this.data[1];
            this.data[2] = v.x * this.data[2];
            this.data[3] = v.y * this.data[3];
            this.data[4] = v.y * this.data[4];
            this.data[5] = v.y * this.data[5];
            return this;
        };
        Mat3.prototype.setTo = function (a00, a01, a02, a10, a11, a12, a20, a21, a22) {
            this.data[0] = a00;
            this.data[1] = a01;
            this.data[2] = a02;
            this.data[3] = a10;
            this.data[4] = a11;
            this.data[5] = a12;
            this.data[6] = a20;
            this.data[7] = a21;
            this.data[8] = a22;
            return this;
        };
        Mat3.prototype.toString = /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the object.
        **/
        function () {
            return '';
            //return "[{Vec2 (x=" + this.x + " y=" + this.y + ")}]";
                    };
        return Mat3;
    })();
    Phaser.Mat3 = Mat3;    
})(Phaser || (Phaser = {}));
