import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, CheckCircle2, XCircle, Clock } from 'lucide-react';

// --- Data for the Charts ---

// Data for Application Trends (Area Chart)
const applicationData = [
  { month: 'Jan', applicants: 400 },
  { month: 'Feb', applicants: 600 },
  { month: 'Mar', applicants: 800 },
  { month: 'Apr', applicants: 750 },
  { month: 'May', applicants: 900 },
  { month: 'Jun', applicants: 1100 },
];

// Colors for the Pie Chart slices
const COLORS = ['#3b82f6', '#ef4444', '#f59e0b']; // Blue, Red, Orange

// --- Custom Components for Charts ---

// Custom Tooltip for Area Chart for a better look
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200">
        <p className="label text-sm font-semibold text-gray-700">{`${label}`}</p>
        <p className="intro text-blue-600">{`New Applicants : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// Custom Label for Pie Chart to show percentages
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


// --- Main Dashboard Component ---

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_applications: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/admin/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    { title: "Total Applicants", value: stats.total_applications, icon: <Users size={24} />, color: "text-blue-600", bgColor: "bg-blue-100" },
    { title: "Approved", value: stats.approved, icon: <CheckCircle2 size={24} />, color: "text-green-600", bgColor: "bg-green-100" },
    { title: "Rejected", value: stats.rejected, icon: <XCircle size={24} />, color: "text-red-600", bgColor: "bg-red-100" },
    { title: "Pending", value: stats.pending, icon: <Clock size={24} />, color: "text-orange-600", bgColor: "bg-orange-100" },
  ];

  const statusData = [
    { name: 'Approved', value: stats.approved },
    { name: 'Rejected', value: stats.rejected },
    { name: 'Pending', value: stats.pending },
  ];

  return (
    <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome back, Admin</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <span className={card.color}>{card.icon}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <h2 className="text-2xl font-bold text-gray-800">{card.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Area Chart - taking more space */}
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Trends</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={applicationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }}/>
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="applicants" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorApplicants)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Status</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconSize={10} wrapperStyle={{ fontSize: "14px", bottom: 0 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
