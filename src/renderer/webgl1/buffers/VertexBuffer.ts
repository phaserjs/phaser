import { DeleteGLBuffer } from './DeleteGLBuffer';
import { IVertexBuffer } from './IVertexBuffer';
import { IVertexBufferConfig } from './IVertexBufferConfig';
import { gl } from '../GL';

export class VertexBuffer implements IVertexBuffer
{
    //  Handy for debug tracing
    name: string;

    /**
     * Maximum number of entries per batch before a flush takes place.
     * For a Mesh, this is the number of triangles / faces in the vertex buffer.
     * Typically each face consists of 3 verts.
     *
     * @type {number}
     */
    batchSize: number;

    /**
     * The size, in bytes, per entry in the array buffer.
     *
     * @type {number}
     */
    dataSize: number;

    /**
     * The amount of elements / floats a single vertex consists of.
     *
     * The default is 9:
     *
     * position (x,y - 2 floats)
     * texture coord (x,y - 2 floats)
     * texture index (uint)
     * red channel (float)
     * green channel (float)
     * blue channel (float)
     * alpha channel (float)
     *
     * @type {number}
     */
    vertexElementSize: number;

    /**
     * The size, in bytes, of a single vertex in the array buffer.
     *
     * This is `vertexElementSize * dataSize`.
     *
     * @type {number}
     */
    vertexByteSize: number;

    /**
     * The size, in bytes, of a single entry in the array buffer.
     *
     * This is `vertexByteSize * elementsPerEntry` for a quad.
     *
     * @type {number}
     */
    entryByteSize: number;

    /**
     * The size, in bytes, of the Array Buffer.
     *
     * This is `batchSize * entryByteSize`
     *
     * @type {number}
     */
    bufferByteSize: number;

    /**
     * The Array Buffer.
     *
     * @type {ArrayBuffer}
     */
    data: ArrayBuffer;

    /**
     * Float32 View of the Array Buffer.
     *
     * @type {Float32Array}
     */
    vertexViewF32: Float32Array;

    /**
     * The data array buffer.
     *
     * @type {WebGLBuffer}
     */
    vertexBuffer: WebGLBuffer;

    /**
     * The size, in quantity of elements, of a single entry in the element index array.
     *
     * This is `vertexElementSize * elementsPerEntry`
     *
     * @type {number}
     */
    entryElementSize: number;

    indexed: boolean = false;

    isDynamic: boolean = false;

    /**
     * The total number of entries added to the buffer so far, or reserved to be added.
     *
     * This is the total number of indices / verticies, not faces.
     * Typically there are 3 verts per face, so this value is usually batchSize x 3 for a Mesh.
     *
     * @type {number}
     */
    count: number = 0;

    /**
     * The current buffer offset.
     *
     * @type {number}
     */
    offset: number = 0;

    /**
     * The number of elements per entry in the buffer.
     *
     * This is 3 for a tri and 4 for a quad in an indexed buffer.
     *
     * @type {number}
     */
    elementsPerEntry: number;

    isBound: boolean = false;

    constructor (config: IVertexBufferConfig = {})
    {
        const {
            name = 'VBO',
            batchSize = 1,
            dataSize = 4,
            isDynamic = true,
            elementsPerEntry = 3,
            vertexElementSize = 9
        } = config;

        this.name = name;
        this.batchSize = batchSize;
        this.dataSize = dataSize;
        this.vertexElementSize = vertexElementSize;
        this.isDynamic = isDynamic;
        this.elementsPerEntry = elementsPerEntry;

        //  Derive the remaining values
        this.vertexByteSize = vertexElementSize * dataSize;
        this.entryByteSize = this.vertexByteSize * elementsPerEntry;
        this.bufferByteSize = batchSize * this.entryByteSize;
        this.entryElementSize = this.vertexElementSize * this.elementsPerEntry;

        this.create();
    }

    resize (batchSize: number): void
    {
        this.batchSize = batchSize;
        this.bufferByteSize = batchSize * this.entryByteSize;

        if (this.vertexBuffer)
        {
            DeleteGLBuffer(this.vertexBuffer);
        }

        this.create();
    }

    create (): void
    {
        const data = new ArrayBuffer(this.bufferByteSize);

        this.data = data;

        this.vertexViewF32 = new Float32Array(data);

        this.vertexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        const type = (this.isDynamic) ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

        gl.bufferData(gl.ARRAY_BUFFER, data, type);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.isBound = false;
    }

    add (count: number): void
    {
        this.count += count;
        this.offset += (this.vertexElementSize * count);
    }

    reset (): void
    {
        this.count = 0;
        this.offset = 0;
    }

    canContain (count: number): boolean
    {
        return ((this.count + count) <= this.batchSize);
    }

    free (): number
    {
        return Math.max(0, 1 - (this.count / this.batchSize));
    }

    bind (): void
    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    }

    destroy (): void
    {
        DeleteGLBuffer(this.vertexBuffer);

        this.data = null;
        this.vertexViewF32 = null;
        this.vertexBuffer = null;
    }
}
