import { useState } from "react";
import PropTypes from "prop-types"; // ✅ "func" import'unu kaldırdım
import Axios from "axios";

// @mui material components
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

function AddUserModal({ open, onClose, onUserAdded }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    userType: "",
    password: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.name || !user.email || !user.password) {
      // ✅ userType zorunlu değil
      setError("Name, email and password are required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const newUser = {
        name: user.name.trim(),
        email: user.email.trim(),
        userType: user.userType.trim() || "User", // ✅ Default value
        password: user.password,
      };

      console.log("Creating user with data:", newUser);

      const response = await Axios.post("/users", newUser);
      console.log("User created:", response.data);

      onUserAdded(response.data);
      handleClose();
    } catch (error) {
      // ✅ Variable name tutarlı
      console.error("Error creating user:", error);
      console.error("Error response:", error.response?.data); // ✅ "err" → "error"

      if (error.response?.status === 400) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.title ||
          "Invalid data. Please check all fields.";
        setError(errorMessage);
      } else if (error.response?.status === 409) {
        setError("A user with this email already exists.");
      } else if (error.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else {
        setError(error.response?.data?.message || "Failed to create user. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  // ✅ handleClose function'ı try-catch dışına taşındı
  const handleClose = () => {
    setUser({ name: "", email: "", userType: "", password: "" });
    setError("");
    onClose();
  };

  return (
    // ✅ return try-catch dışında
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New User</DialogTitle>

      <DialogContent>
        <MDBox component="form" onSubmit={handleSubmit} mt={2}>
          {error && (
            <MDBox mb={2} p={2} borderRadius="lg" sx={{ backgroundColor: "#ffebee" }}>
              <MDTypography variant="caption" color="error">
                {error}
              </MDTypography>
            </MDBox>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Name"
                  value={user.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  fullWidth
                  required
                />
              </MDBox>
            </Grid>

            <Grid item xs={12}>
              <MDBox mb={2}>
                <MDInput
                  type="email"
                  label="Email"
                  value={user.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  fullWidth
                  required
                />
              </MDBox>
            </Grid>

            <Grid item xs={12}>
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Password"
                  value={user.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  fullWidth
                  required
                />
              </MDBox>
            </Grid>

            <Grid item xs={12}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="User Type"
                  value={user.userType}
                  onChange={(e) => handleInputChange("userType", e.target.value)}
                  fullWidth
                  placeholder="Admin, Editor, User..."
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </DialogContent>

      <DialogActions>
        <MDButton variant="contained" color="secondary" onClick={handleClose}>
          Cancel
        </MDButton>
        <MDButton variant="gradient" color="info" onClick={handleSubmit} disabled={saving}>
          {saving ? "Creating..." : "Create User"}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
} // ✅ Kapatma parantezi düzeltildi

AddUserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUserAdded: PropTypes.func.isRequired,
};

export default AddUserModal;
