/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* New version of PIXI.WebGLFilterManager
*
* @class Phaser.Renderer.Canvas
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
*/
Phaser.Renderer.WebGL.FilterManager = function (renderer)
{
    this.renderer = renderer;

    this.gl = null;

    /**
     * @property filterStack
     * @type Array
     */
    this.filterStack = [];

    this.texturePool = [];
    
    /**
     * @property offsetX
     * @type Number
     */
    this.offsetX = 0;

    /**
     * @property offsetY
     * @type Number
     */
    this.offsetY = 0;

    this.vertexBuffer = null;
    this.uvBuffer = null;
    this.colorBuffer = null;
    this.indexBuffer = null;

    this.vertexArray = null;
    this.colorArray = null;
    this.uvArray = null;

};

Phaser.Renderer.WebGL.FilterManager.prototype.constructor = Phaser.Renderer.WebGL.FilterManager;

Phaser.Renderer.WebGL.FilterManager.prototype = {

    init: function ()
    {
        this.gl = this.renderer.gl;

        var gl = this.gl;

        this.texturePool = [];

        //  Initialises the shader buffers

        this.vertexBuffer = gl.createBuffer();
        this.uvBuffer = gl.createBuffer();
        this.colorBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();

        // bind and upload the vertex data
        this.vertexArray = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
        ]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexArray, gl.STATIC_DRAW);

        // bind and upload the uv buffer
        this.uvArray = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
        ]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvArray, gl.STATIC_DRAW);

        this.colorArray = new Float32Array([
            1.0, 0xFFFFFF,
            1.0, 0xFFFFFF,
            1.0, 0xFFFFFF,
            1.0, 0xFFFFFF
        ]);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colorArray, gl.STATIC_DRAW);

        // bind and upload the index
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([ 0, 1, 2, 1, 3, 2 ]), gl.STATIC_DRAW);
    },

    /**
    * @method begin
    * @param renderSession {RenderSession} 
    * @param buffer {ArrayBuffer} 
    */
    begin: function (buffer)
    {
        this.defaultShader = this.renderer.shaderManager.defaultShader;

        var projection = this.renderer.projection;

        this.width = projection.x * 2;
        this.height = -projection.y * 2;
        this.buffer = buffer;
    },

    /**
    * Applies the filter and adds it to the current filter stack.
    * 
    * @method pushFilter
    * @param filterBlock {Object} the filter that will be pushed to the current filter stack
    */
    pushFilter: function (filterBlock)
    {
        var gl = this.gl;

        var projection = this.renderer.projection;
        var offset = this.renderer.offset;

        filterBlock._filterArea = filterBlock.target.filterArea || filterBlock.target.getBounds();
        
        //  Creates a brand new Stencil Manager each time the filter is pushed
        //  Let's check why

        // filterBlock._previous_stencil_mgr = this.renderSession.stencilManager;
        // this.renderSession.stencilManager = new PIXI.WebGLStencilManager();
        // this.renderSession.stencilManager.setContext(gl);
        // gl.disable(gl.STENCIL_TEST);
       
        this.filterStack.push(filterBlock);

        var filter = filterBlock.filterPasses[0];

        this.offsetX += filterBlock._filterArea.x;
        this.offsetY += filterBlock._filterArea.y;

        var texture = this.texturePool.pop();

        if (!texture)
        {
            texture = new Phaser.Renderer.WebGL.FilterTexture(this.renderer, this.width * this.renderer.resolution, this.height * this.renderer.resolution);
        }
        else
        {
            texture.resize(this.width * this.renderer.resolution, this.height * this.renderer.resolution);
        }

        gl.bindTexture(gl.TEXTURE_2D, texture.texture);

        var filterArea = filterBlock._filterArea;

        var padding = filter.padding;

        filterArea.x -= padding;
        filterArea.y -= padding;
        filterArea.width += padding * 2;
        filterArea.height += padding * 2;

        // cap filter to screen size..
        filterArea.x = Math.max(0, filterArea.x);
        filterArea.y = Math.max(0, filterArea.y);
        filterArea.width = Math.min(this.width, filterArea.width);
        filterArea.height = Math.min(this.height, filterArea.height);

        gl.bindFramebuffer(gl.FRAMEBUFFER, texture.frameBuffer);

        // set view port
        gl.viewport(0, 0, filterArea.width * this.renderer.resolution, filterArea.height * this.renderer.resolution);

        projection.x = filterArea.width / 2;
        projection.y = -filterArea.height / 2;

        offset.x = -filterArea.x;
        offset.y = -filterArea.y;

        gl.colorMask(true, true, true, true);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        filterBlock._glFilterTexture = texture;
    },

    /**
    * Removes the last filter from the filter stack and doesn't return it.
    * 
    * @method popFilter
    */
    popFilter: function ()
    {
        var gl = this.gl;

        var filterBlock = this.filterStack.pop();
        var filterArea = filterBlock._filterArea;

        var texture = filterBlock._glFilterTexture;
        var projection = this.renderer.projection;
        var offset = this.renderer.offset;

        if (filterBlock.filterPasses.length > 1)
        {
            gl.viewport(0, 0, filterArea.width * this.renderer.resolution, filterArea.height * this.renderer.resolution);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

            this.vertexArray[0] = 0;
            this.vertexArray[1] = filterArea.height;

            this.vertexArray[2] = filterArea.width;
            this.vertexArray[3] = filterArea.height;

            this.vertexArray[4] = 0;
            this.vertexArray[5] = 0;

            this.vertexArray[6] = filterArea.width;
            this.vertexArray[7] = 0;

            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexArray);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);

            this.uvArray[2] = filterArea.width / this.width;
            this.uvArray[5] = filterArea.height / this.height;
            this.uvArray[6] = filterArea.width / this.width;
            this.uvArray[7] = filterArea.height / this.height;

            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uvArray);

            var inputTexture = texture;
            var outputTexture = this.texturePool.pop();

            if (!outputTexture)
            {
                outputTexture = new Phaser.Renderer.WebGL.FilterTexture(this.renderer, this.width * this.renderer.resolution, this.height * this.renderer.resolution);
            }
            else
            {
                outputTexture.resize(this.width * this.renderer.resolution, this.height * this.renderer.resolution);
            }

            // need to clear this FBO as it may have some left over elements from a previous filter.
            gl.bindFramebuffer(gl.FRAMEBUFFER, outputTexture.frameBuffer);

            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.disable(gl.BLEND);

            for (var i = 0; i < filterBlock.filterPasses.length - 1; i++)
            {
                var filterPass = filterBlock.filterPasses[i];

                gl.bindFramebuffer(gl.FRAMEBUFFER, outputTexture.frameBuffer);

                // set texture
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, inputTexture.texture);

                // draw texture..
                this.applyFilterPass(filterPass, filterArea, filterArea.width, filterArea.height);

                // swap the textures..
                var temp = inputTexture;
                inputTexture = outputTexture;
                outputTexture = temp;
            }

            gl.enable(gl.BLEND);

            texture = inputTexture;

            this.texturePool.push(outputTexture);
        }

        var filter = filterBlock.filterPasses[filterBlock.filterPasses.length - 1];

        this.offsetX -= filterArea.x;
        this.offsetY -= filterArea.y;

        var sizeX = this.width;
        var sizeY = this.height;

        var offsetX = 0;
        var offsetY = 0;

        var buffer = this.buffer;

        // time to render the filters texture to the previous scene
        if (this.filterStack.length === 0)
        {
            gl.colorMask(true, true, true, true);
        }
        else
        {
            var currentFilter = this.filterStack[this.filterStack.length - 1];

            filterArea = currentFilter._filterArea;

            sizeX = filterArea.width;
            sizeY = filterArea.height;

            offsetX = filterArea.x;
            offsetY = filterArea.y;

            buffer = currentFilter._glFilterTexture.frameBuffer;
        }

        projection.x = sizeX / 2;
        projection.y = -sizeY / 2;

        offset.x = offsetX;
        offset.y = offsetY;

        filterArea = filterBlock._filterArea;

        var x = filterArea.x - offsetX;
        var y = filterArea.y - offsetY;

        // update the buffers..
        // make sure to flip the y!
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        this.vertexArray[0] = x;
        this.vertexArray[1] = y + filterArea.height;

        this.vertexArray[2] = x + filterArea.width;
        this.vertexArray[3] = y + filterArea.height;

        this.vertexArray[4] = x;
        this.vertexArray[5] = y;

        this.vertexArray[6] = x + filterArea.width;
        this.vertexArray[7] = y;

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexArray);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);

        this.uvArray[2] = filterArea.width / this.width;
        this.uvArray[5] = filterArea.height / this.height;
        this.uvArray[6] = filterArea.width / this.width;
        this.uvArray[7] = filterArea.height / this.height;

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uvArray);

        gl.viewport(0, 0, sizeX * this.renderer.resolution, sizeY * this.renderer.resolution);

        // bind the buffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);

        // set texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture.texture);

        //  Need to consolidate with the entry in the method above

        /*
        if (this.renderSession.stencilManager)
        {
            this.renderSession.stencilManager.destroy();
        }

        this.renderSession.stencilManager = filterBlock._previous_stencil_mgr;

        filterBlock._previous_stencil_mgr = null;

        if (this.renderSession.stencilManager.count > 0)
        {
            gl.enable(gl.STENCIL_TEST);
        }
        else
        {
            gl.disable(gl.STENCIL_TEST);
        }
        */

        this.applyFilterPass(filter, filterArea, sizeX, sizeY);

        this.texturePool.push(texture);

        filterBlock._glFilterTexture = null;
    },

    /**
    * Applies the filter to the specified area.
    * 
    * @method applyFilterPass
    * @param filter {Phaser.Filter} the filter that needs to be applied
    * @param filterArea {Texture} TODO - might need an update
    * @param width {Number} the horizontal range of the filter
    * @param height {Number} the vertical range of the filter
    */
    applyFilterPass: function (filter, filterArea, width, height)
    {
        var gl = this.gl;
        var shader = filter.shaders;

        if (!shader)
        {
            shader = new Phaser.Renderer.WebGL.Shaders.Sprite(this.renderer);

            shader.fragmentSrc = filter.fragmentSrc;
            shader.uniforms = filter.uniforms;
            shader.init(true);

            filter.shaders = shader;
        }

        this.renderer.shaderManager.setShader(shader);

        gl.uniform2f(shader.projectionVector, width / 2, -(height / 2));
        gl.uniform2f(shader.offsetVector, 0, 0);

        if (filter.uniforms.dimensions)
        {
            filter.uniforms.dimensions.value[0] = this.width;
            filter.uniforms.dimensions.value[1] = this.height;
            filter.uniforms.dimensions.value[2] = this.vertexArray[0];
            filter.uniforms.dimensions.value[3] = this.vertexArray[5];
        }

        shader.syncUniforms();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(shader.colorAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        this.renderer.drawCount++;
    },

    /**
    * Destroys the filter and removes it from the filter stack.
    * 
    * @method destroy
    */
    destroy: function ()
    {
        var gl = this.gl;

        this.filterStack = null;
        
        this.offsetX = 0;
        this.offsetY = 0;

        // destroy textures
        for (var i = 0; i < this.texturePool.length; i++)
        {
            this.texturePool[i].destroy();
        }
        
        this.texturePool = null;

        //  Destroy buffers
        gl.deleteBuffer(this.vertexBuffer);
        gl.deleteBuffer(this.uvBuffer);
        gl.deleteBuffer(this.colorBuffer);
        gl.deleteBuffer(this.indexBuffer);
    }

};
