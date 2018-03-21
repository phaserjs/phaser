function CreateRenderTarget(gl, width, height, data) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data ? data : null);
    if (gl.getError() != gl.NO_ERROR) {
        console.error("GL ERROR", gl.getError());
    }
    return texture;
}

function UploadTexture(gl, image) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    if (gl.getError() != gl.NO_ERROR) {
        console.error("GL ERROR", gl.getError());
    }
    return texture;
}

function CreateFramebuffer(gl, width, height) {
    var fbo = gl.createFramebuffer();
    var rbo = gl.createRenderbuffer();
    var tex = null;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.bindRenderbuffer(gl.RENDERBUFFER, rbo);
    tex = CreateRenderTarget(gl, width, height);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
        console.error('Frame buffer incomplete');
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    fbo.width = width;
    fbo.height = height;
    fbo.targetTexture = tex;
    fbo.renderbuffer = rbo;
    return fbo;
}

function CanvasGL(gl) {
    var program = gl.createProgram();
    var vShader = gl.createShader(gl.VERTEX_SHADER);
    var fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vShader, [
        'attribute vec2 inPosition;',
        'attribute vec4 inColor;',
        'attribute vec2 inTexCoord;',
        'uniform mat4 uViewMatrix;',
        'varying vec2 outTexCoord;',
        'varying vec4 outColor;',
        'void main() {',
        '   gl_Position = uViewMatrix * vec4(inPosition, 1.0, 1.0);',
        '   outColor = inColor;',
        '   outTexCoord = inTexCoord;',
        '}'
    ].join('\n'));
    gl.shaderSource(fShader, [
        'precision mediump float;',
        'const vec2 gf0 = vec2(-3.0, 0.015625);',
        'const vec2 gf1 = vec2(-2.0, 0.09375);',
        'const vec2 gf2 = vec2(-1.0, 0.234375);',
        'const vec2 gf3 = vec2(0.0, 0.3125);',
        'const vec2 gf4 = vec2(1.0, 0.234375);',
        'const vec2 gf5 = vec2(2.0, 0.09375);',
        'const vec2 gf6 = vec2(3.0, 0.015625);',
        'const float factor = 0.5;',
        'uniform bool isStencil;',
        'uniform bool isPattern;',
        'uniform sampler2D mainSampler;',
        'uniform sampler2D maskSampler;',
        'uniform vec2 scale;',
        'uniform bool enableBlur;',
        'varying vec4 outColor;',
        'varying vec2 outTexCoord;',
        'void main() {',
        '   if (isStencil == false) {',
        '       gl_FragColor = vec4(outColor.bgr, 1.0);',
        '   } else if (isPattern) {',
        '       gl_FragColor = texture2D(mainSampler, outTexCoord);',
        '   } else {',
        '       vec4 mainColor = texture2D(mainSampler, outTexCoord);',
        '       vec4 maskColor = vec4(0, 0, 0, 0);',
        '       if (enableBlur) {',
        '           maskColor += texture2D(maskSampler, vec2(outTexCoord.x + gf0.x * (scale.x * factor), outTexCoord.y + gf0.x * (scale.y * factor))) * gf0.y;',
        '           maskColor += texture2D(maskSampler, vec2(outTexCoord.x + gf1.x * (scale.x * factor), outTexCoord.y + gf1.x * (scale.y * factor))) * gf1.y;',
        '           maskColor += texture2D(maskSampler, vec2(outTexCoord.x + gf2.x * (scale.x * factor), outTexCoord.y + gf2.x * (scale.y * factor))) * gf2.y;',
        '           maskColor += texture2D(maskSampler, vec2(outTexCoord.x + gf3.x * (scale.x * factor), outTexCoord.y + gf3.x * (scale.y * factor))) * gf3.y;',
        '           maskColor += texture2D(maskSampler, vec2(outTexCoord.x + gf4.x * (scale.x * factor), outTexCoord.y + gf4.x * (scale.y * factor))) * gf4.y;',
        '           maskColor += texture2D(maskSampler, vec2(outTexCoord.x + gf5.x * (scale.x * factor), outTexCoord.y + gf5.x * (scale.y * factor))) * gf5.y;',
        '           maskColor += texture2D(maskSampler, vec2(outTexCoord.x + gf6.x * (scale.x * factor), outTexCoord.y + gf6.x * (scale.y * factor))) * gf6.y;',
        '       } else maskColor = texture2D(maskSampler, outTexCoord);',
        '       gl_FragColor = mainColor * maskColor.a;',
        '   }',
        '}'
    ].join('\n'));
    gl.compileShader(vShader);
    gl.compileShader(fShader);
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uViewMatrix'), 0,
        new Float32Array([
            2 / gl.canvas.width, 0, 0, 0,
            0, -2 / gl.canvas.height, 0, 0,
            0, 0, 1, 1, -1, 1, 0, 0
        ])
    );
    this._isStencilLocation = gl.getUniformLocation(program, 'isStencil');
    this._lineWidth = 1;
    this._matrixStack = new Float32Array(6 * 1000);
    this._matrixStackPointer = 0;
    this._matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
    this._program = program;
    this._vShader = vShader;
    this._fShader = fShader;
    this._inPositionLocation = gl.getAttribLocation(program, 'inPosition');
    this._inColorLocation = gl.getAttribLocation(program, 'inColor');
    this._inTexCoordLocation = gl.getAttribLocation(program, 'inTexCoord');
    this._gl = gl;
    this._fillColor = new Uint32Array([0xFFFFFFFF]);
    this._lineColor = 0xFFFFFFFF;
    this._vbo = gl.createBuffer();
    this._vertexCount = 0;
    this._arrayBuffer = new ArrayBuffer(this.VERTEX_SIZE * this.MAX_VERTEX_COUNT);
    this._positionBuffer = new Float32Array(this._arrayBuffer);
    this._colorBuffer = new Uint32Array(this._arrayBuffer);
    this._pathArray = [];
    this._lastPath = null;
    this._emptyTexture = CreateRenderTarget(gl, 1, 1);
    this.bind();
    gl.bufferData(gl.ARRAY_BUFFER, this._arrayBuffer.byteLength, gl.DYNAMIC_DRAW);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform1i(this._isStencilLocation, 0);
    this._fboStencilBuffer = CreateFramebuffer(gl, gl.canvas.width, gl.canvas.height);
    this._fboColorBuffer = CreateFramebuffer(gl, gl.canvas.width, gl.canvas.height);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._emptyTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this._emptyTexture);
    this._isPatternLocation = gl.getUniformLocation(program, 'isPattern');
    gl.uniform1i(gl.getUniformLocation(program, 'mainSampler'), 0);
    gl.uniform1i(gl.getUniformLocation(program, 'maskSampler'), 1);
    gl.uniform1i(this._isPatternLocation, 0);
    gl.uniform2f(gl.getUniformLocation(program, 'scale'), 1 / gl.canvas.width, 1 / gl.canvas.height);
    this.enableMaskAntialiasing();
    this._currentPattern = null;
}

