import { stepBy, cycleBy, mirrorBy, rotateSign } from "@src/js/rotation_degree_handlers";

describe("stepBy", () => {
    test.each([
        { query: { unit: 15, rotation: 0 }, expected: 0 },
        { query: { unit: 15, rotation: 14 }, expected: 0 },
        { query: { unit: 15, rotation: 15 }, expected: 1 },
        { query: { unit: 15, rotation: 30 }, expected: 2 },
        { query: { unit: 15, rotation: -1 }, expected: -1 },
        { query: { unit: 15, rotation: -14 }, expected: -1 },
        { query: { unit: 15, rotation: -15 }, expected: -1 },

        { query: { unit: 30, rotation: 30 }, expected: 1 },
        { query: { unit: 30, rotation: 60 }, expected: 2 },
    ])("should return quotient", ({ query: { unit, rotation }, expected }) => {
        expect(stepBy(unit)(rotation)).toBe(expected)
    })
})

describe("cycleBy", () => {
    test.each([
        { query: { unit: 180, rotation: -180 }, expected: 0 },
        { query: { unit: 180, rotation: -1 }, expected: 179 },
        { query: { unit: 180, rotation: 0 }, expected: 0 },
        { query: { unit: 180, rotation: 179.9 }, expected: 179.9 },
        { query: { unit: 180, rotation: 180 }, expected: 0 },
        { query: { unit: 180, rotation: 181 }, expected: 1 },
        { query: { unit: 180, rotation: 359 }, expected: 179 },
        { query: { unit: 180, rotation: 360 }, expected: 0 },

        { query: { unit: 90, rotation: -1 }, expected: 89 },
        { query: { unit: 90, rotation: 90 }, expected: 0 },
        { query: { unit: 90, rotation: 91 }, expected: 1 },
        { query: { unit: 90, rotation: 180 }, expected: 0 },
    ])("should return residue by positive number", ({ query: { unit, rotation }, expected }) => {
        expect(cycleBy(unit)(rotation)).toBe(expected)
    })
})

describe("mirrorBy", () => {
    test.each(
        [
            { query: { center: 0, value: -1 }, expected: -1 },
            { query: { center: 0, value: 0 }, expected: 0 },
            { query: { center: 0, value: 1 }, expected: -1 },

            { query: { center: 90, value: -1 }, expected: -1 },
            { query: { center: 90, value: 89 }, expected: 89 },
            { query: { center: 90, value: 90 }, expected: 90 },
            { query: { center: 90, value: 91 }, expected: 89 },
            { query: { center: 90, value: 181 }, expected: -1 },

            { query: { center: 180, value: 181 }, expected: 179 },
        ]
    )("should return number having the same distance from the center if the value is larger than the center", ({ query: { center, value }, expected }) => {
        expect(mirrorBy(center)(value)).toBe(expected)
    })
})

describe("rotateSign", () => {
    test("should return -1 when clockwise is true", () => {
        expect(rotateSign(true)).toBe(-1)
    })

    test("should return 1 when clockwise is false", () => {
        expect(rotateSign(false)).toBe(1)
    })
})