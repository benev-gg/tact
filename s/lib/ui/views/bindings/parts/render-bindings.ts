
import {html} from "lit"
import {Content} from "@e280/sly"
import {Bindings} from "../../../../input/types.js"
import {RecordingView} from "../subviews/recording.js"
import {ExpressionView} from "../subviews/expression.js"
import {isExpression} from "../../../../input/investigate/is-expression.js"

export function renderBindings(
		bindings: Bindings,
		original: Bindings,
		update: (b: Bindings) => void,
	): Content {

	if (isExpression(bindings))
		return ExpressionView(bindings, update)

	return Object.entries(bindings).map(([key, child]) => (
		isExpression(child)
			? renderExpression(bindings, original as any, update, key)
			: renderGroup(bindings, original as any, update, key)
	))
}

function renderGroup(
		bindings: Record<string, Bindings>,
		original: Record<string, Bindings>,
		update: (b: Bindings) => void,
		key: string,
	) {

	return html`
		<details class=group open>
			<summary>${key}</summary>
			<div class=children>
				${renderBindings(
					bindings[key],
					original[key],
					fresh => update({...bindings, [key]: fresh}),
				)}
			</div>
		</details>
	`
}

function renderExpression(
		bindings: Record<string, Bindings>,
		original: Record<string, Bindings>,
		update: (b: Bindings) => void,
		key: string,
	) {

	const up = (fresh: Bindings) => update({...bindings, [key]: fresh})
	const reset = () => up(original[key])

	return html`
		<div class=expression>
			<strong>${key}</strong>
			${RecordingView(up, reset, renderBindings(bindings[key], original[key], up))}
		</div>
	`
}

