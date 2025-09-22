import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

import enrolledIcon from "../../assets/admin/students.svg";
import assessedIcon from "../../assets/admin/assessed.svg";
import completionIcon from "../../assets/admin/completion.svg";
import performanceIcon from "../../assets/admin/performance.svg";
import greetingIcon from "../../assets/admin/greetings.png";

function AdminDashboard() {
  const barRef = useRef(null);
  const pieRef = useRef(null);

  useEffect(() => {
    let barChart;
    let pieChart;

    if (barRef.current) {
      const barCtx = barRef.current.getContext("2d");
      barChart = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: ["data 1", "data 2", "data 3"],
          datasets: [
            {
              label: "Series 1",
              data: [4, 12, 18],
              backgroundColor: "#89E2FF",
            },
            {
              label: "Series 2",
              data: [6, 14, 16],
              backgroundColor: "#4AC4FF",
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "top", labels: { color: "#333" } },
          },
          scales: {
            x: {
              ticks: { color: "#333" },
              grid: { display: false },
              beginAtZero: true,
            },
            y: {
              ticks: { color: "#333" },
              grid: { display: false },
            },
          },
        },
      });
    }

    if (pieRef.current) {
      const pieCtx = pieRef.current.getContext("2d");
      pieChart = new Chart(pieCtx, {
        type: "pie",
        data: {
          labels: ["data 1", "data 2", "data 3"],
          datasets: [
            {
              data: [60, 25, 15],
              backgroundColor: ["#89E2FF", "#4AC4FF", "#CFEFFF"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: "#333" },
            },
          },
        },
      });
    }

    return () => {
      if (barChart) barChart.destroy();
      if (pieChart) pieChart.destroy();
    };
  }, []);

  const stats = [
    {
      label: "Enrolled Students",
      value: 137,
      icon: enrolledIcon,
    },
    {
      label: "Total Students Assessed",
      value: 102,
      icon: assessedIcon,
    },
    {
      label: "Assessment Completion Rate",
      value: "87%",
      icon: completionIcon,
    },
    {
      label: "Overall Performance Rate",
      value: "94%",
      icon: performanceIcon,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10  overflow-y-auto scrollable-container">
      {/* Greeting and S.Y. */}
      <div className="bg-white shadow rounded-xl px-6 py-2 flex justify-between items-center text-gray-800 text-sm sm:text-base font-semibold">
        <div className="flex items-center gap-2">
          <img src={greetingIcon} alt="Greeting Icon" className="w-18 h-18" />
          Welcome, <span className="font-bold">Admin</span>
        </div>
        <div className="text-xs text-gray-600">S.Y. 2025-2026</div>
      </div>

      {/* Stat Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-8">
        {stats.map(({ label, value, icon }) => (
          <div
            key={label}
            className="bg-[#77b8ff] text-white rounded-xl p-4 pt-5 h-33 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold text-center">
              <img src={icon} alt={label} className="w-8 h-8 sm:w-10 sm:h-10" />
              <span>{value}</span>
            </div>
            <hr className="bg-white w-1/2 mx-20 mt-4" />
            <div className="text-center text-xs sm:text-sm font-bold leading-tight mt-3">
              {label}
            </div>
          </div>
        ))}
      </section>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow px-4 py-6 h-[400px] flex flex-col overflow-hidden">
          <h2 className="text-center font-semibold text-sm text-gray-700 mb-4">
            Overall Performance Summary
          </h2>
          <div className="flex-grow relative">
            <div className="absolute inset-0">
              <canvas ref={barRef} className="w-full h-full" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow px-4 py-6 h-[400px] flex flex-col overflow-hidden">
          <h2 className="text-center font-semibold text-sm text-gray-700 mb-4">
            Performance Goal Gap
          </h2>
          <div className="flex-grow relative">
            <div className="absolute inset-0">
              <canvas ref={pieRef} className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;