/**
 * We're replacing a couple of Pixi's methods here to fix or add some vital functionality:
 *
 * 1) Added support for Trimmed sprite sheets
 * 2) Skip display objects with an alpha of zero
 *
 * Hopefully we can remove this once Pixi has been updated to support these things.
 */

PIXI.CanvasRenderer.prototype.renderDisplayObject = function(displayObject)
{
	// no loger recurrsive!
	var transform;
	var context = this.context;
	
	context.globalCompositeOperation = 'source-over';
	
	// one the display object hits this. we can break the loop	
	var testObject = displayObject.last._iNext;
	displayObject = displayObject.first;
	
	do	
	{
		transform = displayObject.worldTransform;
		
		if(!displayObject.visible)
		{
			displayObject = displayObject.last._iNext;
			continue;
		}
		
		// if(!displayObject.renderable || displayObject.alpha == 0)
		if(!displayObject.renderable)
		{
			displayObject = displayObject._iNext;
			continue;
		}
		
		if(displayObject instanceof PIXI.Sprite)
		{
			var frame = displayObject.texture.frame;
			
			if(frame)
			{
				context.globalAlpha = displayObject.worldAlpha;
				
				if (displayObject.texture.trimmed)
				{
					context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2] + displayObject.texture.trim.x, transform[5] + displayObject.texture.trim.y);
				}
				else
				{
					context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5]);
				}
					
				context.drawImage(displayObject.texture.baseTexture.source, 
								   frame.x,
								   frame.y,
								   frame.width,
								   frame.height,
								   (displayObject.anchor.x) * -frame.width, 
								   (displayObject.anchor.y) * -frame.height,
								   frame.width,
								   frame.height);
			}					   
	   	}
	   	else if(displayObject instanceof PIXI.Strip)
		{
			context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5])
			this.renderStrip(displayObject);
		}
		else if(displayObject instanceof PIXI.TilingSprite)
		{
			context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5])
			this.renderTilingSprite(displayObject);
		}
		else if(displayObject instanceof PIXI.CustomRenderable)
		{
			displayObject.renderCanvas(this);
		}
		else if(displayObject instanceof PIXI.Graphics)
		{
			context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5])
			PIXI.CanvasGraphics.renderGraphics(displayObject, context);
		}
		else if(displayObject instanceof PIXI.FilterBlock)
		{
			if(displayObject.open)
			{
				context.save();
				
				var cacheAlpha = displayObject.mask.alpha;
				var maskTransform = displayObject.mask.worldTransform;
				
				context.setTransform(maskTransform[0], maskTransform[3], maskTransform[1], maskTransform[4], maskTransform[2], maskTransform[5])
				
				displayObject.mask.worldAlpha = 0.5;
				
				context.worldAlpha = 0;
				
				PIXI.CanvasGraphics.renderGraphicsMask(displayObject.mask, context);
				context.clip();
				
				displayObject.mask.worldAlpha = cacheAlpha;
			}
			else
			{
				context.restore();
			}
		}
	//	count++
		displayObject = displayObject._iNext;
		
		
	}
	while(displayObject != testObject)
	
}

PIXI.WebGLBatch.prototype.update = function()
{
	var gl = this.gl;
	var worldTransform, width, height, aX, aY, w0, w1, h0, h1, index, index2, index3

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
