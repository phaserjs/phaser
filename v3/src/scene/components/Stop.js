var SortScenes = require('./SortScenes');

var Stop = function (key)
{
    var entry = this.getActiveScene(key);

    if (entry)
    {
        entry.scene.sys.shutdown();

        //  Remove from the active list
        var index = this.active.indexOf(entry);

        if (index !== -1)
        {
            this.active.splice(index, 1);

            this.active.sort(SortScenes);
        }
    }
};

module.exports = Stop;
