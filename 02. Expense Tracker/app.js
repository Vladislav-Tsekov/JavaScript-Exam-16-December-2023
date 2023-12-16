window.addEventListener("load", solve);

function solve() {

    const addBtn = document.getElementById('add-btn');
    const deleteBtn = document.querySelector('.btn.delete');
    const expenseTypeInput = document.getElementById('expense');
    const amountInput = document.getElementById('amount');
    const dateInput = document.getElementById('date');
    let previewList = document.getElementById('preview-list');
    let expensesList = document.getElementById('expenses-list');

    let currentExpenseType = '';
    let currentAmount = '';
    let currentDate = '';

    addBtn.addEventListener('click', transferDataFromInputToPreview);

    function transferDataFromInputToPreview() {
        let expenseType = expenseTypeInput.value;
        let amount = amountInput.value;
        let date = dateInput.value;

        if (expenseType == '' || amount == '' || date == '') {
            return;
        }

        currentExpenseType = expenseType;
        currentAmount = amount;
        currentDate = date;

        let typeParagraph = document.createElement('p');
        typeParagraph.innerHTML = `Type: ${expenseType}`;
        let amountParagraph = document.createElement('p');
        amountParagraph.innerHTML = `Amount: ${amount}$`;
        let dateParagraph = document.createElement('p');
        dateParagraph.innerHTML = `Date: ${date}`;

        let articleElement = document.createElement('article');
        let divElement = document.createElement('div');
        divElement.className = 'buttons';

        let editButton = document.createElement('button');
        editButton.className = 'btn edit';
        editButton.innerHTML = 'edit';
        editButton.addEventListener('click', editExpenseInfo);

        let okButton = document.createElement('button');
        okButton.className = 'btn ok';
        okButton.innerHTML = 'ok';
        okButton.addEventListener('click', addToExpenses);

        let liElement = document.createElement('li');
        liElement.className = 'expense-item';

        articleElement.appendChild(typeParagraph);
        articleElement.appendChild(amountParagraph);
        articleElement.appendChild(dateParagraph);

        divElement.appendChild(editButton);
        divElement.appendChild(okButton);

        liElement.appendChild(articleElement);
        liElement.appendChild(divElement);

        previewList.appendChild(liElement);

        addBtn.disabled = true;

        expenseTypeInput.value = '';
        amountInput.value = '';
        dateInput.value = '';

        function editExpenseInfo() {
            addBtn.disabled = false;
            expenseTypeInput.value = currentExpenseType;
            amountInput.value = currentAmount;
            dateInput.value = currentDate;
            previewList.removeChild(liElement);
        }

        function addToExpenses() {
            addBtn.disabled = false;
            liElement.removeChild(divElement);
            expensesList.appendChild(liElement);
            previewList.removeChild(liElement);
        }
    }

    deleteBtn.addEventListener('click', function () {
        location.reload();
    });
};