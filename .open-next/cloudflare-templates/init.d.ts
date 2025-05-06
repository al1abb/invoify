/**
 * Initialization for the workerd runtime.
 *
 * The file must be imported at the top level the worker.
 */
/**
 * Executes the handler with the Cloudflare context.
 */
export declare function runWithCloudflareRequestContext(request: Request, env: CloudflareEnv, ctx: ExecutionContext, handler: () => Promise<Response>): Promise<Response>;
declare global {
    var __BUILD_TIMESTAMP_MS__: number;
    var __NEXT_BASE_PATH__: string;
}
