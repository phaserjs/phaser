/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A set of functions used by the webGL renderer to draw the primitive graphics data
 *
 * @class CanvasGraphics
 */
PIXI.WebGLGraphics = function()
{
	
}

/**
 * Renders the graphics object
 *
 * @static
 * @private
 * @method renderGraphics
 * @param graphics {Graphics}
 * @param projection {Object}
 */
PIXI.WebGLGraphics.renderGraphics = function(graphics, projection)
{
	var gl = PIXI.gl;
	
	if(!graphics._webGL)graphics._webGL = {points:[], indices:[], lastIndex:0, 
										   buffer:gl.createBuffer(),
										   indexBuffer:gl.createBuffer()};
	
	if(graphics.dirty)
	{
		graphics.dirty = false;
		
		if(graphics.clearDirty)
		{
			graphics.clearDirty = false;
			
			graphics._webGL.lastIndex = 0;
			graphics._webGL.points = [];
			graphics._webGL.indices = [];
			
		}
		
		PIXI.WebGLGraphics.updateGraphics(graphics);
	}
	
	PIXI.activatePrimitiveShader();
	
	// This  could be speeded up fo sure!
	var m = PIXI.mat3.clone(graphics.worldTransform);
	
	PIXI.mat3.transpose(m);
	
	// set the matrix transform for the 
 	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

 	gl.uniformMatrix3fv(PIXI.primitiveShader.translationMatrix, false, m);
 	
	gl.uniform2f(PIXI.primitiveShader.projectionVector, projection.x, -projection.y);
	gl.uniform2f(PIXI.primitiveShader.offsetVector, -PIXI.offset.x, -PIXI.offset.y);
	
	gl.uniform1f(PIXI.primitiveShader.alpha, graphics.worldAlpha);
	gl.bindBuffer(gl.ARRAY_BUFFER, graphics._webGL.buffer);
	
	gl.vertexAttribPointer(PIXI.primitiveShader.aVertexPosition, 2, gl.FLOAT, false, 4 * 6, 0);
	gl.vertexAttribPointer(PIXI.primitiveShader.colorAttribute, 4, gl.FLOAT, false,4 * 6, 2 * 4);
	
	// set the index buffer!
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, graphics._webGL.indexBuffer);
	

	gl.drawElements(gl.TRIANGLE_STRIP,  graphics._webGL.indices.length, gl.UNSIGNED_SHORT, 0 );
	
	PIXI.deactivatePrimitiveShader();
	
	
	// return to default shader...
//	PIXI.activateShader(PIXI.defaultShader);
}

/**
 * Updates the graphics object
 *
 * @static
 * @private
 * @method updateGraphics
 * @param graphics {Graphics}
 */
PIXI.WebGLGraphics.updateGraphics = function(graphics)
{
	for (var i=graphics._webGL.lastIndex; i < graphics.graphicsData.length; i++) 
	{
		var data = graphics.graphicsData[i];
		
		if(data.type == PIXI.Graphics.POLY)
		{
			if(data.fill)
			{
				if(data.points.length>3) 
				PIXI.WebGLGraphics.buildPoly(data, graphics._webGL);
			}
			
			if(data.lineWidth > 0)
			{
				PIXI.WebGLGraphics.buildLine(data, graphics._webGL);
			}
		}
		else if(data.type == PIXI.Graphics.RECT)
		{
			PIXI.WebGLGraphics.buildRectangle(data, graphics._webGL);
		}
		else if(data.type == PIXI.Graphics.CIRC || data.type == PIXI.Graphics.ELIP)
		{
			PIXI.WebGLGraphics.buildCircle(data, graphics._webGL);
		}
	};
	
	graphics._webGL.lastIndex = graphics.graphicsData.length;
	
	var gl = PIXI.gl;

	graphics._webGL.glPoints = new Float32Array(graphics._webGL.points);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, graphics._webGL.buffer);
	gl.bufferData(gl.ARRAY_BUFFER, graphics._webGL.glPoints, gl.STATIC_DRAW);
	
	graphics._webGL.glIndicies = new Uint16Array(graphics._webGL.indices);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, graphics._webGL.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, graphics._webGL.glIndicies, gl.STATIC_DRAW);
}

