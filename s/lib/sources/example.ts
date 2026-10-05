
import {sub} from "@e280/stz"
import {Sample, Source} from "../types.js"

export class ExampleSource implements Source {
	onSample = sub<[Sample]>()
}

