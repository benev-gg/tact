
export class Clock {
	since = 0
	last: number | undefined

	constructor(public time = performance.now()) {}

	update(time = performance.now()) {
		this.since = time - (this.time ?? time)
		this.last = this.time
		this.time = time
	}
}

