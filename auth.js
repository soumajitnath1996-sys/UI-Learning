function getToken(){
    return localStorage.getItem("token");
}

function parseJwt(token){

    if(!token){
        return null;
    }

    try{

        const base64Payload = token.split(".")[1];

        const payload = JSON.parse(
            atob(base64Payload)
        );

        return payload;

    }catch(error){

        console.error("Invalid token");

        return null;
    }
}

function getCurrentUser(){

    const token = getToken();

    return parseJwt(token);
}

function logout(){

    localStorage.clear();

    window.location.href = "login.html";
}