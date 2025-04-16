/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CameraEvents = require('../../../cameras/2d/events');
var DynamicTextureCommands = require('../../../textures/DynamicTextureCommands');
var Class = require('../../../utils/Class');
var BlendModes = require('../../BlendModes');
var RenderNode = require('./RenderNode');

/**
 * @classdesc
 * This RenderNode handles rendering for DynamicTextures.
 *
 * @class DynamicTextureHandler
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
var DynamicTextureHandler = new Class({
    Extends: RenderNode,

    initialize: function DynamicTextureHandler (manager)
    {
        RenderNode.call(this, 'DynamicTextureHandler', manager);

        /**
         * The RenderNode that draws a filled rectangle.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.DynamicTextureHandler#fillRectNode
         * @type {Phaser.Renderer.WebGL.RenderNodes.FillRect}
         * @since 4.0.0
         */
        this.fillRectNode = this.manager.getNode('FillRect');
    },

    /**
     * Renders the DynamicTexture.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.DynamicTextureHandler#run
     * @since 4.0.0
     * @param {Phaser.Textures.DynamicTexture} dynamicTexture - The DynamicTexture to render.
     */
    run: function (dynamicTexture)
    {
        var drawingContext = dynamicTexture.drawingContext;
        var camera = drawingContext.camera;
        var renderer = drawingContext.renderer;
        var textureManager = dynamicTexture.manager;

        this.onRunBegin(drawingContext);

        // Ensure the framebuffer texture is not bound,
        // to avoid WebGL feedback.
        var glTexture = drawingContext.framebuffer.renderTexture;
        if (glTexture)
        {
            var glTextureUnits = renderer.glTextureUnits;
            var units = glTextureUnits.units;
            for (var i = 0; i < units.length; i++)
            {
                if (units[i] === glTexture)
                {
                    glTextureUnits.bind(null, i);
                }
            }
        }

        drawingContext.setScissorBox(
            0,
            0,
            camera.width,
            camera.height
        );

        // Enter drawing context.
        drawingContext.use();

        // Big list of reused variables.
        var alpha, blendMode, frame, height, key, originX, originY, rotation, scaleX, scaleY, tint, width, x, y;

        // Traverse commands.
        var commandBuffer = dynamicTexture.commandBuffer;
        var commandBufferLength = commandBuffer.length;

        var eraseMode = false;
        var eraseContext = null;
        var preserveBuffer = false;
        var currentContext = drawingContext;
        var gl = renderer.gl;

        for (var index = 0; index < commandBufferLength; index++)
        {
            var command = commandBuffer[index];

            switch (command)
            {
                case DynamicTextureCommands.CLEAR:
                {
                    x = commandBuffer[++index];
                    y = commandBuffer[++index];
                    width = commandBuffer[++index];
                    height = commandBuffer[++index];

                    var clearContext = currentContext.getClone();
                    clearContext.setScissorEnable(true);
                    clearContext.setScissorBox(x, y, width, height);
                    clearContext.use();

                    clearContext.clear(
                        gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT
                    );

                    clearContext.release();

                    break;
                }

                case DynamicTextureCommands.FILL:
                {
                    var color = commandBuffer[++index];
                    x = commandBuffer[++index];
                    y = commandBuffer[++index];
                    width = commandBuffer[++index];
                    height = commandBuffer[++index];

                    this.fillRectNode.run(
                        currentContext,
                        null,
                        null,
                        x, y, width, height,
                        color, color, color, color,
                        false
                    );

                    break;
                }

                case DynamicTextureCommands.STAMP:
                {
                    key = commandBuffer[++index];
                    frame = commandBuffer[++index];
                    x = commandBuffer[++index];
                    y = commandBuffer[++index];
                    alpha = commandBuffer[++index];
                    tint = commandBuffer[++index];
                    rotation = commandBuffer[++index];
                    scaleX = commandBuffer[++index];
                    scaleY = commandBuffer[++index];
                    originX = commandBuffer[++index];
                    originY = commandBuffer[++index];
                    blendMode = commandBuffer[++index];

                    var stamp = textureManager.resetStamp(alpha, tint);

                    stamp.setPosition(x, y)
                        .setRotation(rotation)
                        .setTexture(key, frame)
                        .setOrigin(originX, originY)
                        .setScale(scaleX, scaleY)
                        .setBlendMode(blendMode);

                    currentContext = this._draw(renderer, stamp, currentContext, drawingContext, eraseContext);

                    break;
                }

                case DynamicTextureCommands.REPEAT:
                {
                    key = commandBuffer[++index];
                    frame = commandBuffer[++index];
                    x = commandBuffer[++index];
                    y = commandBuffer[++index];
                    alpha = commandBuffer[++index];
                    tint = commandBuffer[++index];
                    rotation = commandBuffer[++index];
                    scaleX = commandBuffer[++index];
                    scaleY = commandBuffer[++index];
                    originX = commandBuffer[++index];
                    originY = commandBuffer[++index];
                    blendMode = commandBuffer[++index];

                    width = commandBuffer[++index];
                    height = commandBuffer[++index];
                    var tilePositionX = commandBuffer[++index];
                    var tilePositionY = commandBuffer[++index];
                    var tileRotation = commandBuffer[++index];
                    var tileScaleX = commandBuffer[++index];
                    var tileScaleY = commandBuffer[++index];

                    var repeat = textureManager.resetTileSprite(alpha, tint);

                    repeat.setPosition(x, y)
                        .setRotation(rotation)
                        .setTexture(key, frame)
                        .setSize(width, height)
                        .setOrigin(originX, originY)
                        .setScale(scaleX, scaleY)
                        .setBlendMode(blendMode)
                        .setTilePosition(tilePositionX, tilePositionY)
                        .setTileRotation(tileRotation)
                        .setTileScale(tileScaleX, tileScaleY);

                    currentContext = this._draw(renderer, repeat, currentContext, drawingContext, eraseContext);

                    break;
                }

                case DynamicTextureCommands.DRAW:
                {
                    var object = commandBuffer[++index];
                    x = commandBuffer[++index];
                    y = commandBuffer[++index];

                    if (x !== undefined)
                    {
                        var prevX = object.x;
                        object.x += x;
                    }

                    if (y !== undefined)
                    {
                        var prevY = object.y;
                        object.y += y;
                    }

                    currentContext = this._draw(renderer, object, currentContext, drawingContext, eraseContext);

                    if (x !== undefined)
                    {
                        object.x = prevX;
                    }

                    if (y !== undefined)
                    {
                        object.y = prevY;
                    }

                    break;
                }

                case DynamicTextureCommands.SET_ERASE:
                {
                    eraseMode = commandBuffer[++index];
                    if (eraseMode)
                    {
                        if (!eraseContext)
                        {
                            eraseContext = drawingContext.getClone();
                            eraseContext.setBlendMode(BlendModes.ERASE);
                        }
                        if (currentContext !== eraseContext)
                        {
                            currentContext.release();
                            currentContext = eraseContext;
                            eraseContext.use();
                        }
                    }
                    else if (currentContext === eraseContext)
                    {
                        eraseContext.release();
                        currentContext = drawingContext;
                        drawingContext.use();
                    }
                    break;
                }

                case DynamicTextureCommands.PRESERVE:
                {
                    preserveBuffer = commandBuffer[++index];
                    break;
                }

                case DynamicTextureCommands.CALLBACK:
                {
                    var callback = commandBuffer[++index];
                    callback();
                    break;
                }

                case DynamicTextureCommands.CAPTURE:
                {
                    object = commandBuffer[++index];
                    var config = commandBuffer[++index];

                    var cacheConfig = dynamicTexture.startCapture(object, config);

                    // Handle custom capture camera.
                    var viewContext = currentContext;
                    if (config.camera)
                    {
                        viewContext = viewContext.getClone();
                        viewContext.setCamera(config.camera);
                        viewContext.use();
                    }

                    this._draw(renderer, object, viewContext, drawingContext, eraseContext, cacheConfig.transform);
                    dynamicTexture.finishCapture(object, cacheConfig);

                    if (config.camera)
                    {
                        viewContext.release();
                    }

                    break;
                }
            }
        }

        if (!preserveBuffer)
        {
            // Clear the command buffer.
            commandBuffer.length = 0;
        }

        // Finish rendering.
        currentContext.release();

        camera.emit(CameraEvents.POST_RENDER, camera);

        this.onRunEnd(drawingContext);
    },

    /**
     * Draw an object to the DynamicTexture, handling blend modes.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.DynamicTextureHandler#_draw
     * @private
     * @since 4.0.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer.
     * @param {Phaser.GameObjects.GameObject} object - The object to draw.
     * @param {Phaser.Renderer.WebGL.DrawingContext} currentContext - The current drawing context.
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The base drawing context in use.
     * @param {Phaser.Renderer.WebGL.DrawingContext} eraseContext - The erase drawing context.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - The parent matrix, if any.
     *
     * @return {Phaser.Renderer.WebGL.DrawingContext} The new current drawing context.
     */
    _draw: function (renderer, object, currentContext, drawingContext, eraseContext, parentMatrix)
    {
        // Handle blend mode.
        if (
            currentContext !== eraseContext &&
            object.blendMode !== currentContext.blendMode &&
            object.blendMode !== BlendModes.SKIP_CHECK
        )
        {
            currentContext.release();

            var blendMode = object.blendMode;
            if (blendMode === drawingContext.blendMode)
            {
                // Reset to the base context.
                currentContext = drawingContext;
            }
            else
            {
                // Change blend mode.
                currentContext = drawingContext.getClone();
                currentContext.setBlendMode(blendMode);
            }
            currentContext.use();
        }

        object.renderWebGLStep(renderer, object, currentContext, parentMatrix);

        return currentContext;
    }
});

module.exports = DynamicTextureHandler;
