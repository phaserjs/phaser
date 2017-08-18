var IsActive = function (key)
{
    var scene = this.getActiveScene(key);

    return (scene && scene.sys.settings.active);
};

module.exports = IsActive;
