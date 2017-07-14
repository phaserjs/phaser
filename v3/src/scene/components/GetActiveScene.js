var GetActiveScene = function (key)
{
    var scene = this.getScene(key);

    for (var i = 0; i < this.active.length; i++)
    {
        if (this.active[i].scene === scene)
        {
            return this.active[i];
        }
    }
};

module.exports = GetActiveScene;
