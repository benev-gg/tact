
import {css} from "lit"
export default css`@layer view {

.plate {
	user-select: none;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--pad);
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
	}

	.box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: var(--pad);

		border-style: dashed;
		border-width: 2px;
		border-color: oklch(from var(--text) l c h / 30%);
		background: transparent;
		box-shadow: none;

		button {
			display: flex;
			flex-direction: column;
			svg {
				width: 2.5em;
				height: 2.5em;
			}
		}
	}
}

.card {
	display: flex;
	flex-direction: column;

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
		--tint: oklch(0.7 0.3 var(--hue, 0));
		background: color-mix(in oklch, transparent, var(--bg) 50%);
		border: 2px solid var(--shimmer);
		box-shadow:
			inset 0 0 2em color-mix(in oklch, transparent, var(--shimmer)),
			var(--box-shadow);

		&:hover {
			background: color-mix(in oklch, transparent, var(--bg) 70%);
			filter: brightness(120%);
		}

		[view="profile-select"]::part(select) {
			--base: oklch(from var(--tint) l c h / 50%);
		}
	}

	.controller {
		cursor: grab;
		display: flex;
		align-items: center;

		gap: var(--pad);
		padding: var(--nib);

		border-radius: 0.5em;
		overflow: clip;

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

