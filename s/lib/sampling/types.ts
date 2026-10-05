
export type Sample = [code: string, value: number]
export type SampleFrame = [time: number, samples: Sample[]]

export type Source = {
	onSample: (fn: (sample: Sample) => void) => () => void
}

