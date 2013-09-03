//--------------------------------
// Box
//--------------------------------

ShapeBox = function(local_x, local_y, w, h) {
	local_x = local_x || 0;
	local_y = local_y || 0;

	var hw = w * 0.5;
	var hh = h * 0.5;
	var verts = [
		new vec2(-hw + local_x, +hh + local_y),
		new vec2(-hw + local_x, -hh + local_y),
		new vec2(+hw + local_x, -hh + local_y),
		new vec2(+hw + local_x, +hh + local_y)
	];

	return new ShapePoly(verts);
}