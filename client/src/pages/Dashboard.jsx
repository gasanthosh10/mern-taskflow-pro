import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  Flame,
  FolderKanban,
  LogOut,
  Plus,
  Search,
  Users,
  X
} from 'lucide-react';
import ActivityFeed from '../components/ActivityFeed.jsx';
import { PriorityChart, StatusChart } from '../components/Charts.jsx';
import MetricCard from '../components/MetricCard.jsx';
import ProjectList from '../components/ProjectList.jsx';
import TaskBoard from '../components/TaskBoard.jsx';
import Avatar from '../components/Avatar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

const fallback = {
  metrics: { totalTasks: 0, completed: 0, urgent: 0, overdue: 0, activeProjects: 0, members: 0 },
  statusCounts: [],
  priorityCounts: [],
  projects: [],
  tasks: [],
  users: [],
  recentActivity: []
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState(fallback);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Backlog',
    dueDate: '',
    project: '',
    assignee: '',
    tags: ''
  });

  const fetchSummary = useCallback(async () => {
    const { data } = await api.get('/dashboard/summary');
    setSummary(data);
    setTaskForm((current) => ({
      ...current,
      project: current.project || data.projects[0]?._id || '',
      assignee: current.assignee || data.users[0]?._id || ''
    }));
  }, []);

  useEffect(() => {
    fetchSummary().finally(() => setLoading(false));
  }, [fetchSummary]);

  const filteredTasks = useMemo(() => {
    return summary.tasks.filter((task) => {
      const matchesQuery = `${task.title} ${task.description} ${task.project?.name}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus = status === 'All' || task.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status, summary.tasks]);

  const metrics = summary.metrics;

  const updateTaskStatus = async (taskId, nextStatus) => {
    await api.patch(`/tasks/${taskId}`, { status: nextStatus });
    await fetchSummary();
  };

  const createTask = async (event) => {
    event.preventDefault();
    await api.post('/tasks', {
      ...taskForm,
      tags: taskForm.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    });
    setTaskModalOpen(false);
    setTaskForm((current) => ({ ...current, title: '', description: '', tags: '' }));
    await fetchSummary();
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span>TF</span>
          <strong>TaskFlow Pro</strong>
        </div>
        <nav>
          <a className="active" href="#dashboard">
            <FolderKanban size={18} />
            Dashboard
          </a>
          <a href="#tasks">
            <ClipboardList size={18} />
            Tasks
          </a>
          <a href="#team">
            <Users size={18} />
            Team
          </a>
        </nav>
        <div className="sidebar-profile">
          <Avatar user={user} />
          <div>
            <strong>{user?.name}</strong>
            <span>{user?.role}</span>
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">Workspace overview</span>
            <h1>Task management dashboard</h1>
          </div>
          <div className="topbar-actions">
            <div className="search-box">
              <Search size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks" />
            </div>
            <button className="icon-button" title="Notifications">
              <Bell size={19} />
            </button>
            <button className="create-button" onClick={() => setTaskModalOpen(true)}>
              <Plus size={18} />
              New task
            </button>
            <button className="icon-button" onClick={logout} title="Log out">
              <LogOut size={19} />
            </button>
          </div>
        </header>

        <div className="status-tabs">
          {['All', 'Backlog', 'In Progress', 'Review', 'Done'].map((item) => (
            <button className={status === item ? 'active' : ''} onClick={() => setStatus(item)} key={item}>
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state">Loading dashboard...</div>
        ) : (
          <>
            <section className="metrics-grid">
              <MetricCard icon={ClipboardList} label="Total tasks" value={metrics.totalTasks} tone="blue" />
              <MetricCard icon={CheckCircle2} label="Completed" value={metrics.completed} tone="green" />
              <MetricCard icon={Flame} label="Urgent" value={metrics.urgent} tone="orange" />
              <MetricCard icon={FolderKanban} label="Active projects" value={metrics.activeProjects} tone="dark" />
            </section>

            <div className="dashboard-grid">
              <TaskBoard tasks={filteredTasks} onStatusChange={updateTaskStatus} />
              <div className="side-stack">
                <StatusChart data={summary.statusCounts} />
                <PriorityChart data={summary.priorityCounts} />
              </div>
            </div>

            <div className="lower-grid">
              <ProjectList projects={summary.projects} tasks={summary.tasks} />
              <ActivityFeed items={summary.recentActivity} />
            </div>
          </>
        )}
      </section>

      {isTaskModalOpen && (
        <div className="modal-backdrop" role="presentation">
          <section className="task-modal" role="dialog" aria-modal="true" aria-label="Create task">
            <div className="modal-heading">
              <div>
                <span className="eyebrow">Create task</span>
                <h2>Add sprint work</h2>
              </div>
              <button className="icon-button" onClick={() => setTaskModalOpen(false)} title="Close">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={createTask}>
              <label>
                Title
                <input
                  className="plain-input"
                  required
                  value={taskForm.title}
                  onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })}
                />
              </label>
              <label>
                Description
                <textarea
                  className="plain-input"
                  rows="3"
                  value={taskForm.description}
                  onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })}
                />
              </label>
              <div className="form-grid">
                <label>
                  Project
                  <select
                    className="plain-input"
                    value={taskForm.project}
                    onChange={(event) => setTaskForm({ ...taskForm, project: event.target.value })}
                    required
                  >
                    {summary.projects.map((project) => (
                      <option value={project._id} key={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Assignee
                  <select
                    className="plain-input"
                    value={taskForm.assignee}
                    onChange={(event) => setTaskForm({ ...taskForm, assignee: event.target.value })}
                    required
                  >
                    {summary.users.map((member) => (
                      <option value={member._id} key={member._id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Priority
                  <select
                    className="plain-input"
                    value={taskForm.priority}
                    onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value })}
                  >
                    {['Low', 'Medium', 'High', 'Urgent'].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Due date
                  <input
                    className="plain-input"
                    type="date"
                    required
                    value={taskForm.dueDate}
                    onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })}
                  />
                </label>
              </div>
              <label>
                Tags
                <input
                  className="plain-input"
                  placeholder="api, design, qa"
                  value={taskForm.tags}
                  onChange={(event) => setTaskForm({ ...taskForm, tags: event.target.value })}
                />
              </label>
              <button className="primary-button" type="submit">
                Create task
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
