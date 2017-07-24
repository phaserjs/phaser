var ChildOnDown = function (pointer, interactiveObject)
{
    //  If the callback returns false then we don't consider this child as interacted with
    var result = interactiveObject.onDown(interactiveObject.gameObject, pointer, interactiveObject.localX, interactiveObject.localY);

    if (result !== false)
    {
        interactiveObject.isDown = true;

        this.children.down[pointer.id].push(interactiveObject);

        if (interactiveObject.draggable && !interactiveObject.isDragged)
        {
            //  Apply drag criteria here
            this.childOnDragStart(pointer, interactiveObject);
        }
    }
};

module.exports = ChildOnDown;
