import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { resolveWalletRemoteUrl } from './remote-url.ts';

export default defineConfig(({ command, mode, isPreview }) => {
	const env = loadEnv(mode, import.meta.dirname, 'VITE_');
	const entry = resolveWalletRemoteUrl(
		env.VITE_WALLET_REMOTE_URL,
		command === 'serve' && !isPreview,
	);

	return {
		plugins: [
			react(),
			federation({
				name: 'shell',
				shareStrategy: 'loaded-first',
				dts: false,
				remotes: {
					wallet: { type: 'module', name: 'wallet', entry },
				},
				shared: {
					react: { singleton: true, requiredVersion: '19.3.1' },
					'react-dom': { singleton: true, requiredVersion: '19.3.1' },
				},
			}),
		],
		server: {
			host: '127.0.0.1',
			port: 5173,
			strictPort: true,
			origin: 'http://127.0.0.1:5173',
		},
		preview: { host: '127.0.0.1', port: 5173, strictPort: true },
	};
});
