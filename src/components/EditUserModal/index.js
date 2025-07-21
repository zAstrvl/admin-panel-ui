import { useState, useEffect } from "react";
import PropTypes from "prop-types";
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

function EditUserModal({ open, onClose, userData, onUserUpdated }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    userType: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Modal açıldığında user data'sını form'a yükle
  useEffect(() => {
    if (open && userData) {
      console.log("Loading user data into form:", userData);
      setUser({
        name: userData.name || "",
        email: userData.email || "",
        userType: userData.userType || "",
      });
      setError("");
    }
  }, [open, userData]);

  const handleInputChange = (field, value) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.name || !user.email) {
      setError("Name and email are required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // API'nin beklediği tüm fieldları gönder
      const updateData = {
        id: userData.id, // ID'yi de gönder
        name: user.name.trim(),
        email: user.email.trim(),
        userType: user.userType || "User", // Default value
        passwordHash: userData.passwordHash, // Mevcut password hash'i koru
      };

      console.log("Updating user ID:", userData.id, "with data:", updateData);

      // PUT isteği gönder
      const response = await Axios.put(
        `https://localhost:7294/api/users/${userData.id}`,
        updateData
      );
      console.log("User updated successfully:", response.data);

      onUserUpdated(); // Parent component'i güncelle ve modal'ı kapat
    } catch (err) {
      console.error("Error updating user:", err);
      console.error("Error response:", err.response?.data); // API'den gelen detaylı hata mesajı

      if (err.response?.status === 404) {
        setError("User not found. The user may have been deleted.");
      } else if (err.response?.status === 400) {
        // 400 hatası için daha detaylı mesaj
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.title ||
          "Invalid data. Please check all fields.";
        setError(errorMessage);
      } else {
        setError(err.response?.data?.message || "Failed to update user");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setUser({ name: "", email: "", userType: "" });
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit User</DialogTitle>

      <DialogContent>
        <MDBox component="form" role="form" mt={2}>
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
                  type="text"
                  label="User Type"
                  value={user.userType}
                  onChange={(e) => handleInputChange("userType", e.target.value)}
                  fullWidth
                  placeholder="Admin, Editor, Guest..."
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
          {saving ? "Saving..." : "Save Changes"}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

EditUserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userData: PropTypes.object,
  onUserUpdated: PropTypes.func.isRequired,
};

export default EditUserModal;
