import Event from '../../events/Event';
export default class LoaderStartEvent extends Event {
    loader: any;
    constructor(loader: any);
}
