import { getPayload } from "payload";
import config from "@payload-config";
import { cache } from "react";

/**
 * Returns a memoized Payload instance for use in Server Components.
 * This ensures that during a single request, the initialization and config resolution
 * happen only once, even if called from multiple components.
 */
export const getCachedPayload = cache(async () => {
  return await getPayload({ config });
});
