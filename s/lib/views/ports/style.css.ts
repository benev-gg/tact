
import {css} from "lit"
export default css`@layer view {

.plate {
	user-select: none;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: var(--pad);
	gap: var(--pad);
	background: var(--bg);
}

.plate[data-drag-and-drop] {
	.card[data-drop-candidate] {
		outline: 2px dashed color-mix(in oklch, transparent, var(--droppy) 30%);
		background: color-mix(in oklch, var(--card), var(--droppy) 20%);

		&[data-dropping] {
			outline: 2px solid var(--droppy);
			background: color-mix(in oklch, var(--card), var(--droppy) 50%);
		}
	}
}

.ports {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	gap: var(--pad);

	> * {
		flex: 0 1 auto;
		width: 36em;

		background: var(--card);
		border-radius: var(--round);
		overflow: clip;
	}

	.box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: var(--pad);
		background: var(--card-box);
	}
}

.card {
	display: flex;
	flex-direction: column;

	&.unassigned {
		--card: var(--card-unassigned);
	}

	h3 {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: var(--nib);
	}

	.inset {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		gap: var(--pad);
		padding: var(--pad);
	}

	.controller {
		cursor: grab;
		display: flex;
		background: var(--card);
		border-radius: 0.5em;
		overflow: clip;
		box-shadow: var(--box-shadow);
		gap: var(--pad);

		&:hover {
			background: color-mix(in oklch, var(--card), var(--draggy) 20%);
		}

		.content {
			flex: 1 1 auto;
			display: flex;
			padding: var(--nib);
			gap: var(--pad);

			h4 {
				flex: 1 1 auto;
				font-size: 1em;
				font-weight: normal;
			}

			select {
				padding: var(--nib) var(--pad);
			}
		}

		.griptape {
			display: flex;
			justify-content: center;
			align-items: center;

			width: 1.5em;
			flex: 0 0 auto;

			svg {
				opacity: 0.5;
			}
		}
	}
}

}`

