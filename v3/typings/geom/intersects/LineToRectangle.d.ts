/**
* Checks for intersection between the Line and a Rectangle shape, or a rectangle-like
* object, with public `x`, `y`, `right` and `bottom` properties, such as a Sprite or Body.
*
* An intersection is considered valid if:
*
* The line starts within, or ends within, the Rectangle.
* The line segment intersects one of the 4 rectangle edges.
*
* The for the purposes of this function rectangles are considered 'solid'.
*
* @method Phaser.Line.intersectsRectangle
* @param {Phaser.Line} line - The line to check for intersection with.
* @param {Phaser.Rectangle|object} rect - The rectangle, or rectangle-like object, to check for intersection with.
* @return {boolean} True if the line intersects with the rectangle edges, or starts or ends within the rectangle.
*/
export default function (line: any, rect: any): boolean;
