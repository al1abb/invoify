"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    clearManifestCache: null,
    evalManifest: null,
    loadManifest: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    clearManifestCache: function() {
        return clearManifestCache;
    },
    evalManifest: function() {
        return evalManifest;
    },
    loadManifest: function() {
        return loadManifest;
    }
});
const _fs = require("fs");
const _vm = require("vm");
const cache = new Map();
function loadManifest(path, shouldCache = true) {
    const cached = shouldCache && cache.get(path);
    if (cached) {
        return cached;
    }
    const manifest = JSON.parse((0, _fs.readFileSync)(path, "utf8"));
    if (shouldCache) {
        cache.set(path, manifest);
    }
    return manifest;
}
function evalManifest(path, shouldCache = true) {
    const cached = shouldCache && cache.get(path);
    if (cached) {
        return cached;
    }
    const content = (0, _fs.readFileSync)(path, "utf8");
    if (content.length === 0) {
        throw new Error("Manifest file is empty");
    }
    const contextObject = {};
    (0, _vm.runInNewContext)(content, contextObject);
    if (shouldCache) {
        cache.set(path, contextObject);
    }
    return contextObject;
}
function clearManifestCache(path) {
    return cache.delete(path);
}

//# sourceMappingURL=load-manifest.js.map