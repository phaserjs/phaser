/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Impact Body Scale component.
 * Should be applied as a mixin.
 *
 * @namespace Phaser.Physics.Impact.Components.BodyScale
 * @since 3.0.0
 */
var BodyScale = {

    /**
     * Sets the size of the physics body.
     *
     * @method Phaser.Physics.Impact.Components.BodyScale#setBodySize
     * @since 3.0.0
     *
     * @param {number} width - The width of the body in pixels.
     * @param {number} [height=width] - The height of the body in pixels.
     *
     * @return {this} This Game Object.
     */
    setBodySize: function (width, height)
    {
        if (height === undefined) { height = width; }

        this.body.size.x = Math.round(width);
        this.body.size.y = Math.round(height);

        return this;
    },

    /**
     * Sets the scale of the physics body.
     *
     * @method Phaser.Physics.Impact.Components.BodyScale#setBodyScale
     * @since 3.0.0
     *
     * @param {number} scaleX - The horizontal scale of the body.
     * @param {number} [scaleY] - The vertical scale of the body. If not given, will use the horizontal scale value.
     *
     * @return {this} This Game Object.
     */
    setBodyScale: function (scaleX, scaleY)
    {
        if (scaleY === undefined) { scaleY = scaleX; }

        var gameObject = this.body.gameObject;

        if (gameObject)
        {
            gameObject.setScale(scaleX, scaleY);

            return this.setBodySize(gameObject.width * gameObject.scaleX, gameObject.height * gameObject.scaleY);
        }
        else
        {
            return this.setBodySize(this.body.size.x * scaleX, this.body.size.y * scaleY);
        }
    }

};

module.exports = BodyScale;
