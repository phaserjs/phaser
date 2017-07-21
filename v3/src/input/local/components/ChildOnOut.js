ChildOnOut = function (index, pointer, interactiveObject)
{
    interactiveObject.isOver = false;

    //  If we are not processing topOnly items, or we are and this IS the topmost item, then hit it
    if (!this.topOnly || (this.topOnly && index === 0))
    {
        //  Don't dispatch if we're dragging the gameObject, as the pointer often gets away from it
        if (!interactiveObject.isDragged)
        {
            interactiveObject.onOut(interactiveObject.gameObject, pointer);
        }
    }
};

module.exports = ChildOnOut;
