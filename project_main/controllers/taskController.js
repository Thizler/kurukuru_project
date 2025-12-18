// Mock database for tasks
const tasks = [];

// Render the task list page
exports.renderTasks = (req, res) => {
    const summary = tasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
    }, {});

    res.render('index', { tasks, summary });
};

// Add a new task
exports.addTask = (req, res) => {
    const { username, name, description, priority } = req.body;

    if (!username || !name || !description || !priority) {
        return res.status(400).send('All fields are required');
    }

    tasks.push({ username, name, description, priority });
    res.redirect('/');
};

// Delete selected tasks
exports.deleteTasks = (req, res) => {
    const { taskNames } = req.body;

    if (!taskNames) {
        return res.status(400).send('No tasks selected for deletion');
    }

    const toDelete = Array.isArray(taskNames) ? taskNames : [taskNames];

    for (const name of toDelete) {
        const index = tasks.findIndex(task => task.name === name);
        if (index !== -1) tasks.splice(index, 1);
    }

    res.redirect('/');
};

// Search for a task by name
exports.searchTasks = (req, res) => {
    const { searchName } = req.body;

    if (!searchName) {
        return res.status(400).send('Search term is required');
    }

    const filteredTasks = tasks.filter(task =>
        task.name.toLowerCase().includes(searchName.toLowerCase())
    );

    const summary = filteredTasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
    }, {});

    res.render('index', { tasks: filteredTasks, summary });
};

// Sort tasks by priority (assumes numeric priority)
exports.sortTasks = (req, res) => {
    const sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority);

    const summary = sortedTasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
    }, {});

    res.render('index', { tasks: sortedTasks, summary });
};

// View a single task
exports.viewTask = (req, res) => {
    const { name } = req.params;

    const task = tasks.find(task => task.name === name);
    if (!task) {
        return res.status(404).render('task', { task: null });
    }

    res.render('task', { task });
};
