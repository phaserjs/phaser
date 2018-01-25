let vec2 = Float32Array;

export default function (src, dst = new vec2(2)) {

    dst[0] = src[0];
    dst[1] = src[1];

    return dst;

}
