// this must be called only once on the root of the tree. Never on children
var flattenTree = function (children, flatRenderArray, flatChildrenArray, childCount, renderCount)
{
	for (var index = 0, length = children.length; index < length; ++index)
	{
		var child = children[index];
		// we need a rendering list since we avoid iterating over
		// repeating children used as tags for the applying transformations.
		flatRenderArray[renderCount++] = child; 
		flatChildrenArray[childCount++] = child;
		if (children[index].children.length > 0)
		{
			var counts = flattenTree(children[index].children, flatRenderArray, flatChildrenArray, childCount, renderCount);
			childCount = counts[0];
			renderCount = counts[1];
			flatChildrenArray[childCount++] = children[index]; // add ending tag
		}
	}
	return [childCount, renderCount];
};

// Temporal values for Transform updateRoot
var matrixStack = new Float32Array(6 * 1000);
var matrixStackLength = 0;
var tempLocal = new Float32Array(6);

var Transform = function (gameObject, root)
{
	this.positionX = 0;
	this.positionY = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.rotation = 0;
	this.worldMatrix = new Float32Array(6);
	// Never iterate this list internally.
	// Only for user
	this.children = [];
	this.hasChildren = false;
	this.parent = this;
	// Only valid if you are the root.
	// This probably needs to be on State and not here.
	this.flatChildrenArray = [];
	this.flatRenderArray = [];
	this.transformStack = [];
	this.childStack = [];
	this.childCount = 0;
	this.renderCount = 0;
	this.dirty = false;
	this.dirtyLocal = true;
	this.root = root || this;
    this.gameObject = gameObject;
}
Transform.prototype.add = function (transform)
{
	this.root.dirty = true;
	this.hasChildren = true;
	transform.root = this.root;
	transform.parent.remove(transform);
	transform.parent = this;
	this.children.push(transform);
};
Transform.prototype.remove = function (transform)
{
	var children = this.children;
	var index = children.indexOf(transform);
	if (index >= 0)
	{
		children.splice(index, 1);
		this.hasChildren = (children.length > 0);
		this.root.dirty = true;
		transform.parent = transform;
	}
};

Transform.updateRoot = function (root, globalOffsetX, globalOffsetY)
{
	var currentChild = null;
	var stackLength = 0;
	var childStack = root.childStack;
	var childrenArray = root.flatChildrenArray;
	var cos = Math.cos;
	var sin = Math.sin;
	var transX = root.positionX; 
	var transY = root.positionY;
	var scaleX = root.scaleX;
	var scaleY = root.scaleY;
	var rotation = root.rotation;
	var tcos = cos(rotation);
	var tsin = sin(rotation);

	if (root.dirty)
	{
		var counts = flattenTree(root.children, root.flatRenderArray, childrenArray, 0, 0);
		root.childCount = counts[0];
		root.renderCount = counts[1];
		root.dirty = false;
	}

	tempLocal[0] = tcos * scaleX
	tempLocal[1] = tsin * scaleX
	tempLocal[2] = -tsin * scaleY
	tempLocal[3] = tcos * scaleY
	tempLocal[4] = transX;
	tempLocal[5] = transY;

	for (var index = 0, length = root.childCount; index < length; ++index)
	{
		var child = childrenArray[index];
		if (child !== currentChild)
		{
			// inlined transformation
		    var world = child.worldMatrix;
			var p0 = tempLocal[0];
		    var p1 = tempLocal[1];
		    var p2 = tempLocal[2];
		    var p3 = tempLocal[3];
		    var p4 = tempLocal[4];
		    var p5 = tempLocal[5];
			
			transX = child.positionX + globalOffsetX;
			transY = child.positionY + globalOffsetY;
			scaleX = child.scaleX;
			scaleY = child.scaleY;
			rotation = child.rotation;
		    tcos = cos(rotation);
		    tsin = sin(rotation);

		    // Rotate + Scale + Translate
		    var l0 = tcos * scaleX;
    		var l1 = tsin * scaleX;
    		var l2 = -tsin * scaleY;
    		var l3 = tcos * scaleY;

    		// Apply world transformation
		    world[0] = l0 * p0 + l1 * p2;
		    world[1] = l0 * p1 + l1 * p3;
		    world[2] = l2 * p0 + l3 * p2;
		    world[3] = l2 * p1 + l3 * p3;
		    world[4] = transX * p0 + transY * p2 + p4;
		    world[5] = transX * p1 + transY * p3 + p5;

			if (child.hasChildren)
			{
				matrixStack[matrixStackLength + 0] = tempLocal[0];
				matrixStack[matrixStackLength + 1] = tempLocal[1];
				matrixStack[matrixStackLength + 2] = tempLocal[2];
				matrixStack[matrixStackLength + 3] = tempLocal[3];
				matrixStack[matrixStackLength + 4] = tempLocal[4];
				matrixStack[matrixStackLength + 5] = tempLocal[5];

				tempLocal[0] = world[0];
				tempLocal[1] = world[1];
				tempLocal[2] = world[2];
				tempLocal[3] = world[3];
				tempLocal[4] = world[4];
				tempLocal[5] = world[5];

				childStack[stackLength++] = currentChild;
				currentChild = child;
				matrixStackLength += 6;
			}
		}
		else
		{
			matrixStackLength -= 6;
			tempLocal[0] = matrixStack[matrixStackLength + 0];
			tempLocal[1] = matrixStack[matrixStackLength + 1];
			tempLocal[2] = matrixStack[matrixStackLength + 2];
			tempLocal[3] = matrixStack[matrixStackLength + 3];
			tempLocal[4] = matrixStack[matrixStackLength + 4];
			tempLocal[5] = matrixStack[matrixStackLength + 5];
			currentChild = childStack[--stackLength];
		}
	}
};

Object.defineProperties(Transform.prototype,{
	worldPositionX: {
		enumarable: true,
		get: function ()
		{
			return this.worldMatrix[4];
		}
	},
	worldPositionY: {
		enumarable: true,
		get: function ()
		{
			return this.worldMatrix[5];
		}
	},
	worldScaleX: {
		enumarable: true,
		get: function ()
		{
			var world = this.worldMatrix;
		    var a = world[0];
		    var c = world[2];
		    var a2 = a * a;
		    var c2 = c * c;
		    var sx = Math.sqrt(a2 + c2);
		    return sx;
		}
	},
	worldScaleY: {
		enumarable: true,
		get: function ()
		{
			var world = this.worldMatrix;
		    var b = world[1];
		    var d = world[3];
		    var b2 = b * b;
		    var d2 = d * d;
		    var sy = Math.sqrt(b2 + d2);
		    return sy;
		}
	},
	worldRotation: {
		enumarable: true,
		get: function ()
		{
			var world = this.worldMatrix;
		    var a = world[0];
		    var c = world[2];
		    var a2 = a * a;
		    var c2 = c * c;
		    return Math.acos(a / Math.sqrt(a2 + c2)) * (Math.atan(-c / a) < 0 ? -1 : 1);
		}
	}
});

module.exports = Transform;
