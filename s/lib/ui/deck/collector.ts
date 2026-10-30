
import {Bindings} from "../../input/types.js"

// TODO wip

export class Collector<B extends Bindings> {
	constructor(private bindings: B) {}
}

