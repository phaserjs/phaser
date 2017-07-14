var SortScenes = function (sceneA, sceneB)
{
    // console.log('sortScenes', sceneA.scene.sys.settings.key, sceneA.index, sceneB.scene.sys.settings.key, sceneB.index);

    //  Sort descending
    if (sceneA.index < sceneB.index)
    {
        return -1;
    }
    else if (sceneA.index > sceneB.index)
    {
        return 1;
    }
    else
    {
        return 0;
    }
};

module.exports = SortScenes;
