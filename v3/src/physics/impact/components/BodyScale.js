var BodyScale = {

    setBodySize: function (width, height)
    {
        if (height === undefined) { height = width; }

        this.body.size.x = Math.round(width);
        this.body.size.y = Math.round(height);

        return this;
    },

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
