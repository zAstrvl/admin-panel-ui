import { useState, useEffect } from "react";
import Axios from "axios";
import PropTypes from "prop-types";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import EditTestimonialModal from "components/EditTestimonialModal";
import AddTestimonialModal from "components/AddTestimonialModal";

export default function TestimonialsTableData() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const Testimonial = ({ title, description, imageUrl }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={imageUrl} name={title} size="sm" variant="rounded" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {title}
        </MDTypography>
        <MDTypography variant="caption">{description}</MDTypography>
      </MDBox>
    </MDBox>
  );

  Testimonial.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
  };

  const handleEditClick = (testimonial) => {
    console.log("Edit clicked for testimonial:", testimonial);
    setSelectedTestimonial(testimonial);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    console.log("Modal closing");
    setEditModalOpen(false);
    setSelectedTestimonial(null);
  };

  const handleTestimonialUpdated = () => {
    console.log("Testimonial updated, refreshing table");
    fetchTestimonials(); // Refresh the list after update
  };

  const handleAddClick = () => {
    console.log("Add Testimonial button clicked");
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/testimonials");
      console.log("Testimonials API Response:", response.data);
      setTestimonials(response.data || []);
    } catch (err) {
      console.error("Testimonials API Error:", err);
      setError("Failed to fetch testimonials");
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  }; // Empty dependency array to run only once on mount
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const columns = [
    { Header: "testimonial", accessor: "testimonial", width: "30%", align: "left" },
    { Header: "title", accessor: "title", align: "left" },
    { Header: "description", accessor: "description", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = testimonials.map((testimonial) => ({
    testimonial: (
      <Testimonial
        title={testimonial.title}
        description={testimonial.description}
        imageUrl={testimonial.imageUrl}
      />
    ),
    title: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {testimonial.title}
      </MDTypography>
    ),
    description: (
      <MDTypography variant="caption" color="text">
        {testimonial.description}
      </MDTypography>
    ),
    action: (
      <MDBox display="flex" justifyContent="center">
        <MDButton variant="text" color="info" onClick={() => handleEditClick(testimonial)}>
          Edit
        </MDButton>
      </MDBox>
    ),
  }));

  const editModal = (
    <EditTestimonialModal
      open={editModalOpen}
      testimonialData={selectedTestimonial}
      onClose={handleModalClose}
      onTestimonialUpdated={handleTestimonialUpdated}
    />
  );

  const addModal = (
    <AddTestimonialModal
      open={addModalOpen}
      onClose={() => setAddModalOpen(false)}
      onTestimonialAdded={fetchTestimonials} // Refresh the list after adding a new testimonial
    />
  );
  return { columns, rows, loading, error, editModal, addModal, handleAddClick };
}
