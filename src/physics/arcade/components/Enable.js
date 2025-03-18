/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
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
     * Sets whether this Body should calculate its velocity based on its change in
     * position every frame. The default, which is to not do this, means that you
     * make this Body move by setting the velocity directly. However, if you are
     * trying to move this Body via a Tween, or have it follow a Path, then you
     * should enable this instead. This will allow it to still collide with other
     * bodies, something that isn't possible if you're just changing its position directly.
     *
     * @method Phaser.Physics.Arcade.Components.Enable#setDirectControl
     * @since 3.70.0
     *
     * @param {boolean} [value=true] - `true` if the Body calculate velocity based on changes in position, otherwise `false`.
     *
     * @return {this} This Game Object.
     */
    setDirectControl: function (value)
    {
        this.body.setDirectControl(value);

        return this;
    },

    /**
     * Enables this Game Object's Body.
     * If you reset the Body you must also pass `x` and `y`.
     *
     * @method Phaser.Physics.Arcade.Components.Enable#enableBody
     * @since 3.0.0
     *
     * @param {boolean} [reset] - Also reset the Body and place the Game Object at (x, y).
     * @param {number} [x] - The horizontal position to place the Game Object, if `reset` is true.
     * @param {number} [y] - The horizontal position to place the Game Object, if `reset` is true.
     * @param {boolean} [enableGameObject] - Also set this Game Object's `active` to true.
     * @param {boolean} [showGameObject] - Also set this Game Object's `visible` to true.
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
     * @param {boolean} [disableGameObject=false] - Also set this Game Object's `active` to false.
     * @param {boolean} [hideGameObject=false] - Also set this Game Object's `visible` to false.
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
