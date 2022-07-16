import { useState } from "react";
import axios from "axios";
import { setAuth } from "../../store/reducers/authSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const handleSignin = async (e) => {
    e.preventDefault();
    const response = await axios.post("/api/auth/signin", {
      username,
      password,
    });
    if (response.data.token && response.data.user) {
      dispatch(setAuth(response.data.payload))
    }
  };

  return (
    <>
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-300">
        <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
          <div className="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">
            Login To Your Account
          </div>
          <div className="mt-10">
            <form action="#">
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="username"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  Username:
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="username"
                    name="username"
                    className="text-sm sm:text-base placeholder-gray-500 pl-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Username"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col mb-6">
                <label
                  htmlFor="password"
                  className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
                >
                  Password:
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="text-sm sm:text-base placeholder-gray-500 pl-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                    placeholder="Password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="flex w-full">
                <button
                  type="submit"
                  className="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in"
                  onClick={(e) => handleSignin(e)}
                >
                  <span className="mr-2 uppercase">Login</span>
                </button>
              </div>
            </form>
          </div>
          <div className="flex justify-center items-center mt-6">
            <a
              href="/"
              target="_blank"
              className="inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center"
            >
              <span className="ml-2">Register user</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
