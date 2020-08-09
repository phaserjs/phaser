/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Implements a model view projection matrices.
 * Pipelines can implement this for doing 2D and 3D rendering.
 *
 * @namespace Phaser.Renderer.WebGL.Pipelines.ModelViewProjection
 * @since 3.0.0
 */
var ModelViewProjection = {

    /**
     * Dirty flag for checking if model matrix needs to be updated on GPU.
     *
     * @name Phaser.Renderer.WebGL.Pipelines.ModelViewProjection#modelMatrixDirty
     * @type {boolean}
     * @since 3.0.0
     */
    modelMatrixDirty: false,

    /**
     * Dirty flag for checking if view matrix needs to be updated on GPU.
     *
     * @name Phaser.Renderer.WebGL.Pipelines.ModelViewProjection#viewMatrixDirty
     * @type {boolean}
     * @since 3.0.0
     */
    viewMatrixDirty: false,

    /**
     * Dirty flag for checking if projection matrix needs to be updated on GPU.
     *
     * @name Phaser.Renderer.WebGL.Pipelines.ModelViewProjection#projectionMatrixDirty
     * @type {boolean}
     * @since 3.0.0
     */
    projectionMatrixDirty: false,

    /**
     * Model matrix
     *
     * @name Phaser.Renderer.WebGL.Pipelines.ModelViewProjection#modelMatrix
     * @type {?Float32Array}
     * @since 3.0.0
     */
    modelMatrix: null,

    /**
     * View matrix
     *
     * @name Phaser.Renderer.WebGL.Pipelines.ModelViewProjection#viewMatrix
     * @type {?Float32Array}
     * @since 3.0.0
     */
    viewMatrix: null,

    /**
     * Projection matrix
     *
     * @name Phaser.Renderer.WebGL.Pipelines.ModelViewProjection#projectionMatrix
     * @type {?Float32Array}
     * @since 3.0.0
     */
    projectionMatrix: null,

    /**
     * Initializes MVP matrices with an identity matrix
     *
     * @method Phaser.Renderer.WebGL.Pipelines.ModelViewProjection#mvpInit
     * @since 3.0.0
     */
    mvpInit: function ()
    {
        this.modelMatrixDirty = true;
        this.viewMatrixDirty = true;
        this.projectionMatrixDirty = true;

        this.modelMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);

        this.viewMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);

        this.projectionMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);

        return this;
    },

    /**
     * If dirty flags are set then the matrices are uploaded to the GPU.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.ModelViewProjection#mvpUpdate
     * @since 3.0.0
     */
    mvpUpdate: function ()
    {
        var program = this.program;

        if (this.modelMatrixDirty)
        {
            this.renderer.setMatrix4(program, 'uModelMatrix', false, this.modelMatrix);
            this.modelMatrixDirty = false;
        }

        if (this.viewMatrixDirty)
        {
            this.renderer.setMatrix4(program, 'uViewMatrix', false, this.viewMatrix);
            this.viewMatrixDirty = false;
        }

        if (this.projectionMatrixDirty)
        {
            this.renderer.setMatrix4(program, 'uProjectionMatrix', false, this.projectionMatrix);
            this.projectionMatrixDirty = false;
        }

        return this;
    }
};

module.exports = ModelViewProjection;
