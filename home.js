const monthYear =
            document.getElementById("monthYear");

        const daysContainer =
            document.getElementById("days");


        const prevMonth =
            document.getElementById("prevMonth");


        const nextMonth =
            document.getElementById("nextMonth");


        let currentDate = new Date();

        function renderCalendar() {

            
            let numberOfElements = 0;

            const year =
                currentDate.getFullYear();

            const month =
                currentDate.getMonth();

            const firstDay =
                new Date(
                    year,
                    month,
                    1
                ).getDay();


            const lastDate =
                new Date(
                    year,
                    month + 1,
                    0
                ).getDate();



            const monthName =
                currentDate.toLocaleString(
                    "default",
                    {
                        month: "long"
                    }
                );

            monthYear.textContent =
                `${monthName} ${year}`;


            daysContainer.innerHTML = "";
            for (
                let i = 0;
                i < firstDay;
                i++
            ) {

                const emptyDay =
                    document.createElement("div");

                emptyDay.classList.add("empty");

                daysContainer.appendChild(
                    emptyDay
                );
                numberOfElements++;
            }


            for (
                let day = 1;
                day <= lastDate;
                day++
            ) {



                const dayElement =
                    document.createElement("div");


                dayElement.classList.add("day");


                const monthNumber =
                    String(month + 1)
                        .padStart(2, "0");




                const dayNumber =
                    String(day)
                        .padStart(2, "0");




                const dateString =
                    `${year}-${monthNumber}-${dayNumber}`;




                const timeslotsForThisDay =
                    plannerData.timeslots.filter(
                        function (timeslots) {




                            return timeslots.do_date === dateString;




                        }
                    );




                dayElement.addEventListener(
                    "click",
                    function () {




                        openTaskModal(
                            dateString,
                            timeslotsForThisDay
                        );




                    }
                );



                dayElement.innerHTML = `




                    <span class="date-number">
                        ${day}
                    </span>




                    <div class="tasks-container">
                    </div>




                `;




                const taskContainer =
                    dayElement.querySelector(
                        ".tasks-container"
                    );

                const MAX_VISIBLE_TASKS = 3;
                timeslotsForThisDay
                    .slice(0, MAX_VISIBLE_TASKS)
                    .forEach(
                        function (timeslots, index) {

                            const taskElement =
                                document.createElement("div");

                            taskElement.classList.add(
                                "task"
                            );

                            taskElement.textContent =
                                `• ${timeslots.name}`;
                            if (
                                index === MAX_VISIBLE_TASKS - 1 &&
                                timeslotsForThisDay.length > MAX_VISIBLE_TASKS
                            ) {

                                taskElement.textContent += "...";
                            }

                            taskContainer.appendChild(
                                taskElement
                            );

                        }
                    );

                const today = new Date();

                if (
                    day === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear()
                ) {

                    dayElement.classList.add(
                        "today"
                    );

                }

                daysContainer.appendChild(
                    dayElement
                );


            numberOfElements++;
            }
            /* let daysElements = document.getElementById("days").children;
            for (let i = 0; i < daysElements.length; i++) {
                daysElements[i].style.
            } */
            if ((numberOfElements / 7) > 5) {
                for (
                let i = numberOfElements;
                i < 42;
                i++
                    ) {

                        const emptyDay =
                            document.createElement("div");

                        emptyDay.classList.add("empty");

                        daysContainer.appendChild(
                            emptyDay
                        );
                    }
                daysContainer.style.gridTemplateRows = "repeat(6, 1fr)";
            } else if ((numberOfElements / 7) > 4) {
                for (
                let i = numberOfElements;
                i < 35;
                i++
                    ) {

                        const emptyDay =
                            document.createElement("div");

                        emptyDay.classList.add("empty");

                        daysContainer.appendChild(
                            emptyDay
                        );
                    }
                daysContainer.style.gridTemplateRows = "repeat(5, 1fr)";
            } else if ((numberOfElements / 7) == 4) {
                daysContainer.style.gridTemplateRows = "repeat(4, 1fr)";
            }
            console.log(numberOfElements);
            console.log(numberOfElements / 7);

        }

        prevMonth.addEventListener(
            "click",
            function () {
                currentDate.setMonth(
                    currentDate.getMonth() - 1
                );

                renderCalendar();

            }
        );


        nextMonth.addEventListener(
            "click",
            function () {
                currentDate.setMonth(
                    currentDate.getMonth() + 1
                );

                renderCalendar();

            }
        );


        /* cal task */

        const taskModal =
            document.getElementById("taskModal");
        const modalDate =
            document.getElementById("modalDate");

        const modalTaskList =
            document.getElementById("modalTaskList");
        const closeModal =
            document.getElementById("closeModal");
        function openTaskModal(
            dateString,
            timeslots
        ) {

            const date =
                new Date(
                    dateString + "T00:00:00"
                );

            const formattedDate =
                date.toLocaleDateString(
                    "default",
                    {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                    }
                );

            modalDate.textContent =
                `Tasks for ${formattedDate}`;

            modalTaskList.innerHTML = "";

            if (timeslots.length === 0) {

                modalTaskList.innerHTML =
                    "<p>No tasks scheduled.</p>";

            }

            timeslots.forEach(
                function (timeslot) {

                    const taskElement =
                        document.createElement("div");

                    taskElement.classList.add(
                        "modal-task"
                    );

                    taskElement.innerHTML = `

                        <div class="modal-task-name">
                            • ${timeslot.name}
                        </div>

                     <div class="modal-task-time">
                       Time: ${timeslot.do_time}
                     </div>

                    <div class="modal-task-deadline">
                      Deadline: ${timeslot.deadline}
                     </div>
                    `;

                    modalTaskList.appendChild(
                        taskElement
                    );

                }
            );


            taskModal.style.display = "flex";

        }

        closeModal.addEventListener(
            "click",
            function () {

                taskModal.style.display = "none";

            }
        );

        taskModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === taskModal
                ) {
                    taskModal.style.display = "none";

                }
            }
        );

        /* first time*/

        const firstTimeScreen =
            document.getElementById("firstTimeScreen");

        const questionnaireScreen =
            document.getElementById("questionnaireScreen");

        const homeScreen =
            document.getElementById("homeScreen");

        const topbar = 
            document.getElementById("topbar");

        const proceedButton =
            document.getElementById("proceedButton");

        const questionnaireBackButton =
            document.querySelector("#questionnaireForm .back-button");

        const firstLoadButton =
            document.getElementById("firstLoadButton");
        const questionnaireForm =
            document.getElementById("questionnaireForm");

        const nameInput =
            document.getElementById("nameInput");

        const sleepBeginInput = 
            document.getElementById("sleepBeginTime");
        const sleepEndInput = 
            document.getElementById("sleepEndTime");
        const workBeginInput = 
            document.getElementById("workBeginTime");
        const workEndInput = 
            document.getElementById("workEndTime");

        const shiftInput =
            document.getElementById("shiftInput");

        const workInput =
            document.getElementById("workInput");

        const workdaysSleepTime =
            document.getElementById("workdaysSleepTime");

        const workdaysAwake =
            document.getElementById("workdaysAwake");
        
        const workfreeSleepTime =
            document.getElementById("workfreeSleepTime");

        const workfreeAwakeTime =
            document.getElementById("workfreeAwakeTime");

        const homeHeading =
            document.getElementById("homeHeading");
        const addtaskButton =
            document.getElementById("addtaskButton");


        
        /* QS */

        proceedButton.addEventListener(
            "click",
            function () {
                firstTimeScreen.style.display =
                    "none";

                topbar.style.display = "none";

                questionnaireScreen.style.display =
                    "flex";

            }
        );

        /* QUESTIONNAIRE BACK */

        questionnaireBackButton.addEventListener(
        "click",
         function () {

        questionnaireScreen.style.display =
            "none";

        topbar.style.display = "flex";

        firstTimeScreen.style.display =
            "flex";

            }
        );

        /* ADD TASK */

        addtaskButton.addEventListener(
            "click",
             function () {

                homeScreen.style.display =
                    "none";

                topbar.style.display = "none";

                taskScreen.style.display =
                    "flex";

             }
        );
        /* Submit */

        questionnaireForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const name =
                    nameInput.value.trim();

                const sleepBegin = 
                    sleepBeginInput.value.trim();
                const sleepEnd = 
                    sleepEndInput.value.trim();
                const workBegin = 
                    workBeginInput.value.trim();
                const workEnd = 
                    workEndInput.value.trim();
               
                //Changed this
                const shift =
                    shiftInput.value;
               
                // tama ba if trim    
                const work =
                    workInput.value.trim();  
                   
                const workdaysleep =
                    workdaysSleepTime.value.trim();

                const workdaysawake =
                    workdaysAwake.value.trim();

                const workfreesleep =
                    workfreeSleepTime.value.trim();

                const workfreeawake =
                    workfreeAwakeTime.value.trim();
                   
                if (
                    name === "" ||
                    shift === "" ||
                    sleepBegin === "" ||
                    sleepEnd === "" ||
                    workBegin === "" ||
                    workEnd === "" ||
                    work === "" ||
                    workdaysleep === "" ||
                    workdaysawake === "" ||
                    workfreesleep === "" ||
                    workfreeawake === ""
                ) {

                    alert(
                        "Please complete the questionnaire."
                    );

                    return;
                }

                /* chronotype calculation */

                let chronotype;
                let wfs = parseInt(workfreesleep.slice(0,2)) * 60 + parseInt(workfreesleep.slice(3,5));
                let wfa = parseInt(workfreeawake.slice(0,2)) * 60 + parseInt(workfreeawake.slice(3,5));
                if (wfs > wfa) {
                    wfa += 1440;
                }
                let SDF = wfa - wfs;
                let MSF = wfs + (SDF/2);

                let wds = parseInt(workdaysleep.slice(0,2)) * 60 + parseInt(workdaysleep.slice(3,5));
                let wda = parseInt(workdaysawake.slice(0,2)) * 60 + parseInt(workdaysawake.slice(3,5));
                if (wds > wda) {
                    wda += 1440;
                }
                let sdd = wda - wds;
                let MSD = wds + (sdd/2);

                let workdays = parseInt(work);
                let SDW = (sdd*workdays/7) + (SDF*(7-workdays)/7);
                
                let MSFsc;
                let MSFbig = MSF - 60;
                if (SDF <= SDW) {
                    MSFsc = MSF;
                } else {
                    MSFsc = MSF - (SDF - SDW)/2;
                    if (MSFsc < MSFbig) { // if overall weekly sleep duration is less than sleep duration on free days
                        chronotype = 1;
                    } else {
                        chronotype = 0;
                    }
                }

                /* for sleep slots and work slots */

                initializePlannerData(
                    name,
                    chronotype,
                    sleepBegin,
                    sleepEnd,
                    workBegin,
                    workEnd
                );

                homeHeading.textContent =
                    `Welcome, ${name}!`;

                questionnaireScreen.style.display =
                    "none";
                topbar.style.display = "flex";

                homeScreen.style.display =
                    "flex";

                renderCalendar();
            }
        );



        /* First load */

        firstLoadButton.addEventListener(
            "click",
            function () {

                document
                    .getElementById("loadFunction")
                    .click();
            }
        );

        /* TASK PAGE*/

