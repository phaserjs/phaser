/**
* Note that 'this' in all functions here refer to the owning object.
* For example the Group, Stage, Sprite, etc. because the render function
* here is mapped to the prototype for the game object.
*/
Phaser.Renderer.Canvas.GameObjects.SpriteBatch = {

    render: function (renderer)
    {
        if (!this.visible || this.alpha <= 0 || !this.children.length)
        {
            return;
        }
        
        var context = renderer.context;

        context.globalAlpha = this.worldAlpha;

        this.displayObjectUpdateTransform();

        var transform = this.worldTransform;
           
        var isRotated = true;

        for (var i = 0; i < this.children.length; i++)
        {
            var child = this.children[i];

            if (!child.visible)
            {
                continue;
            }

            var texture = child.texture;
            var frame = texture.frame;

            context.globalAlpha = this.worldAlpha * child.alpha;

            if (child.rotation % Phaser.Math.PI2 === 0)
            {
                //  If rotation === 0 we can avoid setTransform

                if (isRotated)
                {
                    context.setTransform(transform.a, transform.b, transform.c, transform.d, transform.tx, transform.ty);
                    isRotated = false;
                }

                context.drawImage(
                    texture.baseTexture.source,
                    frame.x,
                    frame.y,
                    frame.width,
                    frame.height,
                    ((child.anchor.x) * (-frame.width * child.scale.x) + child.position.x + 0.5 + renderSession.shakeX) | 0,
                    ((child.anchor.y) * (-frame.height * child.scale.y) + child.position.y + 0.5 + renderSession.shakeY) | 0,
                    frame.width * child.scale.x,
                    frame.height * child.scale.y);
            }
            else
            {
                if (!isRotated)
                {
                    isRotated = true;
                }
        
                child.displayObjectUpdateTransform();
               
                var childTransform = child.worldTransform;
                var tx = (childTransform.tx * renderSession.resolution) + renderSession.shakeX;
                var ty = (childTransform.ty * renderSession.resolution) + renderSession.shakeY;

                // allow for trimming
               
                if (renderer.roundPixels)
                {
                    context.setTransform(childTransform.a, childTransform.b, childTransform.c, childTransform.d, tx | 0, ty | 0);
                }
                else
                {
                    context.setTransform(childTransform.a, childTransform.b, childTransform.c, childTransform.d, tx, ty);
                }

                context.drawImage(
                    texture.baseTexture.source,
                    frame.x,
                    frame.y,
                    frame.width,
                    frame.height,
                    ((child.anchor.x) * (-frame.width) + 0.5) | 0,
                    ((child.anchor.y) * (-frame.height) + 0.5) | 0,
                    frame.width,
                    frame.height);
            }
        }
    }
};
