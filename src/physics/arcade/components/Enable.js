/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @name Phaser.Physics.Arcade.Components.Enable
 * @since 3.0.0
 */
var Enable = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Enable#enableBody
     * @since 3.0.0
     *
     * @param {boolean} reset - [description]
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {boolean} enableGameObject - [description]
     * @param {boolean} showGameObject - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    enableBody: function (reset, x, y, enableGameObject, showGameObject)
    {
        if (reset)
        {
            this.body.reset(x, y);
        }

        if (enableGameObject)
        {
            this.body.gameObject.active = true;
        }

        if (showGameObject)
        {
            this.body.gameObject.visible = true;
        }

        this.body.enable = true;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Enable#disableBody
     * @since 3.0.0
     *
     * @param {boolean} [disableGameObject=false] - [description]
     * @param {boolean} [hideGameObject=false] - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    disableBody: function (disableGameObject, hideGameObject)
    {
        if (disableGameObject === undefined) { disableGameObject = false; }
        if (hideGameObject === undefined) { hideGameObject = false; }

        this.body.stop();

        this.body.enable = false;

        if (disableGameObject)
        {
            this.body.gameObject.active = false;
        }

        if (hideGameObject)
        {
            this.body.gameObject.visible = false;
        }

        return this;
    },

    /**
     * Syncs the Bodies position and size with its parent Game Object.
     * You don't need to call this for Dynamic Bodies, as it happens automatically.
     * But for Static bodies it's a useful way of modifying the position of a Static Body
     * in the Physics World, based on its Game Object.
     *
     * @method Phaser.Physics.Arcade.Components.Enable#refreshBody
     * @since 3.1.0
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    refreshBody: function ()
    {
        this.body.updateFromGameObject();

        return this;
    }

};

module.exports = Enable;
