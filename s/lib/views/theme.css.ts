
import {cssReset} from "@e280/sly"
import {css} from "lit"

export default css`
@layer theme, view;
@layer theme {

${cssReset}


[theme-button] {
	display: flex;
	align-items: center;
	justify-content: center;
	font: inherit;

	cursor: pointer;
	opacity: 0.8;
	gap: 0.5em;
	padding: 0.5em;

	&:is(:hover, :focus-visible) { opacity: 1; }
	&:active { opacity: 0.8; }

	svg {
		width: 1.2em;
		height: 1.2em;
	}

	&[theme-button~="naked"] {
		padding: 0;
		border: none;
		background: transparent;
		color: currentColor;
	}

	&[theme-button~="angry"] {
		&:is(:hover, :focus-visible) { color: red; }
	}
}

}`

