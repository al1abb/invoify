"use strict";
/**
 * @license
 * Copyright 2019 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsolatedWorld = void 0;
const Realm_js_1 = require("../api/Realm.js");
const util_js_1 = require("../common/util.js");
const Deferred_js_1 = require("../util/Deferred.js");
const disposable_js_1 = require("../util/disposable.js");
const Mutex_js_1 = require("../util/Mutex.js");
const ExecutionContext_js_1 = require("./ExecutionContext.js");
const utils_js_1 = require("./utils.js");
/**
 * @internal
 */
class IsolatedWorld extends Realm_js_1.Realm {
    #context = Deferred_js_1.Deferred.create();
    // Set of bindings that have been registered in the current context.
    #contextBindings = new Set();
    // Contains mapping from functions that should be bound to Puppeteer functions.
    #bindings = new Map();
    get _bindings() {
        return this.#bindings;
    }
    #frameOrWorker;
    constructor(frameOrWorker, timeoutSettings) {
        super(timeoutSettings);
        this.#frameOrWorker = frameOrWorker;
        this.frameUpdated();
    }
    get environment() {
        return this.#frameOrWorker;
    }
    frameUpdated() {
        this.client.on('Runtime.bindingCalled', this.#onBindingCalled);
    }
    get client() {
        return this.#frameOrWorker.client;
    }
    clearContext() {
        // The message has to match the CDP message expected by the WaitTask class.
        this.#context?.reject(new Error('Execution context was destroyed'));
        this.#context = Deferred_js_1.Deferred.create();
        if ('clearDocumentHandle' in this.#frameOrWorker) {
            this.#frameOrWorker.clearDocumentHandle();
        }
    }
    setContext(context) {
        this.#contextBindings.clear();
        this.#context.resolve(context);
        void this.taskManager.rerunAll();
    }
    hasContext() {
        return this.#context.resolved();
    }
    #executionContext() {
        if (this.disposed) {
            throw new Error(`Execution context is not available in detached frame "${this.environment.url()}" (are you trying to evaluate?)`);
        }
        if (this.#context === null) {
            throw new Error(`Execution content promise is missing`);
        }
        return this.#context.valueOrThrow();
    }
    async evaluateHandle(pageFunction, ...args) {
        pageFunction = (0, util_js_1.withSourcePuppeteerURLIfNone)(this.evaluateHandle.name, pageFunction);
        const context = await this.#executionContext();
        return await context.evaluateHandle(pageFunction, ...args);
    }
    async evaluate(pageFunction, ...args) {
        pageFunction = (0, util_js_1.withSourcePuppeteerURLIfNone)(this.evaluate.name, pageFunction);
        let context = this.#context.value();
        if (!context || !(context instanceof ExecutionContext_js_1.ExecutionContext)) {
            context = await this.#executionContext();
        }
        return await context.evaluate(pageFunction, ...args);
    }
    // If multiple waitFor are set up asynchronously, we need to wait for the
    // first one to set up the binding in the page before running the others.
    #mutex = new Mutex_js_1.Mutex();
    async _addBindingToContext(context, name) {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            if (this.#contextBindings.has(name)) {
                return;
            }
            const _ = __addDisposableResource(env_1, await this.#mutex.acquire(), false);
            try {
                await context._client.send('Runtime.addBinding', context._contextName
                    ? {
                        name,
                        executionContextName: context._contextName,
                    }
                    : {
                        name,
                        executionContextId: context._contextId,
                    });
                await context.evaluate(utils_js_1.addPageBinding, 'internal', name);
                this.#contextBindings.add(name);
            }
            catch (error) {
                // We could have tried to evaluate in a context which was already
                // destroyed. This happens, for example, if the page is navigated while
                // we are trying to add the binding
                if (error instanceof Error) {
                    // Destroyed context.
                    if (error.message.includes('Execution context was destroyed')) {
                        return;
                    }
                    // Missing context.
                    if (error.message.includes('Cannot find context with specified id')) {
                        return;
                    }
                }
                (0, util_js_1.debugError)(error);
            }
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            __disposeResources(env_1);
        }
    }
    #onBindingCalled = async (event) => {
        let payload;
        try {
            payload = JSON.parse(event.payload);
        }
        catch {
            // The binding was either called by something in the page or it was
            // called before our wrapper was initialized.
            return;
        }
        const { type, name, seq, args, isTrivial } = payload;
        if (type !== 'internal') {
            return;
        }
        if (!this.#contextBindings.has(name)) {
            return;
        }
        try {
            const context = await this.#context.valueOrThrow();
            if (event.executionContextId !== context._contextId) {
                return;
            }
            const binding = this._bindings.get(name);
            await binding?.run(context, seq, args, isTrivial);
        }
        catch (err) {
            (0, util_js_1.debugError)(err);
        }
    };
    async adoptBackendNode(backendNodeId) {
        const executionContext = await this.#executionContext();
        const { object } = await this.client.send('DOM.resolveNode', {
            backendNodeId: backendNodeId,
            executionContextId: executionContext._contextId,
        });
        return (0, ExecutionContext_js_1.createCdpHandle)(this, object);
    }
    async adoptHandle(handle) {
        if (handle.realm === this) {
            // If the context has already adopted this handle, clone it so downstream
            // disposal doesn't become an issue.
            return (await handle.evaluateHandle(value => {
                return value;
            }));
        }
        const nodeInfo = await this.client.send('DOM.describeNode', {
            objectId: handle.id,
        });
        return (await this.adoptBackendNode(nodeInfo.node.backendNodeId));
    }
    async transferHandle(handle) {
        if (handle.realm === this) {
            return handle;
        }
        // Implies it's a primitive value, probably.
        if (handle.remoteObject().objectId === undefined) {
            return handle;
        }
        const info = await this.client.send('DOM.describeNode', {
            objectId: handle.remoteObject().objectId,
        });
        const newHandle = (await this.adoptBackendNode(info.node.backendNodeId));
        await handle.dispose();
        return newHandle;
    }
    [disposable_js_1.disposeSymbol]() {
        super[disposable_js_1.disposeSymbol]();
        this.client.off('Runtime.bindingCalled', this.#onBindingCalled);
    }
}
exports.IsolatedWorld = IsolatedWorld;
//# sourceMappingURL=IsolatedWorld.js.map