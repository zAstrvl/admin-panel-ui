import { useState, useEffect } from "react";
import Axios from "axios";
import PropTypes from "prop-types";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import EditHeroModal from "components/EditHeroModal";

export default function HeroesTableData() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedHero, setSelectedHero] = useState(null);

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
        <MDButton variant="text" color="info" onClick={() => handleEditClick(hero)}>
          Edit
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

  return { columns, rows, loading, error, editModal };
}
