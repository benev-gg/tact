
import {css} from "lit"
export default css`@layer view {

.plate {
	display: flex;
	flex-direction: column;
}

.topbar {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	padding: var(--pad) var(--space);

	[view="profile-select"] {
		font-size: 1.2em;
	}

	.corner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--pad);

		p {
			opacity: 0.5;
			font-style: italic;
		}
	}

	.tools {
		display: flex;
		flex-wrap: wrap;
		gap: var(--pad);
		flex: 1 1 auto;
		justify-content: end;
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
	padding: var(--space);

	summary {
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

		> strong {
			font-weight: normal;
		}

		> div {
			margin-left: auto;

			input {
				font: inherit;
				color: inherit;
				width: 8em;

				&[type="number"] {
					width: 5em;
				}
			}
		}

		div {
			display: flex;
			flex-wrap: wrap;
			align-items: stretch;
			gap: var(--nib);
		}

		.bracket {
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