CanvasGL.prototype.createPatternTexture = function (image) {
    var texture = UploadTexture(this._gl, image);
    var pattern = {
        // Other Properties
        texture: texture
    };
    return pattern;
};

CanvasGL.prototype.usePattern = function (pattern) {
    this._currentPattern = pattern;
};

CanvasGL.prototype.stopPattern = function () {
    this._currentPattern = null;
};

CanvasGL.prototype.enableMaskAntialiasing = function () {
    var gl = this._gl;
    gl.uniform1i(gl.getUniformLocation(this._program, 'enableBlur'), 1);
};

CanvasGL.prototype.disableMaskAntialiasing = function () {
    var gl = this._gl;
    gl.uniform1i(gl.getUniformLocation(this._program, 'enableBlur'), 0);
};

CanvasGL.prototype.recordMaskBegin = function () {
    var gl = this._gl;
    var stencilbuffer = this._fboStencilBuffer;
    this.flush();
    gl.viewport(0, 0, stencilbuffer.width, stencilbuffer.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, stencilbuffer);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._emptyTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this._emptyTexture);
    gl.uniform1i(this._isStencilLocation, 0);
};

CanvasGL.prototype.recordMaskEnd = function () {
    var gl = this._gl;
    this.flush();
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._emptyTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this._emptyTexture);
    gl.uniform1i(this._isStencilLocation, 0);
};

