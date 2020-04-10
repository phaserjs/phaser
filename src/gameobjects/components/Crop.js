/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for getting and setting the texture of a Game Object.
 *
 * @namespace Phaser.GameObjects.Components.Crop
 * @since 3.12.0
 */

var Crop = {

    /**
     * The Texture this Game Object is using to render with.
     *
     * @name Phaser.GameObjects.Components.Crop#texture
     * @type {Phaser.Textures.Texture|Phaser.Textures.CanvasTexture}
     * @since 3.0.0
     */
    texture: null,

    /**
     * The Texture Frame this Game Object is using to render with.
     *
     * @name Phaser.GameObjects.Components.Crop#frame
     * @type {Phaser.Textures.Frame}
     * @since 3.0.0
     */
    frame: null,

    /**
     * A boolean flag indicating if this Game Object is being cropped or not.
     * You can toggle this at any time after `setCrop` has been called, to turn cropping on or off.
     * Equally, calling `setCrop` with no arguments will reset the crop and disable it.
     *
     * @name Phaser.GameObjects.Components.Crop#isCropped
     * @type {boolean}
     * @since 3.11.0
     */
    isCropped: false,

    /**
     * Applies a crop to a texture based Game Object, such as a Sprite or Image.
     * 
     * The crop is a rectangle that limits the area of the texture frame that is visible during rendering.
     * 
     * Cropping a Game Object does not change its size, dimensions, physics body or hit area, it just
     * changes what is shown when rendered.
     * 
     * The crop coordinates are relative to the texture frame, not the Game Object, meaning 0 x 0 is the top-left.
     * 
     * Therefore, if you had a Game Object that had an 800x600 sized texture, and you wanted to show only the left
     * half of it, you could call `setCrop(0, 0, 400, 600)`.
     * 
     * It is also scaled to match the Game Object scale automatically. Therefore a crop rect of 100x50 would crop
     * an area of 200x100 when applied to a Game Object that had a scale factor of 2.
     * 
     * You can either pass in numeric values directly, or you can provide a single Rectangle object as the first argument.
     * 
     * Call this method with no arguments at all to reset the crop, or toggle the property `isCropped` to `false`.
     * 
     * You should do this if the crop rectangle becomes the same size as the frame itself, as it will allow
     * the renderer to skip several internal calculations.
     *
     * @method Phaser.GameObjects.Components.Crop#setCrop
     * @since 3.11.0
     *
     * @param {(number|Phaser.Geom.Rectangle)} [x] - The x coordinate to start the crop from. Or a Phaser.Geom.Rectangle object, in which case the rest of the arguments are ignored.
     * @param {number} [y] - The y coordinate to start the crop from.
     * @param {number} [width] - The width of the crop rectangle in pixels.
     * @param {number} [height] - The height of the crop rectangle in pixels.
     *
     * @return {this} This Game Object instance.
     */
    setCrop: function (x, y, width, height)
    {
        if (x === undefined)
        {
            this.isCropped = false;
        }
        else if (this.frame)
        {
            if (typeof x === 'number')
            {
                this.frame.setCropUVs(this._crop, x, y, width, height, this.flipX, this.flipY);
            }
            else
            {
                var rect = x;

                this.frame.setCropUVs(this._crop, rect.x, rect.y, rect.width, rect.height, this.flipX, this.flipY);
            }

            this.isCropped = true;
        }

        return this;
    },

    /**
     * Internal method that returns a blank, well-formed crop object for use by a Game Object.
     *
     * @method Phaser.GameObjects.Components.Crop#resetCropObject
     * @private
     * @since 3.12.0
     * 
     * @return {object} The crop object.
     */
    resetCropObject: function ()
    {
        return { u0: 0, v0: 0, u1: 0, v1: 0, width: 0, height: 0, x: 0, y: 0, flipX: false, flipY: false, cx: 0, cy: 0, cw: 0, ch: 0 };
    }

};

module.exports = Crop;
