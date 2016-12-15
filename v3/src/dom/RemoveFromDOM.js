function RemoveFromDOM (element)
{
    if (element.parentNode)
    {
        element.parentNode.removeChild(element);
    }
}

module.exports = RemoveFromDOM;
