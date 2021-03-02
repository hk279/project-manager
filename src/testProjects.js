const testProjects = [
    {
        title: "Appointment booking app",
        client: "Mehiläinen",
        description:
            "Non tempor velit id minim ex cupidatat laboris non eiusmod amet. Nisi esse voluptate in pariatur Lorem.",
        deadline: "30.11.2021",
        tasks: [
            {
                title: "Task 1",
                completed: false,
                priority: "high",
                estimatedCompletion: "3.3.2021",
                assignedTo: ["Johnny", "Kate"],
            },
            {
                title: "Task 2",
                completed: true,
                priority: "high",
                estimatedCompletion: "2.3.2021",
                assignedTo: ["Johnny"],
            },
            {
                title: "Task 3",
                completed: false,
                priority: "medium",
                estimatedCompletion: "5.3.2021",
                assignedTo: ["Kate"],
            },
        ],
        employees: ["Johnny", "Kate"],
        completed: false,
    },
    {
        title: "Website migration from Angular to React",
        client: "Metso Outotec",
        description:
            "Non tempor velit id minim ex cupidatat laboris non eiusmod amet. Nisi esse voluptate in pariatur Lorem.",
        deadline: "2.8.2021",
        tasks: [
            { title: "Task 1", completed: true, priority: "high", estimatedCompletion: "3.3.2021" },
            { title: "Task 2", completed: true, priority: "high", estimatedCompletion: "2.3.2021" },
            { title: "Task 3", completed: false, priority: "medium", estimatedCompletion: "5.3.2021" },
            { title: "Task 4", completed: false, priority: "low", estimatedCompletion: "9.3.2021" },
        ],
        employees: ["Mike", "Andy"],
        completed: false,
    },
    {
        title: "Improved REST-api for customer data",
        client: "Sanoma Media",
        description:
            "Non tempor velit id minim ex cupidatat laboris non eiusmod amet. Nisi esse voluptate in pariatur Lorem.",
        deadline: "15.10.2021",
        tasks: [
            { title: "Task 1", completed: false, priority: "high", estimatedCompletion: "3.3.2021" },
            { title: "Task 2", completed: false, priority: "high", estimatedCompletion: "2.3.2021" },
            { title: "Task 3", completed: false, priority: "medium", estimatedCompletion: "5.3.2021" },
            { title: "Task 4", completed: false, priority: "low", estimatedCompletion: "9.3.2021" },
        ],
        employees: ["Amy", "Rose"],
        completed: false,
    },
    {
        title: "New website front-end",
        client: "Telia",
        description:
            "Non tempor velit id minim ex cupidatat laboris non eiusmod amet. Nisi esse voluptate in pariatur Lorem.",
        deadline: "7.6.2021",
        tasks: [
            { title: "Task 1", completed: true, priority: "high", estimatedCompletion: "3.3.2021" },
            { title: "Task 2", completed: true, priority: "high", estimatedCompletion: "2.3.2021" },
            { title: "Task 3", completed: true, priority: "medium", estimatedCompletion: "5.3.2021" },
            { title: "Task 4", completed: false, priority: "low", estimatedCompletion: "9.3.2021" },
        ],
        employees: ["Sean", "Mary"],
        completed: false,
    },
];

export default testProjects;
