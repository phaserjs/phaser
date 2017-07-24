var GetInteractiveObject = function (gameObject)
{
    var list = this.children.list;

    for (var i = 0; i < list.length; i++)
    {
        var interactiveObject = list[i];

        if (gameObject === interactiveObject.gameObject)
        {
            return interactiveObject;
        }
    }

    return null;
};

module.exports = GetInteractiveObject;
