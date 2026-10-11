import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Flame,
  Clock,
  Award,
  Info,
  CheckCheck,
  ChevronRight,
  Home
} from 'lucide-react';
import { NotificationItem } from '../types/index.ts';
import { api } from '../lib/api.ts';

interface NotificationsViewProps {
  onNavigateToTab?: (tab: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onNavigateToTab }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.getNotifications();
      setNotifications(res.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;
  const unreadCount = notifications.filter(n => !n.read).length;

  const iconTypeMap: Record<string, { icon: any; color: string }> = {
    streak_risk: { icon: Flame, color: 'text-[#D4A017] bg-[#FFF8E7]' },
    deadline: { icon: Clock, color: 'text-[#8E68CD] bg-[#F3EEFF]' },
    achievement: { icon: Award, color: 'text-[#D4A017] bg-[#FFFDF5]' },
    info: { icon: Info, color: 'text-[#3B2A6B] bg-[#F3EEFF]' }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-[#7D6B9E]">Loading notifications...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb & Home Link */}
      <div className="flex items-center justify-between pb-1">
        <nav className="flex items-center gap-2 text-xs text-[#7D6B9E]">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-[#2A1B4E] transition-colors"
            title="Public Home Page"
          >
            <Home className="w-3.5 h-3.5 text-[#8E68CD]" />
            <span>Home</span>
          </Link>
          <span className="text-[#C8BEDD]">/</span>
          <Link to="/dashboard" className="hover:text-[#2A1B4E] transition-colors">
            Dashboard
          </Link>
          <span className="text-[#C8BEDD]">/</span>
          <span className="font-semibold text-[#2A1B4E]">Notifications</span>
        </nav>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E6DBFF] text-xs font-semibold text-[#6540AB] hover:bg-[#F3EEFF] transition-all shadow-2xs"
          title="Visit Public Website Home"
        >
          <Home className="w-3.5 h-3.5 text-[#8E68CD]" />
          <span>Public Home</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6DBFF]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017] flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" />
            Alerts & Deadline Reminders
          </span>
          <h1 className="text-2xl font-black text-[#2A1B4E] mt-1">
            Notifications ({unreadCount} Unread)
          </h1>
          <p className="text-xs text-[#6B5A99] mt-1">
            Stay on track with streak-at-risk warnings, weekly focus updates, and verified milestone alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1 p-1 bg-[#F3EEFF] rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'all' ? 'bg-white text-[#2A1B4E] shadow-xs' : 'text-[#6B5A99]'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'unread' ? 'bg-white text-[#2A1B4E] shadow-xs' : 'text-[#6B5A99]'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#3B2A6B] bg-white border border-[#E6DBFF] hover:bg-[#FAF8FF] shadow-xs flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-[#E6DBFF] text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-[#2A1B4E]">All Caught Up!</h3>
            <p className="text-xs text-[#6B5A99]">No notifications matching your filter.</p>
          </div>
        ) : (
          filtered.map(notif => {
            const conf = iconTypeMap[notif.type] || iconTypeMap.info;
            const Icon = conf.icon;

            return (
              <div
                key={notif.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  notif.read
                    ? 'bg-white border-[#E6DBFF]'
                    : 'bg-[#FFFDF5] border-[#F2C94C] shadow-xs ring-1 ring-[#FFF8E7]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${conf.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#2A1B4E]">{notif.title}</h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#D4A017]" />
                      )}
                    </div>
                    <p className="text-xs text-[#6B5A99] leading-relaxed">{notif.message}</p>
                    <div className="text-[10px] text-[#9A8CB8] font-mono">
                      {new Date(notif.timestamp).toLocaleDateString()} at{' '}
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                {!notif.read && (
                  <button
                    type="button"
                    onClick={() => handleMarkRead(notif.id)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#805E00] bg-white border border-[#F2C94C]/70 hover:bg-[#FFFBEA] shrink-0 self-start sm:self-auto"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
