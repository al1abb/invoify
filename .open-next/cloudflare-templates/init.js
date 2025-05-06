/**
 * Initialization for the workerd runtime.
 *
 * The file must be imported at the top level the worker.
 */
import { AsyncLocalStorage } from "node:async_hooks";
import process from "node:process";
import stream from "node:stream";
// @ts-expect-error: resolved by wrangler build
import * as nextEnvVars from "./next-env.mjs";
const cloudflareContextALS = new AsyncLocalStorage();
// Note: this symbol needs to be kept in sync with `src/api/get-cloudflare-context.ts`
Object.defineProperty(globalThis, Symbol.for("__cloudflare-context__"), {
    get() {
        return cloudflareContextALS.getStore();
    },
});
/**
 * Executes the handler with the Cloudflare context.
 */
export async function runWithCloudflareRequestContext(request, env, ctx, handler) {
    init(request, env);
    return cloudflareContextALS.run({ env, ctx, cf: request.cf }, handler);
}
let initialized = false;
/**
 * Initializes the runtime on the first call,
 * no-op on subsequent invocations.
 */
function init(request, env) {
    if (initialized) {
        return;
    }
    initialized = true;
    const url = new URL(request.url);
    initRuntime();
    populateProcessEnv(url, env);
}
function initRuntime() {
    // Some packages rely on `process.version` and `process.versions.node` (i.e. Jose@4)
    // TODO: Remove when https://github.com/unjs/unenv/pull/493 is merged
    Object.assign(process, { version: process.version || "v22.14.0" });
    // @ts-expect-error Node type does not match workerd
    Object.assign(process.versions, { node: "22.14.0", ...process.versions });
    globalThis.__dirname ??= "";
    globalThis.__filename ??= "";
    // Do not crash on cache not supported
    // https://github.com/cloudflare/workerd/pull/2434
    // compatibility flag "cache_option_enabled" -> does not support "force-cache"
    const __original_fetch = globalThis.fetch;
    globalThis.fetch = (input, init) => {
        if (init) {
            delete init.cache;
        }
        return __original_fetch(input, init);
    };
    const CustomRequest = class extends globalThis.Request {
        constructor(input, init) {
            if (init) {
                delete init.cache;
                // https://github.com/cloudflare/workerd/issues/2746
                // https://github.com/cloudflare/workerd/issues/3245
                Object.defineProperty(init, "body", {
                    // @ts-ignore
                    value: init.body instanceof stream.Readable ? ReadableStream.from(init.body) : init.body,
                });
            }
            super(input, init);
        }
    };
    Object.assign(globalThis, {
        Request: CustomRequest,
        __BUILD_TIMESTAMP_MS__: __BUILD_TIMESTAMP_MS__,
        __NEXT_BASE_PATH__: __NEXT_BASE_PATH__,
    });
}
/**
 * Populate process.env with:
 * - the environment variables and secrets from the cloudflare platform
 * - the variables from Next .env* files
 * - the origin resolver information
 */
function populateProcessEnv(url, env) {
    for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
            process.env[key] = value;
        }
    }
    const mode = env.NEXTJS_ENV ?? "production";
    if (nextEnvVars[mode]) {
        for (const key in nextEnvVars[mode]) {
            process.env[key] ??= nextEnvVars[mode][key];
        }
    }
    // Set the default Origin for the origin resolver.
    // This is only needed for an external middleware bundle
    process.env.OPEN_NEXT_ORIGIN = JSON.stringify({
        default: {
            host: url.hostname,
            protocol: url.protocol.slice(0, -1),
            port: url.port,
        },
    });
}
/* eslint-enable no-var */
