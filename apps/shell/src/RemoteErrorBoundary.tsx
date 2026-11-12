import { Component } from 'react';
import type { PropsWithChildren } from 'react';

export default class RemoteErrorBoundary extends Component<
	PropsWithChildren,
	{ hasError: boolean }
> {
	state = { hasError: false };

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return (
				<section role="alert">
					<p>Wallet временно недоступен.</p>
					<p>После восстановления Wallet обновите страницу.</p>
				</section>
			);
		}
		return this.props.children;
	}
}
