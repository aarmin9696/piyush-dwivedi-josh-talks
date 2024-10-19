Here's a README file you can use for your Task Management App, including setup instructions and a description of the approach used for sorting tasks by priority.

---

# Task Management App

## Description

The Task Management App is a simple and intuitive application built with Next.js that allows users to create, edit, delete, and manage tasks. Each task can be categorized by priority (high, medium, low) and marked as completed or pending. The app utilizes local storage for task persistence and incorporates a search feature for easy task retrieval.

### Features

- Add new tasks with title, description, and priority.
- Edit existing tasks.
- Delete tasks with confirmation prompts.
- Mark tasks as completed or pending.
- Search functionality to filter tasks by title.
- Tasks are visually differentiated by priority with color gradients.

## Setup Instructions

### Prerequisites

- Node.js (>=14.x)
- npm (Node Package Manager)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd task-management-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**

   ```
   http://localhost:3000
   ```

## Code Overview

### Sorting Tasks by Priority

The tasks are sorted by priority using a custom sorting function that assigns a numeric value to each priority level. The sorting order is defined as follows:

- **High**: 1
- **Medium**: 2
- **Low**: 3

The sorting logic is implemented in the `sortTasksByPriority` function, which takes an array of tasks and sorts them based on their completion status and priority. Completed tasks are pushed to the bottom of the list.

Here's how the sorting function works:

```javascript
const sortTasksByPriority = (tasksToSort) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return [...tasksToSort].sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1; // completed tasks go to the bottom
        }
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
};
```

In this function:
- The tasks are first checked for their completion status. If one task is completed and the other is not, the completed task is moved to the end of the sorted list.
- If both tasks have the same completion status, they are sorted by their assigned numeric value based on their priority.

This approach ensures that tasks are displayed in a clear and prioritized manner, enhancing the overall user experience.

## Technologies Used

- **Frontend:** React, Next.js, React-Bootstrap
- **State Management:** React Hooks
- **Styling:** Bootstrap
- **Notifications:** SweetAlert2
- **Data Persistence:** Local Storage

---

Feel free to modify the content as needed to fit your specific requirements or preferences!