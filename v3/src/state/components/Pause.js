var Pause = function (key)
{
    var entry = this.getActiveState(key);

    if (entry)
    {
        entry.state.sys.pause();
    }
};

module.exports = Pause;
