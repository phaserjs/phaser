/**
 * Hash a number or list of numbers to a simplex noise value.
 *
 * A hash is an unpredictable transformation of an input,
 * which always returns the same output from the same input.
 * It is useful for generating random data in a predictable way.
 *
 * The output is in the range -1 to 1.
 *
 * You can set the config object to control the output.
 * You can add octaves of detail, add a turbulent warp,
 * adjust gradient flow, and set a randomness seed.
 *
 * Simplex noise is an evolution of Perlin noise, both invented by Ken Perlin.
 * It is a form of gradient noise, which forms a smooth, continuous field:
 * very similar inputs produce very similar outputs, although the field
 * itself is still random.
 *
 * Simplex noise works by assigning random gradients to points on a grid,
 * splitting space into grid cells (using a minimal triangular shape called a simplex),
 * identifying which grid cell the input belongs to,
 * and blending between the gradients of that simplex.
 *
 * This version uses a flow parameter to animate the noise field.
 * The flow value rotates gradients in place, creating a periodic
 * shifting pattern.
 *
 * This implementation deliberately copies the shaders used in the
 * `NoiseSimplex2D` and `NoiseSimplex3D` game object shaders.
 * They behave in similar fashion, and the config objects are very similar.
 * HashSimplex does not support value factor/add/power terms,
 * as you can simply process the output yourself.
 *
 * HashSimplex also supports 1-dimensional input.
 * This is automatically padded to 2 dimensions.
 *
 * Simplex performance varies depending on octaves and warp settings.
 * You might compute a thousand or so hashes per millisecond,
 * depending on device and workload.
 *
 * Note: If you specify dimensional properties in the config parameter,
 * ensure they are at least as long as the input vector.
 * Missing values can corrupt the result.
 *
 * Disclaimer: This function is intended for efficiently generating visual
 * variety. It is not intended for cryptographic use. Do not use it for
 * security/authentication/encryption purposes. Use a proper tool instead.
 *
 * @example
 * // Create a smoothly shifting field of points.
 * // Use noiseSeed to get different outputs from the same inputs.
 * for (let x = 0; x < 800; x += 8)
 * {
 *     for (let y = 0; y < 600; y += 8)
 *     {
 *         this.add.rectangle(
 *             Phaser.Math.HashSimplex([ x, y ], { noiseSeed: [ 1, 2 ] }) * 8,
 *             Phaser.Math.HashSimplex([ x, y ], { noiseSeed: [ 3, 4 ] }) * 8,
 *             2,
 *             2,
 *             0xffffff
 *         );
 *     }
 * }
 *
 * @function Phaser.Math.HashSimplex
 * @since 4.0.0
 *
 * @param {number | number[]} vector - The input vector to hash. 1 to 3 numbers.
 * @param {Phaser.Types.Math.HashSimplexConfig} [config] - The configuration of the noise field.
 *
 * @return {number} A noise value in the range -1 to 1.
 */
