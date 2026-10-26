
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
		outline: 2px dashed color-mix(in oklch, transparent, var(--droppy) 80%);
		background: color-mix(in oklch, var(--card), var(--droppy) 20%);

		&[data-dropping] {
			outline: 2px solid var(--droppy);
			background: color-mix(in oklch, var(--card), var(--droppy) 50%);
		}
	}
}

.ports {
	display: grid;
	grid-template-columns: repeat(
		auto-fit,
		minmax(min(100%, 20em), 1fr)
	);

	width: min(100%, calc(48em + var(--pad)));
	gap: var(--pad);

	> * {
		min-width: 0;
		min-height: 6em;

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

.unassigned-ports {
	width: min(100%, 24em);
	grid-template-columns: 1fr;
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
		padding: var(--nib) var(--pad);
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
		align-items: center;

		gap: var(--pad);
		padding: var(--nib);

		border-radius: 0.5em;
		background: oklch(from var(--card) l 0.15 var(--hue, 0));

		overflow: clip;
		box-shadow: var(--box-shadow);

		&:hover {
			filter: brightness(110%);
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

		.label {
			display: flex;
			align-items: center;
			gap: var(--pad);
			min-width: 0;

			flex: 1 1 auto;
			font-size: 1em;
			font-weight: normal;

			.icon {
				display: flex;
				flex: 0 0 auto;
				svg {
					width: 2em;
					height: 2em;
				}
			}

			.name {
				min-width: 0;
				line-height: 1.1;
				font-size: 0.7em;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}

		select {
			padding: var(--nib) var(--pad);
		}
	}
}

}`

