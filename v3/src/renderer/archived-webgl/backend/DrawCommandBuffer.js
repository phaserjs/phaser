// Generic Command Pool
var CommandPool = function (type, poolSize)
{
    this.array = [];
    this.length = 0;
    for (var index = 0; index < poolSize; ++index)
    {
        this.array.push(new type());
    }
};
CommandPool.prototype.allocate = function ()
{
    return this.array[this.length++];
};
CommandPool.prototype.clear = function ()
{
    this.length = 0;
};

// Command Structures
var CmdDrawQuad = function ()
{
    this.uMin = 0;
    this.vMin = 0;
    this.uMax = 1;
    this.vMax = 1;
    this.bufferHost = null;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;
    this.bufferOffset = 0;
    this.r = 1;
    this.g = 1;
    this.b = 1;
    this.a = 1;
};

var CmdSetTexture2D = function ()
{
    this.texture2D = null;
};

var CmdDraw = function ()
{
    this.pipelineState = null;
    this.vertexCount = 0;
    this.startVertexLocation = 0;
};

var CmdUpdateSubVertexBuffer = function ()
{
    this.pipelineState = null;
    this.offset = 0;
    this.elements = 0;
};

// CMD id for generic command streaming.
CmdDrawQuad.CMD_ID = 0;
CmdSetTexture2D.CMD_ID = 1;
CmdDraw.CMD_ID = 2;
CmdUpdateSubVertexBuffer.CMD_ID = 3;

// Allocate Command Pools
CmdDrawQuad.pool = new CommandPool(CmdDrawQuad, 1000000);
CmdSetTexture2D.pool = new CommandPool(CmdSetTexture2D, 100);
CmdDraw.pool = new CommandPool(CmdDraw, 1000);
CmdUpdateSubVertexBuffer.pool = new CommandPool(CmdUpdateSubVertexBuffer, 100);

var DrawCommandBuffer = function ()
{
    this.commandBuffer = [];
};

DrawCommandBuffer.prototype.addCommand = function (type)
{
    var cmd = type.pool.allocate();
    this.commandBuffer.push(type.CMD_ID);
    this.commandBuffer.push(cmd);
    return cmd;
};

DrawCommandBuffer.prototype.clear = function ()
{
    this.commandBuffer.length = 0;
    CmdDrawQuad.pool.clear();
    CmdSetTexture2D.pool.clear();
    CmdDraw.pool.clear();
    CmdUpdateSubVertexBuffer.pool.clear();
};

DrawCommandBuffer.CMD_DRAW_QUAD = CmdDrawQuad.CMD_ID;
DrawCommandBuffer.CMD_SET_TEXTURE_2D = CmdSetTexture2D.CMD_ID;
DrawCommandBuffer.CMD_DRAW = CmdDraw.CMD_ID;
DrawCommandBuffer.CMD_UPDATE_SUB_VERTEX_BUFFER = CmdUpdateSubVertexBuffer.CMD_ID;

