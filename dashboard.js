window.onload = async function(){

    const user = getCurrentUser();

    if(!user){

        logout();

        return;
    }

    // Show user info
    document.getElementById("userName")
        .innerText = user.name;

    document.getElementById("userType")
        .innerText = user.userType;


    // Load businesses
    await loadBusinesses();
};


async function loadBusinesses(){

    const token = getToken();

    const dropdown =
        document.getElementById("businessDropdown");

    try{

        const response = await fetch(
            "http://localhost:8080/api/businesses",
            {
                method:"GET",

                headers:{
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        const businesses =
            await response.json();

        dropdown.innerHTML =
            `<option value="">Select Business</option>`;

        businesses.forEach(business => {

            dropdown.innerHTML += `
                <option value="${business.id}">
                    ${business.businessName}
                </option>
            `;

        });

    }catch(error){

        console.error(error);

        dropdown.innerHTML =
            `<option>Error loading</option>`;
    }
}

async function onBusinessChange(){

    const businessId =
        document.getElementById(
            "businessDropdown"
        ).value;

    if(!businessId){
        return;
    }

    console.log(
        "Selected businessId:",
        businessId
    );

    await loadDashboardData(
        businessId
    );
}


async function loadDashboardData(
    businessId
){

    const token = getToken();

    try{

        console.log(
            "Calling dashboard API..."
        );

        const response =
            await fetch(
                `http://localhost:8080/api/dashboard/business/${businessId}`,
                {
                    method:"GET",

                    headers:{
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );

        console.log(
            "Dashboard response status:",
            response.status
        );

        const data =
            await response.json();

        console.log(
            "Dashboard response:",
            data
        );


        // Update summary cards
        document.getElementById(
            "totalIncome"
        ).innerText =
            "₹" + data.totalIncome;

        document.getElementById(
            "totalExpenditure"
        ).innerText =
            "₹" + data.totalExpenditure;

        document.getElementById(
            "currentFund"
        ).innerText =
            "₹" + data.currentFundBalance;

        document.getElementById(
            "profitLoss"
        ).innerText =
            "₹" + data.profitLoss;


        // Update statements
        renderStatements(
            data.recentStatements
        );

    }catch(error){

        console.error(
            "Dashboard API failed:",
            error
        );

    }

}

function renderStatements(
    statements
){

    console.log(
        "Rendering statements:",
        statements
    );

    const tableBody =
        document.getElementById(
            "statementTableBody"
        );

    tableBody.innerHTML = "";

    statements.forEach(statement => {

        tableBody.innerHTML += `

            <tr>

                <td>
                    ${statement.transactionType}
                </td>

                <td>
                    ₹${statement.amount}
                </td>

                <td>
                    ${statement.subject}
                </td>

                <td>
                    ${statement.transactionBy}
                </td>

                <td>
                    ${statement.note}
                </td>

                <td>
                    ${statement.updatedAt}
                </td>

            </tr>

        `;

    });

}