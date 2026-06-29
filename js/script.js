console.log("Portfolio Loaded");

document.addEventListener("DOMContentLoaded", function () {

    emailjs.init({
        publicKey: "KVk9UYJh5XQr23EE_"
    });

    const form = document.getElementById("contact-form");

    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const button = form.querySelector("button");
        const originalText = button.innerText;

        button.disabled = true;
        button.innerText = "Sending...";

        emailjs.sendForm(
            "service_3zbdmw8",
            "template_dzw08a9",
            form
        )
        .then(() => {
            alert("Message sent successfully!");
            form.reset();
        })
        .catch((error) => {
            console.log("EmailJS Error:", error);
            alert("Failed to send message.");
        })
        .finally(() => {
            button.disabled = false;
            button.innerText = originalText;
        });

    });

});