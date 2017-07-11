var Sleep = function (key)
{
    var entry = this.getActiveState(key);

    if (entry)
    {
        entry.state.sys.sleep();
    }
};

module.exports = Sleep;
