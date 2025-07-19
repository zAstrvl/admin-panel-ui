import { useState, useEffect } from "react";
import Axios from "axios";
import PropTypes from "prop-types";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

export default function data() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  };

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const response = await Axios.get("https://localhost:7294/api/hero");
        setHeroes(response.data);
      } catch (err) {
        setError("Failed to fetch heroes");
      } finally {
        setLoading(false);
      }
    };

    fetchHeroes();
  }, []);

  const columns = [
    { Header: "hero", accessor: "hero", width: "30%", align: "left" },
    { Header: "title", accessor: "title", align: "left" },
    { Header: "description", accessor: "description", align: "center" },
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
  }));
  return { columns, rows, loading, error };
}
