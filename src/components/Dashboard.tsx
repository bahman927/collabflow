

// src/components/Dashboard.tsx
// import React from "react";
// import DashboardLayout from "../components/DashboardLayout";

// const Dashboard: React.FC = () => {
//   return <DashboardLayout />;
// };

// export default Dashboard;


import React from "react";
import ProjectItem from "./ProjectItem";
import ActivityItem from "./ActivityItem";

const DashboardLayout: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="font-bold text-3xl mb-4">Dashboard</h2>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-xl shadow p-2 mb-4 max-w-lg">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks and projects"
            className="w-full pl-10  py-2 rounded-lg border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="lg:flex gap-6">

        {/* LEFT SIDE */}
        <div className="flex-1">

          {/* Status Buttons */}
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <div className="flex flex-wrap gap-4 justify-between">
              <button className="flex-1 rounded-md bg-blue-300 text-white font-semibold hover:bg-blue-700 transition text-sm">
                3 To Do
              </button>
              <button className="flex-1 rounded-md bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-200 transition">
                2 In Progress
              </button>
              <button className="flex-1 rounded-lg bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition">
                3 Done
              </button>
              <button className="flex-1 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition">
                4 Overdue
              </button>
            </div>
          </div>

          {/* Recent Tasks + Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Recent Tasks */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Recent Tasks</h2>
              <ul className="space-y-3 text-lg">
                <ProjectItem title="Design Dashboard UI part 2" status="To Do" />
                <ProjectItem title="API Integration" status="In Progress" />
                <ProjectItem title="Fix Login Bug" status="Done" />
                <ProjectItem title="Client Billing" status="Overdue" />
              </ul>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Activity Feed</h2>
              <ul className="space-y-4">
                <ActivityItem
                  name="Bahman"
                  action="created a new task"
                  time="2 hours ago"
                  avatar="https://i.pravatar.cc/100?img=1"
                />
                <ActivityItem
                  name="Sara"
                  action="commented on a task"
                  time="5 hours ago"
                  avatar="https://i.pravatar.cc/100?img=5"
                />
                <ActivityItem
                  name="Ali"
                  action="marked task as Done"
                  time="Yesterday"
                  avatar="https://i.pravatar.cc/100?img=3"
                />
                <ActivityItem
                  name="Robin"
                  action="marked task as Done"
                  time="Yesterday"
                  avatar="https://i.pravatar.cc/100?img=8"
                />
              </ul>

              
            </div>

          </div>
        </div>

        {/* RIGHT SIDE - Project List */}
        <div className="w-full lg:w-80 mt-6 lg:mt-0">
          <div className="bg-white rounded-xl shadow p-6 h-fit">
            <h2 className="text-2xl font-semibold mb-4">Project List</h2>
            <ul className="space-y-3 text-lg">
              <ProjectItem title="Design Dashboard UI" status="To Do" />
              <ProjectItem title="Marketing Website" status="In Progress" />
              <ProjectItem title="Client Portal" status="Done" />
              <ProjectItem title="Account System" status="Overdue" />
              <ProjectItem title="Marketing System" status="Overdue" />
              <ProjectItem title="Account System" status="Overdue" />
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;



// import React from "react";
// import ProjectItem from "./ProjectItem";

// const DashboardLayout: React.FC = () => {
//   return (
//      {/* MAIN CONTENT AREA */}
// <div className="lg:flex gap-6">

//   {/* LEFT SIDE */}
//   <div className="flex-1">

//     {/* Top Status Buttons */}
//     <div className="bg-white rounded-xl shadow p-4 mb-6">
//       <div className="flex flex-wrap gap-4 justify-between">
//         <button className="flex-1 rounded-md bg-blue-300 text-white font-semibold hover:bg-blue-700 transition text-sm">
//           3 To Do
//         </button>
//         <button className="flex-1 rounded-md bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-200 transition">
//           2 In Progress
//         </button>
//         <button className="flex-1 rounded-lg bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition">
//           3 Done
//         </button>
//         <button className="flex-1 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition">
//           4 Overdue
//         </button>
//       </div>
//     </div>

//     {/* Recent Tasks + Activity Grid */}
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//       {/* Recent Tasks */}
//       <div className="bg-white rounded-xl shadow p-6">
//         <h2 className="text-2xl font-semibold mb-4">Recent Tasks</h2>
//         <ul className="space-y-3 text-lg">
//           <ProjectItem title="Design Dashboard UI part 2" status="To Do" />
//           <ProjectItem title="API Integration" status="In Progress" />
//           <ProjectItem title="Fix Login Bug" status="Done" />
//           <ProjectItem title="Client Billing" status="Overdue" />
//         </ul>
//       </div>

//       {/* Activity Feed */}
//       <div className="bg-white rounded-xl shadow p-6">
//         <h2 className="text-2xl font-semibold mb-4">Activity Feed</h2>
//         <ul className="space-y-4 text-lg">
//           <li>
//             <span className="font-semibold">Bahman</span> created a new task
//             <p className="text-sm text-gray-500">2 hours ago</p>
//           </li>
//           <li>
//             <span className="font-semibold">Sara</span> commented on a task
//             <p className="text-sm text-gray-500">5 hours ago</p>
//           </li>
//           <li>
//             <span className="font-semibold">Ali</span> marked task as Done
//             <p className="text-sm text-gray-500">Yesterday</p>
//           </li>
//         </ul>
//       </div>

//     </div>
//   </div>

//   <div className="w-full lg:w-80 mt-6 lg:mt-0">
//     <div className="bg-white rounded-xl shadow p-6 h-fit">
//       <h2 className="text-2xl font-semibold mb-4">Project List</h2>
//       <ul className="space-y-3 text-lg">
//         <ProjectItem title="Design Dashboard UI" status="To Do" />
//         <ProjectItem title="Marketing Website" status="In Progress" />
//         <ProjectItem title="Client Portal" status="Done" />
//         <ProjectItem title="Billing System" status="Overdue" />
//       </ul>
//     </div>
//   </div>

// </div> 



//   );
// };
// export default DashboardLayout;

  {/* RIGHT SIDE — Project List */}
  



  //   <div className="p-6 bg-gray-100 min-h-auto">
  //      <p className="font-bold text-2xl mb-4"> Dashboard</p>
  //     <div className="bg-white rounded-xl shadow p-2 mb-4 max-w-md">
  //       <div className="relative">
  //         <svg
  //           className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
  //           width="20"
  //           height="20"
  //           fill="none"
  //           stroke="currentColor"
  //           strokeWidth="2"
  //           viewBox="0 0 24 24"
  //         >
  //           <circle cx="11" cy="11" r="8" />
  //           <line x1="21" y1="21" x2="16.65" y2="16.65" />
  //         </svg>
  //         <input
  //           type="text"
  //           placeholder="Search tasks and projects"
  //           className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300
  //                      focus:outline-none focus:ring-2 focus:ring-blue-500"
  //         />
  //       </div>
  //     </div> 
         
  //     {/* Top Status Buttons */}
  //     <div className="bg-white rounded-xl shadow p-4 mb-6">
  //       <div className="flex flex-wrap gap-4 justify-between">
  //         <button className="flex-1  rounded-md bg-blue-300 text-white   font-semibold hover:bg-blue-700 transition text-sm">
  //          3 To Do
  //         </button>
  //         <button className="flex-1 rounded-md bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-200 transition">
  //           2 In Progress
  //         </button>
  //         <button className="flex-1   rounded-lg bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition">
  //           3 Done
  //         </button>
  //         <button className="flex-1  rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition">
  //           4 Overdue
  //         </button>
  //       </div>
  //     </div>

  //     {/* Search Bar */}
      

  //     {/* Bottom Section: 2 Columns */}
  //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //       {/* Recent Tasks */}
  //       <div className="bg-white rounded-xl shadow p-6">
  //         <h2 className="text-2xl font-semibold mb-4">Recent Tasks</h2>
  //         <ul className="space-y-3 text-lg">
  //           <ProjectItem title="Design Dashboard UI part 2" status="To Do" />
  //           <ProjectItem title="API Integration" status="In Progress" />
  //           <ProjectItem title="Fix Login Bug" status="Done" />
  //           <ProjectItem title="Client Billing" status="Overdue" />
  //         </ul>
  //       </div>

  //         {/* NEW: Activity Feed */}
  //   <div className="bg-white rounded-xl shadow p-6">
  //     <h2 className="text-2xl font-semibold mb-4">Activity Feed</h2>
  //     <ul className="space-y-4 text-lg">
  //       <li>
  //         <span className="font-semibold">Bahman</span> created a new task
  //         <p className="text-sm text-gray-500">2 hours ago</p>
  //       </li>
  //       <li>
  //         <span className="font-semibold">Sara</span> commented on a task
  //         <p className="text-sm text-gray-500">5 hours ago</p>
  //       </li>
  //       <li>
  //         <span className="font-semibold">Ali</span> marked task as Done
  //         <p className="text-sm text-gray-500">Yesterday</p>
  //       </li>
  //     </ul>
  //   </div>
  //   </div>
   
  // </div>
   {/* Project List */}
        //  <div className="bg-white rounded-xl shadow p-6">
        //   <h2 className="text-2xl font-semibold mb-4">Project List</h2>
        //   <ul className="space-y-3 text-lg">
        //     <ProjectItem title="Design Dashboard UI" status="To Do" />
        //     <ProjectItem title="Marketing Website" status="In Progress" />
        //     <ProjectItem title="Client Portal" status="Done" />
        //     <ProjectItem title="Billing System" status="Overdue" />
        //   </ul>
        // </div> 


    






 {/* Project List */}
        //  <div className="bg-white rounded-xl shadow p-6">
        //   <h2 className="text-2xl font-semibold mb-4">Project List</h2>
        //   <ul className="space-y-3 text-lg">
        //     <ProjectItem title="Design Dashboard UI" status="To Do" />
        //     <ProjectItem title="Marketing Website" status="In Progress" />
        //     <ProjectItem title="Client Portal" status="Done" />
        //     <ProjectItem title="Billing System" status="Overdue" />
        //   </ul>
        // </div> 


// // const DashboardLayout = () => {
// //   return (
// //     <div className="p-6 bg-gray-100 min-h-screen">
// //       <p className="font-bold text-2xl mb-4"> Dashboard</p>
// //       <div className="bg-white w-140 rounded-xl shadow  ml-10 mb-3">
        
//         <div className="relative">
//           {/* Search Icon */}
//           <svg
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//             width="20"
//             height="20"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//           >
//             <circle cx="11" cy="11" r="8" />
//             <line x1="21" y1="21" x2="16.65" y2="16.65" />
//           </svg>

//           {/* Input */}
//           <input
//             type="text"
//             placeholder="Search tasks or projects"
//             className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300
//                       focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
// //     </div>

// //       {/* <div className="bg-white  w-120 rounded-xl shadow p-6 ml-20 mb-3">
// //       </div> */}
// //       {/* Top Status Card */}
// //       <div className="bg-white rounded-xl shadow p-4 mb-4">
// //         <p className="font-semibold text-lg">Recent Tasks</p>
// //         <div className="flex flex-wrap gap-4 justify-between mt-1">
// //           <button className="flex-1 min-w-22.5 py-1  rounded-lg bg-blue-300  font-semibold  hover:bg-blue-400 transition">
// //            7 To Do
// //           </button>

// //           <button className="flex-1 min-w-35 py-3 rounded-lg bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-200 transition">
// //            5 In Progress
// //           </button>

// //           <button className="flex-1 min-w-35 py-3 rounded-lg bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition">
// //            3 Done
// //           </button>

// //           <button className="flex-1 min-w-35 py-3 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition">
// //            4 Overdue
// //           </button>
// //         </div>
// //       </div>

// //       {/* Bottom Section */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //         {/* Recent Tasks Card */}
// //         <div className="bg-white rounded-xl shadow p-6">
// //           <h2 className="text-lg font-semibold mb-4">Recent Tasks</h2>

// //           <ul className="space-y-3">
// //             <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
// //               <span>Design Dashboard UI</span>
// //               <span className="text-sm text-blue-600">To Do</span>
// //             </li>

// //             <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
// //               <span>API Integration</span>
// //               <span className="text-sm text-yellow-600">In Progress</span>
// //             </li>

// //             <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
// //               <span>Fix Login Bug</span>
// //               <span className="text-sm text-green-600">Done</span>
// //             </li>
// //           </ul>
// //         </div>

// //         {/* Project List Card */}
// //         <div className="bg-white rounded-xl shadow p-6">
// //           <h2 className="text-lg font-semibold mb-4">Project Lists</h2>

// //           <ul className="space-y-3">
// //             <li className="p-3 bg-gray-50 rounded-lg">
// //               <p className="font-medium">CollabFlow</p>
// //               <p className="text-sm text-gray-500">Team Collaboration App</p>
// //             </li>

// //             <li className="p-3 bg-gray-50 rounded-lg">
// //               <p className="font-medium">Task Manager</p>
// //               <p className="text-sm text-gray-500">Internal Productivity Tool</p>
// //             </li>

// //             <li className="p-3 bg-gray-50 rounded-lg">
// //               <p className="font-medium">Client Portal</p>
// //               <p className="text-sm text-gray-500">Customer Dashboard</p>
// //             </li>
// //           </ul>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DashboardLayout;







// // // src/pages/Dashboard.tsx

// // // src/pages/Dashboard.tsx
// // // import React from "react";
// // // import { Link } from "react-router-dom";

// // // const Dashboard: React.FC = () => {
// // //   return (
// // //     <div className="p-6 bg-slate-50 min-h-screen">
// // //       <h2 className="text-blue-900 font-extrabold mb-6">Dashboard</h2>

// // //       <p className="text-slate-700 mb-4">
// // //         Welcome to your CollabFlow dashboard. Manage projects, tasks, and teams here.
// // //       </p>

// // //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// // //         <Link
// // //           to="/projects"
// // //           className="rounded-lg bg-blue-200 p-6 text-white font-medium hover:bg-blue-400 transition"
// // //         >
// // //           View Projects
// // //         </Link>
// // //         <div className="rounded-lg bg-white p-6 shadow">Recent Activity</div>
// // //         <div className="rounded-lg bg-white p-6 shadow">Team Overview</div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;



// // // const Dashboard = () => {
// // //   return (
// // //     <div className="p-6">
// // //       <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
// // //       <p>Welcome to CollabFlow! Here you can see your workspaces and projects.</p>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;
