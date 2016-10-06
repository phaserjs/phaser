/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* New version of PIXI.WebGLSpriteBatch
*
* @class Phaser.Renderer.Canvas
* @constructor
* @param {Phaser.Game} game - Game reference to the currently running game.
*/
Phaser.Renderer.WebGL.SpriteBatch = function (renderer)
{
    this.renderer = renderer;

    this.gl = null;

    this.vertSize = 5;

    //  Number of images in the SpriteBatch before it flushes
    this.size = 2000;

    //the total number of bytes in our batch
    // Including texture index:
    // position + uv + color + textureIndex
    // vec2 + vec2 + (char * 4) + float
    this.vertexSize = (4 * 2) + (4 * 2) + (4) + (4);

    var numVerts = this.vertexSize * this.size * 4;

    //this.size * 4 * 4 * this.vertSize;
    //the total number of indices in our batch
    var numIndices = this.size * 6;

    //  Holds the vertices
    this.vertices = new ArrayBuffer(numVerts);

    //  View on the vertices as a Float32Array
    this.positions = new Float32Array(this.vertices);

    //  View on the vertices as a Uint32Array
    this.colors = new Uint32Array(this.vertices);

    //  Holds the indices
    this.indices = new Uint16Array(numIndices);

    this.lastIndexCount = 0;

    for (var i = 0, j = 0; i < numIndices; i += 6, j += 4)
    {
        this.indices[i + 0] = j + 0;
        this.indices[i + 1] = j + 1;
        this.indices[i + 2] = j + 2;
        this.indices[i + 3] = j + 0;
        this.indices[i + 4] = j + 2;
        this.indices[i + 5] = j + 3;
    }

    this.drawing = false;
    this.currentBatchSize = 0;
    this.currentBaseTexture = null;
    this.dirty = true;
    this.textures = [];
    this.blendModes = [];
    this.shaders = [];
    this.sprites = [];
    this.defaultShader = null;

    this.MAX_TEXTURES = 0;

};

Phaser.Renderer.WebGL.SpriteBatch.prototype.constructor = Phaser.Renderer.WebGL.SpriteBatch;

