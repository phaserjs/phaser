var RemoveFromDOM = function (element)
{
    if (element.parentNode)
    {
        element.parentNode.removeChild(element);
    }
};

module.exports = RemoveFromDOM;
