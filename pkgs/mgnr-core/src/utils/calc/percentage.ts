
export const roundFloatPercent = (n: number) => Math.round(n * 100) / 100

export const toFloatPercent = (percentInInt: number) => roundFloatPercent(percentInInt * 0.01)