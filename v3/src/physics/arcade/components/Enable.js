var Enable = {

    enableBody: function (reset, x, y)
    {
        this.body.enable = true;

        if (reset)
        {
            this.body.reset(x, y);
        }

        return this;
    },

    disableBody: function (reset, x, y)
    {
        this.body.stop();

        this.body.enable = false;

        if (reset)
        {
            this.body.reset(x, y);
        }

        return this;
    }

};

module.exports = Enable;
