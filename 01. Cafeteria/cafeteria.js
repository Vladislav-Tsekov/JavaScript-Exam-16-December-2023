function cafeteriaSolution(input) {

    let baristasCollection = {};

    const n = parseInt(input[0]);


    for (let i = 1; i <= n; i++) {
        const [name, shift, drinks] = input[i].split(" ");
        baristasCollection[name] = { shift, drinks: drinks.split(",") };
    }

    //Check if counter is correct?
    for (let i = n + 1; i < input.length - 1; i++) {
        const [inputCommand, barista, cmdArg1, cmdArg2] = input[i].split(" / ");

        if (inputCommand === "Prepare") {
            prepareDesiredCoffee(barista, cmdArg1, cmdArg2);
        } else if (inputCommand === "Change Shift") {
            changeCurrentShift(barista, cmdArg1);
        } else if (inputCommand === "Learn") {
            learnToPrepareNewCoffee(barista, cmdArg1);
        }
    }

    function prepareDesiredCoffee(barista, shift, coffeeType) {
        if (baristasCollection[barista] && baristasCollection[barista].shift === shift && baristasCollection[barista].drinks.includes(coffeeType)) {
            console.log(`${barista} has prepared a ${coffeeType} for you!`);
        } 
        else {
            console.log(`${barista} is not available to prepare a ${coffeeType}.`);
        }
    }

    function changeCurrentShift(barista, newShift) {

        // console.log(barista);
        // console.log(newShift);

        baristasCollection[barista].shift = newShift;
        console.log(`${barista} has updated his shift to: ${newShift}`);
    }

    function learnToPrepareNewCoffee(barista, newCoffee) {
        if (baristasCollection[barista] && baristasCollection[barista].drinks.includes(newCoffee)) {
            console.log(`${barista} knows how to make ${newCoffee}.`);
        } else {
            baristasCollection[barista].drinks.push(newCoffee);
            console.log(`${barista} has learned a new coffee type: ${newCoffee}.`);
        }
    }

    function baristasOutput() {
        Object.keys(baristasCollection).forEach((barista) => {
            const { shift, drinks } = baristasCollection[barista];
            //"Barista: {barista name}, Shift: {shift}, Drinks: {drink type 1, drink type 2, ...}"
            console.log(`Barista: ${barista}, Shift: ${shift}, Drinks: ${drinks.join(', ')}`);
        });
    }

    baristasOutput();
}