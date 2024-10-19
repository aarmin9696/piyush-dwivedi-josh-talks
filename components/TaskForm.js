import React, { useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const TaskForm = ({ editTask, handleSubmit, handleClose }) => {
  const [task, setTask] = React.useState({ title: "", description: "", priority: "low" });

  useEffect(() => {
    if (editTask) {
      setTask(editTask);
    } else {
      setTask({ title: "", description: "", priority: "low" });
    }
  }, [editTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(task);
    handleClose();
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={task?.title}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={task?.description}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Priority</Form.Label>
        <Form.Select name="priority" value={task.priority} onChange={handleChange}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Form.Select>
      </Form.Group>
      <Button  className="border border-none" style={{backgroundColor:"black"}}  type="submit">
        {editTask ? "Update Task" : "Add Task"}
      </Button>
    </Form>
  );
};

export default TaskForm;
