/**
* We're replacing a couple of Pixi's methods here to fix or add some vital functionality:
*
* 1) Added support for Trimmed sprite sheets
* 2) Skip display objects with an alpha of zero
* 3) Avoid Style Recalculation from the incorrect bgcolor value
*
* Hopefully we can remove this once Pixi has been updated to support these things.
*/

/**
 * Renders the stage to its canvas view
 *
 * @method render
 * @param stage {Stage} the Stage element to be rendered
 */
PIXI.CanvasRenderer.prototype.render = function(stage)
{
    PIXI.texturesToUpdate.length = 0;
    PIXI.texturesToDestroy.length = 0;
    
    PIXI.visibleCount++;
    stage.updateTransform();

    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.width, this.height)
    this.renderDisplayObject(stage);
   
    //  Remove frame updates
    if (PIXI.Texture.frameUpdates.length > 0)
    {
        PIXI.Texture.frameUpdates.length = 0;
    }
    
}

PIXI.CanvasRenderer.prototype.renderDisplayObject = function(displayObject)
{
    // Once the display object hits this we can break the loop  
    var testObject = displayObject.last._iNext;
    displayObject = displayObject.first;
    
    do
    {
        //transform = displayObject.worldTransform;
        
        if (!displayObject.visible)
        {
            displayObject = displayObject.last._iNext;
            continue;
        }
        
        if (!displayObject.renderable || displayObject.alpha === 0)
        {
            displayObject = displayObject._iNext;
            continue;
        }
        
        if (displayObject instanceof PIXI.Sprite)
        {
            // var frame = displayObject.texture.frame;
            
            if (displayObject.texture.frame)
            {
                this.context.globalAlpha = displayObject.worldAlpha;

                this.context.setTransform(
                        displayObject.worldTransform[0],
                        displayObject.worldTransform[3],
                        displayObject.worldTransform[1],
                        displayObject.worldTransform[4],
                        displayObject.worldTransform[2],
                        displayObject.worldTransform[5]);
                
                if (displayObject.texture.trimmed)
                {
                    this.context.transform(1, 0, 0, 1, displayObject.texture.trim.x, displayObject.texture.trim.y);
                }

                //if smoothingEnabled is supported and we need to change the smoothing property for this texture
                if (this.smoothProperty && this.scaleMode !== displayObject.texture.baseTexture.scaleMode)
                {
                    this.scaleMode = displayObject.texture.baseTexture.scaleMode;
                    this.context[this.smoothProperty] = (this.scaleMode === PIXI.BaseTexture.SCALE_MODE.LINEAR);
                }
                    
                this.context.drawImage(
                    displayObject.texture.baseTexture.source,
                    displayObject.texture.frame.x,
                    displayObject.texture.frame.y,
                    displayObject.texture.frame.width,
                    displayObject.texture.frame.height,
                    Math.floor((displayObject.anchor.x) * -displayObject.texture.frame.width),
                    Math.floor((displayObject.anchor.y) * -displayObject.texture.frame.height),
                    displayObject.texture.frame.width,
                    displayObject.texture.frame.height);
            }
        }
        else if (displayObject instanceof PIXI.Strip)
        {
            this.context.setTransform(displayObject.worldTransform[0], displayObject.worldTransform[3], displayObject.worldTransform[1], displayObject.worldTransform[4], displayObject.worldTransform[2], displayObject.worldTransform[5])
            this.renderStrip(displayObject);
        }
        else if (displayObject instanceof PIXI.TilingSprite)
        {
            this.context.setTransform(displayObject.worldTransform[0], displayObject.worldTransform[3], displayObject.worldTransform[1], displayObject.worldTransform[4], displayObject.worldTransform[2], displayObject.worldTransform[5])
            this.renderTilingSprite(displayObject);
        }
        else if (displayObject instanceof PIXI.CustomRenderable)
        {
            displayObject.renderCanvas(this);
        }
        else if (displayObject instanceof PIXI.Graphics)
        {
            this.context.setTransform(displayObject.worldTransform[0], displayObject.worldTransform[3], displayObject.worldTransform[1], displayObject.worldTransform[4], displayObject.worldTransform[2], displayObject.worldTransform[5])
            PIXI.CanvasGraphics.renderGraphics(displayObject, this.context);
        }
        else if (displayObject instanceof PIXI.FilterBlock)
        {
            if (displayObject.open)
            {
                this.context.save();
                
                var cacheAlpha = displayObject.mask.alpha;
                var maskTransform = displayObject.mask.worldTransform;
                
                this.context.setTransform(maskTransform[0], maskTransform[3], maskTransform[1], maskTransform[4], maskTransform[2], maskTransform[5])
                
                displayObject.mask.worldAlpha = 0.5;
                
                this.context.worldAlpha = 0;
                
                PIXI.CanvasGraphics.renderGraphicsMask(displayObject.mask, this.context);
                this.context.clip();
                
                displayObject.mask.worldAlpha = cacheAlpha;
            }
            else
            {
                this.context.restore();
            }
        }
        //  count++
        displayObject = displayObject._iNext;
    }
    while(displayObject != testObject)
    
}

