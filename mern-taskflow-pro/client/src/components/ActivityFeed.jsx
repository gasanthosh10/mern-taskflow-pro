import Avatar from './Avatar.jsx';

export default function ActivityFeed({ items }) {
  return (
    <section className="panel">
      <div className="section-heading compact">
        <div>
          <span>Activity</span>
          <h2>Team updates</h2>
        </div>
      </div>
      <div className="activity-feed">
        {items.map((item) => (
          <article className="activity-item" key={item._id}>
            <Avatar user={item.actor} size={32} />
            <div>
              <p>
                <strong>{item.actor?.name}</strong> {item.action}
              </p>
              <span>{item.target}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

