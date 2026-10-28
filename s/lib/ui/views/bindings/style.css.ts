
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
		align-items: center;
		margin-left: 0.5em;
		border-bottom: 1px dashed var(--subtle);
		flex-wrap: wrap;
		gap: 0 var(--pad);

		> strong {
			font-weight: normal;
		}

		> div {
			margin-left: auto;
			input {
				width: 8em;
				font: inherit;
				color: inherit;
			}
		}

		.string {
			display: flex;
			align-items: stretch;
			gap: var(--nib);

			button {
				padding: 0 var(--pad);
			}

			&[data-recording] {
				color: var(--prime);
			}
		}

		.bracket {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			gap: var(--nib) var(--pad);
			padding: 0 var(--nib);
			--slate: #8881;
			box-shadow: 0.1em 0.2em 0.5em #0002;
		}
	}

	.children {
		margin-left: 0.3em;
		padding-left: 0.5em;
		border-left: 1px solid var(--subtle);
	}
}

}`

