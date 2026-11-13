
import {css} from "lit"
export default css`@layer view {

[part="plate"] {
	display: flex;
	flex-direction: column;
	gap: var(--space);
}

.topbar {
	display: flex;
	flex-direction: column;
	gap: var(--nib);

	[view="profile-select"] {
		font-size: 1.2em;
	}

	.interactive {
		display: flex;
		flex-wrap: wrap;
		gap: var(--pad);

		small {
			user-select: none;
			opacity: 0.5;
			padding: 0 var(--pad);
			font-style: italic;
		}

		input {
			margin-left: auto;
		}
	}

	.info {
		opacity: 0.5;
		padding: 0 var(--pad);
		font-size: 0.8em;
		font-style: italic;
	}
}

.bindings, .group {
	display: flex;
	flex-direction: column;
	gap: var(--nib);
}

.bindings {
	user-select: none;
	cursor: default;

	summary {
		cursor: pointer;
		color: var(--prime);
		width: max-content;
		font-weight: bold;
		font-size: 1.2em;
		&:is(:hover, :focus-visible) { filter: brightness(120%); }
		&:active { filter: brightness(90%); }
	}

	.expression {
		display: flex;
		align-items: end;
		margin-left: 0.5em;
		border-bottom: 1px dashed oklch(from var(--prime) l c h / 30%);
		flex-wrap: wrap;
		gap: 0 var(--pad);
		padding: var(--nib);

		min-height: 3em;

		&:last-of-type {
			margin-bottom: calc(var(--space) * 2);
		}

		div {
			display: flex;
			flex-wrap: wrap;
			align-items: stretch;
			gap: var(--nib);
		}

		> strong {
			font-weight: normal;
		}

		> div {
			flex-wrap: nowrap;
			margin-left: auto;
			padding-left: 1em;

			input {
				font: inherit;
				color: inherit;
				width: 8em;

				&[type="number"] {
					width: 5em;
				}
			}
		}

		.bracket {
			justify-content: end;
			align-items: center;
			gap: var(--nib);
			padding: 2px var(--nib);
			background: color-mix(in oklch, #aaa2, var(--slate) 80%);
			box-shadow: 0.1em 0.2em 0.5em #0002;
			border: 1px solid #fff4;
			border-radius: 0.2em;

			&.mod {
				gap: var(--nib);
			}

			> strong {
				margin-right: auto;
			}
		}
	}

	.children {
		display: flex;
		flex-direction: column;

		margin-left: 0.3em;
		padding-left: 0.5em;
		border-left: 1px solid oklch(from var(--prime) l c h / 20%);
	}

	.expression .recorder {
		display: flex;
		gap: var(--pad);

		&[data-recording] {
			color: var(--recording);
		}
	}
}

}`

