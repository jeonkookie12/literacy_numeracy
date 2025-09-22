import React from "react";
import { useNavigate } from "react-router-dom";

import learnersImg from "../../assets/admin/user_management/learners.jpg";
import teachersImg from "../../assets/admin/user_management/teachers.jpg";
import adminImg from "../../assets/admin/user_management/admin.jpg";

const AdminUsers = () => {
  const navigate = useNavigate();

  const userTypes = [
    { label: "Learners", image: learnersImg, route: "/manage-users/learners" },
    { label: "Teachers", image: teachersImg, route: "/manage-users/teachers" },
    { label: "Admin/Staff", image: adminImg, route: "/manage/admin" },
  ];

  return (
    <div className="min-h-screen bg-[#F3F3FF] px-4 py-10">
      <h2 className="text-center text-gray-700 font-medium mb-10 text-lg">
        Tap a section to browse and manage users by role
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {userTypes.map((user) => (
          <div
            key={user.label}
            onClick={() => {
              console.log(`AdminUsers - Navigating to: ${user.route}`);
              navigate(user.route);
            }}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden flex flex-col cursor-pointer"
          >
            <div className="p-4 pb-0">
              <img
                src={user.image}
                alt={user.label}
                className="rounded-xl object-cover object-top w-full h-60"
              />
            </div>

            <div className="px-4 py-3 flex-grow flex flex-col justify-between">
              <p className="text-gray-800 font-medium text-md mb-4 text-left">
                {user.label}
              </p>

              <div className="w-full bg-[#D9E1FF] text-[#3E4C9A] font-semibold py-2 rounded-xl text-sm text-center pointer-events-none">
                Manage
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;