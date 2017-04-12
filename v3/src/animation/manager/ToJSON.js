var ToJSON = function (key)
{
    if (key !== undefined)
    {
        return this.anims.get(key).toJSON();
    }
    else
    {
        var output = {
            anims: [],
            globalTimeScale: this.globalTimeScale
        };

        this.anims.each(function (key, anim)
        {
            output.anims.push(anim.toJSON());
        });

        return output;
    }
};

module.exports = ToJSON;
