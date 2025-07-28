import { useState, useEffect } from "react";
import Axios from "axios";
import PropTypes from "prop-types";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import EditAboutUsModal from "components/EditAboutUsModal";
import AddAboutUsModal from "components/AddAboutUsModal";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";

export default function AboutUsTableData() {
  const [aboutUsData, setAboutUsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAboutUs, setSelectedAboutUs] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const AboutUs = ({ title, description }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
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

  AboutUs.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
  };

  const handleEditClick = (aboutUs) => {
    console.log("Edit clicked for about us:", aboutUs);
    console.log("About Us ID:", aboutUs.id);

    setSelectedAboutUs(aboutUs);
    setEditModalOpen(true);
  };
  const handleDeleteClick = async (aboutUs) => {
    setItemToDelete(aboutUs);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading((prev) => ({ ...prev, [itemToDelete.id]: true }));

      console.log("Deleting about us:", itemToDelete);
      await Axios.delete(`/aboutus/${itemToDelete.id}`);

      // ✅ Local state'den kaldır
      setAboutUsData((prev) => prev.filter((item) => item.id !== itemToDelete.id));

      console.log("About Us deleted successfully");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete About Us item. Please try again.");
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [itemToDelete.id]: false }));
    }
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setSelectedAboutUs(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleAboutUsUpdated = (updatedAboutUs) => {
    console.log("About Us updated:", updatedAboutUs);
    setAboutUsData((prev) =>
      prev.map((item) => (item.id === updatedAboutUs.id ? updatedAboutUs : item))
    );
    setEditModalOpen(false);
    setSelectedAboutUs(null);
  };

  const handleAddClick = () => {
    console.log("Add About Us button clicked");
    setAddModalOpen(true);
  };

  const handleAddModalClose = (newAboutUs) => {
    console.log("About Us added:", newAboutUs);
    setAboutUsData((prev) => [...prev, newAboutUs]);
    setAddModalOpen(false);
  };

  const fetchAboutUs = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/aboutus");
      console.log("Fetched About Us data:", response.data);
      setAboutUsData(response.data || []);
      setError("");
    } catch (err) {
      console.error("About Us API error: ", err);
      setError("Failed to fetch About Us data");
      setAboutUsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutUs();
  }, []);

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
  const columns = [
    { Header: "title", accessor: "title", width: "45%", align: "left" },
    { Header: "description", accessor: "description", width: "45%", align: "left" },
    { Header: "action", accessor: "action", width: "10%", align: "center" },
  ];

  const rows = aboutUsData.map((aboutUs) => ({
    title: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {aboutUs.title || "No Title"}
      </MDTypography>
    ),
    description: (
      <MDTypography variant="caption" color="text">
        {aboutUs.description || "No Description"}
      </MDTypography>
    ),
    action: (
      <MDBox display="flex" justifyContent="center">
        <MDButton
          variant="text"
          color="info"
          onClick={() => handleEditClick(aboutUs)}
          startIcon={<EditIcon />}
        >
          Edit
        </MDButton>
        <MDButton
          variant="text"
          color="error"
          size="small"
          onClick={() => handleDeleteClick(aboutUs)}
          disabled={deleteLoading[aboutUs.id]} // ✅ Loading state
          startIcon={<DeleteIcon />}
        >
          {deleteLoading[aboutUs.id] ? "Deleting..." : "Delete"}
        </MDButton>
      </MDBox>
    ),
  }));

  const editModal = (
    <EditAboutUsModal
      open={editModalOpen}
      onClose={handleModalClose}
      aboutUsData={selectedAboutUs}
      onAboutUsUpdated={handleAboutUsUpdated}
    />
  );

  const addModal = (
    <AddAboutUsModal
      open={addModalOpen}
      onClose={handleAddModalClose}
      onAboutUsAdded={fetchAboutUs} // Refresh the list after adding
    />
  );

  return {
    columns,
    rows,
    loading,
    error,
    editModal,
    addModal,
    deleteDialog,
    handleAddClick,
  };
}
