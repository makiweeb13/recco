import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import useStore from '../../store/store';

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const {
    notifications, unreadCount,
    setNotifications, setUnreadCount,
    markNotificationRead, markAllNotificationsRead
  } = useStore();

  useEffect(() => {
    fetch('/api/notifications?limit=20', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      })
      .catch(() => {});
  }, []);

  const handleClickOutside = useCallback((e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, handleClickOutside]);

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      await fetch(`/api/notifications/${notif.id}/read`, {
        method: 'PUT',
        credentials: 'include'
      });
      markNotificationRead(notif.id);
    }
    setOpen(false);
    if (notif.post_id) {
      navigate(`/post/${notif.post_id}`);
    }
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    await fetch('/api/notifications/read-all', {
      method: 'PUT',
      credentials: 'include'
    });
    markAllNotificationsRead();
  };

  return (
    <div className="notif-bell-wrapper" ref={dropdownRef}>
      <span className="notif-bell" onClick={() => setOpen(!open)}>
        <FontAwesomeIcon icon={faBell} className="menu-icon" />
        {unreadCount > 0 && (
          <span className="unread-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </span>
      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead}>Mark all as read</button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="notif-empty">No notifications yet</div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                className={`notif-item${notif.read ? '' : ' unread'}`}
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="notif-avatar">
                  {notif.actors?.profile_picture ? (
                    <img src={notif.actors.profile_picture} alt="" />
                  ) : (
                    <div className="notif-avatar-placeholder">
                      {notif.actors?.username?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <div className="notif-body">
                  <div className="notif-message">{notif.message}</div>
                  <div className="notif-time">{timeAgo(notif.created_at)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
