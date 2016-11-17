//  Graphics

Phaser.Renderer.WebGL.GameObjects.Graphics = {

    TYPES: [
        Phaser.GameObject.Graphics.prototype
    ],

    circleSegments: 40,

    graphicsDataPool: [],

    render: function (renderer, src)
    {
        if (src.visible === false || src.alpha === 0 || src.isMask === true)
        {
            return;
        }

        if (src._cacheAsBitmap)
        {
            if (src.dirty || src.cachedSpriteDirty)
            {
                src._generateCachedSprite();
       
                // we will also need to update the texture on the gpu too!
                src.updateCachedSpriteTexture();

                src.cachedSpriteDirty = false;
                src.dirty = false;
            }

            src._cachedSprite.worldAlpha = src.worldAlpha;

            // PIXI.Sprite.prototype._renderWebGL.call(this._cachedSprite, renderSession);

            return;
        }

        renderer.spriteBatch.stop();
        renderer.setBlendMode(src.blendMode);

        if (src._mask)
        {
            renderer.pushMask(src._mask);
        }

        if (src._filters)
        {
            renderer.filterManager.pushFilter(src._filterBlock);
        }
      
        // check blend mode
        if (src.blendMode !== renderer.spriteBatch.currentBlendMode)
        {
            renderer.spriteBatch.currentBlendMode = src.blendMode;

            var blendModeWebGL = renderer.blendModes[renderer.spriteBatch.currentBlendMode];

            renderer.spriteBatch.gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
        }
        
        // check if the webgl graphic needs to be updated
        if (src.webGLDirty)
        {
            src.dirty = true;
            src.webGLDirty = false;
        }
        
        var gl = renderer.gl;
        var offset = renderer.offset;
        var projection = renderer.projection;
        var shader = renderer.shaderManager.primitiveShader;
        var webGLData;

        if (src.dirty)
        {
            Phaser.Renderer.WebGL.GameObjects.Graphics.updateGraphics(renderer, src);
        }

        for (var i = 0; i < src._webGL.data.length; i++)
        {
            webGLData = src._webGL.data[i];

            if (webGLData.mode === 1)
            {
                renderer.stencilManager.pushStencil(src, webGLData);

                gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, (webGLData.indices.length - 4) * 2);
                
                renderer.stencilManager.popStencil(src, webGLData);
            }
            else
            {
                renderer.shaderManager.setShader(shader);

                // shader = renderSession.shaderManager.primitiveShader;

                gl.uniformMatrix3fv(shader.translationMatrix, false, src.worldTransform.toArray(true));
                
                gl.uniform1f(shader.flipY, 1);
                
                gl.uniform2f(shader.projectionVector, projection.x, -projection.y);
                gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);

                gl.uniform3fv(shader.tintColor, Phaser.Color.hexToRGBArray(src.tint));

                gl.uniform1f(shader.alpha, src.worldAlpha);

                gl.bindBuffer(gl.ARRAY_BUFFER, webGLData.buffer);

                gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 4 * 6, 0);

                gl.vertexAttribPointer(shader.colorAttribute, 4, gl.FLOAT, false,4 * 6, 2 * 4);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webGLData.indexBuffer);

                gl.drawElements(gl.TRIANGLE_STRIP, webGLData.indices.length, gl.UNSIGNED_SHORT, 0);
            }
        }
        
        //  Only render if it has children!
        if (src.children.length)
        {
            renderer.spriteBatch.start();

            for (var i = 0; i < src.children.length; i++)
            {
                var child = src.children[i];
                child.render(renderer, child);
            }

            renderer.spriteBatch.stop();
        }

        if (src._filters)
        {
            renderer.filterManager.popFilter();
        }

        if (src._mask)
        {
            renderer.popMask(src.mask);
        }
          
        renderer.drawCount++;

        renderer.spriteBatch.start();
    },

    /**
     * Updates the graphics object
     *
     * @static
     * @private
     * @method updateGraphics
     * @param graphicsData {Graphics} The graphics object to update
     * @param gl {WebGLContext} the current WebGL drawing context
     */
    updateGraphics: function (renderer, graphics)
    {
        var gl = renderer.gl;
        var webGL = graphics._webGL;

        //  If the graphics object does not exist in the webGL context time to create it!
        if (!webGL)
        {
            webGL = graphics._webGL = { lastIndex: 0, data: [], gl: gl };
        }

        //  Flag the graphics as not dirty as we are about to update it
        graphics.dirty = false;

        var i;

        //  If the user cleared the graphics object we will need to clear every object
        if (graphics.clearDirty)
        {
            graphics.clearDirty = false;

            // loop through and return all the webGLDatas to the object pool so than can be reused later on
            for (i = 0; i < webGL.data.length; i++)
            {
                var graphicsData = webGL.data[i];

                graphicsData.reset();

                Phaser.Renderer.WebGL.GameObjects.Graphics.graphicsDataPool.push(graphicsData);
            }

            //  Clear the array and reset the index
            webGL.data = [];
            webGL.lastIndex = 0;
        }
        
        var webGLData;
        
        //  Loop through the Graphics data.
        //  If the object is complex, use the Stencil Buffer.
        //  Otherwise add the object into the batch.

        for (i = webGL.lastIndex; i < graphics.graphicsData.length; i++)
        {
            var data = graphics.graphicsData[i];

            switch (data.type)
            {
                case Phaser.RECTANGLE:

                    webGLData = Phaser.Renderer.WebGL.GameObjects.Graphics.switchMode(webGL, 0);
                    Phaser.Renderer.WebGL.GameObjects.Graphics.buildRectangle(data, webGLData);

                    break;

                case Phaser.CIRCLE:
                case Phaser.ELLIPSE:

                    webGLData = Phaser.Renderer.WebGL.GameObjects.Graphics.switchMode(webGL, 0);
                    Phaser.Renderer.WebGL.GameObjects.Graphics.buildCircle(data, webGLData);

                    break;

                case Phaser.ROUNDEDRECTANGLE:

                    webGLData = Phaser.Renderer.WebGL.GameObjects.Graphics.switchMode(webGL, 0);
                    Phaser.Renderer.WebGL.GameObjects.Graphics.buildRoundedRectangle(data, webGLData);

                    break;

                case Phaser.POLYGON:

                    //  Need to add the points the the graphics object
                    data.points = data.shape.points.slice();

                    if (data.shape.closed)
                    {
                        //  Close the poly if the value is true!
                        if (data.points[0] !== data.points[data.points.length - 2] || data.points[1] !== data.points[data.points.length - 1])
                        {
                            data.points.push(data.points[0], data.points[1]);
                        }
                    }

                    //  Check the type
                    if (data.fill)
                    {
                        if (data.points.length >= renderer.stencilBufferLimit)
                        {
                            if (data.points.length < renderer.stencilBufferLimit * 2)
                            {
                                webGLData = Phaser.Renderer.WebGL.GameObjects.Graphics.switchMode(webGL, 0);
                                
                                var canDrawUsingSimple = Phaser.Renderer.WebGL.GameObjects.Graphics.buildPoly(data, webGLData);

                                if (!canDrawUsingSimple)
                                {
                                    webGLData = Phaser.Renderer.WebGL.GameObjects.Graphics.switchMode(webGL, 1);
                                    Phaser.Renderer.WebGL.GameObjects.Graphics.buildComplexPoly(data, webGLData);
                                }
                            }
                            else
                            {
                                webGLData = Phaser.Renderer.WebGL.GameObjects.Graphics.switchMode(webGL, 1);
                                Phaser.Renderer.WebGL.GameObjects.Graphics.buildComplexPoly(data, webGLData);
                            }
                        }
                    }

                    if (data.lineWidth > 0)
                    {
                        webGLData = Phaser.Renderer.WebGL.GameObjects.Graphics.switchMode(webGL, 0);
                        Phaser.Renderer.WebGL.GameObjects.Graphics.buildLine(data, webGLData);
                    }

                    break;
            }

            webGL.lastIndex++;
        }

        //  Upload all the dirty data
        for (i = 0; i < webGL.data.length; i++)
        {
            webGLData = webGL.data[i];

            if (webGLData.dirty)
            {
                webGLData.upload();
            }
        }
    },

    switchMode: function (webGL, type)
    {
        var webGLData;

        if (!webGL.data.length)
        {
            webGLData = Phaser.Renderer.WebGL.GameObjects.Graphics.graphicsDataPool.pop() || new Phaser.Renderer.WebGL.GameObjects.GraphicsData(webGL.gl);
            webGLData.mode = type;
            webGL.data.push(webGLData);
        }
        else
        {
            webGLData = webGL.data[webGL.data.length - 1];

            if (webGLData.mode !== type || type === 1)
            {
                webGLData = Phaser.Renderer.WebGL.GameObjects.Graphics.graphicsDataPool.pop() || new Phaser.Renderer.WebGL.GameObjects.GraphicsData(webGL.gl);
                webGLData.mode = type;
                webGL.data.push(webGLData);
            }
        }

        webGLData.dirty = true;

        return webGLData;
    },

    buildRectangle: function (graphicsData, webGLData)
    {
        var rectData = graphicsData.shape;
        var x = rectData.x;
        var y = rectData.y;
        var width = rectData.width;
        var height = rectData.height;

        if (graphicsData.fill)
        {
            var color = Phaser.Color.hexToRGBArray(graphicsData.fillColor);
            var alpha = graphicsData.fillAlpha;

            var r = color[0] * alpha;
            var g = color[1] * alpha;
            var b = color[2] * alpha;

            var verts = webGLData.points;
            var indices = webGLData.indices;

            var vertPos = verts.length / 6;

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
            indices.push(vertPos, vertPos, vertPos + 1, vertPos + 2, vertPos + 3, vertPos + 3);
        }

        if (graphicsData.lineWidth)
        {
            var tempPoints = graphicsData.points;

            graphicsData.points = [
                x, y,
                x + width, y,
                x + width, y + height,
                x, y + height,
                x, y
            ];

            Phaser.Renderer.WebGL.GameObjects.Graphics.buildLine(graphicsData, webGLData);

            graphicsData.points = tempPoints;
        }
    },

    buildRoundedRectangle: function (graphicsData, webGLData)
    {
        var rrectData = graphicsData.shape;
        var x = rrectData.x;
        var y = rrectData.y;
        var width = rrectData.width;
        var height = rrectData.height;

        var radius = rrectData.radius;

        var recPoints = [];

        recPoints.push(x, y + radius);

        recPoints = recPoints.concat(Phaser.Renderer.WebGL.GameObjects.Graphics.quadraticBezierCurve(x, y + height - radius, x, y + height, x + radius, y + height));
        recPoints = recPoints.concat(Phaser.Renderer.WebGL.GameObjects.Graphics.quadraticBezierCurve(x + width - radius, y + height, x + width, y + height, x + width, y + height - radius));
        recPoints = recPoints.concat(Phaser.Renderer.WebGL.GameObjects.Graphics.quadraticBezierCurve(x + width, y + radius, x + width, y, x + width - radius, y));
        recPoints = recPoints.concat(Phaser.Renderer.WebGL.GameObjects.Graphics.quadraticBezierCurve(x + radius, y, x, y, x, y + radius));

        if (graphicsData.fill)
        {
            var color = Phaser.Color.hexToRGBArray(graphicsData.fillColor);
            var alpha = graphicsData.fillAlpha;

            var r = color[0] * alpha;
            var g = color[1] * alpha;
            var b = color[2] * alpha;

            var verts = webGLData.points;
            var indices = webGLData.indices;

            var vecPos = verts.length / 6;

            var triangles = Phaser.EarCut.Triangulate(recPoints, null, 2);

            var i = 0;

            for (i = 0; i < triangles.length; i += 3)
            {
                indices.push(triangles[i] + vecPos);
                indices.push(triangles[i] + vecPos);
                indices.push(triangles[i + 1] + vecPos);
                indices.push(triangles[i + 2] + vecPos);
                indices.push(triangles[i + 2] + vecPos);
            }

            for (i = 0; i < recPoints.length; i++)
            {
                verts.push(recPoints[i], recPoints[++i], r, g, b, alpha);
            }
        }

        if (graphicsData.lineWidth)
        {
            var tempPoints = graphicsData.points;

            graphicsData.points = recPoints;

            Phaser.Renderer.WebGL.GameObjects.Graphics.buildLine(graphicsData, webGLData);

            graphicsData.points = tempPoints;
        }
    },

    quadraticBezierCurve: function (fromX, fromY, cpX, cpY, toX, toY)
    {
        var xa;
        var ya;
        var xb;
        var yb;
        var x;
        var y;
        var n = 20;
        var points = [];

        function getPt (n1, n2, perc)
        {
            var diff = n2 - n1;

            return n1 + (diff * perc);
        };

        var j = 0;

        for (var i = 0; i <= n; i++)
        {
            j = i / n;

            // The Green Line
            xa = getPt(fromX, cpX, j);
            ya = getPt(fromY, cpY, j);
            xb = getPt(cpX, toX, j);
            yb = getPt(cpY, toY, j);

            // The Black Dot
            x = getPt(xa, xb, j);
            y = getPt(ya, yb, j);

            points.push(x, y);
        }

        return points;
    },

    buildCircle: function (graphicsData, webGLData)
    {
        //  Need to convert points to a nice regular data
        var circleData = graphicsData.shape;
        var x = circleData.x;
        var y = circleData.y;
        var width;
        var height;
        
        if (graphicsData.type === Phaser.CIRCLE)
        {
            width = circleData.radius;
            height = circleData.radius;
        }
        else
        {
            width = circleData.width;
            height = circleData.height;
        }

        var totalSegs = Phaser.Renderer.WebGL.GameObjects.Graphics.circleSegments;
        var seg = (Math.PI * 2) / totalSegs;

        var i = 0;

        if (graphicsData.fill)
        {
            var color = Phaser.Color.hexToRGBArray(graphicsData.fillColor);
            var alpha = graphicsData.fillAlpha;

            var r = color[0] * alpha;
            var g = color[1] * alpha;
            var b = color[2] * alpha;

            var verts = webGLData.points;
            var indices = webGLData.indices;

            var vecPos = verts.length / 6;

            indices.push(vecPos);

            for (i = 0; i < totalSegs + 1 ; i++)
            {
                verts.push(x, y, r, g, b, alpha);

                verts.push(
                    x + Math.sin(seg * i) * width,
                    y + Math.cos(seg * i) * height,
                    r, g, b, alpha
                );

                indices.push(vecPos++, vecPos++);
            }

            indices.push(vecPos - 1);
        }

        if (graphicsData.lineWidth)
        {
            var tempPoints = graphicsData.points;

            graphicsData.points = [];

            for (i = 0; i < totalSegs + 1; i++)
            {
                graphicsData.points.push(
                    x + Math.sin(seg * i) * width,
                    y + Math.cos(seg * i) * height
                );
            }

            Phaser.Renderer.WebGL.GameObjects.Graphics.buildLine(graphicsData, webGLData);

            graphicsData.points = tempPoints;
        }
    },

    buildLine: function (graphicsData, webGLData)
    {
        var i = 0;
        var points = graphicsData.points;

        if (points.length === 0)
        {
            return;
        }

        //  If the line width is an odd number add 0.5 to align to a whole pixel
        if (graphicsData.lineWidth % 2)
        {
            for (i = 0; i < points.length; i++)
            {
                points[i] += 0.5;
            }
        }

        //  Get first and last point. Figure out the middle!
        var firstPoint = new Phaser.Point(points[0], points[1]);
        var lastPoint = new Phaser.Point(points[points.length - 2], points[points.length - 1]);

        //  If the first point is the last point we're gonna have issues :)
        if (firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y)
        {
            //  Need to clone as we are going to slightly modify the shape
            points = points.slice();

            points.pop();
            points.pop();

            lastPoint = new Phaser.Point(points[points.length - 2], points[points.length - 1]);

            var midPointX = lastPoint.x + (firstPoint.x - lastPoint.x) * 0.5;
            var midPointY = lastPoint.y + (firstPoint.y - lastPoint.y) * 0.5;

            points.unshift(midPointX, midPointY);
            points.push(midPointX, midPointY);
        }

        var verts = webGLData.points;
        var indices = webGLData.indices;
        var length = points.length / 2;
        var indexCount = points.length;
        var indexStart = verts.length / 6;

        //  Draw the Line
        var width = graphicsData.lineWidth / 2;

        //  Sort the color
        var color = Phaser.Color.hexToRGBArray(graphicsData.lineColor);
        var alpha = graphicsData.lineAlpha;
        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var px, py, p1x, p1y, p2x, p2y, p3x, p3y;
        var perpx, perpy, perp2x, perp2y, perp3x, perp3y;
        var a1, b1, c1, a2, b2, c2;
        var denom, pdist, dist;

        p1x = points[0];
        p1y = points[1];

        p2x = points[2];
        p2y = points[3];

        perpx = -(p1y - p2y);
        perpy = p1x - p2x;

        dist = Math.sqrt(perpx * perpx + perpy * perpy);

        perpx /= dist;
        perpy /= dist;
        perpx *= width;
        perpy *= width;

        //  Start
        verts.push(p1x - perpx , p1y - perpy, r, g, b, alpha);

        verts.push(p1x + perpx , p1y + perpy, r, g, b, alpha);

        for (i = 1; i < length - 1; i++)
        {
            p1x = points[(i - 1) * 2];
            p1y = points[(i - 1) * 2 + 1];

            p2x = points[(i) * 2];
            p2y = points[(i) * 2 + 1];

            p3x = points[(i + 1) * 2];
            p3y = points[(i + 1) * 2 + 1];

            perpx = -(p1y - p2y);
            perpy = p1x - p2x;

            dist = Math.sqrt(perpx * perpx + perpy * perpy);

            perpx /= dist;
            perpy /= dist;
            perpx *= width;
            perpy *= width;

            perp2x = -(p2y - p3y);
            perp2y = p2x - p3x;

            dist = Math.sqrt(perp2x * perp2x + perp2y * perp2y);

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

            denom = a1 * b2 - a2 * b1;

            if (Math.abs(denom) < 0.1)
            {
                denom += 10.1;
                verts.push(p2x - perpx, p2y - perpy, r, g, b, alpha);
                verts.push(p2x + perpx, p2y + perpy, r, g, b, alpha);
                continue;
            }

            px = (b1 * c2 - b2 * c1) / denom;
            py = (a2 * c1 - a1 * c2) / denom;

            pdist = (px -p2x) * (px -p2x) + (py -p2y) + (py -p2y);

            if (pdist > 140 * 140)
            {
                perp3x = perpx - perp2x;
                perp3y = perpy - perp2y;

                dist = Math.sqrt(perp3x * perp3x + perp3y * perp3y);

                perp3x /= dist;
                perp3y /= dist;
                perp3x *= width;
                perp3y *= width;

                verts.push(p2x - perp3x, p2y -perp3y, r, g, b, alpha);
                verts.push(p2x + perp3x, p2y +perp3y, r, g, b, alpha);
                verts.push(p2x - perp3x, p2y -perp3y, r, g, b, alpha);

                indexCount++;
            }
            else
            {
                verts.push(px, py, r, g, b, alpha);
                verts.push(p2x - (px-p2x), p2y - (py - p2y), r, g, b, alpha);
            }
        }

        p1x = points[(length - 2) * 2];
        p1y = points[(length - 2) * 2 + 1];

        p2x = points[(length - 1) * 2];
        p2y = points[(length - 1) * 2 + 1];

        perpx = -(p1y - p2y);
        perpy = p1x - p2x;

        dist = Math.sqrt(perpx * perpx + perpy * perpy);

        perpx /= dist;
        perpy /= dist;
        perpx *= width;
        perpy *= width;

        verts.push(p2x - perpx , p2y - perpy, r, g, b, alpha);
        verts.push(p2x + perpx , p2y + perpy, r, g, b, alpha);

        indices.push(indexStart);

        for (i = 0; i < indexCount; i++)
        {
            indices.push(indexStart++);
        }

        indices.push(indexStart - 1);
    },

    buildComplexPoly: function(graphicsData, webGLData)
    {
        var points = graphicsData.points.slice();

        if (points.length < 6)
        {
            return;
        }

        //  Get first and last point.. figure out the middle!
        var indices = webGLData.indices;
        webGLData.points = points;
        webGLData.alpha = graphicsData.fillAlpha;
        webGLData.color = Phaser.Color.hexToRGBArray(graphicsData.fillColor);

        //  Calculate the bounds
        var minX = Infinity;
        var maxX = -Infinity;

        var minY = Infinity;
        var maxY = -Infinity;

        var x;
        var y;

        //  Get the size
        for (var i = 0; i < points.length; i += 2)
        {
            x = points[i];
            y = points[i + 1];

            minX = (x < minX) ? x : minX;
            maxX = (x > maxX) ? x : maxX;

            minY = (y < minY) ? y : minY;
            maxY = (y > maxY) ? y : maxY;
        }

        //  Add a quad to the end because there is no point making another buffer!
        points.push(
            minX, minY,
            maxX, minY,
            maxX, maxY,
            minX, maxY
        );

        //  TODO: Is this even needed?
        var length = points.length / 2;

        for (i = 0; i < length; i++)
        {
            indices.push(i);
        }
    },

    buildPoly: function (graphicsData, webGLData)
    {
        var points = graphicsData.points;

        if (points.length < 6)
        {
            return;
        }

        //  Get first and last point.. figure out the middle!
        var verts = webGLData.points;
        var indices = webGLData.indices;

        var length = points.length / 2;

        //  Sort the color
        var color = Phaser.Color.hexToRGBArray(graphicsData.fillColor);
        var alpha = graphicsData.fillAlpha;
        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var triangles = Phaser.EarCut.Triangulate(points, null, 2);

        if (!triangles)
        {
            return false;
        }

        var vertPos = verts.length / 6;

        var i = 0;

        for (i = 0; i < triangles.length; i += 3)
        {
            indices.push(triangles[i] + vertPos);
            indices.push(triangles[i] + vertPos);
            indices.push(triangles[i + 1] + vertPos);
            indices.push(triangles[i + 2] +vertPos);
            indices.push(triangles[i + 2] + vertPos);
        }

        for (i = 0; i < length; i++)
        {
            verts.push(
                points[i * 2],
                points[i * 2 + 1],
                r, g, b, alpha
            );
        }

        return true;
    }

};
