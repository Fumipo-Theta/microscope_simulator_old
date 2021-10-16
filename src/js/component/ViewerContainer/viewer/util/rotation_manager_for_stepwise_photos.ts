import { IRotationManager } from '@src/js/type/sample_viewer'
import { cycleBy, stepBy, mirrorBy, rotateSign } from "@src/js/rotation_degree_handlers"

export default class RotationManagerForStepwisePhotos implements IRotationManager {
    private sampleRotateClockwise: boolean;
    private unitOfStep: number;
    private totalSteps: number;
    private unitOfCycle: number;
    private requiredImageNumber: number;


    constructor(sampleRotationIsClockwise: boolean, unitOfStep: number, unitOfCycle: number) {
        this.sampleRotateClockwise = sampleRotationIsClockwise
        this.unitOfStep = unitOfStep
        const requiredImageNumber = unitOfCycle / unitOfStep + 1
        this.unitOfCycle = unitOfCycle
        this.requiredImageNumber = requiredImageNumber
        this.totalSteps = requiredImageNumber * 2
    }

    private assertValidRotation(rotation: number) {
        if (rotation < 0 || 360 <= rotation) {
            throw new Error("rotation must be in [0, 360)")
        }
    }

    private circulateRotation(rotation: number): number {
        if (rotation < 0) {
            return rotation + 360
        } else if (rotation > 360) {
            return rotation - 360
        } else {
            return rotation
        }
    }

    public getAlpha(rotation: number): number {
        this.assertValidRotation(rotation)

        const residue = rotation - stepBy(this.unitOfStep)(rotation) * this.unitOfStep
        return 1 - Math.abs(residue) / this.unitOfStep
    }

    public getImageNumberToBeShown(rotation: number, extraSteps: number = 0): number {
        this.assertValidRotation(rotation)

        const netRotation = this.circulateRotation(rotation + extraSteps * this.unitOfStep)
        if (this.unitOfCycle > 0) {
            const actualStep = stepBy(this.unitOfStep)(this.sampleRotateClockwise ? 360 - netRotation : netRotation)
            return cycleBy(this.requiredImageNumber - 1)(actualStep)
        } else {
            return mirrorBy(this.requiredImageNumber)(
                cycleBy(this.totalSteps)(
                    stepBy(this.unitOfStep)(netRotation)
                )
            )
        }
    }

    public calcRotationDegreesOfImage(rotation: number, extraSteps: number = 0): number {
        const nth = this.getImageNumberToBeShown(rotation, extraSteps)
        return rotateSign(this.sampleRotateClockwise) * (rotation + this.unitOfStep * nth) / 180 * Math.PI
    }

    public getRequiredImageNumber(): number {
        return this.requiredImageNumber
    }
}