CanvasGL.prototype.applyMaskBegin = function () {
    var gl = this._gl;
    var colorbuffer = this._fboColorBuffer;
    this.flush();
    gl.viewport(0, 0, colorbuffer.width, colorbuffer.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, colorbuffer);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._emptyTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this._emptyTexture);
    gl.uniform1i(this._isStencilLocation, 0);
};

CanvasGL.prototype.applyMaskEnd = function () {
    var gl = this._gl;
    var colorbuffer = this._fboColorBuffer;
    var stencilbuffer = this._fboStencilBuffer;
    this.flush();
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._currentPattern ? this._currentPattern.texture : colorbuffer.targetTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, stencilbuffer.targetTexture);
    gl.uniform1i(this._isStencilLocation, 1);

    this.fillRect(0, 0, colorbuffer.width, colorbuffer.height);
    this.flush();

    gl.uniform1i(this._isStencilLocation, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._emptyTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this._emptyTexture);
};

CanvasGL.prototype.clearScreen = function () {
    var gl = this._gl;
    gl.clear(gl.COLOR_BUFFER_BIT);
};

CanvasGL.Point = function (x, y) {
    this.x = x;
    this.y = y;
};

CanvasGL.Path = function (x, y) {
    this.points = [];
    this.points.push(new CanvasGL.Point(x, y));
};

CanvasGL.PointAdd = function (p0, p1) {
    return new CanvasGL.Point(
        p0.x + p1.x,
        p0.y + p1.y
    );
};

CanvasGL.PointSub = function (p0, p1) {
    return new CanvasGL.Point(
        p0.x - p1.x,
        p0.y - p1.y
    );
};


CanvasGL.LineIntersection = function (lineA0, lineB0, lineA1, lineB1) {
    var bx = lineB0.x - lineA0.x;
    var by = lineB0.y - lineA0.y;
    var dx = lineB1.x - lineA1.x;
    var dy = lineB1.y - lineA1.y;
    var cross = bx * dy - by * dx;
    if (cross === 0) return null;
    var cx = lineA1.x - lineA0.x;
    var cy = lineA1.y - lineA0.y;
    var t = (cx * dy - cy * dx) / cross;
    if (t < 0 || t > 1) return null;
    var u = (cx * by - cy * bx) / cross;
    if (u < 0 || u > 1) return null;
    return new CanvasGL.Point(
        lineA0.x + t * bx,
        lineA0.y + t * by
    );
};

CanvasGL.prototype.destroy = function () {
    var gl = this._gl;
    gl.deleteBuffer(this._vbo);
    gl.deleteShader(this._fShader);
    gl.deleteShader(this._vShader);
    gl.deleteProgram(this._program);
    this._vbo = null;
    this._fShader = null;
    this._vShader = null;
    this._program = null;
};

CanvasGL.prototype.save = function () {
    var index = this._matrixStackPointer;
    var stack = this._matrixStack;
    var matrix = this._matrix;

    stack[index++] = matrix[0];
    stack[index++] = matrix[1];
    stack[index++] = matrix[2];
    stack[index++] = matrix[3];
    stack[index++] = matrix[4];
    stack[index++] = matrix[5];

    this._matrixStackPointer += 6;
};

