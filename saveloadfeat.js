let plannerData = {
    name: "",
    chronotype: "",
    sleepBegin: "",
    sleepEnd: "",
    workBegin: "",
    workEnd: "",
    timeslots: []
};

function initializePlannerData(name, chronotype, sleepBegin, sleepEnd, workBegin, workEnd) {

    plannerData = {
        name: name,
        chronotype: chronotype,
        sleepBegin: sleepBegin,
        sleepEnd: sleepEnd,
        workBegin: workBegin,
        workEnd: workEnd,
        timeslots: []
    };

}

function saveJSON() {
    const jsonData =
        JSON.stringify(
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
    link.download = "chronotype_data.json";
    link.click();

    URL.revokeObjectURL(url);
}

function loadJSON(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
            try {
                const loadedData = JSON.parse(
                        event.target.result
                    );

                plannerData = loadedData;

                if (
                    !Array.isArray(
                        plannerData.timeslots
                    )
                ) {
                    plannerData.timeslots = [];
                }

                if (
                    plannerData.name
                ) {
                    document.getElementById(
                            "homeHeading"
                        )
                        .textContent = `Welcome, ${plannerData.name}!`;
                }

                document.getElementById(
                        "firstTimeScreen"
                    )
                    .style.display = "none";

                document.getElementById(
                        "questionnaireScreen"
                    )
                    .style.display = "none";

                document.getElementById(
                        "homeScreen"
                    )
                    .style.display = "flex";

                document.getElementById("topbar").style.display = "flex";

                renderCalendar();

            } catch (error) {
                alert(
                    "Invalid JSON file."
                );
                console.error(error);
            }
        };

    reader.onerror = function () {
            alert(
                "There's an error when reading the file"
            );
        };
    reader.readAsText(file);
}

document
    .getElementById("saveButton")
    .addEventListener(
        "click",
        function () {

            saveJSON();

        }
    );

document
    .getElementById("loadFunction")
    .addEventListener(
        "change",
        function (event) {
            const file =
                event.target.files[0];

            if (!file) {
                return;
            }

            loadJSON(file);
        }
    );