const taskScreen =
    document.getElementById("taskScreen");

const taskForm =
    document.getElementById("taskForm");

const numTasks =
    document.getElementById("numTasks");

const taskFields =
    document.getElementById("taskFields");

const moodGroup =
    document.querySelector(".mood-group");

const moodInput =
    document.getElementById("moodInput");

const generateTasksButton =
    document.getElementById("generateTasksButton");

const submitTasksButton =
    document.getElementById("submitTasksButton");

const backToQuestionnaireButton =
    document.getElementById("backToQuestionnaireButton");


/* GENERATE TASK INPUTS */

generateTasksButton.addEventListener(
    "click",
    function () {

        const numberOfTasks =
            parseInt(numTasks.value);

        if (
            isNaN(numberOfTasks) ||
            numberOfTasks <= 0
        ) {
            alert(
                "Please enter a valid number of tasks."
            );

            return;
        }


        taskFields.innerHTML = "";


        for (
            let i = 1;
            i <= numberOfTasks;
            i++
        ) {

            const taskBlock =
                document.createElement("div");

            taskBlock.className =
                "task-block";


           taskBlock.innerHTML = `

             <h2>TASK ${i}</h2>

              <div class="task-name-group">

                <label for="taskName${i}">
                   Task Name
               </label>

           <input
              type="text"
               id="taskName${i}"
               name="taskName${i}"
               placeholder="Enter task name"
               required>

    </div>


    <div class="task-details-row">

        <div class="task-detail-group">

            <label for="taskPriority${i}">
                Priority
            </label>

            <input
                        type="number"
                        id="taskPriority${i}"
                        name="taskPriority${i}"
                        min="1"
                        max="10"
                        placeholder="(1-10)"
                        required>

        </div>


        <div class="task-detail-group">

            <label for="taskTedium${i}">
                Tedium
            </label>

            <input
                        type="number"
                        id="taskTedium${i}"
                        name="taskTedium${i}"
                        min="1"
                        max="10"
                        placeholder="(1-10)"
                        required>

        </div>


        <div class="task-detail-group">

            <label for="taskDeadline${i}">
                Deadline
            </label>

            <input
                type="date"
                id="taskDeadline${i}"
                name="taskDeadline${i}"
                required>

        </div>

    </div>

`;
            taskFields.appendChild(taskBlock);
        }


        /* Show submit button */

        generateTasksButton.style.display =
            "none";

        submitTasksButton.style.display =
            "block";

        /* Show mood input */

        moodGroup.style.display =
            "block";

        moodInput.required =
            true;
    }
);

