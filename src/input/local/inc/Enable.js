var Enable = function (gameObject, shape, callback)
{
    if (gameObject.input)
    {
        //  If it is already has an InteractiveObject then just enable it and return
        gameObject.input.enabled = true;
    }
    else
    {
        //  Create an InteractiveObject and enable it
        this.setHitArea(gameObject, shape, callback);
    }

    return this;
};

module.exports = Enable;
