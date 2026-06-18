import { CalendarDays, Flag, MoveRight } from 'lucide-react';
import Avatar from './Avatar.jsx';

const statuses = ['Backlog', 'In Progress', 'Review', 'Done'];

const priorityClass = {
  Low: 'priority-low',
  Medium: 'priority-medium',
  High: 'priority-high',
  Urgent: 'priority-urgent'
};

export default function TaskBoard({ tasks, onStatusChange }) {
  return (
    <section className="board-section">
      <div className="section-heading">
        <div>
          <span>Work board</span>
          <h2>Current sprint tasks</h2>
        </div>
      </div>
      <div className="task-board">
        {statuses.map((status) => {
          const columnTasks = tasks.filter((task) => task.status === status);
          return (
            <div className="task-column" key={status}>
              <div className="column-title">
                <strong>{status}</strong>
                <span>{columnTasks.length}</span>
              </div>
              {columnTasks.map((task) => (
                <article className="task-card" key={task._id}>
                  <div className="task-card-top">
                    <span className={`priority ${priorityClass[task.priority]}`}>
                      <Flag size={13} />
                      {task.priority}
                    </span>
                    <span className="project-pill" style={{ borderColor: task.project?.color }}>
                      {task.project?.name}
                    </span>
                  </div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <div className="task-meta">
                    <span>
                      <CalendarDays size={14} />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <Avatar user={task.assignee} size={30} />
                  </div>
                  <div className="task-actions">
                    {statuses
                      .filter((item) => item !== task.status)
                      .slice(0, 2)
                      .map((item) => (
                        <button key={item} onClick={() => onStatusChange(task._id, item)} title={`Move to ${item}`}>
                          <MoveRight size={13} />
                          {item}
                        </button>
                      ))}
                  </div>
                </article>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
