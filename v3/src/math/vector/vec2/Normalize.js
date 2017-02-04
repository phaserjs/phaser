let vec2 = Float32Array;

export default function (a, dst = new vec2(2)) {

    const x = a[0];
    const y = a[1];
    const lsq = x * x + y * y;

    if (lsq > 0)
    {
        const lr = 1 / Math.sqrt(lsq);

        dst[0] = x * lr;
        dst[1] = y * lr;
    }
    else
    {
        dst[0] = 0;
        dst[1] = 0;
    }

    return dst;

}
