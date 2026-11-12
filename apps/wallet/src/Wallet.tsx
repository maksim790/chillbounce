import { useState } from 'react';

export default function Wallet() {
	const [checks, setChecks] = useState(0);

	return (
		<section aria-label="Модуль Wallet">
			<h2>Wallet</h2>
			<p>
				Технический remote Chillbounce. Данные кошелька ещё не
				подключены.
			</p>
			<button
				type="button"
				onClick={() => setChecks((value) => value + 1)}
			>
				Проверить React
			</button>
			<p aria-live="polite">Проверок: {checks}</p>
		</section>
	);
}
