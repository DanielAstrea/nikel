const myModal = new bootstrap.Modal("#transactions-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let cashIn = [];
let cashOut = [];
let data = {
    transactions: []
};

document.getElementById("button-logout").addEventListener("click", logout);
document.getElementById("transactions-button").addEventListener("click", function() {
    window.location.href = "transactions.html"
})

//ADICIONAR LANÇAMENTO
document.getElementById("transactions-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const type = document.querySelector('input[name="type-input"]:checked').value;

    data.transactions.unshift({
        value: value, type: type, description: description, date: date
    })

    saveData(data);
    e.target.reset();
    myModal.hide();

    GetCashOut();
    GetCashIn();
    getTotal();

    alert("Lançamento adicionado com sucesso.");
})


checklogged();


function checklogged() {
    if (session) {
        sessionStorage.setItem("logged", session);
        logged = session;
    }

    if (!logged) {
        window.location.href = "index.html";
        return;

    }

    const dataUser = localStorage.getItem(logged);
    if (dataUser) {
        data = JSON.parse(dataUser);
    }

    GetCashOut();
    GetCashIn();
    getTotal();

}

function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");

    window.location.href = "index.html";

}

function GetCashOut() {
    const transactions = data.transactions;

    const CashIn = transactions.filter((item) => item.type === "1");

    if (CashIn.length) {
        let CashInHtml = ``;
        let limit = 0;

        if (CashIn.length > 5) {
            limit = 5;
        } else {
            limit = CashIn.length;

        }

        for (let index = 0; index < limit; index++) {
            CashInHtml += `
             <div class="row m-4">
             <div class="col-12">
                 <h3 class="fs-2">R$ ${CashIn[index].value.toFixed(2)}</h3>
                 <div class="container p-0">
                     <div class="row">
                         <div class="col-12 col-md-8">
                           <p>${CashIn[index].description}</p>  
                         </div>
                         <div class="col-12 col-md-3 d-flex justify-content-end">
                             ${CashIn[index].date}
                         </div>
                     </div>
                 </div>
             </div>
         </div>
             `

        }

        document.getElementById("cash-in-list").innerHTML = CashInHtml;
    }
}
 
function getTotal() {
    const transactions = data.transactions;
     let total = 0;
    
     transactions.forEach((item) => {
        if(item.type === "1") {
            total += item.value;
        } else {
            total -= item.value;
        }
    });

    document.getElementById("total").innerHTML = `RS$ ${total.toFixed(2)}`;
}

function saveData(data) {
    localStorage.setItem(data.login, JSON.stringify(data));
}