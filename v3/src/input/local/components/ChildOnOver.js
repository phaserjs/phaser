var ChildOnOver = function (index, pointer, interactiveObject)
{
    interactiveObject.isOver = true;

    //  If we are not processing topOnly items, or we are and this IS the topmost item, then hit it
    if (!this.topOnly || (this.topOnly && index === 0))
    {
        //  Don't dispatch if we're dragging the gameObject, as the pointer often gets away from it
        if (!interactiveObject.isDragged)
        {
            interactiveObject.onOver(interactiveObject.gameObject, pointer, interactiveObject.localX, interactiveObject.localY);
        }
    }
};

module.exports = ChildOnOver;
