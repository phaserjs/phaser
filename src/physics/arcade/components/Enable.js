/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for setting the enable properties of an Arcade Physics Body.
 *
 * @namespace Phaser.Physics.Arcade.Components.Enable
 * @since 3.0.0
 */
var Enable = {

    /**
     * Enables this Game Object's Body.
     *
     * @method Phaser.Physics.Arcade.Components.Enable#enableBody
     * @since 3.0.0
     *
     * @param {boolean} reset - Also reset the Body and place it at (x, y).
     * @param {number} x - The horizontal position to place the Game Object and Body.
     * @param {number} y - The horizontal position to place the Game Object and Body.
     * @param {boolean} enableGameObject - Also activate this Game Object.
     * @param {boolean} showGameObject - Also show this Game Object.
     *
     * @return {this} This Game Object.
     *
     * @see Phaser.Physics.Arcade.Body#enable
     * @see Phaser.Physics.Arcade.StaticBody#enable
     * @see Phaser.Physics.Arcade.Body#reset
     * @see Phaser.Physics.Arcade.StaticBody#reset
     * @see Phaser.GameObjects.GameObject#active
     * @see Phaser.GameObjects.GameObject#visible
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
     * Stops and disables this Game Object's Body.
     *
     * @method Phaser.Physics.Arcade.Components.Enable#disableBody
     * @since 3.0.0
     *
     * @param {boolean} [disableGameObject=false] - Also deactivate this Game Object.
     * @param {boolean} [hideGameObject=false] - Also hide this Game Object.
     *
     * @return {this} This Game Object.
     *
     * @see Phaser.Physics.Arcade.Body#enable
     * @see Phaser.Physics.Arcade.StaticBody#enable
     * @see Phaser.GameObjects.GameObject#active
     * @see Phaser.GameObjects.GameObject#visible
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
     * Syncs the Body's position and size with its parent Game Object.
     * You don't need to call this for Dynamic Bodies, as it happens automatically.
     * But for Static bodies it's a useful way of modifying the position of a Static Body
     * in the Physics World, based on its Game Object.
     *
     * @method Phaser.Physics.Arcade.Components.Enable#refreshBody
     * @since 3.1.0
     *
     * @return {this} This Game Object.
     *
     * @see Phaser.Physics.Arcade.StaticBody#updateFromGameObject
     */
    refreshBody: function ()
    {
        this.body.updateFromGameObject();

        return this;
    }

};

module.exports = Enable;
