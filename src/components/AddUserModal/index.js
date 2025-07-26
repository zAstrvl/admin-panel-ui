import { useState } from "react";
import PropTypes from "prop-types"; // ✅ "func" import'unu kaldırdım
import Axios from "axios";

// @mui material components
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

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

  const userTypeOptions = [
    { value: "Admin", label: "Admin" },
    { value: "Editor", label: "Editor" },
    { value: "Guest", label: "Guest" },
  ];

  const handleInputChange = (field, value) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.name || !user.email || !user.password) {
      setError("Name, email and password are required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const newUser = {
        name: user.name.trim(),
        email: user.email.trim(),
        userType: user.userType.trim() || "User",
        password: user.password,
      };

      console.log("Creating user with data:", {
        ...newUser,
        password: "******",
      });

      console.log("Creating user with data:", newUser);

      // ✅ Proxy kullanıyorsanız sadece endpoint'i belirtin
      const response = await Axios.post("/users", newUser);
      console.log("User created:", response.data);

      onUserAdded(response.data);
      handleClose();
    } catch (error) {
      console.error("Error creating user:", error);
      console.error("Error response:", error.response?.data);
      console.error("Validation errors:", error.response?.data?.errors); // ✅ Bu satırı ekleyin
      console.error("Error status:", error.response?.status);

      // Validation error'larını göster
      if (error.response?.data?.errors) {
        const validationErrors = Object.entries(error.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n");

        setError(`Validation errors:\n${validationErrors}`);
      } else {
        setError(
          error.response?.data?.title ||
            error.response?.data?.message ||
            "Failed to create user. Please try again."
        );
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
                <FormControl fullWidth required>
                  <InputLabel id="user-type-label">User Type</InputLabel>
                  <Select
                    labelId="user-type-label"
                    id="user-type-select"
                    value={user.userType}
                    label="User Type"
                    onChange={(e) => handleInputChange("userType", e.target.value)}
                    sx={{
                      minHeight: "45px", // MDInput ile uyumlu yükseklik
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "0.5rem", // Material Dashboard style
                      },
                    }}
                  >
                    {userTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
