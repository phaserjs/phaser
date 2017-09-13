var SortScenes = function (sceneA, sceneB)
{
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
