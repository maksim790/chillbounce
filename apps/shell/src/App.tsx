import { lazy, Suspense } from 'react';

const Wallet = lazy(() => import('wallet/Wallet'));

export default function App() {
	return (
		<main>
			<h1>Chillbounce</h1>
			<p>Shell — техническая оболочка.</p>
			<Suspense fallback={<p role="status">Загрузка Wallet…</p>}>
				<Wallet />
			</Suspense>
		</main>
	);
}
