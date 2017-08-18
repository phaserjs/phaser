var IsSleeping = function (key)
{
    var entry = this.getActiveScene(key);

    if (entry)
    {
        return (!entry.scene.sys.settings.active && !entry.scene.sys.settings.visible);
    }

    return false;
};

module.exports = IsSleeping;
