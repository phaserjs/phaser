var MatrixStack = {

    matrixStack: null,
    currentMatrix: null,
    currentMatrixIndex: 0,

    initMatrixStack: function ()
    {
        this.matrixStack = new Float32Array(6000); // up to 1000 matrices
        this.currentMatrix = new Float32Array([1.0, 0.0, 0.0, 1.0, 0.0, 0.0]);
        this.currentMatrixIndex = 0;
        return this;
    },

    save: function ()
    {
        if (this.currentMatrixIndex >= this.matrixStack.length) return this;

        var matrixStack = this.matrixStack;
        var currentMatrix = this.currentMatrix;
        var currentMatrixIndex = this.currentMatrixIndex;
        this.currentMatrixIndex += 6;

        matrixStack[currentMatrixIndex + 0] = currentMatrix[0];
        matrixStack[currentMatrixIndex + 1] = currentMatrix[1];
        matrixStack[currentMatrixIndex + 2] = currentMatrix[2];
        matrixStack[currentMatrixIndex + 3] = currentMatrix[3];
        matrixStack[currentMatrixIndex + 4] = currentMatrix[4];
        matrixStack[currentMatrixIndex + 5] = currentMatrix[5];
        
        return this;
    },

    restore: function ()
    {
        if (this.currentMatrixIndex <= 0) return this;

        this.currentMatrixIndex -= 6;

        var matrixStack = this.matrixStack;
        var currentMatrix = this.currentMatrix;
        var currentMatrixIndex = this.currentMatrixIndex;

        currentMatrix[0] = matrixStack[currentMatrixIndex + 0];
        currentMatrix[1] = matrixStack[currentMatrixIndex + 1];
        currentMatrix[2] = matrixStack[currentMatrixIndex + 2];
        currentMatrix[3] = matrixStack[currentMatrixIndex + 3];
        currentMatrix[4] = matrixStack[currentMatrixIndex + 4];
        currentMatrix[5] = matrixStack[currentMatrixIndex + 5];

        return this;
    },

    loadIdentity: function ()
    {
        this.setTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
        return this;
    },

    transform: function (a, b, c, d, tx, ty)
    {
        var currentMatrix = this.currentMatrix;
        var m0 = currentMatrix[0];
        var m1 = currentMatrix[1];
        var m2 = currentMatrix[2];
        var m3 = currentMatrix[3];
        var m4 = currentMatrix[4];
        var m5 = currentMatrix[5];

        currentMatrix[0] = m0 * a + m2 * b;
        currentMatrix[1] = m1 * a + m3 * b;
        currentMatrix[2] = m0 * c + m2 * d;
        currentMatrix[3] = m1 * c + m3 * d;
        currentMatrix[4] = m0 * tx + m2 * ty + m4;
        currentMatrix[5] = m1 * tx + m3 * ty + m5;

        return this;
    },

    setTransform: function (a, b, c, d, tx, ty)
    {
        var currentMatrix = this.currentMatrix;

        currentMatrix[0] = a;
        currentMatrix[1] = b;
        currentMatrix[2] = c;
        currentMatrix[3] = d;
        currentMatrix[4] = tx;
        currentMatrix[5] = ty;

        return this;
    },

    translate: function (x, y)
    {
        var currentMatrix = this.currentMatrix;
        var m0 = currentMatrix[0];
        var m1 = currentMatrix[1];
        var m2 = currentMatrix[2];
        var m3 = currentMatrix[3];
        var m4 = currentMatrix[4];
        var m5 = currentMatrix[5];

        currentMatrix[4] = m0 * x + m2 * y + m4;
        currentMatrix[5] = m1 * x + m3 * y + m5;

        return this;
    },

    scale: function (x, y)
    {
        var currentMatrix = this.currentMatrix;
        var m0 = currentMatrix[0];
        var m1 = currentMatrix[1];
        var m2 = currentMatrix[2];
        var m3 = currentMatrix[3];

        currentMatrix[0] = m0 * x;
        currentMatrix[1] = m1 * x;
        currentMatrix[2] = m2 * y;
        currentMatrix[3] = m3 * y;

        return this;
    },

    rotate: function (t)
    {
        var currentMatrix = this.currentMatrix;
        var m0 = currentMatrix[0];
        var m1 = currentMatrix[1];
        var m2 = currentMatrix[2];
        var m3 = currentMatrix[3];
        var st = Math.sin(t);
        var ct = Math.cos(t);

        currentMatrix[0] = m0 * ct + m2 * st;
        currentMatrix[1] = m1 * ct + m3 * st;
        currentMatrix[2] = m2 * -st + m2 * ct;
        currentMatrix[3] = m3 * -st + m3 * ct;

        return this;
    }

};

module.exports = MatrixStack;