CanvasGL.prototype.restore = function () {
    var index = this._matrixStackPointer;
    var stack = this._matrixStack;
    var matrix = this._matrix;

    matrix[5] = stack[--index];
    matrix[4] = stack[--index];
    matrix[3] = stack[--index];
    matrix[2] = stack[--index];
    matrix[1] = stack[--index];
    matrix[0] = stack[--index];

    this._matrixStackPointer -= 6;
};

CanvasGL.prototype.translate = function (x, y) {
    var matrix = this._matrix;
    matrix[4] = matrix[0] * x + matrix[2] * y + matrix[4];
    matrix[5] = matrix[1] * x + matrix[3] * y + matrix[5];
};

CanvasGL.prototype.scale = function (x, y) {
    var matrix = this._matrix;
    matrix[0] = matrix[0] * x;
    matrix[1] = matrix[1] * x;
    matrix[2] = matrix[2] * y;
    matrix[3] = matrix[3] * y;
};

CanvasGL.prototype.rotate = function (radian) {
    var matrix = this._matrix;
    var a = matrix[0];
    var b = matrix[1];
    var c = matrix[2];
    var d = matrix[3];
    var sr = Math.sin(radian);
    var cr = Math.cos(radian);

    matrix[0] = a * cr + c * sr;
    matrix[1] = b * cr + d * sr;
    matrix[2] = a * -sr + c * cr;
    matrix[3] = b * -sr + d * cr;
};

CanvasGL.prototype.transform = function (a, b, c, d, e, f) {
    var matrix = this._matrix;
    var a2 = a * matrix[0] + b * matrix[2];
    var b2 = a * matrix[1] + b * matrix[3];
    var c2 = c * matrix[0] + d * matrix[2];
    var d2 = c * matrix[1] + d * matrix[3];
    var e2 = e * matrix[0] + f * matrix[2] + matrix[4];
    var f2 = e * matrix[1] + f * matrix[3] + matrix[5];
    this.setTransform(a2, b2, c2, d2, e2, f2);
};

CanvasGL.prototype.setTransform = function (a, b, c, d, e, f) {
    var matrix = this._matrix;
    matrix[0] = a;
    matrix[1] = b;
    matrix[2] = c;
    matrix[3] = d;
    matrix[4] = e;
    matrix[5] = f;
};

CanvasGL.prototype.resetTransform = function () {
    var matrix = this._matrix;
    matrix[0] = 1;
    matrix[1] = 0;
    matrix[2] = 0;
    matrix[3] = 1;
    matrix[4] = 0;
    matrix[5] = 0;
};

CanvasGL.prototype.arc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
    var lerp = function (norm, min, max) {
        return (max - min) * norm + min;
    };
    var iteration = 0;
    var iterStep = 0.01;
    var tx = 0;
    var ty = 0;
    var ta = 0;
    var cos = Math.cos;
    var sin = Math.sin;
    while (iteration < 1) {
        ta = lerp(iteration, startAngle, endAngle);
        tx = x + cos(ta) * radius;
        ty = y + sin(ta) * radius;
        if (iteration === 0) {
            this.moveTo(tx, ty);
        } else {
            this.lineTo(tx, ty);
        }
        iteration += iterStep;
    }
};

