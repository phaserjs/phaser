var SortStates = require('./SortStates');

var Stop = function (key)
{
    var entry = this.getActiveState(key);

    if (entry)
    {
        entry.state.sys.shutdown();

        //  Remove from the active list
        var index = this.active.indexOf(entry);

        if (index !== -1)
        {
            this.active.splice(index, 1);

            this.active.sort(SortStates);
        }
    }
};

module.exports = Stop;
