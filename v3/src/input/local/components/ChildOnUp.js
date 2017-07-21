var ChildOnUp = function (index, pointer, interactiveObject)
{
    interactiveObject.isDown = false;

    //  If we are not processing topOnly items, or we are and this IS the topmost item, then hit it
    if (!this.topOnly || (this.topOnly && index === 0))
    {
        interactiveObject.onUp(interactiveObject.gameObject, pointer);
    }
};

module.exports = ChildOnUp;
