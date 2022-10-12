const apiURL = "https://emailvalidation.abstractapi.com/v1/?api_key=50c633691bcf4e89a2d44975aa9c833b"

const sendEmailValidationRequest = async (email) => {
    try {
        const response = await fetch.get(apiURL + '&email=' + email);
        const data = await response.json();
        // console.log(data)
    } catch (error) {
        alert("Email Validation", error.message)
    }
}