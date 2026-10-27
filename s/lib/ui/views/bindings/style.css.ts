
import {css} from "lit"
export default css`@layer view {

:host {
	--subtle: #fff2;
	--prime: #75dc66;
}

.plate {
	display: flex;
	flex-direction: column;
	gap: var(--nib);
}

.topbar {
	display: flex;
	justify-content: end;
}

.bindings {
	user-select: none;
	cursor: default;
	padding: var(--space);

	summary {
		font-weight: bold;
		font-size: 1.2em;
		color: var(--prime);
		&:is(:hover, :focus-visible) { filter: brightness(120%); }
		&:active { filter: brightness(90%); }
	}

	.expression {
		display: flex;
		margin-left: 0.5em;
		border-bottom: 1px dashed var(--subtle);

		> strong {
			font-weight: normal;
		}

		> span {
			margin-left: auto;
		}
	}

	.children {
		margin-left: 0.3em;
		padding-left: 0.5em;
		border-left: 1px solid var(--subtle);
	}
}

}`

