/**
* The `Matter.Bounds` module contains methods for creating and manipulating axis-aligned bounding boxes (AABB).
*
* @class Bounds
*/

var Bounds = {};

module.exports = Bounds;

(function() {

    /**
     * Creates a new axis-aligned bounding box (AABB) for the given vertices.
     * @method create
     * @param {vertices} vertices
     * @return {bounds} A new bounds object
     */
    Bounds.create = function(vertices) {
        var bounds = { 
            min: { x: 0, y: 0 }, 
            max: { x: 0, y: 0 }
        };

        if (vertices)
            Bounds.update(bounds, vertices);
        
        return bounds;
    };

    /**
     * Updates bounds using the given vertices and extends the bounds given a velocity.
     * @method update
     * @param {bounds} bounds
     * @param {vertices} vertices
     * @param {vector} velocity
     */
    Bounds.update = function(bounds, vertices, velocity) {
        bounds.min.x = Infinity;
        bounds.max.x = -Infinity;
        bounds.min.y = Infinity;
        bounds.max.y = -Infinity;

        for (var i = 0; i < vertices.length; i++) {
            var vertex = vertices[i];
            if (vertex.x > bounds.max.x) bounds.max.x = vertex.x;
            if (vertex.x < bounds.min.x) bounds.min.x = vertex.x;
            if (vertex.y > bounds.max.y) bounds.max.y = vertex.y;
            if (vertex.y < bounds.min.y) bounds.min.y = vertex.y;
        }
        
        if (velocity) {
            if (velocity.x > 0) {
                bounds.max.x += velocity.x;
            } else {
                bounds.min.x += velocity.x;
            }
            
            if (velocity.y > 0) {
                bounds.max.y += velocity.y;
            } else {
                bounds.min.y += velocity.y;
            }
        }
    };

    /**
     * Returns true if the bounds contains the given point.
     * @method contains
     * @param {bounds} bounds
     * @param {vector} point
     * @return {boolean} True if the bounds contain the point, otherwise false
     */
    Bounds.contains = function(bounds, point) {
        return point.x >= bounds.min.x && point.x <= bounds.max.x 
               && point.y >= bounds.min.y && point.y <= bounds.max.y;
    };

    /**
     * Returns true if the two bounds intersect.
     * @method overlaps
     * @param {bounds} boundsA
     * @param {bounds} boundsB
     * @return {boolean} True if the bounds overlap, otherwise false
     */
    Bounds.overlaps = function(boundsA, boundsB) {
        return (boundsA.min.x <= boundsB.max.x && boundsA.max.x >= boundsB.min.x
                && boundsA.max.y >= boundsB.min.y && boundsA.min.y <= boundsB.max.y);
    };

    /**
     * Translates the bounds by the given vector.
     * @method translate
     * @param {bounds} bounds
     * @param {vector} vector
     */
    Bounds.translate = function(bounds, vector) {
        bounds.min.x += vector.x;
        bounds.max.x += vector.x;
        bounds.min.y += vector.y;
        bounds.max.y += vector.y;
    };

    /**
     * Shifts the bounds to the given position.
     * @method shift
     * @param {bounds} bounds
     * @param {vector} position
     */
    Bounds.shift = function(bounds, position) {
        var deltaX = bounds.max.x - bounds.min.x,
            deltaY = bounds.max.y - bounds.min.y;
            
        bounds.min.x = position.x;
        bounds.max.x = position.x + deltaX;
        bounds.min.y = position.y;
        bounds.max.y = position.y + deltaY;
    };

    /**
     * Returns a translation vector that wraps the `objectBounds` inside the `bounds`.
     * @method wrap
     * @param {bounds} objectBounds The bounds of the object to wrap inside the bounds.
     * @param {bounds} bounds The bounds to wrap the body inside.
     * @param {number} [padding=0] - An amount added to the boundary.
     * @returns {?Matter.Vector} A translation vector (only if wrapping is required).
     */
    Bounds.wrap = function(objectBounds, bounds, padding) {
        var x = null,
          y = null;

        if (typeof bounds.min.x !== 'undefined' && typeof bounds.max.x !== 'undefined') {
          if (objectBounds.min.x > bounds.max.x) {
            x = bounds.min.x - objectBounds.max.x;
          } else if (objectBounds.max.x < bounds.min.x) {
            x = bounds.max.x - objectBounds.min.x;
          }
        }
  
        if (typeof bounds.min.y !== 'undefined' && typeof bounds.max.y !== 'undefined') {
          if (objectBounds.min.y > bounds.max.y) {
            y = bounds.min.y - objectBounds.max.y;
          } else if (objectBounds.max.y < bounds.min.y) {
            y = bounds.max.y - objectBounds.min.y;
          }
        }
  
        if (x !== null || y !== null) {
          return {
            x: x || 0,
            y: y || 0
          };
        }
      };
    
})();
