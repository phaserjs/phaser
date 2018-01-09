var Ignore = function (gameObjectOrArray)
{
    if (gameObjectOrArray instanceof Array)
    {
        for (var index = 0; index < gameObjectOrArray.length; ++index)
        {
            gameObjectOrArray[index].cameraFilter |= this._id;
        }
    }
    else
    {
        gameObjectOrArray.cameraFilter |= this._id;
    }
};

module.exports = Ignore;