CanvasGL.prototype.fillTriangle = function (tx0, ty0, tx1, ty1, tx2, ty2, fillColor) {
    if (this._vertexCount + 3 >= this.MAX_VERTEX_COUNT) {
        this.flush();
    }
    var offset = this._vertexCount * 5;
    var position = this._positionBuffer;
    var color = this._colorBuffer;
    var intColor = fillColor;
    var mat = this._matrix;
    var a = mat[0];
    var b = mat[1];
    var c = mat[2];
    var d = mat[3];
    var e = mat[4];
    var f = mat[5];
    var x0 = tx0 * a + ty0 * c + e;
    var y0 = tx0 * b + ty0 * d + f;
    var x1 = tx1 * a + ty1 * c + e;
    var y1 = tx1 * b + ty1 * d + f;
    var x2 = tx2 * a + ty2 * c + e;
    var y2 = tx2 * b + ty2 * d + f;

    position[offset++] = x0;
    position[offset++] = y0;
    position[offset++] = 0;
    position[offset++] = 0;
    color[offset++] = intColor;

    position[offset++] = x1;
    position[offset++] = y1;
    position[offset++] = 0;
    position[offset++] = 0;
    color[offset++] = intColor;

    position[offset++] = x2;
    position[offset++] = y2;
    position[offset++] = 0;
    position[offset++] = 0;
    color[offset++] = intColor;

    this._vertexCount += 3;
};

CanvasGL.prototype.strokeLine = function (ax, ay, bx, by) {
    if (this._vertexCount + 6 >= this.MAX_VERTEX_COUNT) {
        this.flush();
    }
    var dx = bx - ax;
    var dy = by - ay;
    var len = Math.sqrt(dx * dx + dy * dy);
    var lineWidth = this._lineWidth * 0.5;
    var offset = this._vertexCount * 5;
    var position = this._positionBuffer;
    var color = this._colorBuffer;
    var intColor = this._lineColor;
    var mat = this._matrix;
    var a = mat[0];
    var b = mat[1];
    var c = mat[2];
    var d = mat[3];
    var e = mat[4];
    var f = mat[5];
    var lx0 = bx - lineWidth * (by - ay) / len;
    var ly0 = by - lineWidth * (ax - bx) / len;
    var lx1 = ax - lineWidth * (by - ay) / len;
    var ly1 = ay - lineWidth * (ax - bx) / len;
    var lx2 = bx + lineWidth * (by - ay) / len;
    var ly2 = by + lineWidth * (ax - bx) / len;
    var lx3 = ax + lineWidth * (by - ay) / len;
    var ly3 = ay + lineWidth * (ax - bx) / len;
    var x0 = lx0 * a + ly0 * c + e;
    var y0 = lx0 * b + ly0 * d + f;
    var x1 = lx1 * a + ly1 * c + e;
    var y1 = lx1 * b + ly1 * d + f;
    var x2 = lx2 * a + ly2 * c + e;
    var y2 = lx2 * b + ly2 * d + f;
    var x3 = lx3 * a + ly3 * c + e;
    var y3 = lx3 * b + ly3 * d + f;

    position[offset++] = x0;
    position[offset++] = y0;
    position[offset++] = 0;
    position[offset++] = 1;
    color[offset++] = intColor;
    position[offset++] = x1;
    position[offset++] = y1;
    position[offset++] = 1;
    position[offset++] = 1;
    color[offset++] = intColor;
    position[offset++] = x2;
    position[offset++] = y2;
    position[offset++] = 0;
    position[offset++] = 0;
    color[offset++] = intColor;
    position[offset++] = x1;
    position[offset++] = y1;
    position[offset++] = 1;
    position[offset++] = 1;
    color[offset++] = intColor;
    position[offset++] = x3;
    position[offset++] = y3;
    position[offset++] = 1;
    position[offset++] = 0;
    color[offset++] = intColor;
    position[offset++] = x2;
    position[offset++] = y2;
    position[offset++] = 0;
    position[offset++] = 0;
    color[offset++] = intColor;

    this._vertexCount += 6;
    return [
        x0, y0,
        x1, y1,
        x2, y2,
        x3, y3
    ];
};

