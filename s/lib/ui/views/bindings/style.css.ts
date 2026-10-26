
import {css} from "lit"
export default css`@layer view {

:host {
	--subtle: #fff2;
	--prime: #75dc66;
}

.bindings {
	user-select: none;
	cursor: default;

	summary {
		font-weight: bold;
		font-size: 1.2em;
		color: var(--prime);
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

