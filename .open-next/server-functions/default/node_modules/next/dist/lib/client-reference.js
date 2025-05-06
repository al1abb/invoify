"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isClientReference", {
    enumerable: true,
    get: function() {
        return isClientReference;
    }
});
function isClientReference(reference) {
    return (reference == null ? void 0 : reference.$$typeof) === Symbol.for("react.client.reference");
}

//# sourceMappingURL=client-reference.js.map