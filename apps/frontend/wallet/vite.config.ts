import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';

const shellOrigins = ['http://127.0.0.1:5173', 'http://localhost:5173'];

export default defineConfig({
	plugins: [
		react(),
		federation({
			name: 'wallet',
			filename: 'remoteEntry.js',
			exposes: { './Wallet': './src/Wallet.tsx' },
			shareStrategy: 'loaded-first',
			dts: false,
			shared: {
				react: { singleton: true, requiredVersion: '19.3.1' },
				'react-dom': { singleton: true, requiredVersion: '19.3.1' },
			},
		}),
		tailwindcss(),
	],
	server: {
		host: '127.0.0.1',
		port: 5174,
		strictPort: true,
		origin: 'http://127.0.0.1:5174',
		cors: { origin: shellOrigins },
	},
	preview: {
		host: '127.0.0.1',
		port: 5174,
		strictPort: true,
		cors: { origin: shellOrigins },
	},
	resolve: {
		alias: {
			'@': path.resolve(import.meta.dirname, './src'),
		},
	},
});
