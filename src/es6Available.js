export default function es6Available() {
    return (typeof Symbol === "function" && typeof Symbol() === "symbol")
}
