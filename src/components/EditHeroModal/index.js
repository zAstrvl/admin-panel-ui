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

function EditHeroModal({ open, onClose, heroData, onHeroUpdated }) {
  const [hero, setHero] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && heroData) {
      console.log("Loading hero data into form:", heroData);
      setHero({
        title: heroData.title || "",
        description: heroData.description || "",
        imageUrl: heroData.imageUrl || "",
      });
      setError("");
    }
  }, [open, heroData]);

  const handleInputChange = (field, value) => {
    setHero((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hero.title || !hero.description) {
      setError("Title and description are required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updateData = {
        id: heroData.id,
        title: hero.title,
        description: hero.description,
        imageUrl: hero.imageUrl,
      };

      const response = await Axios.put(
        `https://localhost:7294/api/hero/${heroData.id}`,
        updateData
      );
      console.log("Hero updated successfully:", response.data);

      onHeroUpdated(response.data);
      onClose();
    } catch (err) {
      console.error("Error updating hero:", err);
      setError("Failed to update hero. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setHero({
      title: "",
      description: "",
      imageUrl: "",
    });
    console.log("Modal closing");
    onClose();
  };

  if (!heroData) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Hero</DialogTitle>

      <DialogContent>
        <MDBox component="form" onSubmit={handleSubmit} p={3}>
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
                  value={hero.title}
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
                  value={hero.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
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
                  value={hero.imageUrl}
                  onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                  fullWidth
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

EditHeroModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  heroData: PropTypes.object,
  onHeroUpdated: PropTypes.func.isRequired,
};
export default EditHeroModal;
