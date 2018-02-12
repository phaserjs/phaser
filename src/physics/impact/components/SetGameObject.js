/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
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
     * @param {[type]} gameObject - [description]
     * @param {[type]} sync - [description]
     *
     * @return {[type]} [description]
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
     * @return {[type]} [description]
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
