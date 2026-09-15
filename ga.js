// New Functions
function PrepareSlots(string) {
    if (string.trim()) {
        return Number(string.trim());
    }
}

function CheckSlots(value) {
    if (isNaN(value) || value >= slotsPerDay || value < 0) {
        return false;
    } else {
        return true;
    }
}

function Sample(arr, size) {
    let shuffled = arr.slice(0);
    let i = shuffled.length;
    let min = Math.max(0, i - size);
    
    while (i-- > min) {
        let index = Math.floor((i + 1) * Math.random());
        let temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    
    return shuffled.slice(min);
}

// Variable initialization
let populationSize = 100;
let generations = 150;
let tournamentSize = 4;
let mutationRate = 0.05;

let slotsPerDay = 1440;
let days = 30;
let totalSlots = slotsPerDay * days;

let chronotype = plannerData.chronotype;

let takenSlots = []; 

let favoredTimes;

let sleepSlots_input;
let sleepSlots;
let workSlots_input;
let workSlots;

// User Input
async function GetMoodFromUser() {
    let moodText = document.getElementById("moodInput").value.trim();

    if (moodText === "") {
        return null;
    }
    try {
        const response = await fetch("http://127.0.0.1:5000/predict-mood", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: moodText
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.log("Mood prediction error:", data.error);
            return null;
        }

        console.log("Detected mood:", data.mood);
        console.log("Confidence:", data.confidence);

        return data.mood;
    } catch (error) {
        console.log("Could not connect to NLP server:", error);
        return null;
    }
}

/* Deprecated
function GetSlotsFromUser(beginId, endId) {
    const beginTime = document.getElementById(beginId).value;
    const endTime = document.getElementById(endId).value;

    if (!beginTime || !endTime) {
        return [];
    }
    function TimeToSlot(time) {
        const parts = time.split(":");
        const hours = Number(parts[0]);
        const minutes = Number(parts[1]);

        return hours * 2 + Math.floor(minutes / 30);
    }

    let startSlot = TimeToSlot(beginTime);
    let endSlot = TimeToSlot(endTime);

    let slots = [];

    if (startSlot < endSlot) {
        for (let i = startSlot; i < endSlot; i++) {
            slots.push(i);
        }
    } else {
        // crosses midnight
        for (let i = startSlot; i < slotsPerDay; i++) {
            slots.push(i);
        }
        for (let i = 0; i < endSlot; i++) {
            slots.push(i);
        }
    }

    return slots;
}
*/

// INITIALIZATION
function CreateIndividual(task) {
    let deadlineSlot = Math.min(task.deadlineDays * slotsPerDay, totalSlots);
    let maxStart = Math.max(0, deadlineSlot - 1);

    let start = Math.floor(Math.random() * (maxStart + 1));

    let maxDuration = Math.min(180, deadlineSlot - start);

    if (maxDuration < 1) {
        maxDuration = 1;
    }

    let duration = Math.floor(Math.random() * maxDuration) + 1;
    let end = start + duration;

    const individual = {
        start: start,
        end: end,
        fitness: 0
    };

    return individual;
}

// Random scheds
function CreatePopulation(task) {
    let population = new Array(populationSize);

    for (let i = 0; i < population.length; i++) {
        population[i] = CreateIndividual(task);
    }

    return population;
}

// FITNESS FUNCTION
function Fitness(individual, task, mood) {
    let startTime = individual.start;
    let endTime = individual.end;
    let duration = endTime - startTime;

    if (duration <= 0) return -Infinity;

    let P = Number(task.priority);
    let T = Number(task.tedium);
    let D = Number(task.deadlineDays);
    let score = 0;

    let avgEnergy = 0;

    // HARD CONSTRAINTS
    let deadlineSlot = D * slotsPerDay;

    if (endTime > deadlineSlot) {
        return -Infinity;
    }

    for (let slot = startTime; slot < endTime; slot++) {
        let dailySlot = slot % slotsPerDay;

        if (sleepSlots.includes(dailySlot) || workSlots.includes(dailySlot) || takenSlots.includes(slot)) {
            return -Infinity;
        }

        // SOFT CONSTRAINT (chronotype)
        avgEnergy += favoredTimes[dailySlot];
    }

    score += (avgEnergy * 5) / duration;

    // PRIORITY + DEADLINE
    let urgency = 1 / (D + 1);
    score += P * urgency * 10;

    // MOOD + EARLY SCHEDULING
    let scheduledDay = Math.floor(startTime / slotsPerDay);
    let daysBeforeDeadline = Math.max(0, D - scheduledDay);

    let preferredDaysBeforeDeadline = 0;

    if (mood === 0) {
        // negative, closer to deadline
        preferredDaysBeforeDeadline = 2;
    } else if (mood === 1) {
        // neutral
        preferredDaysBeforeDeadline = 4;
    } else if (mood === 2) {
        // positive, earlier work slots
        preferredDaysBeforeDeadline = 6;
    }

    let moodTimingPenalty = Math.abs(
        daysBeforeDeadline - preferredDaysBeforeDeadline
    );

    score -= moodTimingPenalty;

    // TEDIUM
    let idealDuration = Math.max(1, T / 2) * 30;
    score -= Math.abs(duration - idealDuration);

    return score;
}

// Tournament SELECTION
function TournamentSelection(pop, task, mood) {
    let selected = Sample(pop, tournamentSize);

    for (let individual of selected) {
        individual.fitness = Fitness(individual, task, mood);
    }

    selected.sort(function(a, b) {
        return b.fitness - a.fitness;
    });

    return selected[0];
}

// CROSSOVER
function Crossover(p1, p2, task, mood) {
    let s1 = p1.start;
    let e1 = p1.end;
    let s2 = p2.start;
    let e2 = p2.end;

    let child1 = {
        start: s1,
        end: e2,
        fitness: 0
    };

    let child2 = {
        start: s2,
        end: e1,
        fitness: 0
    };

    if (child1.end <= child1.start) {
        child1.end = child1.start + 1;
    }

    if (child2.end <= child2.start) {
        child2.end = child2.start + 1;
    }

    child1.fitness = Fitness(child1, task, mood);
    child2.fitness = Fitness(child2, task, mood);

    return [child1, child2];
}

// MUTATION
function Mutate(individual, task, mood) {
    if (Math.random() < mutationRate) {
        let deadlineSlot = Math.min(task.deadlineDays * slotsPerDay, totalSlots);
        let maxStart = Math.max(0, deadlineSlot - 1);

        individual.start = Math.floor(Math.random() * (maxStart + 1));

        let maxDuration = Math.min(180, deadlineSlot - individual.start);

        if (maxDuration < 1) {
            maxDuration = 1;
        }

        let duration = Math.floor(Math.random() * maxDuration) + 1;

        individual.end = individual.start + duration;
        individual.fitness = Fitness(individual, task, mood);
    }

    return individual;
}

// The GA itself per task (column)
function EvolveTask(task, mood) {
    let population = CreatePopulation(task);

    for (let x = 0; x < generations; x++) {
        let newPop = [];

        // Evaluate population
        for (let individual of population) {
            individual.fitness = Fitness(individual, task, mood);
        }

        // Elitism to preserve best indivs, before crossover & mutation
        let best = population.reduce(function(prev, current) {
            return (prev.fitness > current.fitness) ? prev : current;
        });

        newPop.push(best);

        while (newPop.length < populationSize) {
            let p1 = TournamentSelection(population, task, mood);
            let p2 = TournamentSelection(population, task, mood);

            let children = Crossover(p1, p2, task, mood);

            let c1 = Mutate(children[0], task, mood);
            let c2 = Mutate(children[1], task, mood);

            newPop.push(c1);

            if (newPop.length < populationSize) {
                newPop.push(c2);
            }
        }

        population = newPop;
    }

    // Return best individual from final generation
    for (let individual of population) {
        individual.fitness = Fitness(individual, task, mood);
    }

    return population.reduce(function(prev, current) {
        return (prev.fitness > current.fitness) ? prev : current;
    });
}

// Add timeslots taken by previously finalized tasks; these taken timeslots will become hard constraints
function AddTakenSlot(slot) {
    let start = slot[0];
    let end = slot[1];

    for (let i = start; i < end; i++) {
        if (!takenSlots.includes(i)) {
            takenSlots.push(i);
        }
    }
}

/* Deprecated
function DisplaySchedule(schedule) {
    console.log("Generated Schedule:");

    for (let item of schedule) {
        let task = item.task;
        let individual = item.individual;

        let day = Math.floor(individual.start / slotsPerDay) + 1;
        let startSlot = individual.start % slotsPerDay;
        let endSlot = individual.end % slotsPerDay;

        console.log(
            task.name +
            " | Day " + day +
            " | Slot " + startSlot +
            " - " + endSlot +
            " | Fitness: " + individual.fitness
        );
    }
}
    */

// MAIN PROGRAM LOOP
async function Run(tasks) {
    // There should be functionality to scan all already-created tasks from the plannerData, and add them to takenSlots here
    takenSlots = [];

    let sb = parseInt(plannerData.sleepBegin.slice(0,2)) * 60 + parseInt(plannerData.sleepBegin.slice(3,5));
    let se = parseInt(plannerData.sleepEnd.slice(0,2)) * 60 + parseInt(plannerData.sleepEnd.slice(3,5));
    if (sb > se) {
        se += 1440;
    }
    let wb = parseInt(plannerData.workBegin.slice(0,2)) * 60 + parseInt(plannerData.workBegin.slice(3,5));
    let we = parseInt(plannerData.workEnd.slice(0,2)) * 60 + parseInt(plannerData.workEnd.slice(3,5));
    if (wb > we) {
        we += 1440;
    }
    let sd = se - sb;
    let wd = we - wb;

    let counter = 0;
    sleepSlots_input = new Array(sd);
    for (let i = sb; i < se; i++) {
        sleepSlots_input[counter] = i;
        counter++;
    }
    counter = 0;
    workSlots_input = new Array(wd);
    for (let i = wb; i < we; i++) {
        workSlots_input[counter] = i;
        counter++;
    }

    let mood = await GetMoodFromUser();

    if (mood === "negative") {
        mood = 0;
    } else if (mood === "neutral") {
        mood = 1;
    } else if (mood === "positive") {
        mood = 2;
    }

    console.log("Mood received by GA: ", mood);

    sleepSlots = [...new Set(sleepSlots_input)];
    sleepSlots.sort((a, b) => a - b);

    workSlots = [...new Set(workSlots_input)];
    workSlots.sort((a, b) => a - b);

    favoredTimes = new Array(slotsPerDay);

    for (let i = 0; i < favoredTimes.length; i++) {
        if (i < 720) {
            if (chronotype == 0) { // Morning
                favoredTimes[i] = 0.9;
            } else { // Evening
                favoredTimes[i] = 0.4;
            }
        } else {
            if (chronotype == 0) {
                favoredTimes[i] = 0.4;
            } else { // Evening
                favoredTimes[i] = 0.9;
            }
        }
    }

    // TASKS (FORM INPUT)

    if (!tasks || tasks.length === 0){
        console.log("No tasks found.");
        return [];
    }

    // Sort tasks by deadline so earlier deadlines are handled first
    tasks.sort(function(a, b) {
        return Number(a.deadlineDays) - Number(b.deadlineDays);
    });

    let schedule = [];

    for (let task of tasks) {
        let best = EvolveTask(task, mood);

        if (best.fitness === -Infinity) {
            console.log("No valid schedule found for task: " + task.name);
            continue;
        }
        
        let element = {
            task: task,
            individual: best
        };

        schedule.push(element);

        // AddTakenSlot([best.start, best.end]);
    }
    console.log(schedule);
    console.log(typeof schedule);
    // DisplaySchedule(schedule);

    return schedule;
}

/*
DEV NOTES
Implement GA properly for week 9:
- Reimplement all inputs (prompt methods) so that they rely on form data from First-Time Input and Task&Mood Input 
    - Function GetSlotsFromUser
    - Input for number of tasks
    - Inputs for task details
- Reimplement takenSlots: add to takenSlots the items from the saved user data when the user adds tasks or
- Reimplement chronotype: take it from the saved user data after the user completes First-Time Input 
- (Potentially) reimplement the slot system (which will require a lot of work)
    - Change slot "lengths" from 30 minutes to 15 minutes
        - Increase number of slots per day to 96
    - Further increase number of slots from 30 (within one month) to 365 (within one year)
*/