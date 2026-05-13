async function login(){

    const mobileNo = document.getElementById("mobileNo").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");
    const loginBtn = document.getElementById("loginBtn");

    if(!mobileNo || !password){
        message.innerText = "Please fill all fields";
        return;
    }

    try{

        // Loading state
        loginBtn.innerText = "Signing In...";
        loginBtn.disabled = true;

        const response = await fetch(
            "http://localhost:8080/api/auth/login",
            {
                method: "POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body: JSON.stringify({
                    mobileNo: mobileNo,
                    password: password
                })
            }
        );

        const data = await response.json();

        if(response.ok){

            localStorage.setItem("token", data.token);

            // small delay for smooth UX
            setTimeout(()=>{
                window.location.href = "dashboard.html";
            }, 800);

        }else{

            message.innerText =
                data.message || "Login Failed";

            loginBtn.innerText = "Sign In";
            loginBtn.disabled = false;
        }

    }catch(error){

        message.innerText = "Server Error";

        loginBtn.innerText = "Sign In";
        loginBtn.disabled = false;

        console.error(error);
    }
}