var Resume = function (key)
{
    var entry = this.getActiveScene(key);

    if (entry)
    {
        entry.scene.sys.resume();
    }
};

module.exports = Resume;
