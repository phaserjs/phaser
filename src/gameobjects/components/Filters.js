/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Camera = null; // Lazy loaded.
var Vector2 = require('../../math/Vector2');
var TransformMatrix = require('./TransformMatrix');

/**
 * Provides methods used for setting the filters properties of a Game Object.
 * These apply special effects, post-processing and masks to the object.
 * Should be applied as a mixin and not used directly.
 *
 * Filters work by rendering the object to a texture.
 * The texture is then rendered again for each filter, using a shader.
 * See {@link Phaser.GameObjects.Components.FilterList} for more information.
 *
 * Enable filters with `enableFilters()`.
 * Each object with filters enabled, and any filters active,
 * makes a new draw call, plus one or more per active filter.
 * This can be expensive. Use sparingly.
 *
 * ---
 *
 * ## Camera
 *
 * Filters has a `filterCamera` property, which is a Camera.
 * The Camera does most of the hard work, including the filters.
 *
 * The Camera automatically focuses on the Game Object,
 * so you should not need to adjust it manually.
 * If you do want to adjust it, you can use `focusFiltersOverride`.
 *
 * ---
 *
 * ## Framebuffer Coverage
 *
 * Filters are rendered to a framebuffer, which is a texture.
 * Anything outside the bounds of the framebuffer is not rendered.
 * Think of it as a window into another world.
 *
 * To ensure that the game object fits into the framebuffer,
 * the internal camera is transformed to match the object.
 * The object can transform normally, and the camera will follow
 * while `filtersAutoFocus` is enabled.
 *
 * @namespace Phaser.GameObjects.Components.Filters
 * @since 4.0.0
 */
var Filters = {};

