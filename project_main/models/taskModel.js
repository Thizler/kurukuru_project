const fs = require('fs');
const Encryption = require('../util');
const ArrayList = require('./ArrayList'); // เพิ่มบรรทัดนี้

const util = new Encryption();

class Task {
  constructor() {
    this.tasks = new ArrayList(); // ใช้ ArrayList แทน []
  }

  addTask(task) {
    this.tasks.add(task);
  }

  getAllTasks() {
    return this.tasks.getAll();
  }

  summarizeByPriority() {
    const summary = {};
    this.tasks.getAll().forEach((task) => {
      const key = task.priority?.toString() || 'unknown';
      summary[key] = (summary[key] || 0) + 1;
    });
    return summary;
  }

  sortByPriority() {
    const sorted = this.tasks.getAll().sort((a, b) => (a.priority || 0) - (b.priority || 0));
    const newList = new ArrayList();
    sorted.forEach(task => newList.add(task));
    this.tasks = newList;
    return this.tasks.getAll();
  }

  searchByName(name) {
    const lowerName = name.toLowerCase();
    return this.tasks
      .getAll()
      .filter((task) => task.name?.toLowerCase().includes(lowerName))
      .map((task) => this.encryptTask(task));
  }

  encryptTask(task) {
    return {
      ...task,
      username: task.username ? util.encrypt(task.username) : '',
    };
  }

  saveTasksToFile(filePath) {
    fs.writeFileSync(filePath, JSON.stringify(this.tasks.getAll(), null, 2));
  }

  loadTasksFromFile(filePath) {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(data);
      this.tasks = new ArrayList();
      parsed.forEach(task => this.tasks.add(task));
    }
  }
}

module.exports = Task;
