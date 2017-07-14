var Wake = function (key)
{
    var entry = this.getActiveScene(key);

    if (entry)
    {
        entry.scene.sys.wake();
    }
};

module.exports = Wake;
