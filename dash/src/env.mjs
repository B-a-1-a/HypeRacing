import { z } from "zod";

const server = z.object({
	NODE_ENV: z.enum(["development", "test", "production"]),
});

const client = z.object({
	NEXT_PUBLIC_LIVE_SOCKET_URL: z.string().min(1).includes("http"),
	NEXT_PUBLIC_API_URL: z.string().min(1).includes("http"),

	NEXT_PUBLIC_TRACKING_ID: z.string().optional(),
	NEXT_PUBLIC_TRACKING_URL: z.string().includes("http").optional(),
	
	// Firebase configuration
	NEXT_PUBLIC_FIREBASE_API_KEY: z.string().optional(),
	NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().optional(),
	NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().optional(), 
	NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
	NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
	NEXT_PUBLIC_FIREBASE_APP_ID: z.string().optional(),
	NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),
});

const processEnv = {
	NODE_ENV: process.env.NODE_ENV,
	NEXT_PUBLIC_LIVE_SOCKET_URL: process.env.NEXT_PUBLIC_LIVE_SOCKET_URL,
	NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,

	NEXT_PUBLIC_TRACKING_ID: process.env.NEXT_PUBLIC_TRACKING_ID,
	NEXT_PUBLIC_TRACKING_URL: process.env.NEXT_PUBLIC_TRACKING_URL,
	
	// Firebase configuration
	NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Don't touch the part below
// --------------------------
const merged = server.merge(client);
/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

const skip =
	!!process.env.SKIP_ENV_VALIDATION &&
	process.env.SKIP_ENV_VALIDATION !== "false" &&
	process.env.SKIP_ENV_VALIDATION !== "0";

if (!skip) {
	const isServer = typeof window === "undefined";

	const parsed = /** @type {MergedSafeParseReturn} */ (
		isServer
			? merged.safeParse(processEnv) // on server we can validate all env vars
			: client.safeParse(processEnv) // on client we can only validate the ones that are exposed
	);

	if (parsed.success === false) {
		console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
		throw new Error("Invalid environment variables");
	}

	env = new Proxy(parsed.data, {
		get(target, prop) {
			if (typeof prop !== "string") return undefined;
			// Throw a descriptive error if a server-side env var is accessed on the client
			// Otherwise it would just be returning `undefined` and be annoying to debug
			if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
				throw new Error(
					process.env.NODE_ENV === "production"
						? "❌ Attempted to access a server-side environment variable on the client"
						: `❌ Attempted to access server-side environment variable '${prop}' on the client`,
				);

			return target[/** @type {keyof typeof target} */ (prop)];
		},
	});
}

export { env };
