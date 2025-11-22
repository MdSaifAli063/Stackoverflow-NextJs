/* Safe Appwrite config for server & edge usage.
   - Always exports: env, client, databases, storage (stubs if SDK/env missing).
   - Avoids throwing during static import in Edge middleware.
*/

type AppwriteEnv = {
	appwrite: {
		endpoint: string;
		projectId: string;
		apikey: string;
	};
};

const endpoint =
	process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
	process.env.APPWRITE_ENDPOINT ||
	process.env.NEXT_PUBLIC_APPWRITE_URL ||
	'';
const projectId =
	process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ||
	process.env.APPWRITE_PROJECT_ID ||
	'';
const apikey = process.env.APPWRITE_API_KEY || '';

export const env: AppwriteEnv = {
	appwrite: {
		endpoint,
		projectId,
		apikey,
	},
};

// Minimal chaining stub client so calls like client.setEndpoint(...) won't crash at import time.
function createStubClient() {
	const stub: any = {
		setEndpoint: () => stub,
		setProject: () => stub,
		setKey: () => stub,
		// allow property access without throwing immediately
	};
	return stub;
}

// Generic stub service that throws when a method is actually invoked (safer for imports).
function createStubService(name: string) {
	const handler: ProxyHandler<any> = {
		get(_target, prop) {
			if (prop === 'then') return undefined; // avoid being treated as a Promise
			return (..._args: any[]) => {
				throw new Error(
					`Appwrite service "${name}" is not available. Install Appwrite SDK and set env vars (e.g. NEXT_PUBLIC_APPWRITE_ENDPOINT).`
				);
			};
		},
	};
	return new Proxy({}, handler);
}

export let client: any = createStubClient();
export let databases: any = createStubService('databases');
export let storage: any = createStubService('storage');

// Try to instantiate real SDK services if possible.
// Keep this at runtime; if the SDK isn't available (or edge runtime forbids it), stubs remain.
if (endpoint) {
	try {
		// Dynamically require so bundlers/static analysis won't break imports in environments without SDK.
		// @ts-ignore
		const sdk = require('node-appwrite') || require('appwrite');
		if (sdk && sdk.Client) {
			const RealClient = sdk.Client;
			client = new RealClient();
			if (typeof client.setEndpoint === 'function') client.setEndpoint(endpoint);
			if (typeof client.setProject === 'function') client.setProject(projectId);
			if (typeof client.setKey === 'function' && apikey) client.setKey(apikey);

			// Attach services if present in the SDK
			if (sdk.Databases) {
				try {
					databases = new sdk.Databases(client);
				} catch (e) {
					// fallback to stub on unexpected errors
					databases = createStubService('databases');
				}
			}
			if (sdk.Storage) {
				try {
					storage = new sdk.Storage(client);
				} catch (e) {
					storage = createStubService('storage');
				}
			}
		}
	} catch (err) {
		/* eslint-disable no-console */
		if (process.env.NODE_ENV !== 'production') {
			console.warn(
				'[config] Appwrite SDK not initialized. Using safe stubs for client/databases/storage. ' +
					'Install "node-appwrite" (server) or "appwrite" and set Appwrite env vars to enable full functionality.'
			);
		}
		/* eslint-enable no-console */
	}
} else {
	if (process.env.NODE_ENV !== 'production') {
		/* eslint-disable no-console */
		console.warn(
			'[config] NEXT_PUBLIC_APPWRITE_ENDPOINT or APPWRITE_ENDPOINT is not set. Using safe stubs for client/databases/storage.'
		);
		/* eslint-enable no-console */
	}
}