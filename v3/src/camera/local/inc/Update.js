var Update = function (timestep, delta)
{
    for (var i = 0, l = this.cameras.length; i < l; ++i)
    {
        this.cameras[i].update(timestep, delta);
    }
};

module.exports = Update;
