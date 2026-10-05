
export type Sample = [
	time: number,
	code: string,
	value: number,
]

export type Source = {
	onSample: (fn: (sample: Sample) => void) => () => void
}

