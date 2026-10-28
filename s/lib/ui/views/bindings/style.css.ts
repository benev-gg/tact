
import {css} from "lit"
export default css`@layer view {

.plate {
	display: flex;
	flex-direction: column;
}

.topbar {
	display: flex;
	justify-content: center;
	padding: var(--pad);
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
		border-bottom: 1px dashed var(--subtle);
		flex-wrap: wrap;
		gap: 0 var(--pad);

		min-height: 2.3em;

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
			gap: var(--nib) var(--pad);
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
		border-left: 1px solid var(--subtle);
	}

	.expression .recorder {
		display: flex;
		gap: var(--pad);

		&[data-recording] {
			color: var(--prime);
		}
	}
}

}`

