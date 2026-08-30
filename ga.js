let populationSize = 52;
let generations = 100;
let tournamentSize = 4;
let mutationRate = 0.05;

let slotsPerDay = 48
let days = 30
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
                console.log("Invalid slot. Please enter numbers between 0 and " + slotsPerDay + ".");
            }
        } catch (error) {
            console.log("Invalid input. Please enter a comma-separated list of numbers (e.g., 0,1,2,3,44,45,46,47).");
        }
    } 
}

// USER INPUT NA HARD CONSTRAINTS (penalty if task is sched here)
let sleepSlots_input = GetSlotsFromUser("Enter sleep slots (0-" + slotsPerDay + "), e.g., 44,45,46,47 for 10pm-12am): ");

let workSlots_input = GetSlotsFromUser("Enter work slots (0-" + slotsPerDay + "), e.g., 16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31 for 8am-4pm): ");

// FORBIDDEN TIME SLOTS (Hard Constraints)
let sleepSlots_set = new Set(sleepSlots_input);
let sleepSlots = [...sleepSlots_set];
sleepSlots.sort();
let workSlots_set = new Set(workSlots_input);
let workSlots = [...workSlots_set];
workSlots.sort();
let takenSlots = [];

// CHRONOTYPE: higher = more productive
let favoredTimes = new Array(slotsPerDay);
for (let i = 0; i < favoredTimes.length; i++) {
    if ((i / 2) < (slotsPerDay / 2)) {
        if (chronotype == 0) { // Morning
            favoredTimes[i] = 0.9;
        } else { // Evening
            favoredTimes[i] = 0.4;
        }
    } else {
        if (chronotype == 0) { 
            favoredTimes[i] = 0.4;
        } else {
            favoredTimes[i] = 0.9;
        }
    }
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

// Task Details - para sa fitness function
let tasks = [];
for (let i = 1; i <= numberOfTasks; i++) {
    console.log("Enter details for task " + i + ": ");
    let name = prompt("    Task Name: ");

    let priority = -1;
    while (priority > 10 || priority < 1) {
        try {
            let priority = prompt("    Priority (1-10): ");
            if (priority > 10 || priority < 1) {
                print("Priority must be between 1 and 10.");
            }
        } catch (error) {
            console.log("Invalid input. Please enter a number.");
        }
    }

    let tedium = -1;
    while (tedium > 10 || tedium < 1) {
        try {
            let tedium = prompt("    Tedium (1-10): ");
            if (tedium > 10 || tedium < 1) {
                print("Tedium must be between 1 and 10.");
            }
        } catch (error) {
            console.log("Invalid input. Please enter a number.");
        }
    }

    let deadline = -1;
    while (deadline > days || deadline < 1) {
        try {
            let deadline = prompt("    Deadline (days from now, 1-" + days + "): ");
            if (deadline > days || deadline < 1) {
                print("Deadline must be between 1 and " + days + ".");
            }
        } catch (error) {
            console.log("Invalid input. Please enter a number.");
        }
    }

    let task = {
        name = name,
        priority = priority,
        tedium = tedium,
        deadline = deadline
    };
    
    tasks.append(task);
}
tasks.sort(function(a, b) {
    return parseInt(b.deadline) - parseInt(a.deadline);
});

// INITIALIZATION
function CreateIndividual() {
    start = Math.floor(Math.random() * totalSlots);
    end = Math.floor(Math.min(start + (Math.random() * 6, totalSlots - 1, start + 1)));
    const individual = {
        start: start, 
        end: end
    };
    return individual;
}

// Random scheds
function CreatePopulation() {
    population = new Array(populationSize);
    for (let i = 0; i < population.length; i++) {
        population[i] = CreateIndividual();
    }
}

// FITNESS FUNCTION
function Fitness(individual, task) {
    let startTime = individual.start;
    let endTime = individual.end;
    let duration = end - start;

    if (duration <= 0) return -Infinity;

    let P = task.priority;
    let T = task.tedium;
    let D = task.deadline;
    let score = 0;

    let avgEnergy;
    // HARD CONSTRAINTS
    for (let slot = start; slot < end; slot++) {
        if (sleepSlots.includes(slot % 48) || workSlots.includes(slot % 48) || takenSlots.includes(slot % 48)) {
            score -= 20000;
        }
        
        // SOFT CONSTRAINT (chronotype)
        avgEnergy += favoredTimes[slot];
    }

    score += (avgEnergy * 5) / duration;

    // PRIORITY + DEADLINE
    let urgency = 1 / (D + 1);
    score += (P * urgency * (1 / (start + 1)));

    // TEDIUM
    let idealDuration = T / 2;
    score -= Math.abs(duration - idealDuration);

    return score;
}