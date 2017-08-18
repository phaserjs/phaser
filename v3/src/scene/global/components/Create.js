var SortScenes = require('./SortScenes');

var Create = function (scene)
{
    //  Insert at the correct index, or it just all goes wrong :)

    var i = this.getSceneIndex(scene);

    this.active.push({ index: i, scene: scene });

    //  Sort the 'active' array based on the index property
    this.active.sort(SortScenes);

    if (scene.create)
    {
        scene.create.call(scene, scene.sys.settings.data);
    }
};

module.exports = Create;
