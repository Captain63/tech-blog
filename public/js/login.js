const loginForm = document.querySelector("#login");

const logUserIn = async (event) => {
    event.preventDefault();

    const email = document.querySelector("#loginEmail").value.trim();
    const password = document.querySelector("#loginPassword").value.trim();

    const response = await fetch('/api/users/login', {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        // Wait 0.5 seconds for session cookie to update so that user is now flagged as logged in before redirecting
        setTimeout(() => {
            document.location.replace('/dashboard');
        }, 500);
    } else {
        alert("Email or password not recognized. Please try again.")
    }
}

loginForm.addEventListener("submit", logUserIn);