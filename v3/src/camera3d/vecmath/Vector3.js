function Vector3(x, y, z) {
    if (typeof x === "object") {
        this.x = x.x||0;
        this.y = x.y||0;
        this.z = x.z||0;
    } else {
        this.x = x||0;
        this.y = y||0;
        this.z = z||0;
    }
}

//shorthand it for better minification
var vec3 = Vector3.prototype;

vec3.clone = function() {
    return new Vector3(this.x, this.y, this.z);
};

vec3.copy = function(otherVec) {
    this.x = otherVec.x;
    this.y = otherVec.y;
    this.z = otherVec.z;
    return this;
};

vec3.set = function(x, y, z) {
    if (typeof x === "object") {
        this.x = x.x||0;
        this.y = x.y||0;
        this.z = x.z||0;
    } else {
        this.x = x||0;
        this.y = y||0;
        this.z = z||0;
    }
    return this;
};

vec3.add = function(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
};

vec3.subtract = function(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
};

vec3.multiply = function(v) {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    return this;
};

vec3.scale = function(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
};

vec3.divide = function(v) {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    return this;
};

vec3.negate = function() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
};

vec3.distance = function(v) {
    var dx = v.x - this.x,
        dy = v.y - this.y,
        dz = v.z - this.z;
    return Math.sqrt(dx*dx + dy*dy + dz*dz);
};

vec3.distanceSq = function(v) {
    var dx = v.x - this.x,
        dy = v.y - this.y,
        dz = v.z - this.z;
    return dx*dx + dy*dy + dz*dz;
};

vec3.length = function() {
    var x = this.x,
        y = this.y,
        z = this.z;
    return Math.sqrt(x*x + y*y + z*z);
};

vec3.lengthSq = function() {
    var x = this.x,
        y = this.y,
        z = this.z;
    return x*x + y*y + z*z;
};

vec3.normalize = function() {
    var x = this.x,
        y = this.y,
        z = this.z;
    var len = x*x + y*y + z*z;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        this.x = x*len;
        this.y = y*len;
        this.z = z*len;
    }
    return this;
};

vec3.dot = function(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
};

vec3.cross = function(v) {
    var ax = this.x, ay = this.y, az = this.z,
        bx = v.x, by = v.y, bz = v.z;

    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
};

vec3.lerp = function(v, t) {
    var ax = this.x,
        ay = this.y,
        az = this.z;
    t = t||0;
    this.x = ax + t * (v.x - ax);
    this.y = ay + t * (v.y - ay);
    this.z = az + t * (v.z - az);
    return this;
};

vec3.transformMat4 = function(mat) {
    var x = this.x, y = this.y, z = this.z, m = mat.val;
    this.x = m[0] * x + m[4] * y + m[8] * z + m[12];
    this.y = m[1] * x + m[5] * y + m[9] * z + m[13];
    this.z = m[2] * x + m[6] * y + m[10] * z + m[14];
    return this;
};

vec3.transformMat3 = function(mat) {
    var x = this.x, y = this.y, z = this.z, m = mat.val;
    this.x = x * m[0] + y * m[3] + z * m[6];
    this.y = x * m[1] + y * m[4] + z * m[7];
    this.z = x * m[2] + y * m[5] + z * m[8];
    return this;
};

vec3.transformQuat = function(q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations
    var x = this.x, y = this.y, z = this.z,
        qx = q.x, qy = q.y, qz = q.z, qw = q.w,

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return this;
};

/**
 * Multiplies this Vector3 by the specified matrix, 
 * applying a W divide. This is useful for projection,
 * e.g. unprojecting a 2D point into 3D space.
 *
 * @method  prj
 * @param {Matrix4} the 4x4 matrix to multiply with 
 * @return {Vector3} this object for chaining
 */
vec3.project = function(mat) {
    var x = this.x,
        y = this.y,
        z = this.z,
        m = mat.val,
        a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3],
        a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7],
        a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11],
        a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];

    var l_w = 1 / (x * a03 + y * a13 + z * a23 + a33);

    this.x = (x * a00 + y * a10 + z * a20 + a30) * l_w; 
    this.y = (x * a01 + y * a11 + z * a21 + a31) * l_w; 
    this.z = (x * a02 + y * a12 + z * a22 + a32) * l_w;
    return this;
};

/**
 * Unproject this point from 2D space to 3D space.
 * The point should have its x and y properties set to
 * 2D screen space, and the z either at 0 (near plane)
 * or 1 (far plane). The provided matrix is assumed to already
 * be combined, i.e. projection * view * model.
 *
 * After this operation, this vector's (x, y, z) components will
 * represent the unprojected 3D coordinate.
 * 
 * @param  {Vector4} viewport          screen x, y, width and height in pixels
 * @param  {Matrix4} invProjectionView combined projection and view matrix
 * @return {Vector3}                   this object, for chaining
 */
vec3.unproject = function(viewport, invProjectionView) {
    var viewX = viewport.x,
        viewY = viewport.y,
        viewWidth = viewport.z,
        viewHeight = viewport.w;
    
    var x = this.x, 
        y = this.y,
        z = this.z;

    x = x - viewX;
    y = viewHeight - y - 1;
    y = y - viewY;

    this.x = (2 * x) / viewWidth - 1;
    this.y = (2 * y) / viewHeight - 1;
    this.z = 2 * z - 1;

    return this.project(invProjectionView);
};

vec3.random = function(scale) {
    scale = scale || 1.0;

    var r = Math.random() * 2.0 * Math.PI;
    var z = (Math.random() * 2.0) - 1.0;
    var zScale = Math.sqrt(1.0-z*z) * scale;
    
    this.x = Math.cos(r) * zScale;
    this.y = Math.sin(r) * zScale;
    this.z = z * scale;
    return this;
};

vec3.reset = function() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    return this;
};


vec3.sub = vec3.subtract;

vec3.mul = vec3.multiply;

vec3.div = vec3.divide;

vec3.dist = vec3.distance;

vec3.distSq = vec3.distanceSq;

vec3.len = vec3.length;

vec3.lenSq = vec3.lengthSq;

vec3.toString = function() {
    return 'Vector3(' + this.x + ', ' + this.y + ', ' + this.z + ')';
};

vec3.str = vec3.toString;

module.exports = Vector3;