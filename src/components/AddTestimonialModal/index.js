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

function AddTestimonialModal({ open, onClose, onTestimonialAdded }) {
  // ✅ State field'larını form ile uyumlu hale getirin
  const [testimonial, setTestimonial] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setTestimonial((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Doğru field'ları kontrol edin
    if (!testimonial.title || !testimonial.description) {
      setError("Title and description are required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // ✅ API'nin beklediği format (backend'inizi kontrol edin)
      const newTestimonial = {
        title: testimonial.title.trim(),
        description: testimonial.description.trim(),
        imageUrl: testimonial.imageUrl.trim() || "",
      };

      console.log("Creating testimonial with data:", newTestimonial);

      const response = await Axios.post("/testimonials", newTestimonial);
      console.log("Testimonial created:", response.data);

      onTestimonialAdded(response.data); // ✅ Response data'sını geçin
      handleClose(); // ✅ handleClose function'ını ekleyin
    } catch (err) {
      console.error("Error adding testimonial:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.title ||
        "Failed to add hero. Please try again.";

      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // ✅ handleClose function'ını ekleyin
  const handleClose = () => {
    setTestimonial({ title: "", description: "", imageUrl: "" });
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Testimonial</DialogTitle>
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
                  label="Testimonial Title"
                  fullWidth
                  value={testimonial.title}
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
                  value={testimonial.description}
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
                  value={testimonial.imageUrl}
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
          {saving ? "Creating..." : "Add Hero"}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

AddTestimonialModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onTestimonialAdded: PropTypes.func.isRequired,
};

export default AddTestimonialModal;
