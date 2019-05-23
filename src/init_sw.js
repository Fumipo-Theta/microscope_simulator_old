let newWorker

function postSkipWaiting() {
    if (newWorker) {
        newWorker.postMessage({ "action": "skipWaiting" })
    }
}


window.addEventListener('load', function () {

    if (navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener(
            "controllerchange",
            () => {
                window.location.reload()
            }
        )

        navigator.serviceWorker.register(
            './service_worker.js',
            { scope: '.', updateViaCache: "none" }
        )
            .then(function (registraion) {
                registraion.addEventListener(
                    "updatefound", () => {
                        console.log("update found")
                        newWorker = registraion.installing
                        newWorker.addEventListener(
                            "statechange", () => {
                                switch (newWorker.state) {
                                    case "installed":
                                        console.log("new worker installed ")
                                        if (navigator.serviceWorker.controller) {
                                            let notification = document.querySelector("#update_notification")
                                            notification.classList.remove("inactive")
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        )
                    }
                )
                registraion.update();
            })
            .then(function (registration) {
                console.log("serviceWorker registed.");
            })
            .catch(function (error) {
                console.warn("serviceWorker error.", error);
            });
    }
});