if (typeof WEBGL_RENDERER)
{
    Filters =
    {
        /**
         * The Camera used for filters.
         * You can use this to alter the perspective of filters.
         * It is not necessary to use this camera for ordinary rendering.
         *
         * This is only available if you use the `enableFilters` method.
         *
         * @name Phaser.GameObjects.Components.Filters#filterCamera
         * @type {Phaser.Cameras.Scene2D.Camera}
         * @default null
         * @since 4.0.0
         * @webglOnly
         */
        filterCamera: null,

        /**
         * Get the filters lists.
         * This is an object with `internal` and `external` properties.
         * Each list is a {@see Phaser.GameObjects.Components.FilterList} object.
         *
         * This is only available if you use the `enableFilters` method.
         *
         * @name Phaser.GameObjects.Components.Filters#filters
         * @type {Phaser.Types.GameObjects.FiltersInternalExternal|null}
         * @readonly
         * @since 4.0.0
         * @webglOnly
         */
        filters: {
            get: function ()
            {
                if (this.filterCamera)
                {
                    return this.filterCamera.filters;
                }
                return null;
            }
        },

        /**
         * Whether any filters should be rendered on this Game Object.
         * This is `true` by default, even if there are no filters yet.
         * Disable this to skip filter rendering.
         *
         * Use `willRenderFilters()` to see if there are any active filters.
         *
         * @name Phaser.GameObjects.Components.Filters#renderFilters
         * @type {boolean}
         * @default true
         * @since 4.0.0
         * @webglOnly
         */
        renderFilters: true,

        /**
         * The maximum size of the base filter texture.
         * Filters may use a larger texture after the base texture is rendered.
         * The maximum texture size is 4096 in WebGL.
         * You may set this lower to save memory or prevent resizing.
         *
         * @name Phaser.GameObjects.Components.Filters#maxFilterSize
         * @type {Phaser.Math.Vector2}
         * @since 4.0.0
         * @webglOnly
         */
        maxFilterSize: null,

        /**
         * Whether `filterCamera` should update every frame
         * to focus on the Game Object.
         * Disable this if you want to manually control the camera.
         *
         * @name Phaser.GameObjects.Components.Filters#filtersAutoFocus
         * @type {boolean}
         * @default true
         * @since 4.0.0
         * @webglOnly
         */
        filtersAutoFocus: true,

        /**
         * Whether the filters should focus on the context,
         * rather than attempt to focus on the Game Object.
         * This is enabled automatically when enabling filters on objects
         * which don't have well-defined bounds.
         *
         * This effectively sets the internal filters to render the same way
         * as the external filters.
         *
         * This is only used if `filtersAutoFocus` is enabled.
         *
         * The "context" is the framebuffer to which the Game Object is rendered.
         * This is usually the main framebuffer, but might be another framebuffer.
         * It can even be several different framebuffers if the Game Object is
         * rendered multiple times.
         *
         * @name Phaser.GameObjects.Components.Filters#filtersFocusContext
         * @type {boolean}
         * @default false
         * @since 4.0.0
         * @webglOnly
         */
        filtersFocusContext: false,

        /**
         * Whether the Filters component should always draw to a framebuffer,
         * even if there are no active filters.
         *
         * @name Phaser.GameObjects.Components.Filters#filtersForceComposite
         * @type {boolean}
         * @default false
         * @since 4.0.0
         * @webglOnly
         */
        filtersForceComposite: false,

        /**
         * A transform matrix used to render the filters.
         * It holds the transform of the Game Object.
         *
         * This is only available if you use the `enableFilters` method.
         *
         * @name Phaser.GameObjects.Components.Filters#_filtersMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @private
         * @since 4.0.0
         * @webglOnly
         */
        _filtersMatrix: null,

        /**
         * A transform matrix used to render the filters.
         * It holds the view matrix for the filter camera, adjusted for the Game Object.
         *
         * This is only available if you use the `enableFilters` method.
         *
         * @name Phaser.GameObjects.Components.Filters#_filtersViewMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @private
         * @since 4.0.0
         * @webglOnly
         */
        _filtersViewMatrix: null,

        /**
         * Whether this Game Object will render filters.
         * This is true if it has active filters,
         * and if the `renderFilters` property is also true.
         *
         * @method Phaser.GameObjects.Components.Filters#willRenderFilters
         * @since 4.0.0
         * @webglOnly
         * @return {boolean} Whether the Game Object will render filters.
         */
        willRenderFilters: function ()
        {
            return this.renderFilters &&
                this.filters &&
                (
                    this.filters.internal.getActive().length > 0 ||
                    this.filters.external.getActive().length > 0 ||
                    this.filtersForceComposite
                );
        },

        /**
         * Enable this Game Object to have filters.
         *
         * You need to call this method if you want to use the `filterCamera`
         * and `filters` properties. It sets up the necessary data structures.
         * You may disable filter rendering with the `renderFilters` property.
         *
         * This is a WebGL only feature. It will return early if not available.
         *
         * @method Phaser.GameObjects.Components.Filters#enableFilters
         * @since 4.0.0
         * @webglOnly
         * @returns {this}
         */
        enableFilters: function ()
        {
            if (this.filterCamera || !this.scene.renderer.gl)
            {
                return this;
            }

            var scene = this.scene;

            if (!Camera)
            {
                // Lazy load the camera class to avoid circular dependencies.
                Camera = require('../../cameras/2d/Camera');
            }

            this.filterCamera = new Camera(0, 0, 1, 1).setScene(scene, false);

            if (scene.game.config.roundPixels)
            {
                this.filterCamera.roundPixels = true;
            }

            if (!this.maxFilterSize)
            {
                this.maxFilterSize = new Vector2(4096, 4096);
            }

            this._filtersMatrix = new TransformMatrix();
            this._filtersViewMatrix = new TransformMatrix();

            // Check whether the object is poorly bounded, and needs to focus on the context.
            if (
                !this.getBounds ||
                this.width === undefined ||
                this.height === undefined ||
                this.width === 0 ||
                this.height === 0
            )
            {
                this.filtersFocusContext = true;
            }

            // Add filters as a render step.
            this.addRenderStep(this.renderWebGLFilters, 0);

            return this;
        },

        /**
         * Render this object using filters.
         *
         * This function's scope is not guaranteed, so it doesn't refer to `this`.
         *
         * @method Phaser.GameObjects.Components.Filters#renderWebGLFilters
         * @webglOnly
         * @since 4.0.0
         * @type {Phaser.Types.GameObjects.RenderWebGLStep}
         * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGL Renderer instance to render with.
         * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object being rendered.
         * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
         * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - The parent matrix of the Game Object, if it has one.
         * @param {number} [renderStep=0] - The index of this function in the Game Object's list of render processes. Used to support multiple rendering functions.
         */
        renderWebGLFilters: function (
            renderer,
            gameObject,
            drawingContext,
            parentMatrix,
            renderStep
        )
        {
            if (!gameObject.willRenderFilters())
            {
                gameObject.renderWebGLStep(
                    renderer,
                    gameObject,
                    drawingContext,
                    parentMatrix,
                    renderStep + 1
                );
                return;
            }

            var camera = drawingContext.camera;

            // Add this Game Object to the camera's render list,
            // because other calls to `addToRenderList` will happen in another camera.
            camera.addToRenderList(gameObject);

            var filtersFocusContext = gameObject.filtersFocusContext;

            if (gameObject.filtersAutoFocus)
            {
                if (filtersFocusContext)
                {
                    gameObject.focusFiltersOnCamera(camera);
                }
                else
                {
                    gameObject.focusFilters();
                }
            }

            var filterCamera = gameObject.filterCamera;
            filterCamera.preRender();

            // Get transform.
            var transformMatrix = gameObject._filtersMatrix;
            var cameraMatrix = gameObject._filtersViewMatrix.copyWithScrollFactorFrom(
                camera.getViewMatrix(!drawingContext.useCanvas),
                camera.scrollX, camera.scrollY,
                gameObject.scrollFactorX, gameObject.scrollFactorY
            );

            if (parentMatrix)
            {
                cameraMatrix.multiply(parentMatrix);
            }

            if (filtersFocusContext)
            {
                transformMatrix.loadIdentity();
            }
            else
            {
                if (gameObject.type === 'Layer')
                {
                    transformMatrix.loadIdentity();
                }
                else
                {
                    var flipX = gameObject.flipX ? -1 : 1;
                    var flipY = gameObject.flipY ? -1 : 1;
                    transformMatrix.applyITRS(
                        gameObject.x,
                        gameObject.y,
                        gameObject.rotation,
                        gameObject.scaleX * flipX,
                        gameObject.scaleY * flipY
                    );
                }
    
                // Offset origin.
                var width = filterCamera.width;
                var height = filterCamera.height;
                transformMatrix.translate(
                    -width * filterCamera.originX,
                    -height * filterCamera.originY
                );

                cameraMatrix.multiply(transformMatrix, transformMatrix);
            }

            // Set object scrollFactor to default.
            // We can't accurately focus the camera on the object if it has a scrollFactor,
            // because the camera needs to be set further away,
            // going to infinity at scrollFactor 0.
            // The scroll factor is baked into the transformMatrix, above.
            var scrollX = gameObject.scrollFactorX;
            var scrollY = gameObject.scrollFactorY;
            gameObject.scrollFactorX = 1;
            gameObject.scrollFactorY = 1;

            // Now we have the transform for the game object.
            // Render game object to framebuffer.
            renderer.cameraRenderNode.run(
                drawingContext,
                [ gameObject ],
                filterCamera,
                transformMatrix,
                true,
                renderStep + 1
            );

            // Restore scrollFactor.
            gameObject.scrollFactorX = scrollX;
            gameObject.scrollFactorY = scrollY;
        },

        /**
         * Focus the filter camera.
         * This sets the size and position of the filter camera to match the GameObject.
         * This is called automatically on render if `filtersAutoFocus` is enabled.
         *
         * This will focus on the GameObject's raw dimensions if available.
         * If the GameObject has no dimensions, this will focus on the context:
         * the camera belonging to the DrawingContext used to render the GameObject.
         * Context focus occurs during rendering,
         * as the context is not known until then.
         *
         * @method Phaser.GameObjects.Components.Filters#focusFilters
         * @webglOnly
         * @since 4.0.0
         * @returns {this}
         */
        focusFilters: function ()
        {
            var posX = this.x;
            var posY = this.y;
            var originX = this.originX;
            var originY = this.originY;
            var width = this.width;
            var height = this.height;

            if (
                this.type === 'Layer' ||
                isNaN(posX) || isNaN(posY) ||
                isNaN(width) || isNaN(height) ||
                isNaN(originX) || isNaN(originY) ||
                width === 0 || height === 0
            )
            {
                this.filtersFocusContext = true;
                return this;
            }

            var rotation = this.rotation;
            var scaleX = this.scaleX;
            var scaleY = this.scaleY;

            var centerX = posX + width * (0.5 - originX);
            var centerY = posY + height * (0.5 - originY);

            // Handle flip.
            if (this.flipX)
            {
                scaleX *= -1;
            }
            if (this.flipY)
            {
                scaleY *= -1;
            }

            // Set the filter camera size to match the object.
            this.setFilterSize(width, height);

            // Set the filter camera to match the object.
            this.filterCamera
                .centerOn(centerX, centerY)
                .setRotation(-rotation)
                .setOrigin(originX, originY)
                .setZoom(1 / scaleX, 1 / scaleY);

            return this;
        },

        /**
         * Focus the filter camera on a specific camera.
         * This is used internally when `filtersFocusContext` is enabled.
         *
         * @method Phaser.GameObjects.Components.Filters#focusFiltersOnCamera
         * @webglOnly
         * @since 4.0.0
         * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera to focus on.
         * @returns {this}
         */
        focusFiltersOnCamera: function (camera)
        {
            var width = camera.width;
            var height = camera.height;
            var posX = camera.scrollX;
            var posY = camera.scrollY;
            var rotation = camera.rotation;
            var zoomX = camera.zoomX;
            var zoomY = camera.zoomY;

            var parent = this.parentContainer;

            if (parent)
            {
                var parentMatrix = parent.getWorldTransformMatrix();
                posX -= parentMatrix.tx;
                posY -= parentMatrix.ty;
                rotation += parentMatrix.rotation;
                zoomX *= parentMatrix.scaleX;
                zoomY *= parentMatrix.scaleY;
            }

            // Set the filter camera size to match the object.
            this.setFilterSize(width, height);

            this.filterCamera.setScroll(posX, posY);
            this.filterCamera.setRotation(rotation);
            this.filterCamera.setZoom(zoomX, zoomY);

            return this;
        },

        /**
         * Manually override the focus of the filter camera.
         * This allows you to set the size and position of the filter camera manually.
         * It deactivates `filtersAutoFocus` when called.
         *
         * The camera will set scroll to place the game object at the
         * given position within a rectangle of the given width and height.
         * For example, calling `focusFiltersOverride(400, 200, 800, 600)`
         * will focus the camera to place the object's center
         * 100 pixels above the center of the camera (which is at 400x300).
         *
         * @method Phaser.GameObjects.Components.Filters#focusFiltersOverride
         * @webglOnly
         * @since 4.0.0
         * @param {number} [x] - The x-coordinate of the focus point, relative to the filter size. Default is the center.
         * @param {number} [y] - The y-coordinate of the focus point, relative to the filter size. Default is the center.
         * @param {number} [width] - The width of the focus area. Default is the filter width.
         * @param {number} [height] - The height of the focus area. Default is the filter height.
         * @returns {this}
         */
        focusFiltersOverride: function (x, y, width, height)
        {
            var filterCamera = this.filterCamera;

            // Maintain size.
            if (width === undefined)
            {
                width = filterCamera.width;
            }
            if (height === undefined)
            {
                height = filterCamera.height;
            }

            // Default to center.
            if (x === undefined)
            {
                x = width / 2;
            }
            if (y === undefined)
            {
                y = height / 2;
            }

            var objectX = this.x;
            var objectY = this.y;

            this.setFilterSize(width, height);
            filterCamera.setScroll(objectX - x, objectY - y);

            var originX = x / width;
            var originY = y / height;

            filterCamera.setOrigin(originX, originY);

            // Stop automatic focus.
            this.filtersAutoFocus = false;

            return this;
        },

        /**
         * Set the base size of the filter camera.
         * This is the size of the texture that internal filters will be drawn to.
         * External filters are drawn to the size of the context (usually the game canvas).
         *
         * This is typically the size of the GameObject.
         * It is set automatically when the Game Object is rendered
         * and `filtersAutoFocus` is enabled.
         * Turn off auto focus to set it manually.
         *
         * Technically, larger framebuffers may be used to provide padding.
         * This is the size of the final framebuffer used for "internal" rendering.
         *
         * @method Phaser.GameObjects.Components.Filters#setFilterSize
         * @webglOnly
         * @since 4.0.0
         * @param {number} width - Base width of the filter texture.
         * @param {number} height - Base height of the filter texture.
         * @returns {this}
         */
        setFilterSize: function (width, height)
        {
            // Sanitize inputs.
            width = Math.max(1, Math.min(Math.ceil(width), this.maxFilterSize.x));
            height = Math.max(1, Math.min(Math.ceil(height), this.maxFilterSize.y));

            var filterCamera = this.filterCamera;
            if (!filterCamera)
            {
                return this;
            }
            filterCamera.setSize(width, height);

            return this;
        },

        /**
         * Set whether filters should be updated every frame.
         * Sets the `filtersAutoFocus` property.
         *
         * @method Phaser.GameObjects.Components.Filters#setFiltersAutoFocus
         * @webglOnly
         * @since 4.0.0
         * @param {boolean} value - Whether filters should be updated every frame.
         * @returns {this}
         */
        setFiltersAutoFocus: function (value)
        {
            this.filtersAutoFocus = value;

            return this;
        },

        /**
         * Set whether the filters should focus on the context.
         * Sets the `filtersFocusContext` property.
         *
         * @method Phaser.GameObjects.Components.Filters#setFiltersFocusContext
         * @webglOnly
         * @since 4.0.0
         * @param {boolean} value - Whether the filters should focus on the context.
         * @returns {this}
         */
        setFiltersFocusContext: function (value)
        {
            this.filtersFocusContext = value;

            return this;
        },

        /**
         * Set whether the filters should always draw to a framebuffer.
         * Sets the `filtersForceComposite` property.
         *
         * @method Phaser.GameObjects.Components.Filters#setFiltersForceComposite
         * @webglOnly
         * @since 4.0.0
         * @param {boolean} value - Whether the object should always draw to a framebuffer, even if there are no active filters.
         * @returns {this}
         */
        setFiltersForceComposite: function (value)
        {
            this.filtersForceComposite = value;

            return this;
        },

        /**
         * Set whether the filters should be rendered.
         * Sets the `renderFilters` property.
         *
         * @method Phaser.GameObjects.Components.Filters#setRenderFilters
         * @webglOnly
         * @since 4.0.0
         * @param {boolean} value - Whether the filters should be rendered.
         * @returns {this}
         */
        setRenderFilters: function (value)
        {
            this.renderFilters = value;

            return this;
        }
    };
}

module.exports = Filters;
