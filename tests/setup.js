/**
 * Vitest global setup file.
 *
 * Sets up the jsdom environment with Canvas/WebGL mocks and an Image mock
 * that triggers onload (required for Phaser's TextureManager to boot).
 *
 * Pure math/geometry/utility tests don't need any of this — they just
 * require() the source directly. But tests that need real Phaser Game
 * Objects use the helper in tests/helper.js which boots a headless
 * Phaser Game on top of this environment.
 */

// ── Globals that jsdom doesn't provide ──────────────────────────────────────

if (typeof global.self === 'undefined')
{
    global.self = global;
}

if (typeof global.screen === 'undefined')
{
    global.screen = { width: 1920, height: 1080, orientation: { type: 'landscape-primary' } };
}

// Stub window.focus to suppress jsdom "Not implemented" warnings
if (typeof window !== 'undefined')
{
    window.focus = function () {};
}

// Suppress jsdom "Not implemented" console errors (e.g., window.focus from VisibilityHandler)
var _origConsoleError = console.error;

console.error = function ()
{
    var msg = arguments[0];

    if (typeof msg === 'string' && msg.indexOf('Not implemented') !== -1)
    {
        return;
    }

    _origConsoleError.apply(console, arguments);
};

// ── Image mock ──────────────────────────────────────────────────────────────
// jsdom's Image doesn't fire onload because it has no image decoder.
// Phaser's TextureManager loads base64 textures via Image and waits for
// onload before emitting READY, which blocks the entire boot sequence.
// This mock triggers onload asynchronously when src is set.

var OriginalImage = global.Image;

global.Image = function ()
{
    var img = {
        width: 32,
        height: 32,
        naturalWidth: 32,
        naturalHeight: 32,
        complete: false,
        crossOrigin: '',
        onload: null,
        onerror: null,
        addEventListener: function (type, fn) { if (type === 'load') { img.onload = fn; } },
        removeEventListener: function () {}
    };

    Object.defineProperty(img, 'src', {
        set: function (val)
        {
            img._src = val;
            img.complete = true;

            setTimeout(function ()
            {
                if (typeof img.onload === 'function')
                {
                    img.onload();
                }
            }, 1);
        },
        get: function ()
        {
            return img._src || '';
        }
    });

    return img;
};

// ── Canvas 2D Context mock ──────────────────────────────────────────────────

if (typeof HTMLCanvasElement !== 'undefined')
{
    HTMLCanvasElement.prototype.getContext = function (type)
    {
        if (type === '2d' || type === '2D')
        {
            return {
                canvas: this,
                fillRect: function () {},
                clearRect: function () {},
                getImageData: function (x, y, w, h)
                {
                    return { data: new Uint8ClampedArray(w * h * 4) };
                },
                putImageData: function () {},
                createImageData: function (w, h)
                {
                    return { data: new Uint8ClampedArray(w * h * 4) };
                },
                setTransform: function () {},
                resetTransform: function () {},
                drawImage: function () {},
                save: function () {},
                restore: function () {},
                fillText: function () {},
                strokeText: function () {},
                measureText: function (text)
                {
                    return {
                        width: text ? text.length * 6 : 0,
                        actualBoundingBoxAscent: 8,
                        actualBoundingBoxDescent: 2
                    };
                },
                beginPath: function () {},
                moveTo: function () {},
                lineTo: function () {},
                closePath: function () {},
                stroke: function () {},
                fill: function () {},
                translate: function () {},
                scale: function () {},
                rotate: function () {},
                arc: function () {},
                arcTo: function () {},
                rect: function () {},
                clip: function () {},
                quadraticCurveTo: function () {},
                bezierCurveTo: function () {},
                ellipse: function () {},
                isPointInPath: function () { return false; },
                createLinearGradient: function () { return { addColorStop: function () {} }; },
                createRadialGradient: function () { return { addColorStop: function () {} }; },
                createPattern: function () { return {}; },
                transform: function () {},
                setLineDash: function () {},
                getLineDash: function () { return []; },
                globalAlpha: 1,
                globalCompositeOperation: 'source-over',
                fillStyle: '#000000',
                strokeStyle: '#000000',
                lineWidth: 1,
                lineCap: 'butt',
                lineJoin: 'miter',
                lineDashOffset: 0,
                miterLimit: 10,
                shadowBlur: 0,
                shadowColor: 'rgba(0, 0, 0, 0)',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                font: '10px sans-serif',
                textAlign: 'start',
                textBaseline: 'alphabetic',
                direction: 'ltr',
                imageSmoothingEnabled: true
            };
        }

        if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl')
        {
            return {
                canvas: this,
                getExtension: function () { return null; },
                getParameter: function () { return 0; },
                createBuffer: function () { return {}; },
                createFramebuffer: function () { return {}; },
                createProgram: function () { return {}; },
                createRenderbuffer: function () { return {}; },
                createShader: function () { return {}; },
                createTexture: function () { return {}; },
                bindBuffer: function () {},
                bindFramebuffer: function () {},
                bindRenderbuffer: function () {},
                bindTexture: function () {},
                blendFunc: function () {},
                bufferData: function () {},
                clear: function () {},
                clearColor: function () {},
                compileShader: function () {},
                deleteBuffer: function () {},
                deleteFramebuffer: function () {},
                deleteProgram: function () {},
                deleteRenderbuffer: function () {},
                deleteShader: function () {},
                deleteTexture: function () {},
                disable: function () {},
                enable: function () {},
                drawArrays: function () {},
                drawElements: function () {},
                enableVertexAttribArray: function () {},
                framebufferTexture2D: function () {},
                getAttribLocation: function () { return 0; },
                getProgramParameter: function () { return true; },
                getShaderParameter: function () { return true; },
                getUniformLocation: function () { return {}; },
                linkProgram: function () {},
                pixelStorei: function () {},
                shaderSource: function () {},
                texImage2D: function () {},
                texParameteri: function () {},
                uniform1f: function () {},
                uniform1i: function () {},
                uniform2f: function () {},
                uniform3f: function () {},
                uniform4f: function () {},
                uniformMatrix3fv: function () {},
                uniformMatrix4fv: function () {},
                useProgram: function () {},
                vertexAttribPointer: function () {},
                viewport: function () {},
                scissor: function () {},
                activeTexture: function () {},
                ARRAY_BUFFER: 34962,
                ELEMENT_ARRAY_BUFFER: 34963,
                STATIC_DRAW: 35044,
                FLOAT: 5126,
                UNSIGNED_SHORT: 5123,
                TRIANGLES: 4,
                TRIANGLE_STRIP: 5,
                NEAREST: 9728,
                LINEAR: 9729,
                TEXTURE_2D: 3553,
                RGBA: 6408,
                UNSIGNED_BYTE: 5121,
                BLEND: 3042,
                DEPTH_TEST: 2929,
                STENCIL_TEST: 2960,
                SCISSOR_TEST: 3089,
                TEXTURE0: 33984,
                FRAMEBUFFER: 36160,
                COLOR_ATTACHMENT0: 36064,
                COLOR_BUFFER_BIT: 16384,
                DEPTH_BUFFER_BIT: 256,
                STENCIL_BUFFER_BIT: 1024,
                MAX_TEXTURE_SIZE: 3379,
                MAX_TEXTURE_IMAGE_UNITS: 34930,
                drawingBufferWidth: 800,
                drawingBufferHeight: 600
            };
        }

        return null;
    };
}
