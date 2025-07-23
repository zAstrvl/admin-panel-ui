import { useState, useEffect } from "react";
import Axios from "axios";
import PropTypes from "prop-types";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import EditAboutUsModal from "components/EditAboutUsModal";
import AddAboutUsModal from "components/AddAboutUsModal";

export default function AboutUsTableData() {
  const [aboutUsData, setAboutUsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAboutUs, setSelectedAboutUs] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

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
    setSelectedAboutUs(aboutUs);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    console.log("Modal closing");
    setEditModalOpen(false);
    setSelectedAboutUs(null);
  };

  const handleAboutUsUpdated = () => {
    console.log("About Us updated, refreshing table");
    setAboutUsData((prev) =>
      prev.map((item) => (item.id === updatedAboutUs.id ? updatedAboutUs : item))
    );
    setEditModalOpen(false);
    setSelectedAboutUs(null);
    fetchAboutUs();
  };

  const handleAddClick = () => {
    console.log("Add About Us button clicked");
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
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
        <MDButton variant="text" color="info" onClick={() => handleEditClick(aboutUs)}>
          Edit
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
    handleAddClick,
  };
}
