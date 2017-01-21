export function timeout( milliseconds: number = 0 ) {

    return function( target, key, descriptor ) {

        var originalMethod = descriptor.value;

        descriptor.value = function (...args) {

            setTimeout(() => {
                originalMethod.apply(this, args);
            }, milliseconds);

        };

        return descriptor;
    }


}