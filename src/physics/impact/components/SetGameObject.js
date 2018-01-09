var SetGameObject = {

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