var HashSimplex = function (vector, config)
{
    if (typeof vector === 'number') { vector = [ vector ]; }
    if (!config) { config = {}; }

    var axes = Math.min(3, vector.length);
    var value = 0;

    // Support 1D input.
    while (axes < 2)
    {
        vector.push(0);
        axes++;
    }

    // Match the config names used by the shaders and typedefs.
    var iterations = config.noiseIterations || 1;
    var warpIterations = config.noiseWarpIterations || 1;

    var detailPower = config.noiseDetailPower || 2;
    var flowPower = config.noiseFlowPower || 2;
    var contributionPower = config.noiseContributionPower || 2;

    var warpDetailPower = config.noiseWarpDetailPower || 2;
    var warpFlowPower = config.noiseWarpFlowPower || 2;
    var warpContributionPower = config.noiseWarpContributionPower || 2;

    var cells = config.noiseCells || [ 32, 32, 32 ];
    var offset = config.noiseOffset || [ 0, 0, 0 ];
    var warpAmount = config.noiseWarpAmount || 0;
    if (config.noiseSeed)
    {
        var defaultSeed = [ 1, 2, 3 ];
        for (var i = 0; i < axes; i++)
        {
            seed[i] = config.noiseSeed[i] === undefined ? defaultSeed[i] : config.noiseSeed[i];
        }
    }

    for (i = 0; i < axes; i++)
    {
        coord[i] = vector[i] * cells[i] + offset[i];
    }

    // Optional warping pass, mirroring the shader behaviour.
    if (warpAmount > 0 && warpIterations > 0 && axes >= 2)
    {
        if (axes === 2)
        {
            // 2D warp uses two offset coordinates.
            var warpCoord1 = iterate(warpIterations, 2, coord, config, warpDetailPower, warpFlowPower, warpContributionPower);

            itCoord[0] = coord[0] + o2[0];
            itCoord[1] = coord[1] + o2[1];

            var warpCoord2 = iterate(warpIterations, 2, itCoord, config, warpDetailPower, warpFlowPower, warpContributionPower);

            coord[0] += warpCoord1 * warpAmount;
            coord[1] += warpCoord2 * warpAmount;
        }
        else if (axes === 3)
        {
            // 3D warp uses three offset coordinates.
            var warp3DCoord1 = iterate(warpIterations, 3, coord, config, warpDetailPower, warpFlowPower, warpContributionPower);

            itCoord[0] = coord[0] + o2[0];
            itCoord[1] = coord[1] + o2[1];
            itCoord[2] = coord[2] + o2[2];

            var warp3DCoord2 = iterate(warpIterations, 3, itCoord, config, warpDetailPower, warpFlowPower, warpContributionPower);

            itCoord[0] = coord[0] + o3[0];
            itCoord[1] = coord[1] + o3[1];
            itCoord[2] = coord[2] + o3[2];

            var warp3DCoord3 = iterate(warpIterations, 3, itCoord, config, warpDetailPower, warpFlowPower, warpContributionPower);

            coord[0] += warp3DCoord1 * warpAmount;
            coord[1] += warp3DCoord2 * warpAmount;
            coord[2] += warp3DCoord3 * warpAmount;
        }
    }

    value = iterate(iterations, axes, coord, config, detailPower, flowPower, contributionPower);

    return value;
};

var coord = [ 0, 0, 0 ];
var itCoord = [ 0, 0, 0 ];
var itPeriod = [ 0, 0, 0 ];
var o2 = [ 11.3, 23.7, 13.1 ];
var o3 = [ 29.9, 2.3, 31.7 ];
var seed = [ 0, 0, 0 ];

var iterate = function (iterations, axes, coord, config, detailPower, flowPower, contributionPower)
{
    var i;
    var value = 0;
    var itValue = 0;
    var baseCells = config.noiseCells || [ 32, 32, 32 ];
    var period = config.noisePeriod || baseCells;
    var flow = config.noiseFlow || 0;

    for (var iteration = 0; iteration < iterations; iteration++)
    {
        var detailScale = Math.pow(detailPower, iteration);
        var flowScale = Math.pow(flowPower, iteration);
        for (i = 0; i < axes; i++)
        {
            itCoord[i] = (coord[i] + iteration) * detailScale;
        }
        for (i = 0; i < axes; i++)
        {
            itPeriod[i] = period[i] * detailScale;
        }

        if (axes === 2)
        {
            itValue = psrdnoise2d(itCoord, itPeriod, flow * flowScale + iteration);
        }
        else if (axes === 3)
        {
            itValue = psrdnoise3d(itCoord, itPeriod, flow * flowScale + iteration);
        }

        value += itValue / Math.pow(contributionPower, iteration);
    }
    return value;
};

// The noise functions are derived from
// https://github.com/stegu/psrdnoise/,
// specifically psrdnoise2.glsl and
// psrdnoise3.glsl, version 2021-12-02
// Copyright (c) 2021 Stefan Gustavson and Ian McEwan
// (stefan.gustavson@liu.se, ijm567@gmail.com)
// Published under the MIT license, see:
// https://opensource.org/licenses/MIT

