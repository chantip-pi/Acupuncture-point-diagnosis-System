import { Form, useNavigate } from "@remix-run/react";
import * as React from "react";
import { useLogin } from "~/presentation/hooks/useLogin";

function LogIn() {
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();
  const [formError, setFormError] = React.useState<string | null>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const username = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    if (!username || !password) {
      setFormError("Username and password are required.");
      return;
    }

    const session = await login({ username, password });

    if (!session) {
      // `useLogin` already sets a human-friendly error message.
      setFormError("Invalid username or password.");
      return;
    }

    // Login successful: go to home page
    navigate("/home");
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
          <Form method="post" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
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
                name="password"
                className="w-full py-2 px-3 bg-gray-300 text-sm rounded-3xl"
                required
              />
            </div>
            {(formError || error) && (
              <p className="text-red-500">
                {formError ?? error}
              </p>
            )}
            <button
              className="mt-10 py-2 px-3 bg-gradient-to-r from-[#2CD8] to-[#C5C1FF] text-white font-bold rounded-lg w-[70%] mx-auto block disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
