
import {css} from "lit"
export default css`

* {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}

.plate {
	display: flex;
	flex-direction: column;
	gap: 1em;
}

.stats {
	display: flex;
	flex-wrap: wrap;
	gap: 0.3em;
	> span {
		display: block;
		background: #333;
		border-radius: 1em;
		padding: 0.1em 0.3em;
		border: 1px solid #8888;
	}
}

.device {
	display: flex;
	flex-direction: column;
	gap: 0.4em;

	ul {
		display: flex;
		flex-wrap: wrap;
		list-style: none;
		gap: 0.2em;
		padding: 0;

		font-family: monospace;

		> li {
			position: relative;
			display: flex;
			justify-content: space-between;

			font-size: 0.6em;
			padding: 0.2em;
			min-width: 16em;
			background: #555;

			&::before {
				position: absolute;
				z-index: 1;
				display: block;
				content: "";
				inset: 0;
				background: #08f4;
				width: var(--percent);
			}

			&[data-neg]::before {
				background: #f004;
			}

			> span {
				position: relative;
				z-index: 2;
			}
		}
	}
}

`

