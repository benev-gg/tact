
import {css} from "lit"
export default css`@layer view {

:host {
	display: block;
}

[view="shiny-tabs"] {
	display: block;

	&::part(tabs) {
		display: flex;
		justify-content: center;
	}
}

}`

