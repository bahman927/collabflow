import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();

  return (
    <button
      onClick={() => login("demo-token")}
      className="px-4 py-2 bg-black text-white rounded"
    >
      Login
    </button>
  );
};

export default Login;


// src/pages/Login.tsx
// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// const Login: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Login with", { email, password });
//     // TODO: call Django API
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
//       <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
//         <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">
//           Login
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full rounded-md border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full rounded-md border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />

//           <button
//             type="submit"
//             className="w-full rounded-lg bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 transition"
//           >
//             Login
//           </button>
//         </form>

//         <p className="text-sm text-slate-600 mt-4 text-center">
//           Don’t have an account?{" "}
//           <Link to="/signup" className="text-blue-600 hover:underline">
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