// Temporary module-scope containers for composite data types
var _psrd2d = {
    uv: { x: 0, y: 0 },
    i0: { x: 0, y: 0 },
    f0: { x: 0, y: 0 },
    o1: { x: 0, y: 0 },
    i1: { x: 0, y: 0 }, i2: { x: 0, y: 0 },
    v0: { x: 0, y: 0 }, v1: { x: 0, y: 0 }, v2: { x: 0, y: 0 },
    x0: { x: 0, y: 0 }, x1: { x: 0, y: 0 }, x2: { x: 0, y: 0 },

    // For vec3's
    iu: [ 0, 0, 0 ], iv: [ 0, 0, 0 ], xw: [ 0, 0, 0 ], yw: [ 0, 0, 0 ],
    hash: [ 0, 0, 0 ],
    psi: [ 0, 0, 0 ], gx: [ 0, 0, 0 ], gy: [ 0, 0, 0 ],
    g0: { x: 0, y: 0 }, g1: { x: 0, y: 0 }, g2: { x: 0, y: 0 },
    w: [ 0, 0, 0 ], w2: [ 0, 0, 0 ], w4: [ 0, 0, 0 ],
    gdotx: [ 0, 0, 0 ]
};

function dot2 (a, b) { return a.x * b.x + a.y * b.y; }