// WebGL command descoder will decode and execute
// drawing commands.
var WebGLDrawCommandDecoder = {};
WebGLDrawCommandDecoder.executeDrawCommandBuffer = function (device, drawCommandBuffer)
{
    var commandBuffer = drawCommandBuffer.commandBuffer;
    for (var index = 0, length = commandBuffer.length; index < length; ++index)
    {
        var cmd = commandBuffer[index];
        switch (cmd)
        {
            case DrawCommandBuffer.CMD_DRAW_QUAD:
                {
                    var cmdQuadDraw = commandBuffer[++index];
                    var bufferHost = cmdQuadDraw.bufferHost;
                    var offset = cmdQuadDraw.bufferOffset;
                    var x = cmdQuadDraw.x;
                    var y = cmdQuadDraw.y;
                    var width = cmdQuadDraw.width;
                    var height = cmdQuadDraw.height;
                    var uMin = cmdQuadDraw.uMin;
                    var vMin = cmdQuadDraw.vMin;
                    var uMax = cmdQuadDraw.uMax;
                    var vMax = cmdQuadDraw.vMax;
                    var scaleX = cmdQuadDraw.scaleX;
                    var scaleY = cmdQuadDraw.scaleY;
                    var rotation = cmdQuadDraw.rotation;
                    var r = cmdQuadDraw.r;
                    var g = cmdQuadDraw.g;
                    var b = cmdQuadDraw.b;
                    var a = cmdQuadDraw.a;

                    bufferHost[offset++] = x; // x
                    bufferHost[offset++] = y; // y
                    bufferHost[offset++] = uMin; // u
                    bufferHost[offset++] = vMin; // v
                    bufferHost[offset++] = r; // r
                    bufferHost[offset++] = g; // g
                    bufferHost[offset++] = b; // b
                    bufferHost[offset++] = a; // a
                    bufferHost[offset++] = scaleX; // sx
                    bufferHost[offset++] = scaleY; // sy
                    bufferHost[offset++] = rotation; // r

                    bufferHost[offset++] = x; // x
                    bufferHost[offset++] = y + height; // y
                    bufferHost[offset++] = uMin; // u
                    bufferHost[offset++] = vMax; // v
                    bufferHost[offset++] = r; // r
                    bufferHost[offset++] = g; // g
                    bufferHost[offset++] = b; // b
                    bufferHost[offset++] = a; // a
                    bufferHost[offset++] = scaleX; // sx
                    bufferHost[offset++] = scaleY; // sy
                    bufferHost[offset++] = rotation; // r

                    bufferHost[offset++] = x + width; // x
                    bufferHost[offset++] = y + height; // y
                    bufferHost[offset++] = uMax; // u
                    bufferHost[offset++] = vMax; // v
                    bufferHost[offset++] = r; // r
                    bufferHost[offset++] = g; // g
                    bufferHost[offset++] = b; // b
                    bufferHost[offset++] = a; // a
                    bufferHost[offset++] = scaleX; // sx
                    bufferHost[offset++] = scaleY; // sy
                    bufferHost[offset++] = rotation; // r

                    bufferHost[offset++] = x; // x
                    bufferHost[offset++] = y; // y
                    bufferHost[offset++] = uMin; // u
                    bufferHost[offset++] = vMin; // v
                    bufferHost[offset++] = r; // r
                    bufferHost[offset++] = g; // g
                    bufferHost[offset++] = b; // b
                    bufferHost[offset++] = a; // a
                    bufferHost[offset++] = scaleX; // sx
                    bufferHost[offset++] = scaleY; // sy
                    bufferHost[offset++] = rotation; // r

                    bufferHost[offset++] = x + width; // x
                    bufferHost[offset++] = y + height; // y
                    bufferHost[offset++] = uMax; // u
                    bufferHost[offset++] = vMax; // v
                    bufferHost[offset++] = r; // r
                    bufferHost[offset++] = g; // g
                    bufferHost[offset++] = b; // b
                    bufferHost[offset++] = a; // a
                    bufferHost[offset++] = scaleX; // sx
                    bufferHost[offset++] = scaleY; // sy
                    bufferHost[offset++] = rotation; // r

                    bufferHost[offset++] = x + width; // x
                    bufferHost[offset++] = y; // y
                    bufferHost[offset++] = uMax; // u
                    bufferHost[offset++] = vMin; // v
                    bufferHost[offset++] = r; // r
                    bufferHost[offset++] = g; // g
                    bufferHost[offset++] = b; // b
                    bufferHost[offset++] = a; // a
                    bufferHost[offset++] = scaleX; // sx
                    bufferHost[offset++] = scaleY; // sy
                    bufferHost[offset++] = rotation; // r
                    break;
                }
            case DrawCommandBuffer.CMD_SET_TEXTURE_2D:
                {
                    device.setTexture2D(commandBuffer[++index].texture2D);
                    break;
                }
            case DrawCommandBuffer.CMD_DRAW:
                {
                    var cmdDraw = commandBuffer[++index];
                    device.setPipelineState(cmdDraw.pipelineState);
                    device.draw(cmdDraw.vertexCount, cmdDraw.startVertexLocation);
                    break;
                }
            case DrawCommandBuffer.CMD_UPDATE_SUB_VERTEX_BUFFER:
                {
                    var cmdUpdateSubVertexBuffer = commandBuffer[++index];
                    device.setPipelineState(cmdUpdateSubVertexBuffer.pipelineState);
                    device.updateSubVertexBuffer(
                        cmdUpdateSubVertexBuffer.offset,
                        cmdUpdateSubVertexBuffer.elements
                    );
                    break;
                }
            default:
                console.error('Invalid Draw Command', cmd);
                break;
        }
    }
};
