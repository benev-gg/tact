
import {css} from "lit"
export default css`@layer view {

:host {
	display: block;
	width: min(50em, 100%);

	color: var(--text);
	text-shadow: var(--text-shadow);
}

.deck {
	padding: var(--pad);
	--tint: oklch(from var(--prime) l c h / 50%);
}

[view="shiny-tabs"] {
	--prime: inherit;

	--tint: var(--prime);
	--slate: color-mix(in oklch,
		transparent,
		color-mix(in oklch, var(--bg), var(--tint) 25%) 25%
	);
	--shimmer: color-mix(in oklch, transparent, var(--tint));

	display: flex;
	flex-direction: column;
	align-items: center;

	&::part(tabs) {
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
		margin-top: var(--pad);
	}

	button {
		border: none;
		background: transparent;
		border-radius: var(--round);
		border: 2px solid transparent;
		text-shadow: var(--text-shadow);

		&[data-tabbed] {
			text-decoration: none;
			color: var(--prime);
			border-color: var(--prime);
			background: color-mix(in oklch, var(--bg), var(--prime) 30%);
			box-shadow:
				inset 0 0 1.5em oklch(from var(--shimmer) l c h / 50%),
				0 0 2em oklch(from var(--shimmer) l c h / 50%);
		}
	}
}

}`