var psrdnoise2d = function (x, period, alpha)
{
    var i;
    var uv = _psrd2d.uv;
    var i0 = _psrd2d.i0;
    var f0 = _psrd2d.f0;
    var o1 = _psrd2d.o1;
    var i1 = _psrd2d.i1;
    var i2 = _psrd2d.i2;
    var v0 = _psrd2d.v0;
    var v1 = _psrd2d.v1;
    var v2 = _psrd2d.v2;
    var x0 = _psrd2d.x0;
    var x1 = _psrd2d.x1;
    var x2 = _psrd2d.x2;
    var iu = _psrd2d.iu;
    var iv = _psrd2d.iv;
    var xw = _psrd2d.xw;
    var yw = _psrd2d.yw;
    var hash = _psrd2d.hash;
    var psi = _psrd2d.psi;
    var gx = _psrd2d.gx;
    var gy = _psrd2d.gy;
    var g0 = _psrd2d.g0;
    var g1 = _psrd2d.g1;
    var g2 = _psrd2d.g2;
    var w = _psrd2d.w;
    var w2 = _psrd2d.w2;
    var w4 = _psrd2d.w4;
    var gdotx = _psrd2d.gdotx;

    // 2. Transform input point to find simplex "base" i0.
    // x is [ x, y ], period is [ x, y ]
    var xx = x[0];
    var xy = x[1];

    uv.x = xx + xy * 0.5;
    uv.y = xy;

    i0.x = Math.floor(uv.x);
    i0.y = Math.floor(uv.y);

    f0.x = uv.x - i0.x;
    f0.y = uv.y - i0.y;

    // 3. Enumerate simplex corners and transform back.
    var cmp = (f0.y <= f0.x) ? 1 : 0;
    o1.x = cmp;
    o1.y = 1.0 - cmp;
    i1.x = i0.x + o1.x;
    i1.y = i0.y + o1.y;
    i2.x = i0.x + 1.0;
    i2.y = i0.y + 1.0;

    v0.x = i0.x - i0.y * 0.5;
    v0.y = i0.y;

    v1.x = v0.x + o1.x - o1.y * 0.5;
    v1.y = v0.y + o1.y;

    v2.x = v0.x + 0.5;
    v2.y = v0.y + 1.0;

    // 4. Compute distances to corners before we wrap them.
    x0.x = xx - v0.x; x0.y = xy - v0.y;
    x1.x = xx - v1.x; x1.y = xy - v1.y;
    x2.x = xx - v2.x; x2.y = xy - v2.y;

    // 5, 6. wrap to period and adjust i0, i1, i2 accordingly.
    var hasPeriod = (period[0] > 0) || (period[1] > 0);
    if (hasPeriod)
    {
        xw[0] = v0.x; xw[1] = v1.x; xw[2] = v2.x;
        yw[0] = v0.y; yw[1] = v1.y; yw[2] = v2.y;
        if (period[0] > 0.0)
        {
            xw[0] = ((v0.x % period[0]) + period[0]) % period[0];
            xw[1] = ((v1.x % period[0]) + period[0]) % period[0];
            xw[2] = ((v2.x % period[0]) + period[0]) % period[0];
        }
        if (period[1] > 0.0)
        {
            yw[0] = ((v0.y % period[1]) + period[1]) % period[1];
            yw[1] = ((v1.y % period[1]) + period[1]) % period[1];
            yw[2] = ((v2.y % period[1]) + period[1]) % period[1];
        }
        for (i = 0; i < 3; i++)
        {
            iu[i] = Math.floor(xw[i] + 0.5 * yw[i] + 0.5);
            iv[i] = Math.floor(yw[i] + 0.5);
        }
    }
    else
    {
        iu[0] = i0.x; iu[1] = i1.x; iu[2] = i2.x;
        iv[0] = i0.y; iv[1] = i1.y; iv[2] = i2.y;
    }

    // Custom: Seed the noise.
    iu[0] += seed[0]; iu[1] += seed[0]; iu[2] += seed[0];
    iv[0] += seed[1]; iv[1] += seed[1]; iv[2] += seed[1];

    // 7. Compute the hash for each of the simplex corners.
    for (i = 0; i < 3; i++)
    {
        hash[i] = iu[i] % 289.0;
        if (hash[i] < 0) { hash[i] += 289.0; }
    }
    for (i = 0; i < 3; i++)
    {
        hash[i] = (((hash[i] * 51.0 + 2.0) * hash[i]) + iv[i]) % 289.0;
    }
    for (i = 0; i < 3; i++)
    {
        hash[i] = (((hash[i] * 34.0 + 10.0) * hash[i])) % 289.0;
    }

    // 8, 9a. Generate the gradients with an optional rotation.
    for (i = 0; i < 3; i++)
    {
        psi[i] = hash[i] * 0.07482 + alpha;
        gx[i] = Math.cos(psi[i]);
        gy[i] = Math.sin(psi[i]);
    }
    g0.x = gx[0]; g0.y = gy[0];
    g1.x = gx[1]; g1.y = gy[1];
    g2.x = gx[2]; g2.y = gy[2];

    // 10. Compute radial falloff.
    w[0] = 0.8 - dot2(x0, x0);
    w[1] = 0.8 - dot2(x1, x1);
    w[2] = 0.8 - dot2(x2, x2);
    for (i = 0; i < 3; i++)
    {
        w[i] = Math.max(w[i], 0.0);
        w2[i] = w[i] * w[i];
        w4[i] = w2[i] * w2[i];
    }

    // 11. Linear ramp along gradient (by a scalar product)
    gdotx[0] = dot2(g0, x0);
    gdotx[1] = dot2(g1, x1);
    gdotx[2] = dot2(g2, x2);

    // 12, 13. Multiply and sum up noise terms.
    var n = w4[0] * gdotx[0] + w4[1] * gdotx[1] + w4[2] * gdotx[2];

    // Scale the noise value to [-1,1] (empirical factor).
    return 10.9 * n;
};

// --- 3D psrdnoise implementation (port of psrdnoise3.glsl) ---

