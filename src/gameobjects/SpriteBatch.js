/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The SpriteBatch class is a really fast version of the DisplayObjectContainer built purely for speed, so use when you need a lot of sprites or particles.
* It's worth mentioning that by default sprite batches are used through-out the renderer, so you only really need to use a SpriteBatch if you have over
* 1000 sprites that all share the same texture (or texture atlas). It's also useful if running in Canvas mode and you have a lot of un-rotated or un-scaled
* Sprites as it skips all of the Canvas setTransform calls, which helps performance, especially on mobile devices.
*
* Please note that any Sprite that is part of a SpriteBatch will not have its bounds updated, so will fail checks such as outOfBounds.
*
* @class Phaser.SpriteBatch
* @extends Phaser.Group
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Phaser.Group|Phaser.Sprite|null} parent - The parent Group, DisplayObject or DisplayObjectContainer that this Group will be added to. If `undefined` or `null` it will use game.world.
* @param {string} [name=group] - A name for this Group. Not used internally but useful for debugging.
* @param {boolean} [addToStage=false] - If set to true this Group will be added directly to the Game.Stage instead of Game.World.
*/
Phaser.SpriteBatch = function (game, parent, name, addToStage) {

    if (parent === undefined || parent === null) { parent = game.world; }

    Phaser.Group.call(this, game, parent, name, addToStage);

    /**
    * @property {number} type - Internal Phaser Type value.
    * @protected
    */
    this.type = Phaser.SPRITEBATCH;

    /**
    * @property {Object} fastSpriteBatch - WebGL Batch Shader.
    * @private
    */
    this.fastSpriteBatch = null;

    /**
    * @property {boolean} ready - Internal flag.
    * @private
    */
    this.ready = false;

};

Phaser.SpriteBatch.prototype = Object.create(Phaser.Group.prototype);

Phaser.SpriteBatch.prototype.constructor = Phaser.SpriteBatch;

/**
* Renders the Sprite Batch using the WebGL renderer.
*
* @private
* @method
* @memberof Phaser.SpriteBatch
* @param {RenderSession} renderSession
*/
Phaser.SpriteBatch.prototype._renderWebGL = function (renderSession) {

    if (!this.visible || this.alpha <= 0 || !this.children.length)
    {
        return;
    }

    if (!this.ready)
    {
        this.fastSpriteBatch = new PIXI.WebGLFastSpriteBatch(renderSession.gl);

        this.ready = true;
    }
    
    if (this.fastSpriteBatch.gl !== renderSession.gl)
    {
        this.fastSpriteBatch.setContext(renderSession.gl);
    }

    renderSession.spriteBatch.stop();
    
    renderSession.shaderManager.setShader(renderSession.shaderManager.fastShader);
    
    this.fastSpriteBatch.begin(this, renderSession);
    this.fastSpriteBatch.render(this);

    renderSession.spriteBatch.start();
 
};

/**
* Renders the Sprite Batch using the Canvas renderer.
*
* @private
* @method
* @memberof Phaser.SpriteBatch
* @param {RenderSession} renderSession
*/
Phaser.SpriteBatch.prototype._renderCanvas = function (renderSession) {

    if (!this.visible || this.alpha <= 0 || !this.children.length)
    {
        return;
    }
    
    var context = renderSession.context;

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

        if (child.rotation % (Math.PI * 2) === 0)
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
           
            if (renderSession.roundPixels)
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

};
