export default async function sendContactMessage(e) {
    if (Array.from(e.target.classList).includes("pending")) return

    const messageDOM = document.querySelector("#form-contact .form-message")
    const button = e.target
    button.classList.add("pending")

    messageDOM.classList.add("inactive")
    messageDOM.classList.remove("success")
    messageDOM.classList.remove("error")

    const form = document.querySelector("#form-contact")
    const selection = form.querySelector("#select-contact_topic")
    const topic = selection[selection.selectedIndex].value
    const message = form.querySelector("textarea").value
    const from = form.querySelector("input[type=email").value

    if (topic === "") {
        button.classList.remove("pending")
        messageDOM.innerHTML = "Select topic !"
        messageDOM.classList.add("error")
        messageDOM.classList.remove("inactive")
        return false
    }

    if (message === undefined || message == "") {
        button.classList.remove("pending")
        messageDOM.innerHTML = "Write message !"
        messageDOM.classList.add("error")
        messageDOM.classList.remove("inactive")
        return false
    }

    const obj = {
        "from": from,
        "title": topic,
        "body": message
    }

    const method = "POST";
    const body = JSON.stringify(obj);
    const headers = {
        'Accept': 'text/plain,application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',

    };

    console.log({ method, headers, body })

    try {
        const response = await fetch("https://dgo96yhuni.execute-api.us-east-1.amazonaws.com/contactapi/contact", { method, headers, body, 'mode': 'no-cors' })
        messageDOM.innerHTML = "Success. Thank you for contributing !"
        messageDOM.classList.add("success")
        messageDOM.classList.remove("inactive")
    } catch (e) {
        console.log(e)
        messageDOM.innerHTML = "Network error !"
        messageDOM.classList.add("error")
        messageDOM.classList.remove("inactive")
    }
    button.classList.remove("pending")

    return false
}
