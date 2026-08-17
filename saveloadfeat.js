const saveButton = document.getElementById("saveButton");
const loadButton = document.getElementById("loadButton");
const fileInput = document.getElementById("fileInput");
const jsonDisplay = document.getElementById("jsonDisplay");

let plannerData = {

    name: "Dylan",
    chronotype: "Morning",
    tasks: [
        {
            name: "Study Calculus",
            date: "2026-08-17",
            startTime: "08:00",
            endTime: "10:00"
        },
        {
            name: "Study Computer Architecture",
            date: "2026-08-17",
            startTime: "13:00",
            endTime: "15:00"
        },
        {
            name: "Finish Recording PE Video",
            date: "2026-08-17",
            startTime: "17:00",
            endTime: "18:00"
        },
        {
            name: "Study Computer Programming",
            date: "2026-08-18",
            startTime: "09:00",
            endTime: "11:00"
        },
        {
            name: "Work On THEO Script",
            date: "2026-08-18",
            startTime: "14:00",
            endTime: "15:30"
        }
    ]
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

document
    .getElementById("loadFunction")
    .addEventListener(
        "change",
        function (event) {
            const file = event.target.files[0];

            if (!file) {
                return;
            }

            const reader = new FileReader();

            reader.onload = function (event) {

                try {
                    plannerData = JSON.parse(
                        event.target.result
                    );

                    jsonDisplay.textContent =
                        JSON.stringify(
                            plannerData,
                            null,
                            4
                        );

                    console.log(
                        "Planner data loaded:",
                        plannerData
                    );

                    renderCalendar();
                }
                
                catch (error) {
                    alert(
                        "The selected file is not valid JSON."
                    );
                    console.error(error);
                }

            };

            reader.readAsText(file);

        }
    );

renderCalendar();