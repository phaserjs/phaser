var ChildOnDown = function (pointer, interactiveObject)
{
    interactiveObject.isDown = true;

    interactiveObject.onDown(interactiveObject.gameObject, pointer, interactiveObject.localX, interactiveObject.localY);

    this.children.down[pointer.id].push(interactiveObject);

    // if (input.draggable && !input.isDragged)
    // {
    //     this.gameObjectOnDragStart(pointer, gameObject);
    // }
};

module.exports = ChildOnDown;
