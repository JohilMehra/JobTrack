import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import { saveToken } from "../utils/auth";
import { useState } from "react";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);

      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      saveToken(res.data.token);
      toast.success("Google login successful 🚀");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    toast.error("Google sign-in was unsuccessful");
  };

  return (
    <div className="w-full">
      <div
        className={`w-full transition ${
          loading ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          width={280}
          theme="outline"
          size="large"
          shape="pill"
          text="continue_with"
        />
      </div>

      {loading && (
        <p className="text-xs text-center text-gray-400 mt-2">
          Signing in with Google...
        </p>
      )}
    </div>
  );
};

export default GoogleLoginButton;