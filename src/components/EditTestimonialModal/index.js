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
import { Edit } from "@mui/icons-material";
import { apiUrl } from "utils/constants";

function EditTestimonialModal({ open, onClose, testimonialData, onTestimonialUpdated }) {
  const [testimonial, setTestimonial] = useState({
    name: "",
    content: "",
    imageUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && testimonialData) {
      console.log("Loading testimonial data into form:", testimonialData);
      setTestimonial({
        name: testimonialData.name || "",
        content: testimonialData.content || "",
        imageUrl: testimonialData.imageUrl || "",
      });
      setError("");
    }
  }, [open, testimonialData]);

  const handleInputChange = (field, value) => {
    setTestimonial((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!testimonial.name || !testimonial.content) {
      setError("Name and content are required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updateData = {
        id: testimonialData.id,
        name: testimonial.name,
        content: testimonial.content,
        imageUrl: testimonial.imageUrl,
      };

      const response = await Axios.put(
        `${apiUrl}/api/testimonials/${testimonialData.id}`,
        updateData
      );
      console.log("Testimonial updated successfully:", response.data);
      onTestimonialUpdated(response.data);
      onClose();
    } catch (err) {
      console.error("Error updating testimonial:", err);
      setError("Failed to update testimonial");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setTestimonial({
      name: "",
      content: "",
      imageUrl: "",
    });
    console.log("Modal closing");
    onClose();
  };

  if (!testimonialData) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Testimonial</DialogTitle>

      <DialogContent>
        <MDBox component="form" onClose={handleClose} p={3}>
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
                  value={testimonial.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  fullWidth
                  required
                />
              </MDBox>
            </Grid>

            <Grid item xs={12}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Content"
                  value={testimonial.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  fullWidth
                  required
                />
              </MDBox>
            </Grid>

            <Grid item xs={12}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Image URL"
                  value={testimonial.imageUrl}
                  onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                  fullWidth
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

EditTestimonialModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  testimonialData: PropTypes.object,
  onTestimonialUpdated: PropTypes.func.isRequired,
};
export default EditTestimonialModal;
