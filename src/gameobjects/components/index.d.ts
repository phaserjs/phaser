/**
 * Type declaration for the components CJS barrel (index.js).
 *
 * Prevents TS9005/TS9006 declaration-emit errors that occur when a TypeScript
 * module imports this barrel and TypeScript tries to infer types through all
 * the plain-JS component files.
 *
 * Delete this file once the barrel itself is converted.
 */

type DescriptorBag = Record<string, unknown>;

interface Components {

    // --- Migrated components ---------------------------------------------------

    Depth: DescriptorBag;
    Visible: DescriptorBag;

    // --- Unmigrated components (descriptor bags) -------------------------------

    Alpha: DescriptorBag;
    AlphaSingle: DescriptorBag;
    BlendMode: DescriptorBag;
    ComputedSize: DescriptorBag;
    Crop: DescriptorBag;
    ElapseTimer: DescriptorBag;
    FilterList: DescriptorBag;
    Filters: DescriptorBag;
    Flip: DescriptorBag;
    GetBounds: DescriptorBag;
    Lighting: DescriptorBag;
    Mask: DescriptorBag;
    Origin: DescriptorBag;
    PathFollower: DescriptorBag;
    RenderNodes: DescriptorBag;
    RenderSteps: DescriptorBag;
    ScrollFactor: DescriptorBag;
    Size: DescriptorBag;
    Texture: DescriptorBag;
    TextureCrop: DescriptorBag;
    Tint: DescriptorBag;
    ToJSON: DescriptorBag;
    Transform: DescriptorBag;
    TransformMatrix: DescriptorBag;
}

// eslint-disable-next-line no-redeclare
declare const Components: Components;
export default Components;
