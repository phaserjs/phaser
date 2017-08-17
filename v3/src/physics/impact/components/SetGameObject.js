var SetGameObject = {

    setGameObject: function (gameObject, setSize)
    {
        if (setSize === undefined) { setSize = true; }

        if (gameObject)
        {
            this.body.gameObject = gameObject;

            if (setSize)
            {
                this.setSize(gameObject.width, gameObject.height);
            }
        }
        else
        {
            this.body.gameObject = null;
        }

        return this;
    }

};

module.exports = SetGameObject;
