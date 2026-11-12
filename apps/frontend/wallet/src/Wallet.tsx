import { useState } from 'react';
import './index.css';
import { Button } from '@chillbounce/ui/components/button';

export default function Wallet() {
	const [checks, setChecks] = useState(0);

	return (
		<section aria-label="Модуль Wallet">
			<h2>Wallet</h2>
			<p>
				Технический remote Chillbounce. Данные кошелька ещё не
				подключены.
			</p>
			<Button
				type="button"
				onClick={() => setChecks((value) => value + 1)}
			>
				Проверить React
			</Button>
			<p aria-live="polite">Проверок: {checks}</p>
		</section>
	);
}
