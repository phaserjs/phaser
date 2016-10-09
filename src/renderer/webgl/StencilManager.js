/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* New version of PIXI.WebGLStencilManager
*
* @class Phaser.Renderer.Canvas
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
*/
Phaser.Renderer.WebGL.StencilManager = function (renderer)
{
    this.renderer = renderer;

    this.gl = null;

    this.stencilStack = [];

    this.reverse = true;

    this.count = 0;
};

Phaser.Renderer.WebGL.StencilManager.prototype.constructor = Phaser.Renderer.WebGL.StencilManager;

Phaser.Renderer.WebGL.StencilManager.prototype = {

    init: function ()
    {
        this.gl = this.renderer.gl;
    },

    /**
    * Applies the Mask and adds it to the current filter stack.
    * 
    * @method pushMask
    * @param graphics {Graphics}
    * @param webGLData {Array}
    * @param renderSession {Object}
    */
    pushStencil: function (graphics, webGLData)
    {
        var gl = this.gl;

        this.bindGraphics(graphics, webGLData);

        if (this.stencilStack.length === 0)
        {
            gl.enable(gl.STENCIL_TEST);
            gl.clear(gl.STENCIL_BUFFER_BIT);
            this.reverse = true;
            this.count = 0;
        }

        this.stencilStack.push(webGLData);

        var level = this.count;

        gl.colorMask(false, false, false, false);

        gl.stencilFunc(gl.ALWAYS, 0, 0xFF);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.INVERT);

        // draw the triangle strip!

        if (webGLData.mode === 1)
        {
            gl.drawElements(gl.TRIANGLE_FAN, webGLData.indices.length - 4, gl.UNSIGNED_SHORT, 0);
           
            if (this.reverse)
            {
                gl.stencilFunc(gl.EQUAL, 0xFF - level, 0xFF);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
            }
            else
            {
                gl.stencilFunc(gl.EQUAL, level, 0xFF);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
            }

            // draw a quad to increment..
            gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, (webGLData.indices.length - 4) * 2);
                   
            if (this.reverse)
            {
                gl.stencilFunc(gl.EQUAL, 0xFF - (level + 1), 0xFF);
            }
            else
            {
                gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
            }

            this.reverse = !this.reverse;
        }
        else
        {
            if (!this.reverse)
            {
                gl.stencilFunc(gl.EQUAL, 0xFF - level, 0xFF);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
            }
            else
            {
                gl.stencilFunc(gl.EQUAL,level, 0xFF);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
            }

            gl.drawElements(gl.TRIANGLE_STRIP, webGLData.indices.length, gl.UNSIGNED_SHORT, 0);

            if (!this.reverse)
            {
                gl.stencilFunc(gl.EQUAL,0xFF - (level + 1), 0xFF);
            }
            else
            {
                gl.stencilFunc(gl.EQUAL,level + 1, 0xFF);
            }
        }

        gl.colorMask(true, true, true, true);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

        this.count++;
    },

    /**
     * @method bindGraphics
     * @param graphics {Graphics}
     * @param webGLData {Array}
     * @param renderSession {Object}
     */
    bindGraphics: function (graphics, webGLData)
    {
        this._currentGraphics = graphics;

        var gl = this.gl;

         // bind the graphics object..
        var projection = this.renderer.projection;
        var offset = this.renderer.offset;
        var shader;

        if (webGLData.mode === 1)
        {
            shader = this.renderer.shaderManager.complexPrimitiveShader;

            this.renderer.shaderManager.setShader(shader);

            gl.uniform1f(shader.flipY, this.renderer.flipY);
           
            gl.uniformMatrix3fv(shader.translationMatrix, false, graphics.worldTransform.toArray(true));

            gl.uniform2f(shader.projectionVector, projection.x, -projection.y);
            gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);

            gl.uniform3fv(shader.tintColor, Phaser.Color.hexToRGBArray(graphics.tint));
            gl.uniform3fv(shader.color, webGLData.color);

            gl.uniform1f(shader.alpha, graphics.worldAlpha * webGLData.alpha);

            gl.bindBuffer(gl.ARRAY_BUFFER, webGLData.buffer);

            gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 4 * 2, 0);

            // now do the rest..
            // set the index buffer!
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webGLData.indexBuffer);
        }
        else
        {
            shader = this.renderer.shaderManager.primitiveShader;
            this.renderer.shaderManager.setShader(shader);

            gl.uniformMatrix3fv(shader.translationMatrix, false, graphics.worldTransform.toArray(true));

            gl.uniform1f(shader.flipY, this.renderer.flipY);
            gl.uniform2f(shader.projectionVector, projection.x, -projection.y);
            gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);

            gl.uniform3fv(shader.tintColor, Phaser.Color.hexToRGBArray(graphics.tint));

            gl.uniform1f(shader.alpha, graphics.worldAlpha);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, webGLData.buffer);

            gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 4 * 6, 0);
            gl.vertexAttribPointer(shader.colorAttribute, 4, gl.FLOAT, false,4 * 6, 2 * 4);

            // set the index buffer!
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webGLData.indexBuffer);
        }
    },

    /**
     * @method popStencil
     * @param graphics {Graphics}
     * @param webGLData {Array}
     * @param renderSession {Object}
     */
    popStencil: function (graphics, webGLData)
    {
        var gl = this.gl;

        this.stencilStack.pop();
       
        this.count--;

        if (this.stencilStack.length === 0)
        {
            // the stack is empty!
            gl.disable(gl.STENCIL_TEST);
        }
        else
        {
            var level = this.count;

            this.bindGraphics(graphics, webGLData);

            gl.colorMask(false, false, false, false);
        
            if (webGLData.mode === 1)
            {
                this.reverse = !this.reverse;

                if (this.reverse)
                {
                    gl.stencilFunc(gl.EQUAL, 0xFF - (level + 1), 0xFF);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
                }
                else
                {
                    gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
                }

                // draw a quad to increment..
                gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, (webGLData.indices.length - 4) * 2);
                
                gl.stencilFunc(gl.ALWAYS, 0, 0xFF);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.INVERT);

                // draw the triangle strip!
                gl.drawElements(gl.TRIANGLE_FAN, webGLData.indices.length - 4, gl.UNSIGNED_SHORT, 0);
               
                if (!this.reverse)
                {
                    gl.stencilFunc(gl.EQUAL, 0xFF - (level), 0xFF);
                }
                else
                {
                    gl.stencilFunc(gl.EQUAL, level, 0xFF);
                }
            }
            else
            {
                if (!this.reverse)
                {
                    gl.stencilFunc(gl.EQUAL, 0xFF - (level + 1), 0xFF);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
                }
                else
                {
                    gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
                }

                gl.drawElements(gl.TRIANGLE_STRIP, webGLData.indices.length, gl.UNSIGNED_SHORT, 0);

                if (!this.reverse)
                {
                    gl.stencilFunc(gl.EQUAL, 0xFF - (level), 0xFF);
                }
                else
                {
                    gl.stencilFunc(gl.EQUAL,level, 0xFF);
                }
            }

            gl.colorMask(true, true, true, true);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        }
    },

    /**
    * Destroys the mask stack.
    * 
    * @method destroy
    */
    destroy: function ()
    {
        this.stencilStack = null;

        this.gl = null;

        this.renderer = null;
    }

};
