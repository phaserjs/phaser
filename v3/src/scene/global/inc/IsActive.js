var IsActive = function (key)
{
    var entry = this.getActiveScene(key);

    return (entry && entry.scene.sys.settings.active);
};

module.exports = IsActive;
