
import {css} from "lit"
export default css`@layer view {

:host {
	display: block;
	color: var(--text);
	text-shadow: var(--text-shadow);
}

[view="shiny-tabs"] {
	display: block;

	&::part(tabs) {
		display: flex;
		justify-content: center;
	}
}

}`

