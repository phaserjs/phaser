/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Provides methods used for getting and setting the transform values of a Game Object.
 * Should be applied as a mixin and not used directly.
 * 
 * @name Phaser.GameObjects.Components.MatrixStack
 * @since 3.2.0
 */

var MatrixStack = {

    /**
     * [description]
     * 
     * @name Phaser.GameObjects.Components.MatrixStack#matrixStack
     * @type {Float32Array}
     * @private
     * @since 3.2.0
     */
    matrixStack: null,

    /**
     * [description]
     * 
     * @name Phaser.GameObjects.Components.MatrixStack#currentMatrix
     * @type {Float32Array}
     * @private
     * @since 3.2.0
     */
    currentMatrix: null,

    /**
     * [description]
     * 
     * @name Phaser.GameObjects.Components.MatrixStack#currentMatrixIndex
     * @type {integer}
     * @private
     * @since 3.2.0
     */
    currentMatrixIndex: 0,

    /**
     * [description]
     * 
     * @method Phaser.GameObjects.Components.MatrixStack#initMatrixStack
     * @since 3.2.0
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    initMatrixStack: function ()
    {
        this.matrixStack = new Float32Array(6000); // up to 1000 matrices
        this.currentMatrix = new Float32Array([ 1.0, 0.0, 0.0, 1.0, 0.0, 0.0 ]);
        this.currentMatrixIndex = 0;

        return this;
    },

    /**
     * [description]
     * 
     * @method Phaser.GameObjects.Components.MatrixStack#save
     * @since 3.2.0
     * 
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    save: function ()
    {
        if (this.currentMatrixIndex >= this.matrixStack.length) { return this; }

        var matrixStack = this.matrixStack;
        var currentMatrix = this.currentMatrix;
        var currentMatrixIndex = this.currentMatrixIndex;
        this.currentMatrixIndex += 6;

        matrixStack[currentMatrixIndex + 0] = currentMatrix[0];
        matrixStack[currentMatrixIndex + 1] = currentMatrix[1];
        matrixStack[currentMatrixIndex + 2] = currentMatrix[2];
        matrixStack[currentMatrixIndex + 3] = currentMatrix[3];
        matrixStack[currentMatrixIndex + 4] = currentMatrix[4];
        matrixStack[currentMatrixIndex + 5] = currentMatrix[5];
        
        return this;
    },

    /**
     * [description]
     * 
     * @method Phaser.GameObjects.Components.MatrixStack#restore
     * @since 3.2.0
     * 
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    restore: function ()
    {
        if (this.currentMatrixIndex <= 0) { return this; }

        this.currentMatrixIndex -= 6;

        var matrixStack = this.matrixStack;
        var currentMatrix = this.currentMatrix;
        var currentMatrixIndex = this.currentMatrixIndex;

        currentMatrix[0] = matrixStack[currentMatrixIndex + 0];
        currentMatrix[1] = matrixStack[currentMatrixIndex + 1];
        currentMatrix[2] = matrixStack[currentMatrixIndex + 2];
        currentMatrix[3] = matrixStack[currentMatrixIndex + 3];
        currentMatrix[4] = matrixStack[currentMatrixIndex + 4];
        currentMatrix[5] = matrixStack[currentMatrixIndex + 5];

        return this;
    },

    /**
     * [description]
     * 
     * @method Phaser.GameObjects.Components.MatrixStack#loadIdentity
     * @since 3.2.0
     * 
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    loadIdentity: function ()
    {
        this.setTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);

        return this;
    },

    /**
     * [description]
     * 
     * @method Phaser.GameObjects.Components.MatrixStack#transform
     * @since 3.2.0
     *
     * @param {number} a - [description]
     * @param {number} b - [description]
     * @param {number} c - [description]
     * @param {number} d - [description]
     * @param {number} tx - [description]
     * @param {number} ty - [description]
     * 
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    transform: function (a, b, c, d, tx, ty)
    {
        var currentMatrix = this.currentMatrix;
        var m0 = currentMatrix[0];
        var m1 = currentMatrix[1];
        var m2 = currentMatrix[2];
        var m3 = currentMatrix[3];
        var m4 = currentMatrix[4];
        var m5 = currentMatrix[5];

        currentMatrix[0] = m0 * a + m2 * b;
        currentMatrix[1] = m1 * a + m3 * b;
        currentMatrix[2] = m0 * c + m2 * d;
        currentMatrix[3] = m1 * c + m3 * d;
        currentMatrix[4] = m0 * tx + m2 * ty + m4;
        currentMatrix[5] = m1 * tx + m3 * ty + m5;

        return this;
    },

    /**
     * [description]
     * 
     * @method Phaser.GameObjects.Components.MatrixStack#setTransform
     * @since 3.2.0
     *
     * @param {number} a - [description]
     * @param {number} b - [description]
     * @param {number} c - [description]
     * @param {number} d - [description]
     * @param {number} tx - [description]
     * @param {number} ty - [description]
     * 
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    setTransform: function (a, b, c, d, tx, ty)
    {
        var currentMatrix = this.currentMatrix;

        currentMatrix[0] = a;
        currentMatrix[1] = b;
        currentMatrix[2] = c;
        currentMatrix[3] = d;
        currentMatrix[4] = tx;
        currentMatrix[5] = ty;

        return this;
    },

    /**
     * [description]
     * 
     * @method Phaser.GameObjects.Components.MatrixStack#translate
     * @since 3.2.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * 
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    translate: function (x, y)
    {
        var currentMatrix = this.currentMatrix;
        var m0 = currentMatrix[0];
        var m1 = currentMatrix[1];
        var m2 = currentMatrix[2];
        var m3 = currentMatrix[3];
        var m4 = currentMatrix[4];
        var m5 = currentMatrix[5];

        currentMatrix[4] = m0 * x + m2 * y + m4;
        currentMatrix[5] = m1 * x + m3 * y + m5;

        return this;
    },

    /**
     * [description]
     * 
     * @method Phaser.GameObjects.Components.MatrixStack#scale
     * @since 3.2.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * 
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    scale: function (x, y)
    {
        var currentMatrix = this.currentMatrix;
        var m0 = currentMatrix[0];
        var m1 = currentMatrix[1];
        var m2 = currentMatrix[2];
        var m3 = currentMatrix[3];

        currentMatrix[0] = m0 * x;
        currentMatrix[1] = m1 * x;
        currentMatrix[2] = m2 * y;
        currentMatrix[3] = m3 * y;

        return this;
    },

    /**
     * [description]
     * 
     * @method Phaser.GameObjects.Components.MatrixStack#rotate
     * @since 3.2.0
     *
     * @param {number} t - The angle of rotation, in radians.
     * 
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    rotate: function (t)
    {
        var currentMatrix = this.currentMatrix;
        var m0 = currentMatrix[0];
        var m1 = currentMatrix[1];
        var m2 = currentMatrix[2];
        var m3 = currentMatrix[3];
        var st = Math.sin(t);
        var ct = Math.cos(t);

        currentMatrix[0] = m0 * ct + m2 * st;
        currentMatrix[1] = m1 * ct + m3 * st;
        currentMatrix[2] = m0 * -st + m2 * ct;
        currentMatrix[3] = m1 * -st + m3 * ct;

        return this;
    }

};

module.exports = MatrixStack;
