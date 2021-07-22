export const stepBy = unit => val => Math.floor(val / unit)

export const cycleBy = unit => val => {
    const cycle_count = Math.floor(val / unit)
    return val < 0
        ? val + unit
        : (unit <= val)
            ? val - unit * cycle_count
            : val
}

export const mirrorBy = (center) => val => val > center ? 2 * center - val : val

export const rotateSign = (clockwise = true) => clockwise ? -1 : 1
