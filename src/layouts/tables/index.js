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

function Tables() {
  const {
    columns: uColumns,
    rows: uRows,
    loading: usersLoading,
    error: usersError,
    editModal: usersEditModal,
  } = UsersTableData();

  const {
    columns: hColumns,
    rows: hRows,
    loading: heroesLoading,
    error: heroesError,
    editModal: heroEditModal,
  } = HeroesTableData();

  const {
    columns: tColumns,
    rows: tRows,
    loading: testimonialsLoading,
    error: testimonialsError,
    editModal: testimonialsEditModal,
  } = TestimonialsTableData();

  const {
    columns: fColumns,
    rows: fRows,
    loading: featuresLoading,
    error: featuresError,
    editModal: featuresEditModal,
  } = FeaturesTableData();

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
                  Users Table
                </MDTypography>
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
      {featuresEditModal}
      {heroEditModal}
      {testimonialsEditModal}
    </DashboardLayout>
  );
}

export default Tables;
