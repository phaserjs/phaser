var Sleep = function (key)
{
    var entry = this.getActiveScene(key);

    if (entry)
    {
        entry.scene.sys.sleep();
    }
};

module.exports = Sleep;
