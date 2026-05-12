async function login() {
     console.log("Login button clicked");

    const mobileNo = document.getElementById("mobileNo").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    try {

        const response = await fetch(
            "http://localhost:8080/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    mobileNo: mobileNo,
                    password: password
                })
            }
        );

        const data = await response.json();

        if(response.ok){

            console.log(data);

            // Save response
            localStorage.setItem(
                "userData",
                JSON.stringify(data)
            );

            // Redirect
            window.location.href = "dashboard.html";

        }else{
            message.innerText = data.message || "Login Failed";
        }

    } catch(error){
        message.innerText = "Server Error";
        console.error(error);
    }

}