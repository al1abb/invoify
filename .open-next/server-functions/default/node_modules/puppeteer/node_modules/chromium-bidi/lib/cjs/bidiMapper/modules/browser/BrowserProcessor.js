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
exports.BrowserProcessor = void 0;
const protocol_js_1 = require("../../../protocol/protocol.js");
class BrowserProcessor {
    #browserCdpClient;
    #browsingContextStorage;
    #userContextStorage;
    constructor(browserCdpClient, browsingContextStorage, userContextStorage) {
        this.#browserCdpClient = browserCdpClient;
        this.#browsingContextStorage = browsingContextStorage;
        this.#userContextStorage = userContextStorage;
    }
    close() {
        // Ensure that it is put at the end of the event loop.
        // This way we send back the response before closing the tab.
        setTimeout(() => this.#browserCdpClient.sendCommand('Browser.close'), 0);
        return {};
    }
    async createUserContext(params) {
        const request = {
            proxyServer: params['goog:proxyServer'] ?? undefined,
        };
        const proxyBypassList = params['goog:proxyBypassList'] ?? undefined;
        if (proxyBypassList) {
            request.proxyBypassList = proxyBypassList.join(',');
        }
        const context = await this.#browserCdpClient.sendCommand('Target.createBrowserContext', request);
        return {
            userContext: context.browserContextId,
        };
    }
    async removeUserContext(params) {
        const userContext = params.userContext;
        if (userContext === 'default') {
            throw new protocol_js_1.InvalidArgumentException('`default` user context cannot be removed');
        }
        try {
            await this.#browserCdpClient.sendCommand('Target.disposeBrowserContext', {
                browserContextId: userContext,
            });
        }
        catch (err) {
            // https://source.chromium.org/chromium/chromium/src/+/main:content/browser/devtools/protocol/target_handler.cc;l=1424;drc=c686e8f4fd379312469fe018f5c390e9c8f20d0d
            if (err.message.startsWith('Failed to find context with id')) {
                throw new protocol_js_1.NoSuchUserContextException(err.message);
            }
            throw err;
        }
        return {};
    }
    async getUserContexts() {
        return {
            userContexts: await this.#userContextStorage.getUserContexts(),
        };
    }
    async #getWindowInfo(targetId) {
        const windowInfo = await this.#browserCdpClient.sendCommand('Browser.getWindowForTarget', { targetId });
        return {
            // `active` is not supported in CDP yet.
            active: false,
            clientWindow: `${windowInfo.windowId}`,
            state: windowInfo.bounds.windowState ?? 'normal',
            height: windowInfo.bounds.height ?? 0,
            width: windowInfo.bounds.width ?? 0,
            x: windowInfo.bounds.left ?? 0,
            y: windowInfo.bounds.top ?? 0,
        };
    }
    async getClientWindows() {
        const topLevelTargetIds = this.#browsingContextStorage
            .getTopLevelContexts()
            .map((b) => b.cdpTarget.id);
        const clientWindows = await Promise.all(topLevelTargetIds.map(async (targetId) => await this.#getWindowInfo(targetId)));
        const uniqueClientWindowIds = new Set();
        const uniqueClientWindows = new Array();
        // Filter out duplicated client windows.
        for (const window of clientWindows) {
            if (!uniqueClientWindowIds.has(window.clientWindow)) {
                uniqueClientWindowIds.add(window.clientWindow);
                uniqueClientWindows.push(window);
            }
        }
        return { clientWindows: uniqueClientWindows };
    }
}
exports.BrowserProcessor = BrowserProcessor;
//# sourceMappingURL=BrowserProcessor.js.map