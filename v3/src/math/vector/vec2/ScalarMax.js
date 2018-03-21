let vec2 = Float32Array;

export default function (a, b, dst = new vec2(2)) {

    dst[0] = Math.max(a[0], b);
    dst[1] = Math.max(a[1], b);

    return dst;

}
