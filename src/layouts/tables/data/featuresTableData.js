import { useState, useEffect } from "react";
import Axios from "axios";
import PropTypes from "prop-types";

import MDBox from "components/MDBox";
import MDAvatar from "components/MDAvatar";
import MDTypography from "components/MDTypography";

export default function FeaturesTableData() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const Feature = ({ title, description, imageUrl }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox>
        <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
          {title}
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {description}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
  Feature.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
  };
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const response = await Axios.get("https://localhost:7294/api/features");
        console.log("Features API Response:", response.data); // Debug için image URL'lerini görmek için
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

    fetchFeatures();
  }, []);
  const columns = [
    { Header: "feature", accessor: "feature", width: "30%", align: "left" },
    { Header: "title", accessor: "title", align: "left" },
    { Header: "description", accessor: "description", align: "center" },
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
        {feature.title}
      </MDTypography>
    ),
    description: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {feature.description}
      </MDTypography>
    ),
  }));
  return { columns, rows, loading, error };
}
