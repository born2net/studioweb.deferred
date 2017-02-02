import {Subscriber} from "rxjs";
export function Once(milliseconds: number = 0) {
    return function (target, key, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            var sub = originalMethod.apply(this, args);
            setTimeout(() => {
                if (sub instanceof Subscriber) {
                    sub.unsubscribe();
                } else {
                    sub()
                }
            }, milliseconds);
        };
        return descriptor;
    }
}