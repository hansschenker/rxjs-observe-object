const { Subject } = require("rxjs");

export function source(operations) {

    const subject = new Subject();
    const source = subject.pipe(operations);
  
    const handler = (...args) => subject.next(...args);
    handler[observable] = () => source;
    return handler;
}
