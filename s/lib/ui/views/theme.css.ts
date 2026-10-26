
import {css} from "lit"
import {cssReset} from "@e280/sly"

export default css`
@layer theme, view;
@layer theme {

${cssReset}

:host {
	--text: #fffc;
	--bg: transparent;
	--card: #7896;
	--card-unassigned: #8884;
	--card-box: #8883;

	--slate: #28395970;
	--gem: #1e348c;
	--gem-shimmer: cyan;

	--draggy: rebeccapurple;
	--droppy: cyan;

	--round: 0.5em;
	--pad: 0.5em;
	--nib: 0.2em;
	--space: 1em;
	--box-shadow: 0.1em 0.2em 1em #0006;
	--text-shadow: 0.02em 0.04em 0.1em #000a;
}

[theme-card] {
	--shimmer: oklch(from var(--slate) calc(l * 2) calc(c * 1.5) h);
	background: var(--slate);
	border: 1px solid var(--shimmer);
	border-radius: var(--round);
	box-shadow:
		inset 0 0 2em color-mix(in oklch, transparent, var(--shimmer)),
		var(--box-shadow);

	&[theme-card="dull"] {
		--slate: #4444;
	}
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

