/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterSetBodyConfig
 * @since 3.22.0
 *              
 * @property {string} [type='rectangle'] - The shape type. Either `rectangle`, `circle`, `trapezoid`, `polygon`, `fromVertices`, `fromVerts` or `fromPhysicsEditor`.
 * @property {number} [x] - The horizontal world position to place the body at.
 * @property {number} [y] - The vertical world position to place the body at.
 * @property {number} [width] - The width of the body.
 * @property {number} [height] - The height of the body.
 * @property {number} [radius] - The radius of the body. Used by `circle` and `polygon` shapes.
 * @property {number} [maxSides=25] - The max sizes of the body. Used by the `circle` shape.
 * @property {number} [slope=0.5] - Used by the `trapezoid` shape. The slope of the trapezoid. 0 creates a rectangle, while 1 creates a triangle. Positive values make the top side shorter, while negative values make the bottom side shorter.
 * @property {number} [sides=5] - Used by the `polygon` shape. The number of sides the polygon will have.
 * @property {(string|array)} [verts] - Used by the `fromVerts` shape. The vertices data. Either a path string or an array of vertices.
 * @property {boolean} [flagInternal=false] - Used by the `fromVerts` shape. Flag internal edges (coincident part edges)
 * @property {number} [removeCollinear=0.01] - Used by the `fromVerts` shape. Whether Matter.js will discard collinear edges (to improve performance).
 * @property {number} [minimumArea=10] - Used by the `fromVerts` shape. During decomposition discard parts that have an area less than this.
 * @property {boolean} [addToWorld=true] - Should the new body be automatically added to the world?
 */
