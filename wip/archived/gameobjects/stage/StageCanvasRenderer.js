
/**
* Note that 'this' in all functions here refer to the owning object.
* For example the Group, Stage, Sprite, etc. because the render function
* here is mapped to the prototype for the game object.
*/
Phaser.Renderer.Canvas.GameObjects.Stage = {

    TYPES: [
        Phaser.Stage.prototype
    ],

    render: function (renderer, src)
    {
        if (src.visible === false || src.alpha === 0)
        {
            return;
        }

        // if (src._mask)
        // {
        //     renderer.pushMask(src._mask);
        // }

        for (var i = 0; i < src.children.list.length; i++)
        {
            var child = src.children.list[i];

            child.render(renderer, child);
        }

        // if (src._mask)
        // {
        //     renderer.popMask();
        // }

    }

};
