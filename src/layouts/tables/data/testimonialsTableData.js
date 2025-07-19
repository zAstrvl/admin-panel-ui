import { useState, useEffect } from "react";
import Axios from "axios";
import PropTypes from "prop-types";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

export default function TestimonialsTableData() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await Axios.get("https://localhost:7294/api/testimonials");
        console.log("Testimonials API Response:", response.data); // Debug için image URL'lerini görmek için
        setTestimonials(response.data || []);
        setError("");
      } catch (err) {
        console.error("Testimonials API Error:", err);
        setError("Failed to fetch testimonials");
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);
  const columns = [
    { Header: "testimonial", accessor: "testimonial", width: "30%", align: "left" },
    { Header: "title", accessor: "title", align: "left" },
    { Header: "description", accessor: "description", align: "center" },
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
  }));
  return { columns, rows, loading, error };
}
