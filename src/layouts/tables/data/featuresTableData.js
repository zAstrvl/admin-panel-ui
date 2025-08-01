import { useState, useEffect } from "react";
import Axios from "axios";
import PropTypes from "prop-types";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import MDBox from "components/MDBox";
import MDAvatar from "components/MDAvatar";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import EditFeatureModal from "components/EditFeatureModal";
import AddFeatureModal from "components/AddFeatureModal";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";

export default function FeaturesTableData() {
  // Function adı düzeltildi
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const Feature = ({ title, description, imageUrl }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={imageUrl || "/default-feature.png"} alt={title} variant="rounded" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {title || "No Title"}
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {description || "No Description"}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  Feature.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
  };

  const handleEditClick = (feature) => {
    console.log("Edit clicked for feature:", feature);
    setSelectedFeature(feature);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    console.log("Modal closing");
    setEditModalOpen(false);
    setSelectedFeature(null);
  };

  const handleFeatureUpdated = () => {
    console.log("Feature updated, refreshing table");
    fetchFeatures(); // Refresh the list after update
  };

  const handleAddClick = () => {
    console.log("Add Feature button clicked");
    setAddModalOpen(true);
  };
  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };
  const handleDeleteClick = async (feature) => {
    setItemToDelete(feature);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading((prev) => ({ ...prev, [itemToDelete.id]: true }));

      console.log("Deleting feature:", itemToDelete);
      await Axios.delete(`/features/${itemToDelete.id}`);

      // ✅ Local state'den kaldır
      setFeatures((prev) => prev.filter((item) => item.id !== itemToDelete.id));

      console.log("Feature deleted successfully");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete feature. Please try again.");
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [itemToDelete.id]: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/features");
      console.log("Features API Response:", response.data);
      setFeatures(response.data || []);
      setError("");
    } catch (err) {
      console.error("Features API Error:", err);
      setError("Failed to fetch features");
      setFeatures([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const columns = [
    { Header: "feature", accessor: "feature", width: "45%", align: "left" },
    { Header: "title", accessor: "title", align: "left" },
    { Header: "description", accessor: "description", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = features.map((feature) => ({
    feature: (
      <Feature
        title={feature.title}
        description={feature.description}
        imageUrl={feature.imageUrl}
      />
    ),
    title: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {feature.title || "No Title"}
      </MDTypography>
    ),
    description: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {feature.description || "No Description"}
      </MDTypography>
    ),
    action: (
      <MDBox display="flex" justifyContent="center">
        <MDButton
          variant="text"
          color="info"
          onClick={() => handleEditClick(feature)}
          startIcon={<EditIcon />}
        >
          Edit
        </MDButton>
        <MDButton
          variant="text"
          color="error"
          size="small"
          onClick={() => handleDeleteClick(feature)}
          disabled={deleteLoading[feature.id]} // ✅ Loading state
          startIcon={<DeleteIcon />}
        >
          {deleteLoading[feature.id] ? "Deleting..." : "Delete"}
        </MDButton>
      </MDBox>
    ),
  }));

  const deleteDialog = (
    <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete {itemToDelete?.title}? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <MDButton onClick={handleDeleteCancel} color="secondary">
          Cancel
        </MDButton>
        <MDButton
          onClick={handleDeleteConfirm}
          color="error"
          disabled={deleteLoading[itemToDelete?.id]}
        >
          {deleteLoading[itemToDelete?.id] ? "Deleting..." : "Delete"}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
  const editModal = (
    <EditFeatureModal
      open={editModalOpen}
      onClose={handleModalClose}
      featureData={selectedFeature}
      onFeatureUpdated={handleFeatureUpdated}
    />
  );

  const addModal = (
    <AddFeatureModal
      open={addModalOpen}
      onClose={handleAddModalClose}
      onFeatureAdded={fetchFeatures}
    />
  );

  return { columns, rows, loading, error, editModal, addModal, deleteDialog, handleAddClick };
}
