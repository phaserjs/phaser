/**
* Note that 'this' in all functions here refer to the owning object.
* For example the Group, Stage, Sprite, etc. because the render function
* here is mapped to the prototype for the game object.
*/
Phaser.Renderer.Canvas.GameObjects.Stage = {

    render: function (renderer)
    {
        if (this.visible === false || this.alpha === 0)
        {
            return;
        }

        if (this._mask)
        {
            renderer.pushMask(this._mask);
        }

        for (var i = 0; i < this.children.length; i++)
        {
            this.children[i].render(renderer);
        }

        if (this._mask)
        {
            renderer.popMask();
        }

    }

};
