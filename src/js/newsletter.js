document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("newsletter-form");
    const emailInput = document.getElementById("newsletter-email");
    const message = document.getElementById("newsletter-message");

    // For debugging environment variables
    console.warn("Environment check:", {
        serverUrl: import.meta.env.VITE_SERVER_URL,
        hasApiKey: !!import.meta.env.VITE_API_KEY
    });

    // Function to validate email format
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();

        // Check if email is empty or invalid
        if (!email || !isValidEmail(email)) {
            message.textContent = "Please enter a valid email address.";
            message.style.color = "red";
            return;
        }

        try {
            // Get existing subscribers or initialize empty array
            const existingSubscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
            
            // Check if email already exists
            if (existingSubscribers.some(sub => sub.email === email)) {
                message.textContent = "This email is already subscribed!";
                message.style.color = "orange";
                return;
            }

            // Add new subscriber
            existingSubscribers.push({
                email,
                date: new Date().toISOString()
            });

            // Save back to localStorage
            localStorage.setItem('subscribers', JSON.stringify(existingSubscribers));

            // Success message
            message.textContent = "🎉 Thank you for subscribing!";
            message.style.color = "green";
            emailInput.value = ""; // Clear input

            // Log for verification (you can remove this in production)
            console.warn("Current subscribers:", existingSubscribers);

        } catch (error) {
            console.error("Error:", error);
            message.textContent = "⚠️ Something went wrong. Try again.";
            message.style.color = "red";
        }
    });
});