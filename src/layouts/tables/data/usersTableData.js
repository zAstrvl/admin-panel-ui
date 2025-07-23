import AddUserModal from "components/AddUserModal";
import { useState, useEffect } from "react";
import Axios from "axios";
import PropTypes from "prop-types";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDButton from "components/MDButton";
import EditUserModal from "components/EditUserModal";

export default function UsersTableData() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const User = ({ name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name || "No Name"}
        </MDTypography>
        <MDTypography variant="caption">{email || "No Email"}</MDTypography>
      </MDBox>
    </MDBox>
  );

  User.propTypes = {
    name: PropTypes.string,
    email: PropTypes.string,
  };

  const Status = ({ status }) => (
    <MDBox ml={-1}>
      <MDBadge
        badgeContent={status || "inactive"}
        color={status === "active" ? "success" : "secondary"}
        variant="gradient"
        size="sm"
      />
    </MDBox>
  );

  Status.propTypes = {
    status: PropTypes.string,
  };

  // Edit button handler - Direkt user data'sını geçir
  const handleEditClick = (user) => {
    console.log("Edit clicked for user:", user);
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  // Modal close handler
  const handleModalClose = () => {
    console.log("Modal closing");
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  // User updated handler - refresh the table
  const handleUserUpdated = () => {
    console.log("User updated, refreshing table");
    fetchUsers();
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserAdded = () => {
    console.log("User added, refreshing table");
    fetchUsers();
    setAddModalOpen(false);
  };

  const handleAddClick = () => {
    console.log("Add User button clicked");
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/users");
      console.log("Users API Response:", response.data);
      setUsers(response.data || []);
      setError("");
    } catch (err) {
      console.error("Users API Error:", err);
      setError("Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        {user.userType || "No Type"}
      </MDTypography>
    ),
    status: <Status status={user.status} />,
    action: (
      <MDButton
        variant="text"
        color="info"
        size="small"
        onClick={() => handleEditClick(user)} // Tüm user object'ini geç
      >
        Edit
      </MDButton>
    ),
  }));

  const editModal = (
    <EditUserModal
      open={editModalOpen}
      onClose={handleModalClose}
      userData={selectedUser} // userId yerine userData geç
      onUserUpdated={handleUserUpdated}
    />
  );

  const addModal = (
    <AddUserModal open={addModalOpen} onClose={handleAddModalClose} onUserAdded={handleUserAdded} />
  );

  return {
    columns,
    rows,
    loading,
    error,
    editModal,
    addModal,
    handleAddClick,
  };
}
