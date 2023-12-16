//Base URL and endpoints setup for ease of access
const BASE_URL = 'http://localhost:3030/jsonstore/tasks';

let endpoints = {
    update: (id) => `${BASE_URL}/${id}`,
    delete: (id) => `${BASE_URL}/${id}`,
};

//Taking the elements that I would later need
let foodElement = document.getElementById("food");
let timeElement = document.getElementById("time");
let caloriesElement = document.getElementById("calories");

let mealsSection = document.getElementById("meals");
let list = document.getElementById('list');

let addMealBtn = document.getElementById("add-meal");
let editMealBtn = document.getElementById("edit-meal");
let loadMealsBtn = document.getElementById("load-meals");

//Try to reset selected meal?
let selectedMealIdForEdit = null;

//need for remove?
function attachEvents() {
    loadMealsBtn.addEventListener('click', loadMealsEventHandler);
    addMealBtn.addEventListener('click', createMealEventHandler);
    editMealBtn.addEventListener('click', editMealEventHandler);
}

//Why does it need AA approach to work? Test w/o AA in the end?
async function loadMealsEventHandler() {
    clearAllSections();

    const res = await fetch(BASE_URL);
    const allMeals = await res.json();
    
    //forEach error troubleshooting
    Object.values(allMeals).forEach((meal) => {
        let mealContainer = document.createElement('div');
        mealContainer.className = 'meal';

        let foodElement = document.createElement('h2');
        foodElement.textContent = meal.food;

        let timeElement = document.createElement('h3');
        timeElement.textContent = meal.time;

        let caloriesElement = document.createElement('h3');
        caloriesElement.textContent = meal.calories;

        let mealButtonsContainer = document.createElement('div');
        mealButtonsContainer.className = 'meal-buttons';

        let changeMealBtn = document.createElement('button');
        changeMealBtn.className = 'change-meal';
        changeMealBtn.textContent = 'Change';

        let deleteMealBtn = document.createElement('button');
        deleteMealBtn.className = 'delete-meal';
        deleteMealBtn.textContent = 'Delete';

        mealButtonsContainer.appendChild(changeMealBtn);
        mealButtonsContainer.appendChild(deleteMealBtn);

        mealContainer.appendChild(foodElement);
        mealContainer.appendChild(timeElement);
        mealContainer.appendChild(caloriesElement);
        mealContainer.appendChild(mealButtonsContainer);

        list.appendChild(mealContainer);
    });

    attachMealEventListeners();
}

function attachMealEventListeners() {
    //QS Bug avoided? Troubleshoot if Judge tests fail.
    const changeMealButtons = Array.from(document.querySelectorAll('.change-meal'));
    const deleteMealButtons = Array.from(document.querySelectorAll('.delete-meal'));

    changeMealButtons.forEach((changeMealButton) => {
        changeMealButton.addEventListener('click', (event) => {
            let mealContainer = event.target.closest('.meal');
            let food = mealContainer.querySelector('h2').textContent;
            let time = mealContainer.querySelector('h3:nth-child(2)').textContent;
            let calories = mealContainer.querySelector('h3:nth-child(3)').textContent;
            
            // console.log("attachMealEventListeners/changeBtn -> QSA => Array <- /// Results below:");
            // console.log(food);
            // console.log(time);
            // console.log(calories);
        
            editMeal(food, time, calories);
            enableEditMealBtn();
        });
    });

    deleteMealButtons.forEach((deleteMealButton) => {
        deleteMealButton.addEventListener('click', (event) => {
            // console.log("Hey there?")
            let mealContainer = event.target.closest('.meal');
            let food = mealContainer.querySelector('h2').textContent;
            deleteMeal(food);
        });
    });
}

function createMealEventHandler(ev) {
    //Disable if an error occurs...?
    ev.preventDefault();
    if (foodElement.value !== '' && timeElement.value !== '' && caloriesElement.value !== '') {
        let headers = {
            method: 'POST',
            body: JSON.stringify({
                food: foodElement.value,
                time: timeElement.value,
                calories: caloriesElement.value,
            }),
        };

        fetch(BASE_URL, headers)
            .then(loadMealsEventHandler)
            .catch(console.error);

        clearAllInputs();
    }
}


async function editMeal(food, time, calories) {
    let selectedMealId = await getFoodId(food);
    foodElement.value = food;
    timeElement.value = time;
    caloriesElement.value = calories;
    selectedMealIdForEdit = selectedMealId;
    // console.log(selectedMealIdForEdit);
    enableEditMealBtn();
}

function editMealEventHandler(ev) {
    ev.preventDefault();
    let food = foodElement.value;
    let data = {
        food: foodElement.value,
        time: timeElement.value,
        calories: caloriesElement.value,
    };

    fetch(endpoints.update(selectedMealIdForEdit), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(() => {
            clearAllInputs();
            loadMealsEventHandler();
            enableAddMealBtn();
            selectedMealIdForEdit = null;
            // console.log(selectedMealIdForEdit);
        })
        .catch(console.error);
}

function deleteMeal(food) {
    getFoodId(food)
        .then((id) =>
            fetch(endpoints.delete(id), {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })
        )
        .then(() => {
            clearAllSections();
            loadMealsEventHandler();
            enableAddMealBtn();
        })
        .catch(console.error);
}

//Hoisting biatch.

function enableEditMealBtn() {
    addMealBtn.disabled = true;
    editMealBtn.disabled = false;
}

function enableAddMealBtn() {
    addMealBtn.disabled = false;
    editMealBtn.disabled = true;
}

function getFoodId(meal) {
    return fetch(BASE_URL)
        .then(res => res.json())
        .then(res => Object.entries(res).find(e => e[1].food == meal)[1]._id);
}

function clearAllSections() {
    list.innerHTML = '';
}

function clearAllInputs() {
    foodElement.value = '';
    timeElement.value = '';
    caloriesElement.value = '';
}

attachEvents();