var _psrd3d = {
    // Temporary containers to avoid allocations.
    uvw: [ 0, 0, 0 ],
    i0: [ 0, 0, 0 ],
    f0: [ 0, 0, 0 ],
    g_: [ 0, 0, 0 ],
    l_: [ 0, 0, 0 ],
    g: [ 0, 0, 0 ],
    l: [ 0, 0, 0 ],
    o1: [ 0, 0, 0 ],
    o2: [ 0, 0, 0 ],
    i1: [ 0, 0, 0 ],
    i2: [ 0, 0, 0 ],
    i3: [ 0, 0, 0 ],
    v0: [ 0, 0, 0 ],
    v1: [ 0, 0, 0 ],
    v2: [ 0, 0, 0 ],
    v3: [ 0, 0, 0 ],
    x0: [ 0, 0, 0 ],
    x1: [ 0, 0, 0 ],
    x2: [ 0, 0, 0 ],
    x3: [ 0, 0, 0 ],
    vx: [ 0, 0, 0, 0 ],
    vy: [ 0, 0, 0, 0 ],
    vz: [ 0, 0, 0, 0 ],
    hash: [ 0, 0, 0, 0 ],
    theta: [ 0, 0, 0, 0 ],
    sz: [ 0, 0, 0, 0 ],
    psi: [ 0, 0, 0, 0 ],
    Ct: [ 0, 0, 0, 0 ],
    St: [ 0, 0, 0, 0 ],
    szp: [ 0, 0, 0, 0 ],
    gx: [ 0, 0, 0, 0 ],
    gy: [ 0, 0, 0, 0 ],
    gz: [ 0, 0, 0, 0 ],
    px: [ 0, 0, 0, 0 ],
    py: [ 0, 0, 0, 0 ],
    pz: [ 0, 0, 0, 0 ],
    Sp: [ 0, 0, 0, 0 ],
    Cp: [ 0, 0, 0, 0 ],
    Ctp: [ 0, 0, 0, 0 ],
    qx: [ 0, 0, 0, 0 ],
    qy: [ 0, 0, 0, 0 ],
    qz: [ 0, 0, 0, 0 ],
    Sa: [ 0, 0, 0, 0 ],
    Ca: [ 0, 0, 0, 0 ],
    w: [ 0, 0, 0, 0 ],
    w2: [ 0, 0, 0, 0 ],
    w3: [ 0, 0, 0, 0 ],
    gdotx: [ 0, 0, 0, 0 ]
};

var permute4 = function (i, out)
{
    // out = mod(((im * 34.0) + 10.0) * im, 289.0);
    for (var k = 0; k < 4; k++)
    {
        var im = i[k] % 289.0;

        if (im < 0) { im += 289.0; }

        out[k] = (((im * 34.0) + 10.0) * im) % 289.0;
    }
};

