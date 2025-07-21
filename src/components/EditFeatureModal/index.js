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

function EditFeatureModal({ open, onClose, featureData, onFeatureUpdated }) {
  const [feature, setFeature] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Modal açıldığında feature data'sını form'a yükle
  useEffect(() => {
    if (open && featureData) {
      console.log("Loading feature data into form:", featureData);
      setFeature({
        title: featureData.title || "",
        description: featureData.description || "",
        imageUrl: featureData.imageUrl || "",
      });
      setError("");
    }
  }, [open, featureData]);

  const handleInputChange = (field, value) => {
    setFeature((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feature.title || !feature.description) {
      setError("Title and description are required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updateData = {
        id: featureData.id,
        title: feature.title.trim(),
        description: feature.description.trim(),
        imageUrl: feature.imageUrl.trim(),
      };

      console.log("Updating feature ID:", featureData.id, "with data:", updateData);

      const response = await Axios.put(
        `https://localhost:7294/api/features/${featureData.id}`,
        updateData
      );
      console.log("Feature updated successfully:", response.data);

      onFeatureUpdated(); // Parent component'i güncelle
      onClose(); // Modal'ı kapat
    } catch (err) {
      console.error("Error updating feature:", err);
      console.error("Error response:", err.response?.data);

      if (err.response?.status === 404) {
        setError("Feature not found. The feature may have been deleted.");
      } else if (err.response?.status === 400) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.title ||
          "Invalid data. Please check all fields.";
        setError(errorMessage);
      } else {
        setError(err.response?.data?.message || "Failed to update feature");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setFeature({ title: "", description: "", imageUrl: "" });
    setError("");
    onClose();
  };

  // Modal'ı sadece featureData varsa göster
  if (!featureData) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Feature</DialogTitle>

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
                  value={feature.title}
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
                  value={feature.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  required
                />
              </MDBox>
            </Grid>

            <Grid item xs={12}>
              <MDBox mb={2}>
                <MDInput
                  type="url"
                  label="Image URL"
                  value={feature.imageUrl}
                  onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                  fullWidth
                  placeholder="https://example.com/image.jpg"
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </DialogContent>

      <DialogActions>
        <MDButton variant="text" color="secondary" onClick={handleClose}>
          Cancel
        </MDButton>
        <MDButton variant="gradient" color="info" onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

EditFeatureModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  featureData: PropTypes.object, // isRequired kaldırıldı
  onFeatureUpdated: PropTypes.func.isRequired,
};

export default EditFeatureModal;
