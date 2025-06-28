import { useEffect } from "react";
import MapComponent from "../../modules/dashboard/Map";

import { useGlobalKeys } from "../../stores/useGlobalKeys";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const userKey = useGlobalKeys((state) => state.userKey);

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Dashboard";
    if (userKey === ``) {
      navigate("/login");
      window.location.reload();
    }
  }, [navigate, userKey]);

  return <MapComponent />;
};

export default Dashboard;
