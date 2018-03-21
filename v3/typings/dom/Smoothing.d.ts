export declare class Smoothing {
    /**
    * Gets the Smoothing Enabled vendor prefix being used on the given context, or null if not set.
    * iife
    *
    * @method Phaser.Canvas.getSmoothingPrefix
    * @param {CanvasRenderingContext2D} context - The context to enable or disable the image smoothing on.
    * @return {string|null} Returns the smoothingEnabled vendor prefix, or null if not set on the context.
    */
    static prefix: any;
    /**
    * Sets the Image Smoothing property on the given context. Set to false to disable image smoothing.
    * By default browsers have image smoothing enabled, which isn't always what you visually want, especially
    * when using pixel art in a game. Note that this sets the property on the context itself, so that any image
    * drawn to the context will be affected. This sets the property across all current browsers but support is
    * patchy on earlier browsers, especially on mobile.
    *
    * @method Phaser.Canvas.setSmoothingEnabled
    * @param {CanvasRenderingContext2D} context - The context to enable or disable the image smoothing on.
    * @param {boolean} value - If set to true it will enable image smoothing, false will disable it.
    * @return {CanvasRenderingContext2D} Returns the source context.
    */
    enable(context: any, value: any): any;
    /**
     * Returns `true` if the given context has image smoothing enabled, otherwise returns `false`.
     * Returns null if no smoothing prefix is available.
     *
     * @method Phaser.Canvas.getSmoothingEnabled
     * @param {CanvasRenderingContext2D} context - The context to check for smoothing on.
     * @return {boolean} True if the given context has image smoothing enabled, otherwise false.
     */
    isEnabled(context: any): any;
}
declare var _default: Smoothing;
export default _default;
