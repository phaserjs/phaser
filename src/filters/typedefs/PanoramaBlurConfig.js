/**
 * @typedef {object} Phaser.Types.Filters.PanoramaBlurConfig
 * @since 4.0.0
 *
 * @property {number} [radius=1] - The radius of the blur effect. 1 samples an entire hemisphere; 0 samples a single point.
 * @property {number} [samplesX=32] - The number of samples to take along the X axis. More samples produces a more accurate blur, but at the cost of performance. The X axis in a panorama is usually wider than the Y axis.
 * @property {number} [samplesY=16] - The number of samples to take along the Y axis. More samples produces a more accurate blur, but at the cost of performance.
 * @property {number} [power=1] - An exponent applied to samples. Power above 1 increases darkness, allowing brighter colors to dominate. Power below 1 increases brightness, reducing the influence of brighter colors. To simulate an HDR environment with bright sunlight that cannot be represented in sRGB color, use low power.
 */
