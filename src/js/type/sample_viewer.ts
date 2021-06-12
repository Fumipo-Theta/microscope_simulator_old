export interface IRotationManager {
    getAlpha(rotate: number): number;
    getImageNumberToBeShown(rotate: number, extraSteps: number): number;
    calcRotationDegreesOfImage(rotate: number, extraSteps: number): number;
}
