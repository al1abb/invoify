"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidiCdpSession = void 0;
const CDPSession_js_1 = require("../api/CDPSession.js");
const Errors_js_1 = require("../common/Errors.js");
const Deferred_js_1 = require("../util/Deferred.js");
/**
 * @internal
 */
class BidiCdpSession extends CDPSession_js_1.CDPSession {
    static sessions = new Map();
    #detached = false;
    #connection = undefined;
    #sessionId = Deferred_js_1.Deferred.create();
    frame;
    constructor(frame, sessionId) {
        super();
        this.frame = frame;
        if (!this.frame.page().browser().cdpSupported) {
            return;
        }
        const connection = this.frame.page().browser().connection;
        this.#connection = connection;
        if (sessionId) {
            this.#sessionId.resolve(sessionId);
            BidiCdpSession.sessions.set(sessionId, this);
        }
        else {
            (async () => {
                try {
                    const session = await connection.send('cdp.getSession', {
                        context: frame._id,
                    });
                    this.#sessionId.resolve(session.result.session);
                    BidiCdpSession.sessions.set(session.result.session, this);
                }
                catch (error) {
                    this.#sessionId.reject(error);
                }
            })();
        }
        // SAFETY: We never throw #sessionId.
        BidiCdpSession.sessions.set(this.#sessionId.value(), this);
    }
    connection() {
        return undefined;
    }
    async send(method, params) {
        if (this.#connection === undefined) {
            throw new Errors_js_1.UnsupportedOperation('CDP support is required for this feature. The current browser does not support CDP.');
        }
        if (this.#detached) {
            throw new Errors_js_1.TargetCloseError(`Protocol error (${method}): Session closed. Most likely the page has been closed.`);
        }
        const session = await this.#sessionId.valueOrThrow();
        const { result } = await this.#connection.send('cdp.sendCommand', {
            method: method,
            params: params,
            session,
        });
        return result.result;
    }
    async detach() {
        if (this.#connection === undefined || this.#detached) {
            return;
        }
        try {
            await this.frame.client.send('Target.detachFromTarget', {
                sessionId: this.id(),
            });
        }
        finally {
            BidiCdpSession.sessions.delete(this.id());
            this.#detached = true;
        }
    }
    id() {
        const value = this.#sessionId.value();
        return typeof value === 'string' ? value : '';
    }
}
exports.BidiCdpSession = BidiCdpSession;
//# sourceMappingURL=CDPSession.js.map