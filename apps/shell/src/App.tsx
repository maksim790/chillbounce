import { lazy, Suspense } from 'react';
import RemoteErrorBoundary from './RemoteErrorBoundary';

const Wallet = lazy(() => import('wallet/Wallet'));

export default function App() {
	return (
		<main>
			<h1>Chillbounce</h1>
			<p>Shell — техническая оболочка.</p>
			<RemoteErrorBoundary>
				<Suspense fallback={<p role="status">Загрузка Wallet…</p>}>
					<Wallet />
				</Suspense>
			</RemoteErrorBoundary>
		</main>
	);
}