CanvasGL.prototype.fillRect = function (x, y, width, height) {
    if (this._vertexCount + 6 >= this.MAX_VERTEX_COUNT) {
        this.flush();
    }
    var offset = this._vertexCount * 5;
    var position = this._positionBuffer;
    var color = this._colorBuffer;
    var intColor = this._fillColor[0];
    var mat = this._matrix;
    var a = mat[0];
    var b = mat[1];
    var c = mat[2];
    var d = mat[3];
    var e = mat[4];
    var f = mat[5];
    var xmin = x;
    var ymin = y;
    var xmax = x + width;
    var ymax = y + height;
    var x0 = xmin * a + ymax * c + e;
    var y0 = xmin * b + ymax * d + f;
    var x1 = xmax * a + ymax * c + e;
    var y1 = xmax * b + ymax * d + f;
    var x2 = xmin * a + ymin * c + e;
    var y2 = xmin * b + ymin * d + f;
    var x3 = xmax * a + ymin * c + e;
    var y3 = xmax * b + ymin * d + f;

    var umin = 0;
    var vmin = 0;
    var umax = 1;
    var vmax = 1;

    position[offset++] = x0;
    position[offset++] = y0;
    position[offset++] = umin;
    position[offset++] = vmin;
    color[offset++] = intColor;
    position[offset++] = x1;
    position[offset++] = y1;
    position[offset++] = umax;
    position[offset++] = vmin;
    color[offset++] = intColor;
    position[offset++] = x2;
    position[offset++] = y2;
    position[offset++] = umin;
    position[offset++] = vmax;
    color[offset++] = intColor;
    position[offset++] = x1;
    position[offset++] = y1;
    position[offset++] = umax;
    position[offset++] = vmin;
    color[offset++] = intColor;
    position[offset++] = x3;
    position[offset++] = y3;
    position[offset++] = umax;
    position[offset++] = vmax;
    color[offset++] = intColor;
    position[offset++] = x2;
    position[offset++] = y2;
    position[offset++] = umin;
    position[offset++] = vmax;
    color[offset++] = intColor;

    this._vertexCount += 6;
};

CanvasGL.prototype.beginPath = function () {
    this._pathArray.length = 0;
};

CanvasGL.prototype.closePath = function () {
    var lastPath = this._lastPath;
    if (lastPath !== null && lastPath.points.length > 0) {
        var firstPoint = lastPath.points[0];
        var lastPoint = lastPath.points[lastPath.points.length - 1];
        lastPath.points.push(firstPoint);
        this.moveTo(lastPoint.x, lastPoint.y);
    }
};

CanvasGL.prototype.lineTo = function (x, y) {
    if (this._lastPath !== null) {
        this._lastPath.points.push(new CanvasGL.Point(x, y));
    } else {
        this.moveTo(x, y);
    }
};

CanvasGL.prototype.moveTo = function (x, y) {
    this._lastPath = new CanvasGL.Path(x, y);
    this._pathArray.push(this._lastPath);
};

