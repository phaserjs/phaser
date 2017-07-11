var Wake = function (key)
{
    var entry = this.getActiveState(key);

    if (entry)
    {
        entry.state.sys.wake();
    }
};

module.exports = Wake;
