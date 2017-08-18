//  Gets the Active scene at the given position

var GetSceneAt = function (index)
{
    if (this.active[index])
    {
        return this.active[index].scene;
    }
};

module.exports = GetSceneAt;
