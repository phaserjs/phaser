var DrawCommand = require('../commands/DrawCommand');
var UpdateBufferResourceCommand = require('../commands/UpdateBufferResourceCommand');
var TexturedAndTintedShader = require('../shaders/TexturedAndTintedShader');
var GL = require('../GL');
var TransformMatrix = require('../../../components/TransformMatrix');
var GlobalCommandList = require('../../GlobalCommandList');

var TextureRenderer = function (game, maxSprites, commandList) 
{
    
    // Vertex Structure
    // ---------------------
    // struct SpriteVertex {
    //     float32 a_position[2];   // 8 bytes
    //     float32 a_tex_coord[2];  // 8 bytes
    //     uint32 a_color;          // 4 bytes
    //     float32 a_alpha;         // 4 bytes
    // };
    // ---------------------

    // Internal use
    this.vertexSize = 24;
    this.maxVertices = 6 * (maxSprites !== undefined ? maxSprites : 1);
    this.vertexCount = 0;
    this.bufferResource = new ArrayBuffer(this.maxVertices * this.vertexSize);
    this.float32View = new Float32Array(this.bufferResource);
    this.uint32View = new Uint32Array(this.bufferResource);
    this.tempMatrix = new TransformMatrix();

    // Save resource manager and command list
    this.resourceManager = game.renderDevice.resourceManager;
    this.commandList = commandList !== undefined ? commandList : GlobalCommandList.commandList;

    // Resource Creation
    this.drawCommand = new DrawCommand();
    this.updateBufferResourceCommand = new UpdateBufferResourceCommand();
    this.shaderPipeline = this.resourceManager.createShaderPipeline('TexturedAndTintedShader', TexturedAndTintedShader);
    this.vertexBuffer = this.resourceManager.createBuffer(GL.ARRAY_BUFFER, this.bufferResource, GL.STREAM_DRAW);
    this.outputStage = this.resourceManager.createOutputStage();

    // Setup output stage
    this.outputStage.enableBlending = true;
    this.outputStage.setDefaultBlending();

    // Vertex Attribute Definition
    this.vertexBuffer.setInputElement(0, 2, GL.FLOAT, false, this.vertexSize, 0);
    this.vertexBuffer.setInputElement(1, 2, GL.FLOAT, false, this.vertexSize, 8);
    this.vertexBuffer.setInputElement(2, 4, GL.UNSIGNED_BYTE, true, this.vertexSize, 16);
    this.vertexBuffer.setInputElement(3, 1, GL.FLOAT, false, this.vertexSize, 20);

    // Draw call setup
    this.drawCommand.setTopology(GL.TRIANGLES);
    this.drawCommand.setShaderPipeline(this.shaderPipeline);
    this.drawCommand.setOutputStage(this.outputStage);
    this.drawCommand.setVertexBuffer(this.vertexBuffer);
    this.drawCommand.setVertexCount(0, 0);

    // Update buffer resource setup
    this.updateBufferResourceCommand.setBuffer(this.vertexBuffer);
    this.updateBufferResourceCommand.setBufferData(this.bufferResource, 0);

    // Set Clipping Martrix
    this.setClippingRect(
        game.config.width * game.config.resolution, 
        game.config.height * game.config.resolution
    );
};

TextureRenderer.prototype.constructor = TextureRenderer;

