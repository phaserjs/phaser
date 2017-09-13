var Pause = function (key)
{
    var entry = this.getActiveScene(key);

    if (entry)
    {
        entry.scene.sys.pause();
    }
};

module.exports = Pause;
