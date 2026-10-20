
import {css} from "lit"
export default css`

.deck {
	display: flex;
	flex-direction: column;
	gap: 0.5em;

	> div {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;
	}
}

.port {
	background: grey;
	width: 16em;
	max-width: 100%;

	header {
		display: flex;
		padding: 0.5em;

		> span {
			flex: 1 1 auto;
			font-weight: bold;
		}
	}

	strong {
		display: block;
		width: 100%;
		padding: 0.2em;
	}

	.controllerlist {
		display: flex;
		flex-direction: column;
		padding: 0.5em;
		gap: 0.5em;
	}
}

.controller {
	display: flex;
	flex-direction: column;
	background: green;
	padding: 0.5em;
	gap: 0.5em;

	.buttons {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		> div {
			display: flex;
			flex-wrap: wrap;
		}
	}
}

button[disabled] {
	opacity: 0.2;
}

`