Phaser.Renderer.WebGL.SpriteBatch.prototype = {

    init: function ()
    {
        this.gl = this.renderer.gl;

        var gl = this.gl;

        this.MAX_TEXTURES = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

        if (this.renderer.enableMultiTextureToggle)
        {
            var dynamicIfs = '\tif (vTextureIndex == 0.0) gl_FragColor = texture2D(uSamplerArray[0], vTextureCoord) * vColor;\n'

            for (var index = 1; index < this.MAX_TEXTURES; ++index)
            {
                dynamicIfs += '\telse if (vTextureIndex == ' +
                    index + '.0) gl_FragColor = texture2D(uSamplerArray[' +
                    index + '], vTextureCoord) * vColor;\n'
            }

            this.defaultShader = new Phaser.Filter(
                this.renderer.game,
                undefined,
                [
                    '//WebGLSpriteBatch Fragment Shader.',
                    'precision lowp float;',
                    'varying vec2 vTextureCoord;',
                    'varying vec4 vColor;',
                    'varying float vTextureIndex;',
                    'uniform sampler2D uSamplerArray[' + this.MAX_TEXTURES + '];',
                    'void main(void) {',
                        dynamicIfs,
                        '\telse gl_FragColor = texture2D(uSamplerArray[0], vTextureCoord) * vColor;',
                    '}'
                ]);
        }
        else
        {
            this.defaultShader = new Phaser.Filter(
                this.renderer.game,
                undefined,
                [
                    '//WebGLSpriteBatch Fragment Shader.',
                    'precision lowp float;',
                    'varying vec2 vTextureCoord;',
                    'varying vec4 vColor;',
                    'varying float vTextureIndex;',
                    'uniform sampler2D uSampler;',
                    'void main(void) {',
                    '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;',
                    '}'
                ]);
        }

        //  Create a couple of buffers
        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();

        //  65535 is max index, so 65535 / 6 = 10922.

        //  Upload the index data
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

        this.currentBlendMode = 99999;

        var shader = new Phaser.Renderer.WebGL.Shaders.Sprite(this.renderer);

        shader.fragmentSrc = this.defaultShader.fragmentSrc;
        shader.uniforms = {};
        shader.init();

        this.defaultShader.shaders = shader;
    },

    begin: function ()
    {
        this.shader = this.renderer.shaderManager.defaultShader;
        this.start();
    },

    start: function () {
        this.dirty = true;
    },

    end: function ()
    {
        this.flush();
    },

    stop: function () {
        this.flush();
        this.dirty = true;
    },

    render: function (sprite)
    {
        var texture = sprite.texture;
        var baseTexture = texture.baseTexture;
        var gl = this.gl;

        if (this.renderer.textureArray[baseTexture.textureIndex] !== baseTexture)
        {
            this.flush();
            gl.activeTexture(gl.TEXTURE0 + baseTexture.textureIndex);
            gl.bindTexture(gl.TEXTURE_2D, baseTexture._glTextures);
            this.renderer.textureArray[baseTexture.textureIndex] = baseTexture;
        }

        // check texture..
        if (this.currentBatchSize >= this.size)
        {
            this.flush();
            this.currentBaseTexture = texture.baseTexture;
        }

        // get the uvs for the texture
        var uvs = texture._uvs;

        // if the uvs have not updated then no point rendering just yet!
        if (!uvs)
        {
            return;
        }

        var aX = sprite.anchor.x;
        var aY = sprite.anchor.y;

        var w0, w1, h0, h1;

        if (texture.trim)
        {
            // if the sprite is trimmed then we need to add the extra space before transforming the sprite coords.
            var trim = texture.trim;

            w1 = trim.x - aX * trim.width;
            w0 = w1 + texture.crop.width;

            h1 = trim.y - aY * trim.height;
            h0 = h1 + texture.crop.height;
        }
        else
        {
            w0 = (texture.frame.width) * (1 - aX);
            w1 = (texture.frame.width) * -aX;

            h0 = texture.frame.height * (1 - aY);
            h1 = texture.frame.height * -aY;
        }

        var i = this.currentBatchSize * this.vertexSize; //4 * this.vertSize;
        var tiOffset = this.currentBatchSize * 4;
        var resolution = texture.baseTexture.resolution;
        var textureIndex = texture.baseTexture.textureIndex;

        var wt = sprite.worldTransform;

        var a = wt.a / resolution;
        var b = wt.b / resolution;
        var c = wt.c / resolution;
        var d = wt.d / resolution;
        var tx = wt.tx;
        var ty = wt.ty;

        var cw = texture.crop.width;
        var ch = texture.crop.height;

        if (texture.rotated)
        {
            var a0 = wt.a;
            var b0 = wt.b;
            var c0 = wt.c;
            var d0 = wt.d;
            var _w1 = w1;
            var _w0 = w0;

            // Offset before rotating
            tx = wt.c * ch + tx;
            ty = wt.d * ch + ty;
            
            // Rotate matrix by 90 degrees
            // We use precalculated values for sine and cosine of rad(90)
            a = a0 * 6.123233995736766e-17 + -c0;
            b = b0 * 6.123233995736766e-17 + -d0;
            c = a0 + c0 * 6.123233995736766e-17;
            d = b0 + d0 * 6.123233995736766e-17;

            // Update UV coordinates
            texture._updateUvsInverted();

            // Rotate dimensions
            w0 = h0;
            w1 = h1;
            h0 = _w0;
            h1 = _w1;   
        }

        var colors = this.colors;
        var positions = this.positions;
        var tint = sprite.tint;
        var color = (tint >> 16) + (tint & 0xff00) + ((tint & 0xff) << 16) + (sprite.worldAlpha * 255 << 24);

        if (this.renderer.roundPixels)
        {
            tx |= 0;
            ty |= 0;
        }

        positions[i++] = a * w1 + c * h1 + tx;
        positions[i++] = d * h1 + b * w1 + ty;
        positions[i++] = uvs.x0;
        positions[i++] = uvs.y0;
        colors[i++] = color;
        positions[i++] = textureIndex;

        positions[i++] = a * w0 + c * h1 + tx;
        positions[i++] = d * h1 + b * w0 + ty;
        positions[i++] = uvs.x1;
        positions[i++] = uvs.y1;
        colors[i++] = color;
        positions[i++] = textureIndex;

        positions[i++] = a * w0 + c * h0 + tx;
        positions[i++] = d * h0 + b * w0 + ty;
        positions[i++] = uvs.x2;
        positions[i++] = uvs.y2;
        colors[i++] = color;
        positions[i++] = textureIndex;

        positions[i++] = a * w1 + c * h0 + tx;
        positions[i++] = d * h0 + b * w1 + ty;
        positions[i++] = uvs.x3;
        positions[i++] = uvs.y3;
        colors[i++] = color;
        positions[i++] = textureIndex;

        // increment the batchsize
        this.sprites[this.currentBatchSize++] = sprite;
    },

    flush: function ()
    {
        // If the batch is length 0 then return as there is nothing to draw
        if (this.currentBatchSize === 0)
        {
            return;
        }

        var gl = this.gl;
        var shader;

        if (this.dirty)
        {
            this.dirty = false;

            shader = this.defaultShader.shaders;

            // bind the main texture
            gl.activeTexture(gl.TEXTURE0);

            // bind the buffers
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            // this is the same for each shader?
            var stride = this.vertexSize; //this.vertSize * 4;
            gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, stride, 0);
            gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, stride, 8);

            // color attributes will be interpreted as unsigned bytes and normalized
            gl.vertexAttribPointer(shader.colorAttribute, 4, gl.UNSIGNED_BYTE, true, stride, 16);

            // Texture index
            gl.vertexAttribPointer(shader.aTextureIndex, 1, gl.FLOAT, false, stride, 20);
        }

        // upload the verts to the buffer  
        if (this.currentBatchSize > (this.size * 0.5))
        {
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
        }
        else
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            var view = this.positions.subarray(0, this.currentBatchSize * this.vertexSize);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);
        }

        var nextTexture, nextBlendMode, nextShader;
        var batchSize = 0;
        var start = 0;

        var currentBaseTexture = null;
        var currentBlendMode = this.renderer.currentBlendMode;
        var currentShader = null;

        var blendSwap = false;
        var shaderSwap = false;
        var sprite;
        var textureIndex = 0;

        for (var i = 0, j = this.currentBatchSize; i < j; i++)
        {
            sprite = this.sprites[i];

            if (sprite.tilingTexture)
            {
                nextTexture = sprite.tilingTexture.baseTexture;
            }
            else
            {
                nextTexture = sprite.texture.baseTexture;
            }

            nextBlendMode = sprite.blendMode;
            nextShader = sprite.shader || this.defaultShader;

            blendSwap = currentBlendMode !== nextBlendMode;
            shaderSwap = currentShader !== nextShader;

            var skip = nextTexture.skipRender;

            if (skip && sprite.children.length > 0)
            {
                skip = false;
            }

            if (blendSwap || shaderSwap)
            {
                this.renderBatch(currentBaseTexture, batchSize, start);

                start = i;
                batchSize = 0;
                currentBaseTexture = nextTexture;

                if (blendSwap)
                {
                    currentBlendMode = nextBlendMode;
                    this.renderer.setBlendMode(currentBlendMode);
                }

                if (shaderSwap)
                {
                    currentShader = nextShader;

                    shader = currentShader.shaders;

                    if (!shader)
                    {
                        shader = new PIXI.PixiShader(gl);

                        shader.fragmentSrc = currentShader.fragmentSrc;
                        shader.uniforms = currentShader.uniforms;
                        shader.init();

                        currentShader.shaders = shader;
                    }

                    this.renderer.shaderManager.setShader(shader);

                    if (shader.dirty)
                    {
                        shader.syncUniforms();
                    }

                    // both these only need to be set if they are changing..
                    // set the projection
                    var projection = this.renderer.projection;

                    gl.uniform2f(shader.projectionVector, projection.x, projection.y);

                    var offsetVector = this.renderer.offset;

                    gl.uniform2f(shader.offsetVector, offsetVector.x, offsetVector.y);
                }
            }

            batchSize++;
        }

        this.renderBatch(currentBaseTexture, batchSize, start);

        // then reset the batch!
        this.currentBatchSize = 0;
    },

    renderBatch: function (texture, size, startIndex)
    {
        if (size === 0)
        {
            return;
        }

        var gl = this.gl;

        // check if a texture is dirty..
        if (texture._dirty)
        {
            if (!this.renderer.updateTexture(texture))
            {
                //  If updateTexture returns false then we cannot render it, so bail out now
                return;
            }
        }

        gl.drawElements(gl.TRIANGLES, size * 6, gl.UNSIGNED_SHORT, startIndex * 6 * 2);

        // increment the draw count
        this.renderer.drawCount++;
    },

    //  PIXI.WebGLSpriteBatch.prototype.renderTilingSprite needs porting over, but not into here

    destroy: function ()
    {
        this.vertices = null;
        this.indices = null;

        this.gl.deleteBuffer(this.vertexBuffer);
        this.gl.deleteBuffer(this.indexBuffer);

        this.currentBaseTexture = null;

        this.renderer = null;
        this.gl = null;
    }

};
