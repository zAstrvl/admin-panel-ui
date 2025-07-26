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

function AddHeroModal({ open, onClose, onHeroAdded }) {
  // ✅ State field'larını form ile uyumlu hale getirin
  const [hero, setHero] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setHero((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Doğru field'ları kontrol edin
    if (!hero.title || !hero.description) {
      setError("Title and description are required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // ✅ API'nin beklediği format (backend'inizi kontrol edin)
      const newHero = {
        title: hero.title.trim(),
        description: hero.description.trim(),
        imageUrl: hero.imageUrl.trim() || "",
      };

      console.log("Creating hero with data:", newHero);

      const response = await Axios.post("/hero", newHero);
      console.log("Hero created:", response.data);

      onHeroAdded(response.data); // ✅ Response data'sını geçin
      handleClose(); // ✅ handleClose function'ını ekleyin
    } catch (err) {
      console.error("Error adding hero:", err);
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
    setHero({ title: "", description: "", imageUrl: "" });
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Hero</DialogTitle>
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
                  label="Hero Title"
                  fullWidth
                  value={hero.title}
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
                  value={hero.description}
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
                  value={hero.imageUrl}
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

AddHeroModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onHeroAdded: PropTypes.func.isRequired,
};

export default AddHeroModal;
