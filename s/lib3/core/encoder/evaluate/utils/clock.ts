
export class Clock {
	since = 0
	last: number | undefined

	update(time: number) {
		this.since = time - (this.last ?? time)
		this.last = time
	}
}

