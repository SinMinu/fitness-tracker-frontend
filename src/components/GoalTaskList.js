import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function GoalTaskList({ goalId }) {
    const { jwtToken } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [newTaskName, setNewTaskName] = useState('');

    useEffect(() => {
        if (goalId && jwtToken) {
            const fetchTasks = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/goal-tasks/goal/${goalId}`, {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                        },
                    });
                    setTasks(response.data);
                } catch (error) {
                    console.error('Failed to fetch tasks:', error);
                }
            };

            fetchTasks();
        }
    }, [goalId, jwtToken]);

    const handleAddTask = async () => {
        if (newTaskName && jwtToken) {
            try {
                const response = await axios.post(
                    `http://localhost:8080/api/goal-tasks/goal/${goalId}/tasks`,
                    {
                        taskName: newTaskName,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                        },
                    }
                );
                setTasks([...tasks, response.data]);
                setNewTaskName('');
            } catch (error) {
                console.error('Failed to add task:', error);
            }
        } else {
            alert("Task name cannot be empty");
        }
    };

    const handleTaskCompletionChange = async (taskId, isCompleted) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/api/goal-tasks/${taskId}/completion`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                    params: {
                        isCompleted: !isCompleted,
                    },
                }
            );

            setTasks(tasks.map(task =>
                task.id === taskId ? { ...task, completed: !isCompleted } : task
            ));
        } catch (error) {
            console.error('Failed to update task completion:', error);
        }
    };

    return (
        <div>
            <h2>Goal Tasks</h2>
            {tasks.length === 0 ? (
                <p>No tasks found for this goal.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleTaskCompletionChange(task.id, task.completed)}
                            />
                            {task.taskName}
                        </li>
                    ))}
                </ul>
            )}

            {/* Add Task Form */}
            <div className="add-task-form">
                <input
                    type="text"
                    placeholder="New Task Name"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                />
                <button onClick={handleAddTask}>Add Task</button>
            </div>
        </div>
    );
}

export default GoalTaskList;
