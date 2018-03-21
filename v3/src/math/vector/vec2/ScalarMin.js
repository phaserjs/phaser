let vec2 = Float32Array;

export default function (a, b, dst = new vec2(2)) {

    dst[0] = Math.min(a[0], b);
    dst[1] = Math.min(a[1], b);

    return dst;

}
