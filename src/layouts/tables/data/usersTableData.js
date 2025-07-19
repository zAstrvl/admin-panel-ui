import { useState, useEffect } from "react";
import Axios from "axios";
import PropTypes from "prop-types";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

export default function UsersTableData() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const User = ({ name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  User.propTypes = {
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  };

  const Status = ({ status }) => (
    <MDBox ml={-1}>
      <MDBadge
        badgeContent={status}
        color={status === "active" ? "success" : "secondary"}
        variant="gradient"
        size="sm"
      />
    </MDBox>
  );

  Status.propTypes = {
    status: PropTypes.string.isRequired,
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await Axios.get("https://localhost:7294/api/users");
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    { Header: "user", accessor: "user", width: "45%", align: "left" },
    { Header: "user type", accessor: "userType", align: "center" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = users.map((user) => ({
    user: <User name={user.name} email={user.email} />,
    userType: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {user.userType}
      </MDTypography>
    ),
    status: <Status status={user.status || "inactive"} />,
    action: (
      <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
        Edit
      </MDTypography>
    ),
  }));

  return {
    columns,
    rows,
    loading,
    error,
  };
}
