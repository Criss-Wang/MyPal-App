import React, { Component } from 'react';
import { Col,Row, Fade,} from 'reactstrap';
import InfoCard from './Pagecomponent/InfoCard'
import RecentAdd from './Pagecomponent/RecentAdd'
import RecentEvent from './Pagecomponent/RecentEvent'
import RecentSummary from './Pagecomponent/RecentSummary'

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.loading = this.loading.bind(this);
    this.state = {
      fadeIn: true,
      timeout: 200,
      selfInfoId:'',
      selfInfo:[],
    };
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    return (
      <div className="animated fadeIn">
        <h1 className="h3 mb-3 text-gray-800">Dashboard</h1>
         <Row>
          <Col xs="12" sm="6" md="4">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              {/*Self Info card display */}
              <InfoCard updateInfo = {this.props.updateInfo}
                        contactUpdated = {this.props.contactUpdated}
                        updateSelfInfo = {this.props.updateSelfInfo}
                        changestate = {this.changestate}/>
            </Fade>
          </Col>

          <Col xs="12" sm="6" md="4"> 
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <RecentEvent eventUpdated = {this.props.eventUpdated}
                          updateEventInfo = {this.props.updateEventInfo}/>
            </Fade>
          </Col>
          <Col xs="12" sm="6" md="4">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <RecentSummary/>
            </Fade>
          </Col>
        </Row>

        <Row>
          <Col>
            <RecentAdd  updateEventInfo = {this.props.updateEventInfo}
                        updateInfo = {this.props.updateInfo}
                        contactUpdated = {this.props.contactUpdated}/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
