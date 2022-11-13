export class Dispatcher {
    constructor(element) {
        this.element = element;
    }
    dispatch(type, properties) {
        let event = new Event(type);  // Event, CustomEvent
        for (let name in properties) {
            event[name] = properties[name];
        }
        this.element.dispatchEvent(event);
    }
}