CanvasGL.prototype.stroke = function () {
    var pathArray = this._pathArray;
    var pathArrayLength = pathArray.length;
    var lineWidth = this.lineWidth * 0.5;
    var pathArrayIndex, path, pathLength, pathIndex, point0, point1;
    var polylines = [];
    var lineColor = this._lineColor;
    var index, length, last, curr;
    var x0, y0, x1, y1, x2, y2, offset, position, color;

    for (pathArrayIndex = 0; pathArrayIndex < pathArrayLength; ++pathArrayIndex) {
        path = pathArray[pathArrayIndex].points;
        pathLength = path.length;
        for (pathIndex = 0; pathIndex + 1 < pathLength; pathIndex += 1) {
            point0 = path[pathIndex];
            point1 = path[pathIndex + 1];
            polylines.push(this.strokeLine(point0.x, point0.y, point1.x, point1.y));
        }
        if (pathArray[pathArrayIndex] === this._lastPath) {
            for (index = 1, length = polylines.length; index < length; ++index) {
                last = polylines[index - 1];
                curr = polylines[index];
                if (this._vertexCount + 6 >= this.MAX_VERTEX_COUNT) {
                    this.flush();
                }

                x0 = last[2 * 2 + 0];
                y0 = last[2 * 2 + 1];
                x1 = last[2 * 0 + 0];
                y1 = last[2 * 0 + 1];
                x2 = curr[2 * 3 + 0];
                y2 = curr[2 * 3 + 1];

                offset = this._vertexCount * 5;
                position = this._positionBuffer;
                color = this._colorBuffer;

                position[offset++] = x0;
                position[offset++] = y0;
                position[offset++] = 0;
                position[offset++] = 1;
                color[offset++] = lineColor;
                position[offset++] = x1;
                position[offset++] = y1;
                position[offset++] = 1;
                position[offset++] = 1;
                color[offset++] = lineColor;
                position[offset++] = x2;
                position[offset++] = y2;
                position[offset++] = 0;
                position[offset++] = 0;
                color[offset++] = lineColor;

                x0 = last[2 * 0 + 0];
                y0 = last[2 * 0 + 1];
                x1 = last[2 * 2 + 0];
                y1 = last[2 * 2 + 1];
                x2 = curr[2 * 1 + 0];
                y2 = curr[2 * 1 + 1];

                position[offset++] = x0;
                position[offset++] = y0;
                position[offset++] = 0;
                position[offset++] = 1;
                color[offset++] = lineColor;
                position[offset++] = x1;
                position[offset++] = y1;
                position[offset++] = 1;
                position[offset++] = 1;
                color[offset++] = lineColor;
                position[offset++] = x2;
                position[offset++] = y2;
                position[offset++] = 0;
                position[offset++] = 0;
                color[offset++] = lineColor;

                this._vertexCount += 6;
            }
        } else {
            for (index = 0, length = polylines.length; index < length; ++index) {
                last = polylines[index - 1] || polylines[polylines.length - 1];
                curr = polylines[index];

                if (this._vertexCount + 6 >= this.MAX_VERTEX_COUNT) {
                    this.flush();
                }

                x0 = last[2 * 2 + 0];
                y0 = last[2 * 2 + 1];
                x1 = last[2 * 0 + 0];
                y1 = last[2 * 0 + 1];
                x2 = curr[2 * 3 + 0];
                y2 = curr[2 * 3 + 1];

                offset = this._vertexCount * 5;
                position = this._positionBuffer;
                color = this._colorBuffer;

                position[offset++] = x0;
                position[offset++] = y0;
                position[offset++] = 0;
                position[offset++] = 1;
                color[offset++] = lineColor;
                position[offset++] = x1;
                position[offset++] = y1;
                position[offset++] = 1;
                position[offset++] = 1;
                color[offset++] = lineColor;
                position[offset++] = x2;
                position[offset++] = y2;
                position[offset++] = 0;
                position[offset++] = 0;
                color[offset++] = lineColor;

                x0 = last[2 * 0 + 0];
                y0 = last[2 * 0 + 1];
                x1 = last[2 * 2 + 0];
                y1 = last[2 * 2 + 1];
                x2 = curr[2 * 1 + 0];
                y2 = curr[2 * 1 + 1];

                position[offset++] = x0;
                position[offset++] = y0;
                position[offset++] = 0;
                position[offset++] = 1;
                color[offset++] = lineColor;
                position[offset++] = x1;
                position[offset++] = y1;
                position[offset++] = 1;
                position[offset++] = 1;
                color[offset++] = lineColor;
                position[offset++] = x2;
                position[offset++] = y2;
                position[offset++] = 0;
                position[offset++] = 0;
                color[offset++] = lineColor;

                this._vertexCount += 6;
            }
        }
        polylines.length = 0;
    }
};