PIXI.WebGLBatch.prototype.update = function()
{
    // var gl = this.gl;
    // var worldTransform, width, height, aX, aY, w0, w1, h0, h1, index, index2, index3

    var worldTransform, width, height, aX, aY, w0, w1, h0, h1, index;

    var a, b, c, d, tx, ty;

    var indexRun = 0;

    var displayObject = this.head;

    while(displayObject)
    {
        if(displayObject.vcount === PIXI.visibleCount)
        {
            width = displayObject.texture.frame.width;
            height = displayObject.texture.frame.height;

            // TODO trim??
            aX = displayObject.anchor.x;// - displayObject.texture.trim.x
            aY = displayObject.anchor.y; //- displayObject.texture.trim.y
            w0 = width * (1-aX);
            w1 = width * -aX;

            h0 = height * (1-aY);
            h1 = height * -aY;

            index = indexRun * 8;

            worldTransform = displayObject.worldTransform;

            a = worldTransform[0];
            b = worldTransform[3];
            c = worldTransform[1];
            d = worldTransform[4];
            tx = worldTransform[2];
            ty = worldTransform[5];

            if (displayObject.texture.trimmed)
            {
                tx += displayObject.texture.trim.x;
                ty += displayObject.texture.trim.y;
            }

            this.verticies[index + 0 ] = a * w1 + c * h1 + tx;
            this.verticies[index + 1 ] = d * h1 + b * w1 + ty;

            this.verticies[index + 2 ] = a * w0 + c * h1 + tx;
            this.verticies[index + 3 ] = d * h1 + b * w0 + ty;

            this.verticies[index + 4 ] = a * w0 + c * h0 + tx;
            this.verticies[index + 5 ] = d * h0 + b * w0 + ty;

            this.verticies[index + 6] =  a * w1 + c * h0 + tx;
            this.verticies[index + 7] =  d * h0 + b * w1 + ty;

            if(displayObject.updateFrame || displayObject.texture.updateFrame)
            {
                this.dirtyUVS = true;

                var texture = displayObject.texture;

                var frame = texture.frame;
                var tw = texture.baseTexture.width;
                var th = texture.baseTexture.height;

                this.uvs[index + 0] = frame.x / tw;
                this.uvs[index +1] = frame.y / th;

                this.uvs[index +2] = (frame.x + frame.width) / tw;
                this.uvs[index +3] = frame.y / th;

                this.uvs[index +4] = (frame.x + frame.width) / tw;
                this.uvs[index +5] = (frame.y + frame.height) / th;

                this.uvs[index +6] = frame.x / tw;
                this.uvs[index +7] = (frame.y + frame.height) / th;

                displayObject.updateFrame = false;
            }

            // TODO this probably could do with some optimisation....
            if(displayObject.cacheAlpha != displayObject.worldAlpha)
            {
                displayObject.cacheAlpha = displayObject.worldAlpha;

                var colorIndex = indexRun * 4;
                this.colors[colorIndex] = this.colors[colorIndex + 1] = this.colors[colorIndex + 2] = this.colors[colorIndex + 3] = displayObject.worldAlpha;
                this.dirtyColors = true;
            }
        }
        else
        {
            index = indexRun * 8;

            this.verticies[index + 0 ] = 0;
            this.verticies[index + 1 ] = 0;

            this.verticies[index + 2 ] = 0;
            this.verticies[index + 3 ] = 0;

            this.verticies[index + 4 ] = 0;
            this.verticies[index + 5 ] = 0;

            this.verticies[index + 6] = 0;
            this.verticies[index + 7] = 0;
        }

        indexRun++;
        displayObject = displayObject.__next;
    }
}
