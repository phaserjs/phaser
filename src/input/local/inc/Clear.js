var Clear = function (gameObject)
{
    var input = gameObject.input;

    input.gameObject = undefined;
    input.target = undefined;
    input.hitArea = undefined;
    input.hitAreaCallback = undefined;
    input.callbackContext = undefined;

    gameObject.input = null;

    return gameObject;
};

module.exports = Clear;
