import { CheckCircle2, Clock3 } from 'lucide-react';
import Avatar from './Avatar.jsx';

export default function ProjectList({ projects, tasks }) {
  return (
    <section className="panel">
      <div className="section-heading compact">
        <div>
          <span>Projects</span>
          <h2>Delivery pipeline</h2>
        </div>
      </div>
      <div className="project-list">
        {projects.map((project) => {
          const projectTasks = tasks.filter((task) => task.project?._id === project._id);
          const done = projectTasks.filter((task) => task.status === 'Done').length;
          const progress = projectTasks.length ? Math.round((done / projectTasks.length) * 100) : 0;

          return (
            <article className="project-row" key={project._id}>
              <div className="project-row-main">
                <span className="project-dot" style={{ background: project.color }} />
                <div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
              </div>
              <div className="progress-track">
                <span style={{ width: `${progress}%`, background: project.color }} />
              </div>
              <div className="project-row-footer">
                <span>
                  <Clock3 size={14} />
                  {new Date(project.dueDate).toLocaleDateString()}
                </span>
                <span>
                  <CheckCircle2 size={14} />
                  {progress}% done
                </span>
                <div className="avatar-stack">
                  {project.members?.slice(0, 4).map((member) => (
                    <Avatar user={member} size={28} key={member._id} />
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

