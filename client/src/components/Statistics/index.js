import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardGroup,
  MDBContainer,
  MDBRow,
  MDBCol,
} from "mdbreact";
import ColDetails from "../Pie";
import TableDetails from "../Table";

const StatisticsPage = () => {
  return (
    <div className="statisticspage" id="statisticspage">
      <MDBContainer>
        <MDBRow>
          <MDBCardGroup>
            <MDBCol md="4">
              <MDBCard>
                <MDBCardBody>
                  <MDBCardTitle tag="h5">Pie Chart</MDBCardTitle>
                  <ColDetails />
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol md="8">
              <MDBCard>
                <MDBCardBody data-test="currQueueNum-card">
                  <MDBCardTitle tag="h5" data-test="currQueueNum-cardtitle">
                    Table of collected per hour per day
                  </MDBCardTitle>
                  <TableDetails />
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBCardGroup>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default StatisticsPage;
