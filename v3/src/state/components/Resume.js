var Resume = function (key)
{
    var entry = this.getActiveState(key);

    if (entry)
    {
        entry.state.sys.resume();
    }
};

module.exports = Resume;
