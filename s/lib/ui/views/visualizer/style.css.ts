
import {css} from "lit"
export default css`@layer view {

:host {
	display: block;
}

output {
	opacity: 0.5;
	color: var(--prime);
	font-size: 1em;
	font-family: monospace;
	display: block;
	overflow-wrap: anywhere;
	text-overflow: ellipsis;
	height: 8em;
	padding: 0 4em;
	overflow: hidden;
}

}`

