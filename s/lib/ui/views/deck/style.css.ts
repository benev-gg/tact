
import {css} from "lit"
export default css`@layer view {

:host {
	display: block;
	color: var(--text);
	text-shadow: var(--text-shadow);
}

[view="shiny-tabs"] {
	display: flex;
	flex-direction: column;
	align-items: center;

	&::part(tabs) {
		--shimmer: oklch(from var(--slate) calc(l * 2) calc(c * 1.5) h);

		display: flex;
		width: max-content;
		justify-content: center;
		padding: var(--nib);

		background: var(--slate);
		border: 1px solid var(--shimmer);
		border-radius: var(--round);
	}

	&::part(panels) {
		display: block;
		width: 100%;
	}

	button {
		border: none;
		background: transparent;
		border-radius: var(--round);
		border: 2px solid transparent;

		&[data-tabbed] {
			text-decoration: none;
			color: var(--gem-shimmer);
			background: var(--gem);
			border-color: color-mix(in oklch, #fff4, var(--gem-shimmer));
			box-shadow:
				inset 0 0 1.5em oklch(from var(--gem-shimmer) l c h / 50%),
				0 0 2em oklch(from var(--gem-shimmer) l c h / 50%);
		}
	}
}

}`

