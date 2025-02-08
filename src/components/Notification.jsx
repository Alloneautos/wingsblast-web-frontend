import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import { IoFastFoodSharp } from "react-icons/io5";
import { API, useNotification } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Notification = ({ sendUnreadCount }) => {
  const { notification, refetch } = useNotification();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notification.filter(
    (notif) => notif.is_read === 0
  ).length;

  useEffect(() => {
    sendUnreadCount(unreadCount);
  }, [unreadCount]);

  const markAsRead = async (id) => {
    try {
      await API.put(`/notification/update/${id}`);
      refetch();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleNotificationClick = async (id, url) => {
    setIsNavigating(true);
    try {
      await markAsRead(id);
      if (url) navigate(url);
    } catch (err) {
      console.error("Failed to navigate:", err);
    } finally {
      setIsNavigating(false);
    }
  };

  const renderNotifications = (notifications) => {
    return notifications.map((item) => (
      <div
        key={item.id}
        className={`flex items-center cursor-pointer justify-between p-2 rounded-lg shadow-sm ${
          item.is_read ? "bg-green-50" : "bg-red-50"
        }`}
        onClick={() => handleNotificationClick(item.id, item.url)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-pink-200 text-2xl p-3 rounded-full flex items-center justify-center text-pink-600 font-semibold">
            <IoFastFoodSharp />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-600">{item.title}</p>
            <p className="text-xs text-gray-600">{item.message}</p>
            <p className="text-xs text-gray-400">
              {new Date(item.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        {/* {isNavigating && <Spin size="small" />} */}
      </div>
    ));
  };

  return (
    <div>
      <div className="drawer drawer-end top-20 z-50">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">{/* Page content here */}</div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 rounded-md shadow-lg">
            {/* Sidebar Header */}
            <div className=" flex ">
              <label htmlFor="my-drawer-4">
                <CgClose className="bg-red-200 text-2xl rounded cursor-pointer" />
              </label>
              <h1 className="ml-6 text-3xl font-bold text-center">
                Notifications
              </h1>
            </div>
            <div className="divider"></div>

            {/* Recent Notifications */}
            <div className="pb-4">
              <h2 className="text-lg font-semibold text-gray-600">Recent</h2>
              <div className="space-y-3 pt-2">
                {renderNotifications(
                  notification.filter((n) => n.is_read === 0)
                )}
              </div>
            </div>
            <div className="divider"></div>

            {/* All Notifications */}
            <div>
              <h2 className="text-lg font-semibold text-gray-600">All</h2>
              <div className="space-y-3 pt-2">
                {renderNotifications(notification)}
              </div>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Notification;
