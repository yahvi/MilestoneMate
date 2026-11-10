import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Clock, AlertCircle, CheckCircle2, DollarSign } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'payment_success':
        return <DollarSign className="w-4 h-4 text-[#047857]" />;
      case 'milestone_approval':
      case 'plan_approval':
        return <CheckCircle2 className="w-4 h-4 text-[#047857]" />;
      case 'revision_request':
      case 'deadline_warning':
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-[#E34234]" />;
      default:
        return <Clock className="w-4 h-4 text-[#3D4C44]" />;
    }
  };

  const handleNotificationClick = (item) => {
    markAsRead(item._id);
    if (item.relatedProjectId) {
      navigate(`/projects/${item.relatedProjectId}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#3D4C44] hover:text-[#047857] hover:bg-[#F2ECE1] rounded-full transition"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E34234] text-[10px] font-bold text-white shadow-xs animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-[#EADBCE] py-2 z-50 animate-in fade-in zoom-in-95">
          <div className="px-4 py-2 border-b border-[#F2ECE1] bg-[#FAF7F2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#1C2826] text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-[#FFEAE6] text-[#E34234] px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[#047857] hover:text-[#065F46] font-bold flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#F2ECE1]">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-[#7F8D85] text-sm">
                No notifications yet.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 hover:bg-[#FAF7F2] cursor-pointer transition flex items-start gap-3 ${
                    !item.isRead ? 'bg-[#F0FAF4]' : ''
                  }`}
                >
                  <div className="p-2 bg-white rounded-lg border border-[#EADBCE] shadow-2xs mt-0.5 shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#1C2826] truncate">{item.title}</p>
                      <span className="text-[10px] text-[#7F8D85]">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-[#526058] mt-0.5 line-clamp-2 leading-relaxed">{item.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
