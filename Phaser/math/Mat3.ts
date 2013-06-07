/// <reference path="../Game.ts" />

/**
* Phaser - Mat3
*
* A 3x3 Matrix
*/

module Phaser {

    export class Mat3 {

        /**
        * Creates a new Mat3 object.
        * @class Mat3
        * @constructor
        * @return {Mat3} This object
        **/
        constructor() {
            this.data = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        }

        //  Temporary vars used for internal calculations
        private _a00: number;
        private _a01: number;
        private _a02: number;
        private _a10: number;
        private _a11: number;
        private _a12: number;
        private _a20: number;
        private _a21: number;
        private _a22: number;

        public data: number[];

        public get a00(): number {
            return this.data[0];
        }

        public set a00(value: number) {
            this.data[0] = value;
        }

        public get a01(): number {
            return this.data[1];
        }

        public set a01(value: number) {
            this.data[1] = value;
        }

        public get a02(): number {
            return this.data[2];
        }

        public set a02(value: number) {
            this.data[2] = value;
        }

        public get a10(): number {
            return this.data[3];
        }

        public set a10(value: number) {
            this.data[3] = value;
        }

        public get a11(): number {
            return this.data[4];
        }

        public set a11(value: number) {
            this.data[4] = value;
        }

        public get a12(): number {
            return this.data[5];
        }

        public set a12(value: number) {
            this.data[5] = value;
        }

        public get a20(): number {
            return this.data[6];
        }

        public set a20(value: number) {
            this.data[6] = value;
        }

        public get a21(): number {
            return this.data[7];
        }

        public set a21(value: number) {
            this.data[7] = value;
        }

        public get a22(): number {
            return this.data[8];
        }

        public set a22(value: number) {
            this.data[8] = value;
        }

        /**
         * Copies the values from one Mat3 into this Mat3.
         * @method copyFromMat3
         * @param {any} source - The object to copy from.
         * @return {Mat3} This Mat3 object.
         **/
        public copyFromMat3(source: Mat3): Mat3 {

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
        }

        /**
         * Copies the upper-left 3x3 values into this Mat3.
         * @method copyFromMat4
         * @param {any} source - The object to copy from.
         * @return {Mat3} This Mat3 object.
         **/
        public copyFromMat4(source: any): Mat3 {

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
        }

        /**
        * Clones this Mat3 into a new Mat3
        * @param {Mat3} out The output Mat3, if none is given a new Mat3 object will be created.
        * @return {Mat3} The new Mat3
        **/
        public clone(out?:Mat3 = new Phaser.Mat3): Mat3 {

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

        }

        /**
         * Sets this Mat3 to the identity matrix.
         * @method identity
         * @param {any} source - The object to copy from.
         * @return {Mat3} This Mat3 object.
         **/
        public identity(): Mat3 {
            return this.setTo(1, 0, 0, 0, 1, 0, 0, 0, 1);
        }

        /**
         * Translates this Mat3 by the given vector
         **/
        public translate(v:Phaser.Vec2): Mat3 {

            this.a20 = v.x * this.a00 + v.y * this.a10 + this.a20;
            this.a21 = v.x * this.a01 + v.y * this.a11 + this.a21;
            this.a22 = v.x * this.a02 + v.y * this.a12 + this.a22;

            return this;

        }

        private setTemps() {

            this._a00 = this.data[0];
            this._a01 = this.data[1];
            this._a02 = this.data[2];
            this._a10 = this.data[3];
            this._a11 = this.data[4];
            this._a12 = this.data[5];
            this._a20 = this.data[6];
            this._a21 = this.data[7];
            this._a22 = this.data[8];

        }

        /**
         * Rotates this Mat3 by the given angle (given in radians)
         **/
        public rotate(rad:number): Mat3 {

            this.setTemps();

            var s = GameMath.sinA[rad];
            var c = GameMath.cosA[rad];

            this.data[0] = c * this._a00 + s * this._a10;
            this.data[1] = c * this._a01 + s * this._a10;
            this.data[2] = c * this._a02 + s * this._a12;

            this.data[3] = c * this._a10 - s * this._a00;
            this.data[4] = c * this._a11 - s * this._a01;
            this.data[5] = c * this._a12 - s * this._a02;

            return this;

        }

        /**
         * Scales this Mat3 by the given vector
         **/
        public scale(v: Vec2): Mat3 {

            this.data[0] = v.x * this.data[0];
            this.data[1] = v.x * this.data[1];
            this.data[2] = v.x * this.data[2];

            this.data[3] = v.y * this.data[3];
            this.data[4] = v.y * this.data[4];
            this.data[5] = v.y * this.data[5];

            return this;

        }

        public setTo(a00: number, a01: number, a02: number, a10: number, a11: number, a12: number, a20: number, a21: number, a22: number): Mat3 {

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

        }

        /**
        * Returns a string representation of this object.
        * @method toString
        * @return {string} a string representation of the object.
        **/
        public toString(): string {
            return '';
            //return "[{Vec2 (x=" + this.x + " y=" + this.y + ")}]";
        }

    }

}