
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
	.controller[data-dragging] {
		opacity: 0.3;
	}

	.card[data-drop-candidate] {
		.dropzone {
			background: color-mix(in oklch, transparent, var(--droppy) 10%);
			border-color: color-mix(in oklch, transparent, var(--droppy) 50%);
		}

		&[data-dropping] {
			background: color-mix(in oklch, var(--card), var(--droppy) 10%);

			.dropzone {
				color: color-mix(in oklch, transparent, var(--droppy) 80%);
				background: color-mix(in oklch, transparent, var(--droppy) 20%);
				border-color: color-mix(in oklch, transparent, var(--droppy) 90%);
			}
		}
	}
}

.ports {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	gap: var(--pad);
}

.card {
	display: flex;
	flex-direction: column;

	flex: 0 1 auto;
	width: 16em;
	min-height: 16em;
	background: var(--card);
	border-radius: var(--round);
	overflow: clip;

	&.unassigned {
		--card: var(--card-unassigned);
	}

	h3 {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		background: var(--card);
		padding: var(--pad);
	}

	.handle {
		font-size: 0.7em;
	}

	.inset {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		gap: var(--space);
		padding: var(--space);
	}

	.controller {
		cursor: grab;
		display: flex;
		gap: var(--pad);
		background: var(--card);
		border-radius: 0.5em;
		overflow: clip;
		box-shadow: var(--box-shadow);

		&:hover {
			background: color-mix(in oklch, var(--card), var(--draggy) 20%);
		}

		.content {
			flex: 1 1 auto;
			padding: var(--pad);
		}

		.griptape {
			display: flex;
			justify-content: center;
			align-items: center;

			width: 1.5em;
			flex: 0 0 auto;
			background: var(--card);

			svg {
				opacity: 0.5;
			}
		}

		.actions {
			margin-top: var(--pad);
		}
	}

	.dropzone {
		flex: 1 0 auto;
		content: "";
		width: 100%;
		height: 5em;
		border: 2px dashed color-mix(in oklch, transparent, currentColor 20%);
		border-radius: var(--round);

		display: flex;
		justify-content: center;
		align-items: center;

		&::before {
			opacity: 0.3;
			content: "drag controller here";
		}
	}
}

}`

