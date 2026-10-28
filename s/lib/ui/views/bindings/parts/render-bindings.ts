
import {html} from "lit"
import {Content} from "@e280/sly"
import {Bindings} from "../../../../input/types.js"
import {RecorderView} from "../subviews/recorder.js"
import {ExpressionView} from "../subviews/expression.js"
import {isExpression} from "../../../../input/investigate/is-expression.js"

export function renderBindings(
		isReadonly: boolean,
		bindings: Bindings,
		original: Bindings,
		update: (b: Bindings) => void,
	): Content {

	if (isExpression(bindings))
		return ExpressionView(bindings, update)

	return Object.entries(bindings).map(([key, child]) => (
		isExpression(child)
			? renderExpression(isReadonly, bindings, original as any, update, key)
			: renderGroup(isReadonly, bindings, original as any, update, key)
	))
}

function renderGroup(
		isReadonly: boolean,
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
					isReadonly,
					bindings[key],
					original[key],
					fresh => update({...bindings, [key]: fresh}),
				)}
			</div>
		</details>
	`
}

function renderExpression(
		isReadonly: boolean,
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
			${RecorderView(up, reset, renderBindings(isReadonly, bindings[key], original[key], up))}
		</div>
	`
}

