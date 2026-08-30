let populationSize = 52;
let generations = 100;
let tournamentSize = 4;
let mutationRate = 0.05;

let slotsPerDay = 48
let days = 7
let totalSlots = slotsPerDay * days;

let chronotype;

// New Functions
function PrepareSlots(string) {
    if (string.trim()) {
        return Number(string.trim());
    }
}

function CheckSlots(value) {
    if (value > slotsPerDay || value < 0) {
        return true;
    } else {
        return false;
    }
}

function DetermineChronotype() {
    if (chronotype == 0) { // Morning
        return 0.9;
    } else if (chronotype == 1) { // Evening
        return 0.4;
    }
}

// USER INPUT
function GetSlotsFromUser(promptText) {
    while (true) {
        try {
            const slots_str = prompt(promptText);
            const slots = slots_str.split(",");
            slots.forEach(PrepareSlots);
            if (slots.every(CheckSlots)) {
                return slots;
            } else {
                console.log("Invalid slot. Please enter numbers between 0 and {SLOTS_PER_DAY - 1}.");
            }
        } catch (error) {
            console.log("Invalid input. Please enter a comma-separated list of numbers (e.g., 0,1,2,3,44,45,46,47).");
        }
    } 
}

// USER INPUT NA HARD CONSTRAINTS (penalty if task is sched here)
let sleepSlots_input = GetSlotsFromUser("Enter sleep slots (0-47), e.g., 44,45,46,47 for 10pm-12am): ");

let workSlots_input = GetSlotsFromUser("Enter work slots (0-47), e.g., 16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31 for 8am-4pm): ");

// FORBIDDEN TIME SLOTS (Hard Constraints)
let sleepSlots_set = new Set(sleepSlots_input);
let sleepSlots = [...sleepSlots_set];
sleepSlots.sort();
let workSlots_set = new Set(workSlots_input);
let workSlots = [...workSlots_set];
workSlots.sort();

// CHRONOTYPE: higher = more productive
let favoredTimes = new Array(slotsPerDay);
for (let i = 0; i < favoredTimes.length; i++) {
    favoredTimes[i] = DetermineChronotype();
}

// TASKS (USER INPUT)
// Number of Tasks
numberOfTasks = 0;
while (numberOfTasks <= 0) {
    try {
        numberOfTasks = Number(prompt("Enter the number of tasks: "));
    } catch (error) {
        console.log("Invalid input. Please enter a number.");
    }
}