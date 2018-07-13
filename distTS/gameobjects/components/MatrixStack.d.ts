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
declare var MatrixStack: {
    /**
     * The matrix stack.
     *
     * @name Phaser.GameObjects.Components.MatrixStack#matrixStack
     * @type {Float32Array}
     * @private
     * @since 3.2.0
     */
    matrixStack: any;
    /**
     * The current matrix.
     *
     * @name Phaser.GameObjects.Components.MatrixStack#currentMatrix
     * @type {Float32Array}
     * @private
     * @since 3.2.0
     */
    currentMatrix: any;
    /**
     * The current index of the top of the matrix stack.
     *
     * @name Phaser.GameObjects.Components.MatrixStack#currentMatrixIndex
     * @type {integer}
     * @private
     * @since 3.2.0
     */
    currentMatrixIndex: number;
    /**
     * Initialize the matrix stack.
     *
     * @method Phaser.GameObjects.Components.MatrixStack#initMatrixStack
     * @since 3.2.0
     *
     * @return {this} This Game Object instance.
     */
    initMatrixStack: () => any;
    /**
     * Push the current matrix onto the matrix stack.
     *
     * @method Phaser.GameObjects.Components.MatrixStack#save
     * @since 3.2.0
     *
     * @return {this} This Game Object instance.
     */
    save: () => any;
    /**
     * Pop the top of the matrix stack into the current matrix.
     *
     * @method Phaser.GameObjects.Components.MatrixStack#restore
     * @since 3.2.0
     *
     * @return {this} This Game Object instance.
     */
    restore: () => any;
    /**
     * Reset the current matrix to the identity matrix.
     *
     * @method Phaser.GameObjects.Components.MatrixStack#loadIdentity
     * @since 3.2.0
     *
     * @return {this} This Game Object instance.
     */
    loadIdentity: () => any;
    /**
     * Transform the current matrix.
     *
     * @method Phaser.GameObjects.Components.MatrixStack#transform
     * @since 3.2.0
     *
     * @param {number} a - The Scale X value.
     * @param {number} b - The Shear Y value.
     * @param {number} c - The Shear X value.
     * @param {number} d - The Scale Y value.
     * @param {number} tx - The Translate X value.
     * @param {number} ty - The Translate Y value.
     *
     * @return {this} This Game Object instance.
     */
    transform: (a: any, b: any, c: any, d: any, tx: any, ty: any) => any;
    /**
     * Set a transform matrix as the current matrix.
     *
     * @method Phaser.GameObjects.Components.MatrixStack#setTransform
     * @since 3.2.0
     *
     * @param {number} a - The Scale X value.
     * @param {number} b - The Shear Y value.
     * @param {number} c - The Shear X value.
     * @param {number} d - The Scale Y value.
     * @param {number} tx - The Translate X value.
     * @param {number} ty - The Translate Y value.
     *
     * @return {this} This Game Object instance.
     */
    setTransform: (a: any, b: any, c: any, d: any, tx: any, ty: any) => any;
    /**
     * Translate the current matrix.
     *
     * @method Phaser.GameObjects.Components.MatrixStack#translate
     * @since 3.2.0
     *
     * @param {number} x - The horizontal translation value.
     * @param {number} y - The vertical translation value.
     *
     * @return {this} This Game Object instance.
     */
    translate: (x: any, y: any) => any;
    /**
     * Scale the current matrix.
     *
     * @method Phaser.GameObjects.Components.MatrixStack#scale
     * @since 3.2.0
     *
     * @param {number} x - The horizontal scale value.
     * @param {number} y - The vertical scale value.
     *
     * @return {this} This Game Object instance.
     */
    scale: (x: any, y: any) => any;
    /**
     * Rotate the current matrix.
     *
     * @method Phaser.GameObjects.Components.MatrixStack#rotate
     * @since 3.2.0
     *
     * @param {number} t - The angle of rotation in radians.
     *
     * @return {this} This Game Object instance.
     */
    rotate: (t: any) => any;
};
