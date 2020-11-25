interface Array<T> {
    last(predicate: (item: T) => boolean): T;
}

Array.prototype.last = function<T>(this: T[], predicate: (item: T) => boolean) {
    if(!this.length) {
        return undefined;
    }

    for(let i = this.length - 1; i >= 0; i--) {
        const iterable = this[i];
        if(predicate(iterable)) {
            return iterable;
        }
    }
}