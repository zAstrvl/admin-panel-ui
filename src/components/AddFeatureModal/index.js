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

function AddFeatureModal({ open, onClose, onFeatureAdded }) {
  const [feature, setFeature] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setFeature((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Doğru field'ları kontrol edin
    if (!feature.title || !feature.description) {
      setError("Title and description are required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // ✅ API'nin beklediği format (backend'inizi kontrol edin)
      const newFeature = {
        title: feature.title.trim(),
        description: feature.description.trim(),
        imageUrl: feature.imageUrl.trim() || "",
      };

      console.log("Creating feature with data:", newFeature);

      const response = await Axios.post("/features", newFeature);
      console.log("Feature created:", response.data);

      onFeatureAdded(response.data); // ✅ Response data'sını geçin
      handleClose(); // ✅ handleClose function'ını ekleyin
    } catch (err) {
      console.error("Error adding feature:", err);
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
    setFeature({ title: "", description: "", imageUrl: "" });
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Feature</DialogTitle>
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
                  label="Feature Title"
                  fullWidth
                  value={feature.title}
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
                  value={feature.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  required
                />
              </MDBox>
            </Grid>

            <Grid item xs={12}>
              <MDBox mb={2}>
                <MDInput
                  label="Image URL"
                  fullWidth
                  value={feature.imageUrl}
                  onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                  placeholder="https://example.com/image.jpg"
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

AddFeatureModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFeatureAdded: PropTypes.func.isRequired,
};

export default AddFeatureModal;
