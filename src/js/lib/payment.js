'use strict';

// Create a Stripe client.
const stripe = Stripe('pk_live_M3gHx2rVryQR68o4sn8PdF7y');
// Create an instance of Elements.
const elements = stripe.elements();
// Create an instance of the card Element.
const card = elements.create('card', {
    hidePostalCode: true,
});

const displayError = document.querySelector('#card-errors');
const displaySuccess = document.querySelector("#card-success");

const loadingAnime = document.querySelector("#form-loader");
const formCard = document.querySelector("#payment-form");

const amountTable = {
    "ja": {
        "placeholder": "",
        "small": 100,
        "middle": 1000,
        "large": 10000
    },
    "en": {
        "placeholder": "",
        "small": 1,
        "middle": 10,
        "large": 100
    }
};

const currencyTable = {
    "ja": "jpy",
    "en": "usd"
};

(function () {

    // Add an instance of the card Element into the `card-element` <div>.
    card.mount('#card-element');

    // Handle real-time validation errors from the card Element.
    card.addEventListener('change', function (event) {

        if (event.error) {
            displayError.innerHTML = (event.error.message);
            displayError.style.display = "block";
        } else {
            displayError.style.display = "none";
        }
    });
})();

const stripeTokenHandler = param => token => {


    const apigClient = apigClientFactory.newClient({ region: 'us-east-1' });

    apigClient.rootPost({}, {
        token: token.id,
        parameters: param,
    }, { "headers": { "Content-Type": "application/json" } })
        .then(function (data) {
            console.log(data);
            loadingAnime.classList.add("inactive")
            formCard.classList.remove("inactive")
            displaySuccess.classList.remove("inactive")
            //決済成功時の処理
        })
        .catch(function (err) {
            loadingAnime.classList.add("inactive")
            formCard.classList.remove("inactive")
            console.log(err);
            //決済失敗時の処理
        });
}

function selectCountry() {
    const code = (window.navigator.languages && window.navigator.languages[0]) ||
        window.navigator.language ||
        window.navigator.userLanguage ||
        window.navigator.browserLanguage;

    return code === "ja" ? "ja" : "en";
}

function changeAmount(e) {
    const amountSelector = document.querySelector("#select-amount");

    const amountType = amountSelector.options[amountSelector.selectedIndex].value;

    const countryCode = selectCountry()

    const amount = amountTable[countryCode][amountType]

    document.querySelector("#show-amount").innerHTML = amount + currencyTable[countryCode].toUpperCase();
}

document.querySelector("#select-amount").addEventListener(
    "change",
    changeAmount,
    false
)

// Handle form submission.
document.querySelector("#payment-form").addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

        loadingAnime.classList.remove("inactive")
        formCard.classList.add("inactive")
        displaySuccess.classList.add("inactive")

        const errorElement = document.querySelector('#card-errors');
        const amountSelector = document.querySelector("#select-amount");

        const amountType = amountSelector.options[amountSelector.selectedIndex].value;
        const countryCode = selectCountry()
        const amount = amountTable[countryCode][amountType]
        const currency = currencyTable[countryCode]

        if (amountType === "placeholder") {
            errorElement.innerHTML = ("Please select amount.");
            errorElement.style.display = "block";
            loadingAnime.classList.add("inactive")
            formCard.classList.remove("inactive")
            return
        }

        stripe.createToken(card).then(function (result) {

            if (result.error) {
                // Inform the user if there was an error.
                errorElement.innerHTML = (result.error.message);
                errorElement.style.display = "block";
                loadingAnime.classList.add("inactive")
                formCard.classList.remove("inactive")
            } else {
                // Send the token to your server.
                errorElement.style.display = "none";
                stripeTokenHandler({
                    "amount": amount,
                    "currency": currency
                })(result.token);

            }
        });

    },
    false
)

window.addEventListener("load",
    e => {
        changeAmount(e)
        formCard.classList.remove("inactive")

    },
    false
)