/**
 * Builds a rectangle to draw
 *
 * @static
 * @private
 * @method buildRectangle
 * @param graphics {Graphics}
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildRectangle = function(graphicsData, webGLData)
{
	// --- //
	// need to convert points to a nice regular data
	// 
	var rectData = graphicsData.points;
	var x = rectData[0];
	var y = rectData[1];
	var width = rectData[2];
	var height = rectData[3];
	
	
	if(graphicsData.fill)
	{
		var color = HEXtoRGB(graphicsData.fillColor);
		var alpha = graphicsData.fillAlpha;
		
		var r = color[0] * alpha;
		var g = color[1] * alpha;
		var b = color[2] * alpha;
	
		var verts = webGLData.points;
		var indices = webGLData.indices;
	
		var vertPos = verts.length/6;
		
		// start
		verts.push(x, y);
		verts.push(r, g, b, alpha);
		
		verts.push(x + width, y);
		verts.push(r, g, b, alpha);
		
		verts.push(x , y + height);
		verts.push(r, g, b, alpha);
		
		verts.push(x + width, y + height);
		verts.push(r, g, b, alpha);
		
		// insert 2 dead triangles..
		indices.push(vertPos, vertPos, vertPos+1, vertPos+2, vertPos+3, vertPos+3)
	}
	
	if(graphicsData.lineWidth)
	{
		graphicsData.points = [x, y,
				  x + width, y,
				  x + width, y + height,
				  x, y + height,
				  x, y];
	
		PIXI.WebGLGraphics.buildLine(graphicsData, webGLData);
	}
	
}

/**
 * Builds a circle to draw
 *
 * @static
 * @private
 * @method buildCircle
 * @param graphics {Graphics}
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildCircle = function(graphicsData, webGLData)
{
	// --- //
	// need to convert points to a nice regular data
	// 
	var rectData = graphicsData.points;
	var x = rectData[0];
	var y = rectData[1];
	var width = rectData[2];
	var height = rectData[3];
	
	var totalSegs = 40;
	var seg = (Math.PI * 2) / totalSegs ;
		
	if(graphicsData.fill)
	{
		var color = HEXtoRGB(graphicsData.fillColor);
		var alpha = graphicsData.fillAlpha;

		var r = color[0] * alpha;
		var g = color[1] * alpha;
		var b = color[2] * alpha;
	
		var verts = webGLData.points;
		var indices = webGLData.indices;
	
		var vecPos = verts.length/6;
		
		indices.push(vecPos);
		
		for (var i=0; i < totalSegs + 1 ; i++) 
		{
			verts.push(x,y, r, g, b, alpha);
			
			verts.push(x + Math.sin(seg * i) * width,
					   y + Math.cos(seg * i) * height,
					   r, g, b, alpha);
		
			indices.push(vecPos++, vecPos++);
		};
		
		indices.push(vecPos-1);
	}
	
	if(graphicsData.lineWidth)
	{
		graphicsData.points = [];
		
		for (var i=0; i < totalSegs + 1; i++) 
		{
			graphicsData.points.push(x + Math.sin(seg * i) * width,
									 y + Math.cos(seg * i) * height)
		};
		
		PIXI.WebGLGraphics.buildLine(graphicsData, webGLData);
	}
	
}

/**
 * Builds a line to draw
 *
 * @static
 * @private
 * @method buildLine
 * @param graphics {Graphics}
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildLine = function(graphicsData, webGLData)
{
	// TODO OPTIMISE!
	
	var wrap = true;
	var points = graphicsData.points;
	if(points.length == 0)return;
	
	// if the line width is an odd number add 0.5 to align to a whole pixel
	if(graphicsData.lineWidth%2)
	{
		for (var i = 0; i < points.length; i++) {
			points[i] += 0.5;
		};
	}

	// get first and last point.. figure out the middle!
	var firstPoint = new PIXI.Point( points[0], points[1] );
	var lastPoint = new PIXI.Point( points[points.length - 2], points[points.length - 1] );
	
	// if the first point is the last point - goona have issues :)
	if(firstPoint.x == lastPoint.x && firstPoint.y == lastPoint.y)
	{
		points.pop();
		points.pop();
		
		lastPoint = new PIXI.Point( points[points.length - 2], points[points.length - 1] );
		
		var midPointX = lastPoint.x + (firstPoint.x - lastPoint.x) *0.5;
		var midPointY = lastPoint.y + (firstPoint.y - lastPoint.y) *0.5;
		
		points.unshift(midPointX, midPointY);
		points.push(midPointX, midPointY)
	}
	
	var verts = webGLData.points;
	var indices = webGLData.indices;
	var length = points.length / 2;
	var indexCount = points.length;
	var indexStart = verts.length/6;
	
	// DRAW the Line
	var width = graphicsData.lineWidth / 2;
	
	// sort color
	var color = HEXtoRGB(graphicsData.lineColor);
	var alpha = graphicsData.lineAlpha;
	var r = color[0] * alpha;
	var g = color[1] * alpha;
	var b = color[2] * alpha;
	
	var p1x, p1y, p2x, p2y, p3x, p3y;
	var perpx, perpy, perp2x, perp2y, perp3x, perp3y;
	var ipx, ipy;
	var a1, b1, c1, a2, b2, c2;
	var denom, pdist, dist;
	
	p1x = points[0];
	p1y = points[1];
	
	p2x = points[2];
	p2y = points[3];
	
	perpx = -(p1y - p2y);
	perpy =  p1x - p2x;
	
	dist = Math.sqrt(perpx*perpx + perpy*perpy);
	
	perpx /= dist;
	perpy /= dist;
	perpx *= width;
	perpy *= width;
	
	// start
	verts.push(p1x - perpx , p1y - perpy,
				r, g, b, alpha);
	
	verts.push(p1x + perpx , p1y + perpy,
				r, g, b, alpha);
	
	for (var i = 1; i < length-1; i++) 
	{
		p1x = points[(i-1)*2];
		p1y = points[(i-1)*2 + 1];
		
		p2x = points[(i)*2]
		p2y = points[(i)*2 + 1]
		
		p3x = points[(i+1)*2];
		p3y = points[(i+1)*2 + 1];
		
		perpx = -(p1y - p2y);
		perpy = p1x - p2x;
		
		dist = Math.sqrt(perpx*perpx + perpy*perpy);
		perpx /= dist;
		perpy /= dist;
		perpx *= width;
		perpy *= width;

		perp2x = -(p2y - p3y);
		perp2y = p2x - p3x;
		
		dist = Math.sqrt(perp2x*perp2x + perp2y*perp2y);
		perp2x /= dist;
		perp2y /= dist;
		perp2x *= width;
		perp2y *= width;
		
		a1 = (-perpy + p1y) - (-perpy + p2y);
	    b1 = (-perpx + p2x) - (-perpx + p1x);
	    c1 = (-perpx + p1x) * (-perpy + p2y) - (-perpx + p2x) * (-perpy + p1y);
	    a2 = (-perp2y + p3y) - (-perp2y + p2y);
	    b2 = (-perp2x + p2x) - (-perp2x + p3x);
	    c2 = (-perp2x + p3x) * (-perp2y + p2y) - (-perp2x + p2x) * (-perp2y + p3y);
	 
	    denom = a1*b2 - a2*b1;

	   if(Math.abs(denom) < 0.1 )
		{
		
			denom+=10.1;
			verts.push(p2x - perpx , p2y - perpy,
				r, g, b, alpha);
	
			verts.push(p2x + perpx , p2y + perpy,
				r, g, b, alpha);
			
			continue;
		}
	    
	    px = (b1*c2 - b2*c1)/denom;
	    py = (a2*c1 - a1*c2)/denom;
		
			
		pdist = (px -p2x) * (px -p2x) + (py -p2y) + (py -p2y);
		

		if(pdist > 140 * 140)
		{
			perp3x = perpx - perp2x;
			perp3y = perpy - perp2y;
			
			dist = Math.sqrt(perp3x*perp3x + perp3y*perp3y);
			perp3x /= dist;
			perp3y /= dist;
			perp3x *= width;
			perp3y *= width;
			
			verts.push(p2x - perp3x, p2y -perp3y);
			verts.push(r, g, b, alpha);
			
			verts.push(p2x + perp3x, p2y +perp3y);
			verts.push(r, g, b, alpha);
			
			verts.push(p2x - perp3x, p2y -perp3y);
			verts.push(r, g, b, alpha);
			
			indexCount++;
		}
		else
		{

			verts.push(px , py);
			verts.push(r, g, b, alpha);
			
			verts.push(p2x - (px-p2x), p2y - (py - p2y));
			verts.push(r, g, b, alpha);
		}
	}
	
	p1x = points[(length-2)*2]
	p1y = points[(length-2)*2 + 1] 
	
	p2x = points[(length-1)*2]
	p2y = points[(length-1)*2 + 1]
	
	perpx = -(p1y - p2y)
	perpy = p1x - p2x;
	
	dist = Math.sqrt(perpx*perpx + perpy*perpy);
	perpx /= dist;
	perpy /= dist;
	perpx *= width;
	perpy *= width;
	
	verts.push(p2x - perpx , p2y - perpy)
	verts.push(r, g, b, alpha);
	
	verts.push(p2x + perpx , p2y + perpy)
	verts.push(r, g, b, alpha);
	
	indices.push(indexStart);
	
	for (var i=0; i < indexCount; i++) 
	{
		indices.push(indexStart++);
	};
	
	indices.push(indexStart-1);
}

/**
 * Builds a polygon to draw
 *
 * @static
 * @private
 * @method buildPoly
 * @param graphics {Graphics}
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildPoly = function(graphicsData, webGLData)
{
	var points = graphicsData.points;
	if(points.length < 6)return;
	
	// get first and last point.. figure out the middle!
	var verts = webGLData.points;
	var indices = webGLData.indices;
	
	var length = points.length / 2;
	
	// sort color
	var color = HEXtoRGB(graphicsData.fillColor);
	var alpha = graphicsData.fillAlpha;
	var r = color[0] * alpha;
	var g = color[1] * alpha;
	var b = color[2] * alpha;
	
	var triangles = PIXI.PolyK.Triangulate(points);
	
	var vertPos = verts.length / 6;
	
	for (var i=0; i < triangles.length; i+=3) 
	{
		indices.push(triangles[i] + vertPos);
		indices.push(triangles[i] + vertPos);
		indices.push(triangles[i+1] + vertPos);
		indices.push(triangles[i+2] +vertPos);
		indices.push(triangles[i+2] + vertPos);
	};
	
	for (var i = 0; i < length; i++) 
	{
		verts.push(points[i * 2], points[i * 2 + 1],
				   r, g, b, alpha);
	};
}

function HEXtoRGB(hex) {
	return [(hex >> 16 & 0xFF) / 255, ( hex >> 8 & 0xFF) / 255, (hex & 0xFF)/ 255];
}




