import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import { saveToken } from "../utils/auth";
import { useState } from "react";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSuccess = async ({ credential }) => {
    if (!credential) {
      toast.error("Google did not return a credential");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/google", { credential });

      saveToken(res.data.token);
      toast.success("Google login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    toast.error("Google sign-in was unsuccessful");
  };

  return (
    <div className="w-full">
      <div className={`w-full transition ${loading ? "opacity-60 pointer-events-none" : ""}`}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap={false}
          theme="outline"
          size="large"
          shape="pill"
          text="continue_with"
          width="280"
        />
      </div>

      {loading && (
        <p className="mt-2 text-center text-xs text-gray-500">Signing in with Google...</p>
      )}
    </div>
  );
};

export default GoogleLoginButton;
