import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Wallet from './Wallet';

const container = document.getElementById('root');
if (!container) {
	throw new Error('Не найден корневой контейнер приложения.');
}

createRoot(container).render(
	<StrictMode>
		<Wallet />
	</StrictMode>,
);
