import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Login from "./components/Login";
import Layout from "./components/Layout";

function App() {
  const axiosApiInstance = axios.create();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [payload, setPayload] = useState();

  const refreshTokens = async () => {
    const response = await axios.post("/auth/refresh-token", {
      credentials: "include",
    });
    return response.data;
  };

  useEffect(() => {
    refreshTokens().then((data) => {
      if (data.ok) {
        setPayload(data.payload);
        setIsAuthenticated(true);
      }
      setLoading(false);
    });
  }, []);

  axiosApiInstance.interceptors.request.use(
    (config) => {
      if (payload?.token) {
        config.headers = {
          ...config.headers,
          authorization: `Bearer ${payload?.token}`,
        };
      }
  
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosApiInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response.status !== 401) {
        return Promise.reject(error);
      }
      refreshTokens()
      .then(data => {
        setPayload(data.payload)
        error.response.config.headers['authorization'] = `Bearer ${data.payload.token}`
        return axios(error.response.config)
      })
      .catch(() => {})
    }
  );

  const handleClick = async () => {
    const response = await axiosApiInstance.post("/api/door", {});
    if (response?.data?.message) {
      toast.success(response.data.message);
    }
  };

  if (loading) return <></>;

  return (
    <div className="flex h-screen">
      {isAuthenticated === false ? (
        <Login states={{ setPayload, setIsAuthenticated }} />
      ) : (
        <Layout payload={payload}>
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
