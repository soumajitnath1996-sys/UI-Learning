let currentPage = 0;
let totalPages = 1;

window.onload = function () {
  loadUserInfo();

  loadBusinesses();
};

function loadUserInfo() {
  const user = getCurrentUser();

  document.getElementById("userName").innerText = user.name;

  document.getElementById("userType").innerText = user.userType;
}

async function loadBusinesses() {
  try {
    console.log("Loading businesses...");

    const response = await fetch("http://localhost:8080/api/businesses", {
      headers: getAuthHeaders(),
    });

    const businesses = await response.json();

    const dropdown = document.getElementById("businessDropdown");

    dropdown.innerHTML = `<option value="">Select Business</option>`;

    businesses.forEach((business) => {
      dropdown.innerHTML += `
                <option value="${business.id}">
                    ${business.businessName}
                </option>
            `;
    });

    dropdown.addEventListener("change", loadStatements);
  } catch (error) {
    console.error("Business load failed", error);
  }
}

async function loadStatements() {
  try {
    const businessId = document.getElementById("businessDropdown").value;

    if (!businessId) return;

    const type = document.getElementById("transactionType").value;

    const by = document.getElementById("transactionBy").value;

    let url = `http://localhost:8080/api/statements/business/${businessId}?page=${currentPage}&size=10`;

    if (type) {
      url += `&transactionType=${encodeURIComponent(type)}`;
    }

    if (by) {
      url += `&transactionBy=${encodeURIComponent(by)}`;
    }

    console.log("Calling API:", url);

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      console.error("API failed:", response.status);

      return;
    }

    const data = await response.json();

    console.log("Statement response:", data);

    totalPages = data.totalPages;

    renderStatements(data.content);

    updatePagination();
  } catch (error) {
    console.error("Statement load failed", error);
  }
}

function renderStatements(statements) {
  const tableBody = document.getElementById("statementTableBody");

  tableBody.innerHTML = "";

  if (!statements || !Array.isArray(statements)) {
    console.error("Invalid statement data:", statements);

    tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No data found
                </td>
            </tr>
        `;

    return;
  }

  statements.forEach((statement) => {
    tableBody.innerHTML += `
            <tr>

                <td>${statement.transactionType || "-"}</td>

                <td>₹${statement.amount || 0}</td>

                <td>${statement.subject || "-"}</td>

                <td>${statement.transactionBy || "-"}</td>

                <td>${statement.note || "-"}</td>

                <td>${statement.updatedAt || "-"}</td>

            </tr>
        `;
  });
}

function applyFilters() {
  currentPage = 0;

  loadStatements();
}

function previousPage() {
  if (currentPage <= 0) {
    console.log("Already on first page");

    return;
  }

  currentPage--;

  console.log("Previous page:", currentPage);

  loadStatements();
}

function nextPage() {
  if (currentPage >= totalPages - 1) {
    console.log("Already on last page");

    return;
  }

  currentPage++;

  console.log("Next page:", currentPage);

  loadStatements();
}

function updatePagination() {
  document.getElementById("pageInfo").innerText =
    `Page ${currentPage + 1} of ${totalPages}`;
}
