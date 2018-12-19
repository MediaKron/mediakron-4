/**
 * Clones an object
 */
export default function recursiveClone(object, cache = []) {
    // just return if obj is immutable value
    if (object === null || typeof object !== 'object') {
        return object;
    }

    // If we find the object in the cache copy, 
    // don't go any further
    var found = cache.find(c => c.original === object);
    if (found) {
        return found.copy;
    }

    // Check to see if the object is 
    const copy = Array.isArray(object) ? [] : {};
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
        original: object,
        copy,
    });

    Object.keys(object).forEach(key => {
        copy[key] = recursiveClone(object[key], cache);
    });

    return copy;
}
