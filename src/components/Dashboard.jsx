"use client";
import { getLogAuditsForDashboard } from "@/dbActions/loginAudit";
import React, { useEffect, useState } from "react";

import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function Dashboard() {
  const [filterType, setFilterType] = useState("M");
  const [loginData, setLoginData] = useState([]);

  const filters = [
    { text: "Hour", type: "H" },
    { text: "Day", type: "D" },
    { text: "7 Days", type: "7D" },
    { text: "Month", type: "M" },
    { text: "6 Months", type: "6M" },
    { text: "Year", type: "Y" },
    { text: "All", type: "A" },
  ];

  useEffect(() => {
    const fetchLoginAuditData = async (type) => {
      const result = await getLogAuditsForDashboard(type);
      if (result.type === "success") {
        setLoginData(result.message);
      } else {
        setLoginData([]);
      }
    };

    fetchLoginAuditData(filterType);
  }, [filterType]);

  const handleFilterChange = (e) => {
    setFilterType(e);
  };

  return (
    <div className="flex flex-col w-full h-fit gap-10 mt-10 px-2">
      <div className="flex justify-between items-center">
        <p className="font-bold">Login Statistics</p>
        <div>
          <ul className="flex gap-1">
            {filters.map((btn) => (
              <li
                key={btn.text}
                className={`py-1 px-3 border-[1px] border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer ${
                  filterType === btn.type && "bg-slate-100"
                }`}
                onClick={() => handleFilterChange(btn.type)}
              >
                {btn.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ width: "100%", height: "500px" }} className="px-2">
        <ResponsiveContainer>
          <ComposedChart
            data={loginData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time_unit"
              label={{
                value: "Time Units",
                position: "insideBottomRight",
                offset: -15,
              }}
            />
            <YAxis
              label={{
                value: "#Sessions",
                angle: "-90",
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="Sessions"
              stroke="#8884d8"
              fill="#c8c3fa"
            />
            <Line
              type="monotone"
              dataKey="Success"
              stroke="#32bf78"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="Failed"
              stroke="#c94058"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
