import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoutes({ role, children }) {
  let token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    try{
      
    if (!token || token == null ) {
      navigate("/login", { replace: true })
      return;
    }
  let decodeRole = jwtDecode(token);
    if (decodeRole.role != role) {
      navigate("/login", { replace: true })
      localStorage.removeItem("token");
      return;
    }
    }
    catch(err){   
      return;
      
    }
  }, []);

  return children;
}
