
export type Sample = {code: string, value: number}

export type Source = {
	readonly onSample: (fn: (sample: Sample) => void) => () => void
	readonly dispose: () => void
}

