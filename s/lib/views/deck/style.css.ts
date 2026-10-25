
import {css} from "lit"
export default css`@layer view {

:host {
	--bg: #000;
	--card: #8882;
	--headers: #8883;
	--controller: #8884;
	--griptape: #8885;

	--draggy: rebeccapurple;
	--droppy: cyan;

	--round: 0.5em;
	--pad: 0.5em;
	--space: 1em;
	--box-shadow: 0.1em 0.2em 0.9em #0004;
}

.deck {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: var(--pad);
	gap: var(--pad);
	background: var(--bg);
}

.deck[data-drag-and-drop] {
	xxxbackground: color-mix(in oklch, var(--bg), var(--droppy) 20%);

	.controller[data-dragging] {
		outline: 2px dashed color-mix(in oklch, transparent, var(--draggy) 90%);
		background: color-mix(in oklch, var(--controller), var(--draggy) 40%);
	}

	.card[data-drop-candidate] {
		.dropzone {
			background: color-mix(in oklch, transparent, var(--droppy) 10%);
			border-color: color-mix(in oklch, transparent, var(--droppy) 50%);
			&::before {
				content: "drop";
				color: color-mix(in oklch, transparent, var(--droppy) 50%);
				font-weight: bold;
			}
		}

		&[data-dropping] {
			xxxoutline: 2px solid color-mix(in oklch, transparent, var(--droppy) 30%);

			.dropzone {
				background: color-mix(in oklch, transparent, var(--droppy) 20%);
				border-color: color-mix(in oklch, transparent, var(--droppy) 90%);
			}
		}
	}
}

.ports {
	user-select: none;

	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	gap: var(--pad);
}

.card {
	display: flex;
	flex-direction: column;

	flex: 0 1 auto;
	width: 20em;
	background: var(--card);
	border-radius: var(--round);
	overflow: clip;

	h3 {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		background: var(--headers);
		padding: var(--pad);
	}

	.inset {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		gap: var(--space);
		padding: var(--space);
	}

	.controller {
		display: flex;
		gap: var(--pad);
		background: var(--controller);
		border-radius: 0.5em;
		overflow: clip;
		box-shadow: var(--box-shadow);

		.griptape {
			width: 1.5em;
			flex: 0 0 auto;
			background: var(--griptape);
			cursor: grab;
		}

		.content {
			flex: 1 1 auto;
			padding: var(--pad);
		}
	}

	.dropzone {
		flex: 1 0 auto;
		content: "";
		width: 100%;
		height: 5em;
		border: 1px dashed color-mix(in oklch, transparent, currentColor 50%);
		border-radius: var(--round);

		display: flex;
		justify-content: center;
		align-items: center;
	}
}

}`