var psrdnoise3d = function (x, period, alpha)
{
    var uvw = _psrd3d.uvw;
    var i0 = _psrd3d.i0;
    var f0 = _psrd3d.f0;
    var g_ = _psrd3d.g_;
    var l_ = _psrd3d.l_;
    var g = _psrd3d.g;
    var l = _psrd3d.l;
    var o1 = _psrd3d.o1;
    var o2 = _psrd3d.o2;
    var i1 = _psrd3d.i1;
    var i2 = _psrd3d.i2;
    var i3 = _psrd3d.i3;
    var v0 = _psrd3d.v0;
    var v1 = _psrd3d.v1;
    var v2 = _psrd3d.v2;
    var v3 = _psrd3d.v3;
    var x0 = _psrd3d.x0;
    var x1 = _psrd3d.x1;
    var x2 = _psrd3d.x2;
    var x3 = _psrd3d.x3;
    var vx = _psrd3d.vx;
    var vy = _psrd3d.vy;
    var vz = _psrd3d.vz;
    var hash = _psrd3d.hash;
    var theta = _psrd3d.theta;
    var sz = _psrd3d.sz;
    var psi = _psrd3d.psi;
    var Ct = _psrd3d.Ct;
    var St = _psrd3d.St;
    var szp = _psrd3d.szp;
    var gx = _psrd3d.gx;
    var gy = _psrd3d.gy;
    var gz = _psrd3d.gz;
    var px = _psrd3d.px;
    var py = _psrd3d.py;
    var pz = _psrd3d.pz;
    var Sp = _psrd3d.Sp;
    var Cp = _psrd3d.Cp;
    var Ctp = _psrd3d.Ctp;
    var qx = _psrd3d.qx;
    var qy = _psrd3d.qy;
    var qz = _psrd3d.qz;
    var Sa = _psrd3d.Sa;
    var Ca = _psrd3d.Ca;
    var w = _psrd3d.w;
    var w2 = _psrd3d.w2;
    var w3 = _psrd3d.w3;
    var gdotx = _psrd3d.gdotx;

    // 2. Transform to simplex space and find simplex "base" i0.
    // uvw = M * x, where M is the 3x3 matrix in the GLSL code.

    uvw[0] = 0 * x[0] + 1 * x[1] + 1 * x[2];
    uvw[1] = 1 * x[0] + 0 * x[1] + 1 * x[2];
    uvw[2] = 1 * x[0] + 1 * x[1] + 0 * x[2];

    for (var i = 0; i < 3; i++)
    {
        i0[i] = Math.floor(uvw[i]);
        f0[i] = uvw[i] - i0[i];
    }

    // 3. Enumerate simplex corners and transform back.
    // g_ = step(f0.xyx, f0.yzz);
    g_[0] = (f0[0] > f0[1]) ? 0 : 1;
    g_[1] = (f0[1] > f0[2]) ? 0 : 1;
    g_[2] = (f0[0] > f0[2]) ? 0 : 1;

    l_[0] = 1.0 - g_[0];
    l_[1] = 1.0 - g_[1];
    l_[2] = 1.0 - g_[2];

    g[0] = l_[2];
    g[1] = g_[0];
    g[2] = g_[1];

    l[0] = l_[0];
    l[1] = l_[1];
    l[2] = g_[2];

    for (i = 0; i < 3; i++)
    {
        o1[i] = Math.min(g[i], l[i]);
        o2[i] = Math.max(g[i], l[i]);
    }

    for (i = 0; i < 3; i++)
    {
        i1[i] = i0[i] + o1[i];
        i2[i] = i0[i] + o2[i];
        i3[i] = i0[i] + 1.0;
    }

    // v* = Mi * i*, where Mi is the inverse matrix.
    // Mi rows: [-0.5,  0.5,  0.5]
    //          [ 0.5, -0.5,  0.5]
    //          [ 0.5,  0.5, -0.5]
    var ix0 = i0[0];
    var iy0 = i0[1];
    var iz0 = i0[2];
    var ix1 = i1[0];
    var iy1 = i1[1];
    var iz1 = i1[2];
    var ix2 = i2[0];
    var iy2 = i2[1];
    var iz2 = i2[2];
    var ix3 = i3[0];
    var iy3 = i3[1];
    var iz3 = i3[2];

    v0[0] = -0.5 * ix0 + 0.5 * iy0 + 0.5 * iz0;
    v0[1] = 0.5 * ix0 - 0.5 * iy0 + 0.5 * iz0;
    v0[2] = 0.5 * ix0 + 0.5 * iy0 - 0.5 * iz0;

    v1[0] = -0.5 * ix1 + 0.5 * iy1 + 0.5 * iz1;
    v1[1] = 0.5 * ix1 - 0.5 * iy1 + 0.5 * iz1;
    v1[2] = 0.5 * ix1 + 0.5 * iy1 - 0.5 * iz1;

    v2[0] = -0.5 * ix2 + 0.5 * iy2 + 0.5 * iz2;
    v2[1] = 0.5 * ix2 - 0.5 * iy2 + 0.5 * iz2;
    v2[2] = 0.5 * ix2 + 0.5 * iy2 - 0.5 * iz2;

    v3[0] = -0.5 * ix3 + 0.5 * iy3 + 0.5 * iz3;
    v3[1] = 0.5 * ix3 - 0.5 * iy3 + 0.5 * iz3;
    v3[2] = 0.5 * ix3 + 0.5 * iy3 - 0.5 * iz3;

    // 4. Compute distances to corners before we wrap.
    for (i = 0; i < 3; i++)
    {
        x0[i] = x[i] - v0[i];
        x1[i] = x[i] - v1[i];
        x2[i] = x[i] - v2[i];
        x3[i] = x[i] - v3[i];
    }

    // 5, 6. Wrap to periods and update i0, i1, i2, i3 accordingly.
    var hasPeriod = (period[0] > 0) || (period[1] > 0) || (period[2] > 0);

    if (hasPeriod)
    {
        vx[0] = v0[0]; vx[1] = v1[0]; vx[2] = v2[0]; vx[3] = v3[0];
        vy[0] = v0[1]; vy[1] = v1[1]; vy[2] = v2[1]; vy[3] = v3[1];
        vz[0] = v0[2]; vz[1] = v1[2]; vz[2] = v2[2]; vz[3] = v3[2];

        if (period[0] > 0.0)
        {
            for (i = 0; i < 4; i++)
            {
                vx[i] = ((vx[i] % period[0]) + period[0]) % period[0];
            }
        }

        if (period[1] > 0.0)
        {
            for (i = 0; i < 4; i++)
            {
                vy[i] = ((vy[i] % period[1]) + period[1]) % period[1];
            }
        }

        if (period[2] > 0.0)
        {
            for (i = 0; i < 4; i++)
            {
                vz[i] = ((vz[i] % period[2]) + period[2]) % period[2];
            }
        }

        // Recompute lattice coordinates from wrapped positions.
        // i* = floor(M * v* + 0.5);
        var rx0 = vx[0];
        var ry0 = vy[0];
        var rz0 = vz[0];
        var rx1 = vx[1];
        var ry1 = vy[1];
        var rz1 = vz[1];
        var rx2 = vx[2];
        var ry2 = vy[2];
        var rz2 = vz[2];
        var rx3 = vx[3];
        var ry3 = vy[3];
        var rz3 = vz[3];

        i0[0] = Math.floor(0 * rx0 + 1 * ry0 + 1 * rz0 + 0.5);
        i0[1] = Math.floor(1 * rx0 + 0 * ry0 + 1 * rz0 + 0.5);
        i0[2] = Math.floor(1 * rx0 + 1 * ry0 + 0 * rz0 + 0.5);

        i1[0] = Math.floor(0 * rx1 + 1 * ry1 + 1 * rz1 + 0.5);
        i1[1] = Math.floor(1 * rx1 + 0 * ry1 + 1 * rz1 + 0.5);
        i1[2] = Math.floor(1 * rx1 + 1 * ry1 + 0 * rz1 + 0.5);

        i2[0] = Math.floor(0 * rx2 + 1 * ry2 + 1 * rz2 + 0.5);
        i2[1] = Math.floor(1 * rx2 + 0 * ry2 + 1 * rz2 + 0.5);
        i2[2] = Math.floor(1 * rx2 + 1 * ry2 + 0 * rz2 + 0.5);

        i3[0] = Math.floor(0 * rx3 + 1 * ry3 + 1 * rz3 + 0.5);
        i3[1] = Math.floor(1 * rx3 + 0 * ry3 + 1 * rz3 + 0.5);
        i3[2] = Math.floor(1 * rx3 + 1 * ry3 + 0 * rz3 + 0.5);
    }

    // Custom: Seed the noise.
    i0[0] += seed[0]; i0[1] += seed[1]; i0[2] += seed[2];
    i1[0] += seed[0]; i1[1] += seed[1]; i1[2] += seed[2];
    i2[0] += seed[0]; i2[1] += seed[1]; i2[2] += seed[2];
    i3[0] += seed[0]; i3[1] += seed[1]; i3[2] += seed[2];

    // 7. Compute hash for each of the four corners.
    // hash = permute(permute(permute(vec4(i0.z, i1.z, i2.z, i3.z)) + vec4(i0.y, i1.y, i2.y, i3.y)) + vec4(i0.x, i1.x, i2.x, i3.x));
    var t0 = _psrd3d.vx; // reuse as temp vec4
    var t1 = _psrd3d.vy; // reuse as temp vec4

    t0[0] = i0[2]; t0[1] = i1[2]; t0[2] = i2[2]; t0[3] = i3[2];
    permute4(t0, t1);

    t1[0] += i0[1];
    t1[1] += i1[1];
    t1[2] += i2[1];
    t1[3] += i3[1];

    permute4(t1, t0);

    t0[0] += i0[0];
    t0[1] += i1[0];
    t0[2] += i2[0];
    t0[3] += i3[0];

    permute4(t0, hash);

    // 8. Compute rotating gradients using the "well-behaved" method.
    for (i = 0; i < 4; i++)
    {
        theta[i] = hash[i] * 3.883222077;
        sz[i] = 0.996539792 - 0.006920415 * hash[i];
        psi[i] = hash[i] * 0.108705628;
        Ct[i] = Math.cos(theta[i]);
        St[i] = Math.sin(theta[i]);
        szp[i] = Math.sqrt(Math.max(0, 1.0 - sz[i] * sz[i]));
    }

    if (alpha !== 0.0)
    {
        for (i = 0; i < 4; i++)
        {
            px[i] = Ct[i] * szp[i];
            py[i] = St[i] * szp[i];
            pz[i] = sz[i];

            Sp[i] = Math.sin(psi[i]);
            Cp[i] = Math.cos(psi[i]);

            Ctp[i] = St[i] * Sp[i] - Ct[i] * Cp[i];

            qx[i] = (1 - sz[i]) * (Ctp[i] * St[i]) + sz[i] * Sp[i];
            qy[i] = (1 - sz[i]) * (-Ctp[i] * Ct[i]) + sz[i] * Cp[i];
            qz[i] = -(py[i] * Cp[i] + px[i] * Sp[i]);

            Sa[i] = Math.sin(alpha);
            Ca[i] = Math.cos(alpha);

            gx[i] = Ca[i] * px[i] + Sa[i] * qx[i];
            gy[i] = Ca[i] * py[i] + Sa[i] * qy[i];
            gz[i] = Ca[i] * pz[i] + Sa[i] * qz[i];
        }
    }
    else
    {
        for (i = 0; i < 4; i++)
        {
            gx[i] = Ct[i] * szp[i];
            gy[i] = St[i] * szp[i];
            gz[i] = sz[i];
        }
    }

    // 10. Compute radial falloff.
    for (i = 0; i < 4; i++)
    {
        var dx0 = (i === 0) ? x0[0] : (i === 1) ? x1[0] : (i === 2) ? x2[0] : x3[0];
        var dy0 = (i === 0) ? x0[1] : (i === 1) ? x1[1] : (i === 2) ? x2[1] : x3[1];
        var dz0 = (i === 0) ? x0[2] : (i === 1) ? x1[2] : (i === 2) ? x2[2] : x3[2];

        var dot = dx0 * dx0 + dy0 * dy0 + dz0 * dz0;

        w[i] = 0.5 - dot;
        if (w[i] < 0.0)
        {
            w[i] = 0.0;
        }
        w2[i] = w[i] * w[i];
        w3[i] = w2[i] * w[i];
    }

    // 11. Linear ramps along gradients (by scalar product)
    for (i = 0; i < 4; i++)
    {
        var gxv = gx[i];
        var gyv = gy[i];
        var gzv = gz[i];

        var vx0 = (i === 0) ? x0[0] : (i === 1) ? x1[0] : (i === 2) ? x2[0] : x3[0];
        var vy0 = (i === 0) ? x0[1] : (i === 1) ? x1[1] : (i === 2) ? x2[1] : x3[1];
        var vz0 = (i === 0) ? x0[2] : (i === 1) ? x1[2] : (i === 2) ? x2[2] : x3[2];

        gdotx[i] = gxv * vx0 + gyv * vy0 + gzv * vz0;
    }

    // 12, 13. Multiply and sum up the four noise terms.
    var n = 0;

    for (i = 0; i < 4; i++)
    {
        n += w3[i] * gdotx[i];
    }

    // Scale noise value to range [-1,1] (empirical factor).
    return 39.5 * n;
};

module.exports = HashSimplex;
