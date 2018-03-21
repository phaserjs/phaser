export default class BatchManager {
    renderer: any;
    currentBatch: any;
    drawImageBatch: any;
    singleTextureBatch: any;
    gl: any;
    constructor(renderer: any, batchSize: any);
    init(): void;
    start(): void;
    stop(): void;
    setBatch(newBatch: any): boolean;
    add(source: any, blendMode: any): void;
    destroy(): void;
}
