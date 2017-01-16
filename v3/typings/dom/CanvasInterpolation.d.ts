export default class CanvasInterpolation {
    /**
    * Sets the CSS image-rendering property on the given canvas to be 'crisp' (aka 'optimize contrast' on webkit).
    * Note that if this doesn't given the desired result then see the setSmoothingEnabled.
    *
    * @method Phaser.Canvas.setImageRenderingCrisp
    * @param {HTMLCanvasElement} canvas - The canvas to set image-rendering crisp on.
    * @return {HTMLCanvasElement} Returns the source canvas.
    */
    static setCrisp(canvas: any): any;
    /**
    * Sets the CSS image-rendering property on the given canvas to be 'bicubic' (aka 'auto').
    * Note that if this doesn't given the desired result then see the CanvasUtils.setSmoothingEnabled method.
    *
    * @method Phaser.Canvas.setImageRenderingBicubic
    * @param {HTMLCanvasElement} canvas The canvas to set image-rendering bicubic on.
    * @return {HTMLCanvasElement} Returns the source canvas.
    */
    static setBicubic(canvas: any): any;
}