/*  TASK BACK BUTTON */

backToQuestionnaireButton.addEventListener(
    "click",
    function () {
        taskForm.reset();
        taskFields.innerHTML = "";
        generateTasksButton.style.display = "block";
        submitTasksButton.style.display = "none";
        moodGroup.style.display = "none";
        moodInput.required = false;
    }
)


/* SUBMIT TASKS */

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const numberOfTasks =
            parseInt(numTasks.value);


        const tasks = [];


        for (
            let i = 1;
            i <= numberOfTasks;
            i++
        ) {

            const name =
                document
                    .getElementById(`taskName${i}`)
                    .value
                    .trim();


            const priority =
                parseInt(
                    document
                        .getElementById(`taskPriority${i}`)
                        .value
                );


            const tedium =
                parseInt(
                    document
                        .getElementById(`taskTedium${i}`)
                        .value
                );


            const deadlineDate = 
                document.getElementById(`taskDeadline${i}`).value;

                if (deadlineDate === "") {
                    alert("Please enter a deadline for Task " + i + ".");
                    return;
                }
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const selectedDate = new Date(deadlineDate + "T00:00:00");
                selectedDate.setHours(0, 0, 0, 0);

                const deadlineDays = Math.round(
                (selectedDate - today) / (1000 * 60 * 60 * 24)
            );

            if (deadlineDays < 1 || deadlineDays > 30) {
                alert("Deadline must be between 1 and " + days + " days from today.");
                return;
            }


            if (
                name === "" ||
                priority < 1 ||
                priority > 10 ||
                tedium < 1 ||
                tedium > 10 ||
                deadlineDate === ""

            ) {

                alert(
                    `Please check the information for Task ${i}.`
                );

                return;
            }


            tasks.push({
                name: name,
                priority: priority,
                tedium: tedium,
                deadline: deadlineDate,
                deadlineDays: deadlineDays
            });
        }


        /* Sort tasks by deadline
           Same as Python prototype */

        tasks.sort(
            function (a, b) {
                return a.deadline - b.deadline;
            }
        );


        console.log(
            "Tasks submitted:",
            tasks
        );



        /* Run GA */
        plannerData.timeslots = Run(tasks);


        /*
         * Go to home page
         */

        taskScreen.style.display =
            "none";

        homeScreen.style.display =
            "flex";

        renderCalendar();

    }
);


/* BACK TO home */

backToQuestionnaireButton.addEventListener(
    "click",
    function () {

        taskScreen.style.display =
            "none";

        homeScreen.style.display =
            "flex";

    }
);

    /* pull up the calendar in mobile mode */
    const pullup = document.getElementById("pullCalendar");
    const rightContent = document.getElementById("right-content");
    let isPulledUp = false;
    pullup.addEventListener(
        "click",
        function () {
            if (!isPulledUp) {
                isPulledUp = true;
                pullup.innerHTML = "&#9660;";
                rightContent.style.transform = "translateY(0%)";
            } else {
                isPulledUp = false;
                pullup.innerHTML = "&#9650;";
                rightContent.style.transform = "translateY(84%)";
            }
        }
    )