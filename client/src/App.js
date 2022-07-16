import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth, setAuth } from "./store/reducers/authSlice";
import Login from "./components/Login";
import Layout from "./components/Layout";

function App() {
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const refreshToken = async () => {
    const response = await axios.get("/api/auth/refresh", {
      withCredentials: true,
    });
    if (response?.data?.ok) {
      dispatch(setAuth(response.data.payload));
      return response.data.payload;
    }
    
  };

  const refreshAuthLogic = async (failedRequest) => {
    const payload = await refreshToken();
    failedRequest.response.config.headers["Authorization"] =
      "Bearer " + payload.token;
    return Promise.resolve();
  };

  createAuthRefreshInterceptor(axios, refreshAuthLogic);

  useEffect(() => {
    refreshToken();
    setLoading(false);
  }, []);

  const handleClick = async () => {
    const response = await axios.get("/api/door", {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    if (response?.data?.message) {
      toast.success(response.data.message);
    }
  };

  if (loading) return (<>Loading...</>)
  return (
    <div className="flex h-screen">
      {auth.token === null ? (
        <Login />
      ) : (
        <Layout>
          <div className="flex flex-col w-full h-full items-center justify-center bg-gray-300">
            <div
              className="p-12 border-2 bg-white border-black rounded-full shadow-xl"
              onClick={() => handleClick()}
            >
              <img className="" alt="garage" src="/assets/garage.png" />
            </div>

            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                className: "mt-12",
                duration: 5000,
              }}
            />
          </div>
        </Layout>
      )}
    </div>
  );
}
export default App;
