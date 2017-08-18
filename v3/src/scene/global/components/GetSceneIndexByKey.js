var GetSceneIndexByKey = function (key)
{
    var scene = this.keys[key];

    return this.scenes.indexOf(scene);
};

module.exports = GetSceneIndexByKey;
