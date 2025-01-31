document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("newsletter-form");
    const emailInput = document.getElementById("newsletter-email");
    const message = document.getElementById("newsletter-message");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent page reload

        const email = emailInput.value.trim();

        if (!email) {
            message.textContent = "Please enter a valid email.";
            message.style.color = "red";
            return;
        }

        const subscriber = { email, date: new Date().toISOString() };

        try {
            // Use environment variable for API URL
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/subscribers`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}` // If API requires auth
                },
                body: JSON.stringify(subscriber),
            });

            if (response.ok) {
                message.textContent = "🎉 Thank you for subscribing!";
                message.style.color = "green";
                emailInput.value = ""; // Clear input
            } else {
                throw new Error("Failed to subscribe.");
            }
        } catch (error) {
            console.error("Error:", error);
            message.textContent = "⚠️ Something went wrong. Try again.";
            message.style.color = "red";
        }
    });
});
