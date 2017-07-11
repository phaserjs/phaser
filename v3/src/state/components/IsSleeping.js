var IsSleeping = function (key)
{
    var entry = this.getActiveState(key);

    if (entry)
    {
        return (!entry.state.sys.settings.active && !entry.state.sys.settings.visible);
    }

    return false;
};

module.exports = IsSleeping;
