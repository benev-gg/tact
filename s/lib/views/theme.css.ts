
import {css} from "lit"
import {cssReset} from "@e280/sly"

export default css`
@layer theme, view;
@layer theme {

${cssReset}

:host {
	--bg: #000;
	--card: #7896;
	--card-unassigned: #8884;

	--draggy: rebeccapurple;
	--droppy: cyan;

	--round: 0.5em;
	--pad: 0.5em;
	--space: 1em;
	--box-shadow: 0.1em 0.2em 0.9em #0004;
}

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

