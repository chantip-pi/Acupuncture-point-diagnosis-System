import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { useLogin } from "~/presentation/hooks/useLogin";

function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error: hookError } = useLogin();
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
  
    setError("");
    const staff = await login({ username, password });
    
    if (staff) {
      sessionStorage.setItem("currentUser", username);
      navigate("/home");
    } else {
      setError(hookError || "Invalid username or password.");
    }
  };  

  return (
    <div className="flex justify-center items-center w-[90vw] h-[90vh] bg-gray-100 shadow-lg rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="p-0 bg-gray-100 rounded-lg max-w-sm w-full z-10">
        <div className="p-12 bg-gray-100 rounded-lg">
          <div className="text-center mb-10">
            <h1 className="text-black font-bold text-3xl mb-2">CLINIC</h1>
            <div className="w-full h-0.5 bg-black mb-2"></div>
            <h3>Chinese Medical Clinic</h3>
          </div>
          <div>
            <div className="mb-4">
              <label htmlFor="username" className="block mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full py-2 px-3 bg-gray-300 text-sm rounded-3xl"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2 px-3 bg-gray-300 text-sm rounded-3xl"
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-10 py-2 px-3 bg-gradient-to-r from-[#2CD8] to-[#C5C1FF] text-white font-bold rounded-lg w-[70%] mx-auto block disabled:opacity-50"
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
