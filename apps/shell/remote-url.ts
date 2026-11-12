export function resolveWalletRemoteUrl(
	raw: string | undefined,
	allowLocalDefault: boolean,
): string {
	if (raw === undefined && allowLocalDefault) {
		return 'http://127.0.0.1:5174/remoteEntry.js';
	}
	if (!raw?.trim()) {
		throw new Error(
			'Укажите публичный VITE_WALLET_REMOTE_URL перед сборкой shell.',
		);
	}

	let url: URL;
	try {
		url = new URL(raw);
	} catch {
		throw new Error(
			'VITE_WALLET_REMOTE_URL должен быть абсолютным HTTP(S) URL.',
		);
	}

	if (
		!['http:', 'https:'].includes(url.protocol) ||
		url.username ||
		url.password
	) {
		throw new Error(
			'VITE_WALLET_REMOTE_URL должен быть HTTP(S) URL без credentials.',
		);
	}
	return url.href;
}
