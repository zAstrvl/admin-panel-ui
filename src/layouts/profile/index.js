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
import AboutUsTableData from "layouts/tables/data/aboutUsTableData";

import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

function Tables() {
  const {
    columns: aColumns,
    rows: aRows,
    loading: aboutUsLoading,
    error: aboutUsError,
    editModal: aboutUsEditModal,
    addModal: aboutUsAddModal,
    handleAddClick: handleAddAboutUs,
  } = AboutUsTableData();

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
                  About Us Table
                </MDTypography>
                <MDButton
                  variant="contained"
                  color="white"
                  size="small"
                  onClick={handleAddAboutUs}
                  startIcon={<AddIcon />}
                >
                  Add About Us
                </MDButton>
              </MDBox>
              <MDBox pt={3}>
                {aboutUsLoading ? (
                  <MDBox display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                  </MDBox>
                ) : aboutUsError ? (
                  <MDBox p={3}>
                    <MDTypography variant="body2" color="error">
                      {aboutUsError}
                    </MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    table={{ columns: aColumns, rows: aRows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      {aboutUsEditModal}
      {aboutUsAddModal}
    </DashboardLayout>
  );
}

export default Tables;
