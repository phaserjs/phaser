/**
* Note that 'this' in all functions here refer to the owning object.
* For example the Group, Stage, Sprite, etc. because the render function
* here is mapped to the prototype for the game object.
*/
Phaser.Renderer.WebGL.GameObjects.Stage = {

    TYPES: [
        Phaser.Stage.prototype
    ],

    render: function (renderer, src)
    {
        // console.log('stage render', src.visible);

        if (!src.visible || src.alpha === 0 || src.children.list.length === 0)
        {
            return;
        }

        for (var i = 0; i < src.children.list.length; i++)
        {
            var child = src.children.list[i];

            child.render(renderer, child);
        }
    }

};
