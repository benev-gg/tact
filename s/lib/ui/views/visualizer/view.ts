
import {html} from "lit"
import {shadowDuplex, useCss} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"
import {Visualizer} from "./visualizer.js"

export const [VisualizerView, makeVisualizerElement] = shadowDuplex((visualizer: Visualizer) => {
	useCss(themeCss, styleCss)

	return html`
		<output class=viz>${visualizer.$hex()}</output>
	`
})

