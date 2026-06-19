/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('../../../../gameobjects/components/TransformMatrix.js');
var Class = require('../../../../utils/Class');
var Merge = require('../../../../utils/object/Merge');
var RenderNode = require('../RenderNode');

/**
 * @classdesc
 * A RenderNode that computes and stores the screen-space position
 * of a single vertex each time it is run.
 *
 * During its `run` call, this node applies the camera view matrix (adjusted
 * for the game object's scroll factors), any parent container matrix, and the
 * game object's own position, rotation, and scale into a single final transform
 * matrix. It then projects the vertex position through that matrix
 * and writes the result back to the vertex position,
 * ready for consumption by the subsequent submitter node.
 *
 * @class TransformerVertex
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 * @param {object} [config] - The configuration object for this RenderNode.
 */
var TransformerVertex = new Class({
    Extends: RenderNode,

    initialize: function TransformerVertex (manager, config)
    {
        config = Merge(config || {}, this.defaultConfig);

        RenderNode.call(this, config.name, manager);

        /**
         * The matrix used internally to compute sprite transforms.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TransformerVertex#_spriteMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 4.0.0
         * @private
         */
        this._spriteMatrix = new TransformMatrix();

        /**
         * The matrix used internally to compute the final transform.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TransformerVertex#_calcMatrix
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 4.0.0
         * @private
         */
        this._calcMatrix = new TransformMatrix();

        /**
         * Whether vertices transformed with the current matrix should be
         * rounded to the nearest integer. This is computed by `setupMatrix`
         * and consumed by `transformVertex`.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.TransformerVertex#_roundVertices
         * @type {boolean}
         * @since 4.NEXT
         * @private
         */
        this._roundVertices = false;
    },

    defaultConfig: {
        name: 'TransformerVertex',
        role: 'Transformer'
    },

    /**
     * Computes the final screen-space position of the given vertex
     * for the given GameObject and stores it in the vertex.
     *
     * The method builds the complete transform by combining the camera view
     * matrix (modified by the game object's scroll factors), an optional parent
     * container matrix, and the game object's own position, rotation, and scale.
     * If vertex rounding is required, the resulting values are snapped to the nearest integer.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.TransformerVertex#run
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject being rendered.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested.
     * @param {Phaser.Math.Vector2} vertex - The vertex to transform.
     */
    run: function (drawingContext, gameObject, parentMatrix, vertex)
    {
        this.onRunBegin(drawingContext);

        this.setupMatrix(drawingContext, gameObject, parentMatrix);
        this.transformVertex(vertex);

        this.onRunEnd(drawingContext);
    },

    /**
     * Builds the final transform matrix for the given GameObject and caches it,
     * along with whether transformed vertices should be rounded. This combines
     * the camera view matrix (modified by the game object's scroll factors), an
     * optional parent container matrix, and the game object's own position,
     * rotation, and scale.
     *
     * Call this once before transforming a batch of vertices with
     * `transformVertex`, since the matrix is constant for all vertices of a
     * single GameObject. This avoids rebuilding the matrix for every vertex.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.TransformerVertex#setupMatrix
     * @since 4.NEXT
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
     * @param {Phaser.GameObjects.GameObject} gameObject - The GameObject being rendered.
     * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested.
     * @return {Phaser.GameObjects.Components.TransformMatrix} The cached transform matrix.
     */
    setupMatrix: function (drawingContext, gameObject, parentMatrix)
    {
        var camera = drawingContext.camera;
        var spriteMatrix = this._spriteMatrix;
        var calcMatrix = this._calcMatrix.copyWithScrollFactorFrom(
            camera.getViewMatrix(!drawingContext.useCanvas),
            camera.scrollX, camera.scrollY,
            gameObject.scrollFactorX, gameObject.scrollFactorY
        );

        if (parentMatrix)
        {
            calcMatrix.multiply(parentMatrix);
        }

        spriteMatrix.applyITRS(
            gameObject.x, gameObject.y,
            gameObject.rotation,
            gameObject.scaleX, gameObject.scaleY
        );

        calcMatrix.multiply(spriteMatrix);

        // Determine whether the matrix does not rotate, scale, or skew.
        // Keyword: #OnlyTranslate
        var cmm = calcMatrix.matrix;
        var onlyTranslate = cmm[0] === 1 && cmm[1] === 0 && cmm[2] === 0 && cmm[3] === 1;

        // Cache whether vertices should be rounded, as this is constant
        // for the whole GameObject.
        this._roundVertices = gameObject.willRoundVertices(camera, onlyTranslate);

        return calcMatrix;
    },

    /**
     * Projects a single vertex through the matrix built by the most recent
     * `setupMatrix` call, writing the result back to the vertex. If vertex
     * rounding is required, the values are snapped to the nearest integer.
     *
     * @method Phaser.Renderer.WebGL.RenderNodes.TransformerVertex#transformVertex
     * @since 4.NEXT
     * @param {Phaser.Math.Vector2} vertex - The vertex to transform.
     * @return {Phaser.Math.Vector2} The transformed vertex.
     */
    transformVertex: function (vertex)
    {
        this._calcMatrix.transformPoint(vertex.x, vertex.y, vertex);

        if (this._roundVertices)
        {
            vertex.x = Math.round(vertex.x);
            vertex.y = Math.round(vertex.y);
        }

        return vertex;
    }
});

module.exports = TransformerVertex;