CanvasGL.prototype.fill = function () {
    var pathArray = this._pathArray;
    var pathArrayLength = pathArray.length;
    var polygon = [];
    for (var pathArrayIndex = 0; pathArrayIndex < pathArrayLength; ++pathArrayIndex) {
        var path = pathArray[pathArrayIndex].points;
        var pathLength = path.length;
        for (var pathIndex = 0; pathIndex < pathLength; ++pathIndex) {
            var point = path[pathIndex];
            polygon.push(point.x, point.y);
        }
        var polygonIndex = earcut(polygon);
        for (var index = 0, length = polygonIndex.length; index < length; index += 3) {
            var v0 = polygonIndex[index + 0] * 2;
            var v1 = polygonIndex[index + 1] * 2;
            var v2 = polygonIndex[index + 2] * 2;
            this.fillTriangle(
                polygon[v0 + 0],
                polygon[v0 + 1],
                polygon[v1 + 0],
                polygon[v1 + 1],
                polygon[v2 + 0],
                polygon[v2 + 1],
                this._fillColor
            );
        }
        polygon.length = 0;
    }
};

CanvasGL.prototype.bind = function () {
    var gl = this._gl;
    var vertexSize = this.VERTEX_SIZE;
    var inPositionLocation = this._inPositionLocation;
    var inColorLocation = this._inColorLocation;
    var inTexCoordLocation = this._inTexCoordLocation;
    gl.useProgram(this._program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
    gl.enableVertexAttribArray(inPositionLocation);
    gl.enableVertexAttribArray(inColorLocation);
    gl.enableVertexAttribArray(inTexCoordLocation);
    gl.vertexAttribPointer(inPositionLocation, 2, gl.FLOAT, gl.FALSE, vertexSize, 0);
    gl.vertexAttribPointer(inTexCoordLocation, 2, gl.FLOAT, gl.FALSE, vertexSize, 8);
    gl.vertexAttribPointer(inColorLocation, 4, gl.UNSIGNED_BYTE, gl.TRUE, vertexSize, 16);
};

CanvasGL.prototype.flush = function () {
    var gl = this._gl;
    var vertexCount = this._vertexCount;
    if (vertexCount > 0) {
        this.bind();
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this._positionBuffer.subarray(0, vertexCount * 5));
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
        this._vertexCount = 0;
    }
};

Object.defineProperty(CanvasGL.prototype, 'fillStyleUINT', {
    get: function () {
        return this._fillColor[0];
    },
    set: function (color) {
        if (typeof color === 'number') {
            this._fillColor[0] = color;
        }
    }
});

Object.defineProperty(CanvasGL.prototype, 'strokeStyleUINT', {
    get: function () {
        return this._lineColor;
    },
    set: function (color) {
        if (typeof color === 'number') {
            this._lineColor = color;
        }
    }
});

Object.defineProperty(CanvasGL.prototype, 'fillStyle', {
    get: function () {
        return '#' + this._fillColor[0].toString(16);
    },
    set: function (fillStyle) {
        this.fillStyleUINT = (0xFF << 24) + parseInt(fillStyle.replace('#', ''), 16);
    }
});

Object.defineProperty(CanvasGL.prototype, 'strokeStyle', {
    get: function () {
        return '#' + this._lineColor.toString(16);
    },
    set: function (strokeStyle) {
        this.strokeStyleUINT = parseInt(strokeStyle.replace('#', ''), 16);
    }
});

Object.defineProperty(CanvasGL.prototype, 'lineWidth', {
    get: function () {
        return this._lineWidth;
    },
    set: function (lineWidth) {
        if (typeof lineWidth === 'number')
            this._lineWidth = lineWidth;
    }
});

Object.defineProperty(CanvasGL.prototype, 'VERTEX_SIZE', {
    get: function () {
        return (4 * 2) + (4 * 2) + 4;
    }
});

Object.defineProperty(CanvasGL.prototype, 'MAX_VERTEX_COUNT', {
    get: function () {
        return 20000 * 12;
    }
});

Object.defineProperty(CanvasGL.prototype, 'canvas', {
    get: function () {
        return this._gl.canvas;
    }
});