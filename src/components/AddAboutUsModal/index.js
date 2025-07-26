import Axios from "axios";
import { useState } from "react";
import PropTypes from "prop-types";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

function AddAboutUsModal({ open, onClose, onAboutUsAdded }) {
  const [aboutUs, setAboutUs] = useState({
    title: "",
    description: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setAboutUs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!aboutUs.title || !aboutUs.description) {
      setError("Title and description are required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const newAboutUs = {
        title: aboutUs.title.trim(),
        description: aboutUs.description.trim(),
      };

      console.log("Creating About Us with data:", newAboutUs);

      const response = await Axios.post("/aboutus", newAboutUs);
      console.log("About Us created:", response.data);

      onAboutUsAdded(response.data); // ✅ Response data'sını geçin
      handleClose(); // ✅ handleClose function'ını ekleyin
    } catch (err) {
      console.error("Error adding About Us:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.title ||
        "Failed to add feature. Please try again.";

      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // ✅ handleClose function'ını ekleyin
  const handleClose = () => {
    setAboutUs({ title: "", description: "" });
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New About Us</DialogTitle>
      <DialogContent>
        <MDBox component="form" onSubmit={handleSubmit} mt={2}>
          {error && error.trim() && (
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
                  label="About Us Title"
                  fullWidth
                  value={aboutUs.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </MDBox>
            </Grid>

            <Grid item xs={12}>
              <MDBox mb={2}>
                <MDInput
                  label="Description"
                  fullWidth
                  value={aboutUs.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  required
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </DialogContent>

      <DialogActions>
        <MDButton variant="contained" color="secondary" onClick={handleClose} disabled={saving}>
          Cancel
        </MDButton>
        <MDButton variant="gradient" color="info" onClick={handleSubmit} disabled={saving}>
          {saving ? "Creating..." : "Add Feature"}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

AddAboutUsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAboutUsAdded: PropTypes.func.isRequired,
};

export default AddAboutUsModal;
