"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidiHTTPRequest = exports.requests = void 0;
const HTTPRequest_js_1 = require("../api/HTTPRequest.js");
const Errors_js_1 = require("../common/Errors.js");
const HTTPResponse_js_1 = require("./HTTPResponse.js");
exports.requests = new WeakMap();
/**
 * @internal
 */
class BidiHTTPRequest extends HTTPRequest_js_1.HTTPRequest {
    static from(bidiRequest, frame) {
        const request = new _a(bidiRequest, frame);
        request.#initialize();
        return request;
    }
    #redirect;
    #response = null;
    id;
    #frame;
    #request;
    constructor(request, frame) {
        super();
        exports.requests.set(request, this);
        this.#request = request;
        this.#frame = frame;
        this.id = request.id;
    }
    get client() {
        throw new Errors_js_1.UnsupportedOperation();
    }
    #initialize() {
        this.#request.on('redirect', request => {
            this.#redirect = _a.from(request, this.#frame);
        });
        this.#request.once('success', data => {
            this.#response = HTTPResponse_js_1.BidiHTTPResponse.from(data, this);
        });
        this.#frame?.page().trustedEmitter.emit("request" /* PageEvent.Request */, this);
    }
    url() {
        return this.#request.url;
    }
    resourceType() {
        return this.initiator().type.toLowerCase();
    }
    method() {
        return this.#request.method;
    }
    postData() {
        throw new Errors_js_1.UnsupportedOperation();
    }
    hasPostData() {
        throw new Errors_js_1.UnsupportedOperation();
    }
    async fetchPostData() {
        throw new Errors_js_1.UnsupportedOperation();
    }
    headers() {
        const headers = {};
        for (const header of this.#request.headers) {
            headers[header.name.toLowerCase()] = header.value.value;
        }
        return headers;
    }
    response() {
        return this.#response;
    }
    failure() {
        if (this.#request.error === undefined) {
            return null;
        }
        return { errorText: this.#request.error };
    }
    isNavigationRequest() {
        return this.#request.navigation !== undefined;
    }
    initiator() {
        return this.#request.initiator;
    }
    redirectChain() {
        if (this.#redirect === undefined) {
            return [];
        }
        const redirects = [this.#redirect];
        for (const redirect of redirects) {
            if (redirect.#redirect !== undefined) {
                redirects.push(redirect.#redirect);
            }
        }
        return redirects;
    }
    enqueueInterceptAction(pendingHandler) {
        // Execute the handler when interception is not supported
        void pendingHandler();
    }
    frame() {
        return this.#frame ?? null;
    }
    continueRequestOverrides() {
        throw new Errors_js_1.UnsupportedOperation();
    }
    continue(_overrides = {}) {
        throw new Errors_js_1.UnsupportedOperation();
    }
    responseForRequest() {
        throw new Errors_js_1.UnsupportedOperation();
    }
    abortErrorReason() {
        throw new Errors_js_1.UnsupportedOperation();
    }
    interceptResolutionState() {
        throw new Errors_js_1.UnsupportedOperation();
    }
    isInterceptResolutionHandled() {
        throw new Errors_js_1.UnsupportedOperation();
    }
    finalizeInterceptions() {
        throw new Errors_js_1.UnsupportedOperation();
    }
    abort() {
        throw new Errors_js_1.UnsupportedOperation();
    }
    respond(_response, _priority) {
        throw new Errors_js_1.UnsupportedOperation();
    }
}
exports.BidiHTTPRequest = BidiHTTPRequest;
_a = BidiHTTPRequest;
//# sourceMappingURL=HTTPRequest.js.map