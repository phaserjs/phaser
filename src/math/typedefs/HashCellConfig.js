/**
 * @typedef {object} Phaser.Types.Math.HashCellConfig
 * @since 4.0.0
 *
 * @property {number} [algorithm=0] - The algorithm to use. 0 is TRIG. 1 is PCG. 2 is PCG_FLOAT.
 * @property {number[]} [noiseCells=[ 32, 32, 32, 32 ]] - The number of cells in the range 0-1, on each axis (XYZW). Unused axes need not be defined.
 * @property {boolean|number[]} [noiseWrap=true] - Whether to wrap the cells smoothly. If a number array, the cells repeat after that many. If `true, the wrap is set to equal `noiseCells`.
 * @property {number[]} [noiseVariation=[ 1, 1, 1, 1 ]] - The variation of the cells away from a perfect grid. Unused axes need not be defined.
 * @property {number} [noiseIterations=1] - How many octaves of noise to render, creating a more detailed output.
 * @property {number} [noiseMode=0] - Which mode to render. 0 is sharp edged cells. 1 is flat colored cells. 2 is soft edged cells.
 * @property {number} [noiseSmoothing=1] - How smooth to render in mode 2.
 * @property {number[]} [noiseSeed=[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ]] - The seed which determines the cell pattern. A different seed creates an entirely different pattern. You only need numbers equal to the square of the input vector's length (1, 4, 9, or 16).
 */
