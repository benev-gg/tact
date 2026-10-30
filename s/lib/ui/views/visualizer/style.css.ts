
import {css} from "lit"
export default css`@layer view {

:host {
	display: block;
}

output {
	opacity: 0.5;
	display: block;

	font-size: 1em;
	height: 8em;

	overflow: hidden;
	overflow-wrap: anywhere;

	font-family: monospace;
	color: var(--prime);
	text-overflow: ellipsis;
}

}`

