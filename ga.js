let populationSize = 52;
let generations = 100;
let tournamentSize = 4;
let mutationRate = 0.05;

let slotsPerDay = 48
let days = 7
let totalSlots = slotsPerDay * days;

function trimSpace(string) {
    return string.trim();
}

function GetSlotsFromUser(promptText) {
    while (true) {
        try {
            let slots_str = prompt(promptText);
            let slots = Number();
        } catch (err) {
            console.log("Invalid input. Please enter a comma-separated list of numbers (e.g., 0,1,2,3,44,45,46,47).");
        }
    } 
}

let sleepSlots_input = GetSlotsFromUser("Enter sleep slots (0-47), e.g., 44,45,46,47 for 10pm-12am): ");

let workSlots_input = GetSlotsFromUser("Enter work slots (0-47), e.g., 16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31 for 8am-4pm): ");
