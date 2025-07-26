import { useState, useEffect } from "react";
import Axios from "axios";
import PropTypes from "prop-types";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import EditHeroModal from "components/EditHeroModal";
import AddHeroModal from "components/AddHeroModal";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";

export default function HeroesTableData() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedHero, setSelectedHero] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const Hero = ({ title, desc, image }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox>
        <MDAvatar src={image} name={title} size="sm" variant="rounded" />
        <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
          {title}
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {desc}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  Hero.propTypes = {
    title: PropTypes.string,
    desc: PropTypes.string,
    image: PropTypes.string,
  };

  const handleEditClick = (hero) => {
    console.log("Edit clicked for hero:", hero);
    setSelectedHero(hero);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    console.log("Modal closing");
    setEditModalOpen(false);
    setSelectedHero(null);
  };

  const handleHeroUpdated = () => {
    console.log("Hero updated, refreshing table");
    fetchHeroes(); // Refresh the list after update
    setEditModalOpen(false);
    setSelectedHero(null);
  };

  const handleHeroAdded = () => {
    console.log("Hero added, refreshing table");
    fetchHeroes();
    setAddModalOpen(false);
  };

  const handleAddClick = () => {
    console.log("Add Hero button clicked");
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleDeleteClick = async (hero) => {
    setItemToDelete(hero);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading((prev) => ({ ...prev, [itemToDelete.id]: true }));

      console.log("Deleting hero:", itemToDelete);
      await Axios.delete(`/hero/${itemToDelete.id}`);

      // ✅ Local state'den kaldır
      setHeroes((prev) => prev.filter((item) => item.id !== itemToDelete.id));

      console.log("Hero deleted successfully");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete hero. Please try again.");
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [itemToDelete.id]: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/hero");
      console.log("Heroes API Response:", response.data);
      setHeroes(response.data || []);
    } catch (err) {
      setError("Failed to fetch heroes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
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
    { Header: "hero", accessor: "hero", width: "30%", align: "left" },
    { Header: "title", accessor: "title", align: "left" },
    { Header: "description", accessor: "description", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = heroes.map((hero) => ({
    hero: <Hero title={hero.title} desc={hero.description} image={hero.imageUrl} />,
    title: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {hero.title}
      </MDTypography>
    ),
    description: (
      <MDTypography variant="caption" color="text">
        {hero.description}
      </MDTypography>
    ),
    action: (
      <MDBox display="flex" justifyContent="center">
        <MDButton
          variant="text"
          color="info"
          onClick={() => handleEditClick(hero)}
          startIcon={<EditIcon />}
        >
          Edit
        </MDButton>
        <MDButton
          variant="text"
          color="error"
          size="small"
          onClick={() => handleDeleteClick(hero)}
          disabled={deleteLoading[hero.id]} // ✅ Loading state
          startIcon={<DeleteIcon />}
        >
          {deleteLoading[hero.id] ? "Deleting..." : "Delete"}
        </MDButton>
      </MDBox>
    ),
  }));

  const editModal = (
    <EditHeroModal
      open={editModalOpen}
      heroData={selectedHero}
      onClose={handleModalClose}
      onHeroUpdated={handleHeroUpdated}
    />
  );
  const addModal = (
    <AddHeroModal open={addModalOpen} onClose={handleAddModalClose} onHeroAdded={handleHeroAdded} />
  );
  return { columns, rows, loading, error, editModal, addModal, deleteDialog, handleAddClick };
}
