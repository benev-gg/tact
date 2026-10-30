
import {css} from "lit"
import {cssReset} from "@e280/sly"

export default css`
@layer theme, view;
@layer theme {

${cssReset}

:host {
	--prime: var(--tact-prime, #fb0);

	--text: var(--tact-text, #fffc);
	--bg: var(--tact-bg, oklch(from var(--prime) calc(l * 0.3) calc(c * 0.1) h));
	--droppy: var(--tact-droppy, oklch(from var(--prime) l c calc(h + 100)));
	--recording: var(--tact-recording, oklch(from var(--prime) l c calc(h + 100)));

	--round: var(--tact-round, 0.5em);
	--pad: var(--tact-pad, 0.5em);
	--nib: var(--tact-nib, 0.2em);
	--space: var(--tact-space, 1em);
	--box-shadow: var(--tact-box-shadow, 0.1em 0.2em 1em #0006);
	--text-shadow: var(--tact-text-shadow, 0.02em 0.04em 0.1em #000a);
}

[theme-card] {
	--tint: var(--prime);
	--slate: color-mix(in oklch,
		transparent,
		color-mix(in oklch, var(--bg), var(--tint) 25%) 25%
	);
	--shimmer: color-mix(in oklch, transparent, var(--tint));

	border-radius: var(--round);
	background: var(--slate);
	border: 1px solid var(--shimmer);
	box-shadow:
		inset 0 0 3em color-mix(in oklch, transparent, var(--shimmer) 30%),
		var(--box-shadow);

	&[theme-card="dull"] {
		--tint: #8888;
	}
}

[theme-button] {
	display: flex;
	align-items: center;
	justify-content: center;
	font: inherit;
	color: inherit;

	cursor: pointer;
	user-select: none;

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

[theme-select] {
	--base: var(--tint, var(--prime));
	font: inherit;
	color: inherit;
	background: var(--bg);
	border: 1px solid var(--base);
	border-radius: var(--round);
	padding: var(--nib) var(--pad);
	box-shadow: inset 0 0 1em oklch(from var(--base) l c h / 40%);

	&:is(:hover, :focus-visible) {
		filter: brightness(110%);
		box-shadow: inset 0 0 1em oklch(from var(--base) l c h / 60%);
	}

	&:active {
		filter: brightness(90%);
		box-shadow: inset 0 0 1em oklch(from var(--base) l c h / 40%);
	}
}

[theme-input] {
	--base: var(--tint, var(--prime));
	--chill: oklch(from var(--base) l c h / 50%);
	font: inherit;
	color: inherit;
	background: transparent;
	border: 1px solid var(--chill);
	border-radius: var(--round);
	padding: 0 var(--nib);
	box-shadow: inset 0 0 1em oklch(from var(--chill) l c h / 20%);
}

}`

