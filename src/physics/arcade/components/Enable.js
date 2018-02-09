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
     * @param {[type]} reset - [description]
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     * @param {[type]} enableGameObject - [description]
     * @param {[type]} showGameObject - [description]
     *
     * @return {[type]} [description]
     */
    enableBody: function (reset, x, y, enableGameObject, showGameObject)
    {
        this.body.enable = true;

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

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Components.Enable#disableBody
     * @since 3.0.0
     *
     * @param {[type]} disableGameObject - [description]
     * @param {[type]} hideGameObject - [description]
     *
     * @return {[type]} [description]
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
    }

};

module.exports = Enable;
