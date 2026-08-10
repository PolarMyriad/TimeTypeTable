const saveButton = document.getElementById("saveButton");
const loadButton = document.getElementById("loadButton");
const fileInput = document.getElementById("fileInput");
const jsonDisplay = document.getElementById("jsonDisplay");

const plannerData = {
    name: "Dylan",
    chronotype: "Morning",
    tasks:{
        week1:{
            day1:[
                {
                    name: "Study Calculus",
                    startTime: "08:00",
                    endTime: "10:00"
                },
                {
                    name: "Study Computer Architecture",
                    startTime: "13:00",
                    endTime: "15:00"
                }
            ],
            day2:[
                {
                    name: "Study Computer Programming",
                    startTime: "09:00",
                    endTime: "11:00"
                },
                {
                    name: "Work On BENE Script",
                    startTime: "14:00",
                    endTime: "15:30"
                }
            ]
        }
    }
};

function saveJSON() {
    const jsonData = JSON.stringify(
        plannerData,
        null,
        4
    );

    const blob = new Blob(
        [jsonData],
        {
            type: "application/json"
        }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "planner.json";
    link.click();
    URL.revokeObjectURL(url);
}

saveButton.addEventListener(
    "click",
    saveJSON
);