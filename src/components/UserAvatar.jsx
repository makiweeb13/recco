function UserAvatar({ username, size = 30 }) {
  const colors = [
    '#7695FF', '#9DBDFF', '#FF9874', '#FFD7C4',
    '#6C63FF', '#FF6B6B', '#48C9B0', '#F1C40F',
    '#E67E22', '#2ECC71', '#E74C3C', '#3498DB',
  ];
  const hash = username ? username.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : 0;
  const bg = colors[hash % colors.length];
  const initials = username ? username.slice(0, 2).toUpperCase() : '?';

  return (
    <svg width={size} height={size} viewBox="0 0 30 30">
      <circle cx="15" cy="15" r="15" fill={bg} />
      <text x="15" y="15" textAnchor="middle" dominantBaseline="central"
        fill="#fff" fontSize={size * 0.4} fontFamily="Inter, sans-serif" fontWeight="600">
        {initials}
      </text>
    </svg>
  );
}

export default UserAvatar;
