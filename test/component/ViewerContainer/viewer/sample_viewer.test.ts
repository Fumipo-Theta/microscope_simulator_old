import RotationManagerForStepwisePhotos from "@src/js/component/ViewerContainer/viewer/rotation_manager_for_stepwise_photos";

describe("RotationManagerForStepwisePhotos", () => {
    describe.each([
        new RotationManagerForStepwisePhotos(true, 15, 180)
    ])("RotationManagerForStepwisePhotos(true, 15, 180)", (manager) => {
        describe("getAlpha", () => {
            test.each(
                [
                    [0, 1],
                    [3.75, 0.75],
                    [7.5, 0.5],
                    [11.25, 0.25],
                    [15, 1],
                    [22.5, 0.5],
                    [30, 1],
                    [180, 1],
                    [183.75, 0.75],
                    [187.5, 0.5],
                    [191.25, 0.25],
                    [195, 1],
                    [352.5, 0.5]
                ]
            )("should return from 1 to 0 according to the distance from step", (rotation, expected) => {
                expect(manager.getAlpha(rotation)).toBe(expected)
            })

            test.each([
                -1, 360, 361
            ])("should throw Error for rotation out of range", (rotation) => {
                expect(() => manager.getAlpha(rotation)).toThrow()
            })
        })

        describe("getImageNumberToBeShown", () => {
            test.each([
                [0, 0, 0],
                [14, 0, 11],
                [15, 0, 11],
                [179, 0, 0],
            ])("should return index number of image to be selected (%i, %i)", (rotation, extraSteps, expected) => {
                expect(manager.getImageNumberToBeShown(rotation, extraSteps)).toBe(expected)
            })
        })
    })
})