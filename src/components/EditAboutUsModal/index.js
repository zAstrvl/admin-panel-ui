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

function EditAboutUsModal({ open, onClose, aboutUsData, onAboutUsUpdated }) {
  const [aboutUs, setAboutUs] = useState({
    title: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Modal açıldığında user data'sını form'a yükle
  useEffect(() => {
    if (open && aboutUsData) {
      console.log("Loading about us data into form:", aboutUsData);
      setAboutUs({
        title: aboutUs.title || "",
        description: aboutUs.description || "",
      });
      setError("");
    }
  }, [open, aboutUsData]);

  const handleInputChange = (field, value) => {
    setAboutUs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      setSaving(true);
      setError("");

      const updateData = {
        id: aboutUs.id,
        title: aboutUs.title.trim(),
        description: aboutUs.description.trim(),
      };

      console.log("Updating about us ID:", aboutUs.id, "with data:", updateData);

      // ✅ Proxy kullanıyorsanız full URL yerine endpoint kullanın
      const response = await Axios.put(`/api/aboutus/${aboutUs.id}`, updateData);
      console.log("About Us updated successfully:", response.data);

      onAboutUsUpdated();
    } catch (err) {
      console.error("Error updating about us:", err);
      setError(err.response?.data?.message || "Failed to update about us");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setAboutUs({ title: "", description: "" });
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit About Us</DialogTitle>
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
                  label="Title"
                  value={aboutUs.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  fullWidth
                  required
                />
              </MDBox>
            </Grid>

            <Grid item xs={12}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Description"
                  value={aboutUs.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  fullWidth
                  required
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
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
                  label="Title"
                  value={aboutUs.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  fullWidth
                  required
                />
              </MDBox>
            </Grid>

            <Grid item xs={12}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Description"
                  value={aboutUs.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  fullWidth
                  required
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

EditAboutUsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  aboutUsData: PropTypes.object,
  onAboutUsUpdated: PropTypes.func.isRequired,
};

export default EditAboutUsModal;
