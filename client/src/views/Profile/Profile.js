import React, { Component } from 'react'
import {Button, Card, CardBody, CardHeader, Table, Fade, Row, Col,} from 'reactstrap';

export class Profile extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <h1 className="h3 mb-3 text-gray-800">User Profile</h1>
        <Row>
          <Col>
          <Card className="card-accent-info shadow-sm">
            {/*5 Most recent Addition display */}
              <CardHeader>
                Event List
              </CardHeader>
              <CardBody className=' pb-2 mb-4'>
                {/* Main Table for display */}
                <Fade timeout={200} in={true}>
                  <Table hover responsive id="dataTable" className="table-outline mb-0 d-none d-sm-table">                  
                    <thead className="thead-light">
                    <tr>
                      <th className="text-center"><i className="icon-calendar"></i> Date</th>
                      <th className="text-center">Event Name</th>
                      <th className="text-center">Group/Individual</th>
                      <th className="text-center mr-2">Notes</th>
                      <th> </th>
                    </tr>
                    </thead>
                    <tbody>
                      <tr className='text-center'>
                        <td>
                          Jun 03, 2018
                        </td>
                        <td>
                          <strong>Society Outing</strong>
                        </td>
                        <td>
                          Group: <strong>Math Friends</strong>s
                        </td>
                        <td>
                          random notes here
                        </td>
                        <td>
                        <Button color='ghost-dark'  className='mr-1'><i className="fa fa-trash"></i> </Button>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Fade>             
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Profile
