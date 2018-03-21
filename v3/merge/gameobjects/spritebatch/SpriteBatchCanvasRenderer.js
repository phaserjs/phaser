/**
* Note that 'this' in all functions here refer to the owning object.
* For example the Group, Stage, Sprite, etc. because the render function
* here is mapped to the prototype for the game object.
*/
Phaser.Renderer.Canvas.GameObjects.SpriteBatch = {

    TYPES: [
        Phaser.GameObject.SpriteBatch.prototype
    ],

    render: function (renderer, src)
    {
        if (!src.visible || src.alpha <= 0 || !src.children.length)
        {
            return;
        }
        
        var context = renderer.context;

        context.globalAlpha = src.worldAlpha;

        src.displayObjectUpdateTransform();

        var transform = src.worldTransform;
           
        var isRotated = true;

        for (var i = 0; i < src.children.length; i++)
        {
            var child = src.children[i];

            if (!child.visible)
            {
                continue;
            }

            var texture = child.texture;
            var frame = texture.frame;

            context.globalAlpha = src.worldAlpha * child.alpha;

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
                    ((child.anchor.x) * (-frame.width * child.scale.x) + child.position.x + 0.5 + renderer.game.camera._shake.x) | 0,
                    ((child.anchor.y) * (-frame.height * child.scale.y) + child.position.y + 0.5 + renderer.game.camera._shake.y) | 0,
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
                var tx = (childTransform.tx * renderer.game.resolution) + renderer.game.camera._shake.x;
                var ty = (childTransform.ty * renderer.game.resolution) + renderer.game.camera._shake.y;

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
