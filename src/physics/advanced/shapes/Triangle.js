//--------------------------------
// Triangle
//--------------------------------

ShapeTriangle = function(p1, p2, p3) {
	var verts = [
		new vec2(p1.x, p1.y),
		new vec2(p2.x, p2.y),
		new vec2(p3.x, p3.y)
	];
	return new ShapePoly(verts);
}
