
import {html} from "lit"
import {shadowDuplex, useCss, useName} from "@e280/sly"

import styleCss from "./style.css.js"
import themeCss from "../theme.css.js"
import {Visualizer} from "./visualizer.js"

export const [VisualizerView, makeVisualizerElement] = shadowDuplex((visualizer: Visualizer) => {
	useName("visualizer")
	useCss(themeCss, styleCss)

	return html`
		<slot></slot>
		<output class=viz>${visualizer.$hex()}</output>
	`
})

