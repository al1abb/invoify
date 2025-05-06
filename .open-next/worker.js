//@ts-expect-error: Will be resolved by wrangler build
import { runWithCloudflareRequestContext } from "./cloudflare/init.js";
//@ts-expect-error: Will be resolved by wrangler build
export { DOQueueHandler } from "./.build/durable-objects/queue.js";
//@ts-expect-error: Will be resolved by wrangler build
export { DOShardedTagCache } from "./.build/durable-objects/sharded-tag-cache.js";
export default {
    async fetch(request, env, ctx) {
        return runWithCloudflareRequestContext(request, env, ctx, async () => {
            const url = new URL(request.url);
            // Serve images in development.
            // Note: "/cdn-cgi/image/..." requests do not reach production workers.
            if (url.pathname.startsWith("/cdn-cgi/image/")) {
                const m = url.pathname.match(/\/cdn-cgi\/image\/.+?\/(?<url>.+)$/);
                if (m === null) {
                    return new Response("Not Found!", { status: 404 });
                }
                const imageUrl = m.groups.url;
                return imageUrl.match(/^https?:\/\//)
                    ? fetch(imageUrl, { cf: { cacheEverything: true } })
                    : env.ASSETS?.fetch(new URL(`/${imageUrl}`, url));
            }
            // Fallback for the Next default image loader.
            if (url.pathname === `${globalThis.__NEXT_BASE_PATH__}/_next/image`) {
                const imageUrl = url.searchParams.get("url") ?? "";
                return imageUrl.startsWith("/")
                    ? env.ASSETS?.fetch(`http://assets.local${imageUrl}`)
                    : fetch(imageUrl, { cf: { cacheEverything: true } });
            }
            // @ts-expect-error: resolved by wrangler build
            const { handler } = await import("./server-functions/default/handler.mjs");
            return handler(request, env, ctx);
        });
    },
};
