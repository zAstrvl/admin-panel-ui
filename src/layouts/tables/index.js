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
import UsersTableData from "layouts/tables/data/usersTableData";
import HeroesTableData from "layouts/tables/data/heroesTableData";
import TestimonialsTableData from "layouts/tables/data/testimonialsTableData";
import FeaturesTableData from "layouts/tables/data/featuresTableData";

import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

function Tables() {
  const {
    columns: uColumns,
    rows: uRows,
    loading: usersLoading,
    error: usersError,
    editModal: usersEditModal,
    addModal: usersAddModal,
    handleAddClick: handleAddUser,
  } = UsersTableData();

  const {
    columns: hColumns,
    rows: hRows,
    loading: heroesLoading,
    error: heroesError,
    editModal: heroEditModal,
    addModal: heroAddModal,
    handleAddClick: handleAddHero,
  } = HeroesTableData();

  const {
    columns: tColumns,
    rows: tRows,
    loading: testimonialsLoading,
    error: testimonialsError,
    editModal: testimonialsEditModal,
    addModal: testimonialsAddModal,
    handleAddClick: handleAddTestimonial,
  } = TestimonialsTableData();

  const {
    columns: fColumns,
    rows: fRows,
    loading: featuresLoading,
    error: featuresError,
    editModal: featuresEditModal,
    addModal: featuresAddModal,
    handleAddClick: handleAddFeature,
  } = FeaturesTableData();

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
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Users Table
                </MDTypography>
                <MDButton
                  variant="contained"
                  color="white"
                  size="small"
                  onClick={handleAddUser}
                  startIcon={<AddIcon />}
                >
                  Add User
                </MDButton>
              </MDBox>
              <MDBox pt={3}>
                {usersLoading ? (
                  <MDBox display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                  </MDBox>
                ) : usersError ? (
                  <MDBox p={3}>
                    <MDTypography variant="body2" color="error">
                      {usersError}
                    </MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    table={{ columns: uColumns, rows: uRows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
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
                  Testimonials Table
                </MDTypography>
                <MDButton
                  variant="contained"
                  color="white"
                  size="small"
                  onClick={handleAddTestimonial}
                  startIcon={<AddIcon />}
                >
                  Add Testimonial
                </MDButton>
              </MDBox>
              <MDBox pt={3}>
                {testimonialsLoading ? (
                  <MDBox display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                  </MDBox>
                ) : testimonialsError ? (
                  <MDBox p={3}>
                    <MDTypography variant="body2" color="error">
                      {testimonialsError}
                    </MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    table={{ columns: tColumns, rows: tRows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
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
                  Features Table
                </MDTypography>
                <MDButton
                  variant="contained"
                  color="white"
                  size="small"
                  onClick={handleAddFeature}
                  startIcon={<AddIcon />}
                >
                  Add Feature
                </MDButton>
              </MDBox>
              <MDBox pt={3}>
                {featuresLoading ? (
                  <MDBox display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                  </MDBox>
                ) : featuresError ? (
                  <MDBox p={3}>
                    <MDTypography variant="body2" color="error">
                      {featuresError}
                    </MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    table={{ columns: fColumns, rows: fRows }}
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
      {usersEditModal}
      {usersAddModal}
      {featuresEditModal}
      {featuresAddModal}
      {heroEditModal}
      {heroAddModal}
      {testimonialsEditModal}
      {testimonialsAddModal}
    </DashboardLayout>
  );
}

export default Tables;
