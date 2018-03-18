/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @name Phaser.Physics.Impact.Components.BodyScale
 * @since 3.0.0
 */
var BodyScale = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.BodyScale#setBodySize
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} [height=width] - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setBodySize: function (width, height)
    {
        if (height === undefined) { height = width; }

        this.body.size.x = Math.round(width);
        this.body.size.y = Math.round(height);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.BodyScale#setBodyScale
     * @since 3.0.0
     *
     * @param {number} scaleX - [description]
     * @param {number} [scaleY] - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
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
