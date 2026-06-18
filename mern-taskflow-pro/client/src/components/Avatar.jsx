export default function Avatar({ user, size = 36 }) {
  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <span
      className="avatar"
      style={{ width: size, height: size, background: user?.avatarColor || '#2563eb' }}
      title={user?.name}
    >
      {initials || 'U'}
    </span>
  );
}

