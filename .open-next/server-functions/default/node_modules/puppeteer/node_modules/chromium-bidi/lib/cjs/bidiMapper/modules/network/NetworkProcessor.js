"use strict";
/**
 * Copyright 2023 Google LLC.
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkProcessor = void 0;
const protocol_js_1 = require("../../../protocol/protocol.js");
const NetworkUtils_js_1 = require("./NetworkUtils.js");
/** Dispatches Network module commands. */
class NetworkProcessor {
    #browsingContextStorage;
    #networkStorage;
    constructor(browsingContextStorage, networkStorage) {
        this.#browsingContextStorage = browsingContextStorage;
        this.#networkStorage = networkStorage;
    }
    async addIntercept(params) {
        this.#browsingContextStorage.verifyTopLevelContextsList(params.contexts);
        const urlPatterns = params.urlPatterns ?? [];
        const parsedUrlPatterns = NetworkProcessor.parseUrlPatterns(urlPatterns);
        const intercept = this.#networkStorage.addIntercept({
            urlPatterns: parsedUrlPatterns,
            phases: params.phases,
            contexts: params.contexts,
        });
        await Promise.all(this.#browsingContextStorage.getAllContexts().map((context) => {
            return context.cdpTarget.toggleNetwork();
        }));
        return {
            intercept,
        };
    }
    async continueRequest(params) {
        if (params.url !== undefined) {
            NetworkProcessor.parseUrlString(params.url);
        }
        if (params.method !== undefined) {
            if (!NetworkProcessor.isMethodValid(params.method)) {
                throw new protocol_js_1.InvalidArgumentException(`Method '${params.method}' is invalid.`);
            }
        }
        if (params.headers) {
            NetworkProcessor.validateHeaders(params.headers);
        }
        const request = this.#getBlockedRequestOrFail(params.request, [
            "beforeRequestSent" /* Network.InterceptPhase.BeforeRequestSent */,
        ]);
        try {
            await request.continueRequest(params);
        }
        catch (error) {
            throw NetworkProcessor.wrapInterceptionError(error);
        }
        return {};
    }
    async continueResponse(params) {
        if (params.headers) {
            NetworkProcessor.validateHeaders(params.headers);
        }
        const request = this.#getBlockedRequestOrFail(params.request, [
            "authRequired" /* Network.InterceptPhase.AuthRequired */,
            "responseStarted" /* Network.InterceptPhase.ResponseStarted */,
        ]);
        try {
            await request.continueResponse(params);
        }
        catch (error) {
            throw NetworkProcessor.wrapInterceptionError(error);
        }
        return {};
    }
    async continueWithAuth(params) {
        const networkId = params.request;
        const request = this.#getBlockedRequestOrFail(networkId, [
            "authRequired" /* Network.InterceptPhase.AuthRequired */,
        ]);
        await request.continueWithAuth(params);
        return {};
    }
    async failRequest({ request: networkId, }) {
        const request = this.#getRequestOrFail(networkId);
        if (request.interceptPhase === "authRequired" /* Network.InterceptPhase.AuthRequired */) {
            throw new protocol_js_1.InvalidArgumentException(`Request '${networkId}' in 'authRequired' phase cannot be failed`);
        }
        if (!request.interceptPhase) {
            throw new protocol_js_1.NoSuchRequestException(`No blocked request found for network id '${networkId}'`);
        }
        await request.failRequest('Failed');
        return {};
    }
    async provideResponse(params) {
        if (params.headers) {
            NetworkProcessor.validateHeaders(params.headers);
        }
        const request = this.#getBlockedRequestOrFail(params.request, [
            "beforeRequestSent" /* Network.InterceptPhase.BeforeRequestSent */,
            "responseStarted" /* Network.InterceptPhase.ResponseStarted */,
            "authRequired" /* Network.InterceptPhase.AuthRequired */,
        ]);
        try {
            await request.provideResponse(params);
        }
        catch (error) {
            throw NetworkProcessor.wrapInterceptionError(error);
        }
        return {};
    }
    async removeIntercept(params) {
        this.#networkStorage.removeIntercept(params.intercept);
        await Promise.all(this.#browsingContextStorage.getAllContexts().map((context) => {
            return context.cdpTarget.toggleNetwork();
        }));
        return {};
    }
    async setCacheBehavior(params) {
        const contexts = this.#browsingContextStorage.verifyTopLevelContextsList(params.contexts);
        // Change all targets
        if (contexts.size === 0) {
            this.#networkStorage.defaultCacheBehavior = params.cacheBehavior;
            await Promise.all(this.#browsingContextStorage.getAllContexts().map((context) => {
                return context.cdpTarget.toggleSetCacheDisabled();
            }));
            return {};
        }
        const cacheDisabled = params.cacheBehavior === 'bypass';
        await Promise.all([...contexts.values()].map((context) => {
            return context.cdpTarget.toggleSetCacheDisabled(cacheDisabled);
        }));
        return {};
    }
    #getRequestOrFail(id) {
        const request = this.#networkStorage.getRequestById(id);
        if (!request) {
            throw new protocol_js_1.NoSuchRequestException(`Network request with ID '${id}' doesn't exist`);
        }
        return request;
    }
    #getBlockedRequestOrFail(id, phases) {
        const request = this.#getRequestOrFail(id);
        if (!request.interceptPhase) {
            throw new protocol_js_1.NoSuchRequestException(`No blocked request found for network id '${id}'`);
        }
        if (request.interceptPhase && !phases.includes(request.interceptPhase)) {
            throw new protocol_js_1.InvalidArgumentException(`Blocked request for network id '${id}' is in '${request.interceptPhase}' phase`);
        }
        return request;
    }
    /**
     * Validate https://fetch.spec.whatwg.org/#header-value
     */
    static validateHeaders(headers) {
        for (const header of headers) {
            let headerValue;
            if (header.value.type === 'string') {
                headerValue = header.value.value;
            }
            else {
                headerValue = atob(header.value.value);
            }
            if (headerValue !== headerValue.trim() ||
                headerValue.includes('\n') ||
                headerValue.includes('\0')) {
                throw new protocol_js_1.InvalidArgumentException(`Header value '${headerValue}' is not acceptable value`);
            }
        }
    }
    static isMethodValid(method) {
        // https://httpwg.org/specs/rfc9110.html#method.overview
        return /^[!#$%&'*+\-.^_`|~a-zA-Z\d]+$/.test(method);
    }
    /**
     * Attempts to parse the given url.
     * Throws an InvalidArgumentException if the url is invalid.
     */
    static parseUrlString(url) {
        try {
            return new URL(url);
        }
        catch (error) {
            throw new protocol_js_1.InvalidArgumentException(`Invalid URL '${url}': ${error}`);
        }
    }
    static parseUrlPatterns(urlPatterns) {
        return urlPatterns.map((urlPattern) => {
            let patternUrl = '';
            let hasProtocol = true;
            let hasHostname = true;
            let hasPort = true;
            let hasPathname = true;
            let hasSearch = true;
            switch (urlPattern.type) {
                case 'string': {
                    patternUrl = unescapeURLPattern(urlPattern.pattern);
                    break;
                }
                case 'pattern': {
                    if (urlPattern.protocol === undefined) {
                        hasProtocol = false;
                        patternUrl += 'http';
                    }
                    else {
                        if (urlPattern.protocol === '') {
                            throw new protocol_js_1.InvalidArgumentException('URL pattern must specify a protocol');
                        }
                        urlPattern.protocol = unescapeURLPattern(urlPattern.protocol);
                        if (!urlPattern.protocol.match(/^[a-zA-Z+-.]+$/)) {
                            throw new protocol_js_1.InvalidArgumentException('Forbidden characters');
                        }
                        patternUrl += urlPattern.protocol;
                    }
                    const scheme = patternUrl.toLocaleLowerCase();
                    patternUrl += ':';
                    if ((0, NetworkUtils_js_1.isSpecialScheme)(scheme)) {
                        patternUrl += '//';
                    }
                    if (urlPattern.hostname === undefined) {
                        if (scheme !== 'file') {
                            patternUrl += 'placeholder';
                        }
                        hasHostname = false;
                    }
                    else {
                        if (urlPattern.hostname === '') {
                            throw new protocol_js_1.InvalidArgumentException('URL pattern must specify a hostname');
                        }
                        if (urlPattern.protocol === 'file') {
                            throw new protocol_js_1.InvalidArgumentException(`URL pattern protocol cannot be 'file'`);
                        }
                        urlPattern.hostname = unescapeURLPattern(urlPattern.hostname);
                        let insideBrackets = false;
                        for (const c of urlPattern.hostname) {
                            if (c === '/' || c === '?' || c === '#') {
                                throw new protocol_js_1.InvalidArgumentException(`'/', '?', '#' are forbidden in hostname`);
                            }
                            if (!insideBrackets && c === ':') {
                                throw new protocol_js_1.InvalidArgumentException(`':' is only allowed inside brackets in hostname`);
                            }
                            if (c === '[') {
                                insideBrackets = true;
                            }
                            if (c === ']') {
                                insideBrackets = false;
                            }
                        }
                        patternUrl += urlPattern.hostname;
                    }
                    if (urlPattern.port === undefined) {
                        hasPort = false;
                    }
                    else {
                        if (urlPattern.port === '') {
                            throw new protocol_js_1.InvalidArgumentException(`URL pattern must specify a port`);
                        }
                        urlPattern.port = unescapeURLPattern(urlPattern.port);
                        patternUrl += ':';
                        if (!urlPattern.port.match(/^\d+$/)) {
                            throw new protocol_js_1.InvalidArgumentException('Forbidden characters');
                        }
                        patternUrl += urlPattern.port;
                    }
                    if (urlPattern.pathname === undefined) {
                        hasPathname = false;
                    }
                    else {
                        urlPattern.pathname = unescapeURLPattern(urlPattern.pathname);
                        if (urlPattern.pathname[0] !== '/') {
                            patternUrl += '/';
                        }
                        if (urlPattern.pathname.includes('#') ||
                            urlPattern.pathname.includes('?')) {
                            throw new protocol_js_1.InvalidArgumentException('Forbidden characters');
                        }
                        patternUrl += urlPattern.pathname;
                    }
                    if (urlPattern.search === undefined) {
                        hasSearch = false;
                    }
                    else {
                        urlPattern.search = unescapeURLPattern(urlPattern.search);
                        if (urlPattern.search[0] !== '?') {
                            patternUrl += '?';
                        }
                        if (urlPattern.search.includes('#')) {
                            throw new protocol_js_1.InvalidArgumentException('Forbidden characters');
                        }
                        patternUrl += urlPattern.search;
                    }
                    break;
                }
            }
            const serializePort = (url) => {
                const defaultPorts = {
                    'ftp:': 21,
                    'file:': null,
                    'http:': 80,
                    'https:': 443,
                    'ws:': 80,
                    'wss:': 443,
                };
                if ((0, NetworkUtils_js_1.isSpecialScheme)(url.protocol) &&
                    defaultPorts[url.protocol] !== null &&
                    (!url.port || String(defaultPorts[url.protocol]) === url.port)) {
                    return '';
                }
                else if (url.port) {
                    return url.port;
                }
                return undefined;
            };
            try {
                const url = new URL(patternUrl);
                return {
                    protocol: hasProtocol ? url.protocol.replace(/:$/, '') : undefined,
                    hostname: hasHostname ? url.hostname : undefined,
                    port: hasPort ? serializePort(url) : undefined,
                    pathname: hasPathname && url.pathname ? url.pathname : undefined,
                    search: hasSearch ? url.search : undefined,
                };
            }
            catch (err) {
                throw new protocol_js_1.InvalidArgumentException(`${err.message} '${patternUrl}'`);
            }
        });
    }
    static wrapInterceptionError(error) {
        // https://source.chromium.org/chromium/chromium/src/+/main:content/browser/devtools/protocol/fetch_handler.cc;l=169
        if (error?.message.includes('Invalid header') ||
            error?.message.includes('Unsafe header')) {
            return new protocol_js_1.InvalidArgumentException(error.message);
        }
        return error;
    }
}
exports.NetworkProcessor = NetworkProcessor;
/**
 * See https://w3c.github.io/webdriver-bidi/#unescape-url-pattern
 */
function unescapeURLPattern(pattern) {
    const forbidden = new Set(['(', ')', '*', '{', '}']);
    let result = '';
    let isEscaped = false;
    for (const c of pattern) {
        if (!isEscaped) {
            if (forbidden.has(c)) {
                throw new protocol_js_1.InvalidArgumentException('Forbidden characters');
            }
            if (c === '\\') {
                isEscaped = true;
                continue;
            }
        }
        result += c;
        isEscaped = false;
    }
    return result;
}
//# sourceMappingURL=NetworkProcessor.js.map