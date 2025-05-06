"use strict";
/**
 * @license
 * Copyright 2020 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._connectToCdpBrowser = _connectToCdpBrowser;
const util_js_1 = require("../common/util.js");
const Browser_js_1 = require("./Browser.js");
const Connection_js_1 = require("./Connection.js");
/**
 * Users should never call this directly; it's called when calling
 * `puppeteer.connect` with `protocol: 'cdp'`.
 *
 * @internal
 */
async function _connectToCdpBrowser(connectionTransport, url, options) {
    const { acceptInsecureCerts = false, defaultViewport = util_js_1.DEFAULT_VIEWPORT, downloadBehavior, targetFilter, _isPageTarget: isPageTarget, slowMo = 0, protocolTimeout, } = options;
    const connection = new Connection_js_1.Connection(url, connectionTransport, slowMo, protocolTimeout);
    const { browserContextIds } = await connection.send('Target.getBrowserContexts');
    const browser = await Browser_js_1.CdpBrowser._create(connection, browserContextIds, acceptInsecureCerts, defaultViewport, downloadBehavior, undefined, () => {
        return connection.send('Browser.close').catch(util_js_1.debugError);
    }, targetFilter, isPageTarget);
    return browser;
}
//# sourceMappingURL=BrowserConnector.js.map