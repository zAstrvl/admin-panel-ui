/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import HeroesTableData from "layouts/tables/data/heroesTableData";

import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

function Tables() {
  const {
    columns: hColumns,
    rows: hRows,
    loading: heroesLoading,
    error: heroesError,
    editModal: heroEditModal,
    addModal: heroAddModal,
    handleAddClick: handleAddHero,
  } = HeroesTableData();

  const [loading, setLoading] = useState({
    addingUser: false,
    addingHero: false,
    addingTestimonial: false,
    addingFeature: false,
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Heroes Table
                </MDTypography>
                <MDButton
                  variant="contained"
                  color="white"
                  size="small"
                  onClick={handleAddHero}
                  startIcon={<AddIcon />}
                >
                  Add Hero
                </MDButton>
              </MDBox>
              <MDBox pt={3}>
                {heroesLoading ? (
                  <MDBox display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                  </MDBox>
                ) : heroesError ? (
                  <MDBox p={3}>
                    <MDTypography variant="body2" color="error">
                      {heroesError}
                    </MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    table={{ columns: hColumns, rows: hRows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
                <MDBox p={3} display="flex" justifyContent="center"></MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      {heroEditModal}
      {heroAddModal}
    </DashboardLayout>
  );
}

export default Tables;