TextureRenderer.prototype = {

    setClippingRect: function (w, h)
    {
        this.shaderPipeline.setConstantMatrix4x4(
            this.shaderPipeline.getUniformLocation('u_view_matrix'),
            new Float32Array([
                2 / w, 0, 0, 0,
                0, -2 / h, 0, 0,
                0, 0, 1, 1,
                -1, 1, 0, 0
            ])
        );
    },

    begin: function ()
    {
        this.vertexCount = 0;
    },

    end: function ()
    {
        this.drawCommand.setVertexCount(0, this.vertexCount);
        this.commandList.addCommand(this.updateBufferResourceCommand);
        this.commandList.addCommand(this.drawCommand);
    },

    setTexture: function (texture)
    {
        this.drawCommand.setTexture(texture.source[0].glTexture, 0);
    },

    render: function (gameObject, camera)
    {
        var tempMatrix, frame, vertexBufferF32, vertexBufferU32, 
            vertexOffset, uvs, width, height, translateX, 
            translateY, scaleX, scaleY, rotation, 
            tempMatrixMatrix, x, y, xw, yh, 
            cameraMatrix, mva, sra, alpha,
            mva, mvb, mvc, mvd, mve, mvf, tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3,
            sra, srb, src, srd, sre, srf, cma, cmb, cmc, cmd, cme, cmf;

        if (this.vertexCount + 6 <= this.maxVertices)
        {
            tempMatrix = this.tempMatrix;
            frame = gameObject.frame;
            vertexBufferF32 = this.float32View;
            vertexBufferU32 = this.uint32View;
            vertexOffset = 0;
            uvs = frame.uvs;
            width = frame.width * (gameObject.flipX ? -1 : 1);
            height = frame.height * (gameObject.flipY ? -1 : 1);
            translateX = gameObject.x - camera.scrollX;
            translateY = gameObject.y - camera.scrollY;
            scaleX = gameObject.scaleX;
            scaleY = gameObject.scaleY;
            rotation = -gameObject.rotation;
            tempMatrixMatrix = tempMatrix.matrix;
            x = -gameObject.displayOriginX + frame.x + ((frame.width) * (gameObject.flipX ? 1 : 0.0));
            y = -gameObject.displayOriginY + frame.y + ((frame.height) * (gameObject.flipY ? 1 : 0.0));
            xw = x + width;
            yh = y + height;
            cameraMatrix = camera.matrix.matrix;
            alpha = gameObject.alpha;

            // Maybe move this function to here.
            tempMatrix.applyITRS(translateX, translateY, rotation, scaleX, scaleY);

            sra = tempMatrixMatrix[0];
            srb = tempMatrixMatrix[1];
            src = tempMatrixMatrix[2];
            srd = tempMatrixMatrix[3];
            sre = tempMatrixMatrix[4];
            srf = tempMatrixMatrix[5];

            cma = cameraMatrix[0];
            cmb = cameraMatrix[1];
            cmc = cameraMatrix[2];
            cmd = cameraMatrix[3];
            cme = cameraMatrix[4];
            cmf = cameraMatrix[5];

            mva = sra * cma + srb * cmc;
            mvb = sra * cmb + srb * cmd;
            mvc = src * cma + srd * cmc;
            mvd = src * cmb + srd * cmd;
            mve = sre * cma + srf * cmc + cme;
            mvf = sre * cmb + srf * cmd + cmf; 
            
            tx0 = x * mva + y * mvc + mve;
            ty0 = x * mvb + y * mvd + mvf;
            tx1 = x * mva + yh * mvc + mve;
            ty1 = x * mvb + yh * mvd + mvf;
            tx2 = xw * mva + yh * mvc + mve;
            ty2 = xw * mvb + yh * mvd + mvf;
            tx3 = xw * mva + y * mvc + mve;
            ty3 = xw * mvb + y * mvd + mvf;

            vertexOffset = (this.vertexCount * this.vertexSize);

            vertexBufferF32[vertexOffset++] = tx0;
            vertexBufferF32[vertexOffset++] = ty0;
            vertexBufferF32[vertexOffset++] = uvs.x0;
            vertexBufferF32[vertexOffset++] = uvs.y0;
            vertexBufferU32[vertexOffset++] = 0xFFFFFF; //vertexColor.topLeft;
            vertexBufferF32[vertexOffset++] = alpha;

            vertexBufferF32[vertexOffset++] = tx1;
            vertexBufferF32[vertexOffset++] = ty1;
            vertexBufferF32[vertexOffset++] = uvs.x1;
            vertexBufferF32[vertexOffset++] = uvs.y1;
            vertexBufferU32[vertexOffset++] = 0xFFFFFF; //vertexColor.bottomLeft;
            vertexBufferF32[vertexOffset++] = alpha;

            vertexBufferF32[vertexOffset++] = tx2;
            vertexBufferF32[vertexOffset++] = ty2;
            vertexBufferF32[vertexOffset++] = uvs.x2;
            vertexBufferF32[vertexOffset++] = uvs.y2;
            vertexBufferU32[vertexOffset++] = 0xFFFFFF; //vertexColor.bottomRight;
            vertexBufferF32[vertexOffset++] = alpha;

            vertexBufferF32[vertexOffset++] = tx0;
            vertexBufferF32[vertexOffset++] = ty0;
            vertexBufferF32[vertexOffset++] = uvs.x0;
            vertexBufferF32[vertexOffset++] = uvs.y0;
            vertexBufferU32[vertexOffset++] = 0xFFFFFF; //vertexColor.topLeft;
            vertexBufferF32[vertexOffset++] = alpha;

            vertexBufferF32[vertexOffset++] = tx2;
            vertexBufferF32[vertexOffset++] = ty2;
            vertexBufferF32[vertexOffset++] = uvs.x2;
            vertexBufferF32[vertexOffset++] = uvs.y2;
            vertexBufferU32[vertexOffset++] = 0xFFFFFF; //vertexColor.bottomRight;
            vertexBufferF32[vertexOffset++] = alpha;

            vertexBufferF32[vertexOffset++] = tx3;
            vertexBufferF32[vertexOffset++] = ty3;
            vertexBufferF32[vertexOffset++] = uvs.x3;
            vertexBufferF32[vertexOffset++] = uvs.y3;
            vertexBufferU32[vertexOffset++] = 0xFFFFFF; //vertexColor.topRight;
            vertexBufferF32[vertexOffset++] = alpha;
        
            this.vertexCount += 6;
            return true;
        }
        return false;
    }

};

module.exports = TextureRenderer;
