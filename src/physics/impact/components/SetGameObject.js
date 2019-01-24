/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Impact Set Game Object component.
 * Should be applied as a mixin.
 *
 * @name Phaser.Physics.Impact.Components.SetGameObject
 * @since 3.0.0
 */
var SetGameObject = {

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.SetGameObject#setGameObject
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - [description]
     * @param {boolean} [sync=true] - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setGameObject: function (gameObject, sync)
    {
        if (sync === undefined) { sync = true; }

        if (gameObject)
        {
            this.body.gameObject = gameObject;

            if (sync)
            {
                this.syncGameObject();
            }
        }
        else
        {
            this.body.gameObject = null;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.SetGameObject#syncGameObject
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    syncGameObject: function ()
    {
        var gameObject = this.body.gameObject;

        if (gameObject)
        {
            this.setBodySize(gameObject.width * gameObject.scaleX, gameObject.height * gameObject.scaleY);
        }

        return this;
    }

};

module.exports = SetGameObject;
