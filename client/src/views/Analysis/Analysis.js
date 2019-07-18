import React, { Component } from 'react'
import { Col, Row, Card, CardHeader, CardBody, Progress, Button, Fade, CardTitle} from 'reactstrap';
import Widget from './widgets';
import { Bar, Doughnut, Line, Pie, Polar, Radar } from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { CircularProgressbar, buildStyles  } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const options = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function(tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor }
        }
      }
    },
    maintainAspectRatio: false,
    legend: {
      display: true,
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            drawOnChartArea: false,
          },
        }],
      yAxes: [
        {
          ticks: {
            beginAtZero: false,
            maxTicksLimit: 5,
            stepSize: Math.ceil(100 / 5),
            max: 100,
          },
        }],
  }
}
const line = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Contacts Increase',
      fill: true,
      lineTension: 0,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'round',
      borderDashOffset: 0.0,
      borderJoinStyle: 'round',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 3,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: '#f0f3f5',
      pointHoverBorderWidth: 2,
      pointRadius: 4,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40],
    },
    {
      label: 'Group Increase',
      fill: true,
      lineTension: 0,
      backgroundColor: 'rgba(75,192,77,0.4)',
      borderColor: 'rgba(75,192,77,1)',
      borderCapStyle: 'round',
      borderDashOffset: 0.0,
      borderJoinStyle: 'round',
      pointBorderColor: 'rgba(75,192,77,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 3,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,77,1)',
      pointHoverBorderColor: '#f0f3f5',
      pointHoverBorderWidth: 2,
      pointRadius: 4,
      pointHitRadius: 10,
      data: [44, 99, 60, 88, 92, 48, 73],
    },
  ],
};

const doughnut = {
  labels: [
    'Senior',
    'Junior',
    'Fellow',
    'Staff',
    'Others'
  ],
  datasets: [
    {
      label:"Senior-Junior Distribution",
      data: [18, 6, 4, 7, 11],
      backgroundColor: [
        '#FF6384',
        '#4BC0C0',
        '#FFCE56',
        '#36A2EB',
        '#E7E9ED',
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#4BC0C0',
        '#FFCE56',
        '#36A2EB',
        '#E7E9ED',
      ],
    }], 
};

const doughnut2 = {
  labels: [
    'SOC',
    'FOS',
    'FASS',
    'Engi',
    'Others'
  ],
  datasets: [
    {
      label:"Senior-Junior Distribution",
      data: [18, 6, 4, 7, 11],
      backgroundColor: [
        '#e83e8c',
        '#20c997',
        '#f8cb00',
        '#17a2b8',
        '#E7E9ED',
      ],
      hoverBackgroundColor: [
        '#e83e8c',
        '#20c997',
        '#f8cb00',
        '#17a2b8',
        '#E7E9ED',
      ],
    }], 
};

export class Analysis extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ContactAdded:0,
      EventAdded:0,
      GroupAdded:0,
      TagAdded:0,
    };
  }

  componentWillMount(){
    var countTags = 0;
    var countEvent = 0;
    axios.get('contacts/getcontact')
    .then(res => {
        res.data.forEach(contact => {
          if (contact.Recent_Event !== ''){countEvent += 1}
          if (contact.Tags.length !== 0){countTags += contact.Tags.length}
        });
        this.setState({
          ContactAdded: res.data.length,
          TagAdded:countTags,
          EventAdded:countEvent
        })
    });
    axios.get('groups/getgroup')
    .then(res => {
        res.data.forEach(group => {
          if (group.Events !== []){countEvent += group.Events.length}
        });
        this.setState({
          GroupAdded:res.data.length,
          EventAdded:countEvent
        })
    });
  }
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    return (
      
      <div className="animated fadeIn">
        <Row>
          <Col>
            <h1 className="h3 mb-3 text-gray-800">Analysis</h1>
            <Fade timeout={200} in={true}></Fade>
        <Row>
          <Col xs="12" sm="6" lg="3">
            <Widget header={`${this.state.ContactAdded}`} val="3" mainText="Contacts Added" icon="fa fa-user" color="primary" variant="1" />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Widget header={`${this.state.EventAdded}`} val="-3" mainText="Events Shared" icon="fa fa-gamepad" color="info" variant="1" />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Widget header={`${this.state.GroupAdded}`} val="3" mainText="Groups Created" icon="fa fa-users" color="warning" variant="1" />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Widget header={`${this.state.TagAdded}`} val="3" mainText="Tags Shared" icon="fa fa-tags" color="danger" variant="1" />
          </Col>
        </Row>
        <Row>
          <Col xs='9'>
          <Card>
            <CardBody>
              <Row>
              <Col sm="5">
                <CardTitle className="mb-0"><strong>User Log Summary</strong></CardTitle>
                <div className="small text-muted">Last 6 Months</div>
              </Col>
{/*               <Col sm="7" className="d-none d-sm-inline-block">
                <Button color="primary" className="float-right"><i className="icon-cloud-download"></i></Button>
                <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                  <ButtonGroup className="mr-3" aria-label="First group">
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(1)} active={this.state.radioSelected === 1}>Day</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(2)} active={this.state.radioSelected === 2}>Month</Button>
                    <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(3)} active={this.state.radioSelected === 3}>Year</Button>
                  </ButtonGroup>
                </ButtonToolbar>
              </Col> */}
              </Row>
              <div className="chart-wrapper" style={{ height: 300 + 'px', marginTop: 40 + 'px' }}>
                <Line data={line} options={options}/>
              </div>
            </CardBody>
          </Card>
          </Col>
          <Col xs='3'>
          <Card className='ml-5 mr-5'>
            <CardBody>
              <Row><Col></Col></Row>
              <div className="text-center" style={{ height: 155 + 'px' }}>
                <i className='fa fa-users mr-2'></i> Grouped friends
                <div className='circleData'>
                <CircularProgressbar
                    value={66}
                    text={`${66}%`}
                    strokeWidth = {8}
                    styles={buildStyles({               
                      textSize: '18px',               
                      pathTransitionDuration: 0.5,
                      pathColor:"rgba(75,192,77,1)",
                      textColor:"rgba(75,192,77,1)",
                      trailColor: '#d6d6d6',
                      backgroundColor: '#3e98c7',
                    })}
                  
                />
                </div>
              </div>
              
            </CardBody>
          </Card>
          <Card className='ml-5 mr-5'>
            <CardBody>
              <Row><Col></Col></Row>
              <div className="text-center" style={{ height: 155 + 'px'}}>
                <i className='fa fa-tags mr-2'></i> Tagged friends
                <div className='circleData'>
                <CircularProgressbar
                    value={66}
                    text={`${66}%`}
                    strokeWidth = {8}
                    styles={buildStyles({               
                      textSize: '18px',               
                      pathTransitionDuration: 0.5,
                      pathColor: "rgba(75,192,192,1)",
                      textColor: "rgba(75,192,192,1)",
                      trailColor: '#d6d6d6',
                      backgroundColor: '#3e98c7',
                    })}
                  
                />
                </div>
              </div>
              
            </CardBody>
          </Card>
          </Col>
        </Row>
        <Row>
          <Col>
          <Card>
            <CardHeader>
              Monthly Activities Summary
            </CardHeader>
            <CardBody>
            <Row>
              <Col xs="12">
                <Row>
                  <Col sm="4">
                    <div className="callout callout-primary">
                      <small className="text-muted">Most active group</small>
                      <br />
                      <strong className="h4">Math Society</strong>
                      <div className="chart-wrapper">
                      </div>
                    </div>
                  </Col>

                  <Col sm="4">
                    <div className="callout callout-warning">
                      <small className="text-muted">Most shared tag</small>
                      <br />
                      <strong className="h4">Anime</strong>
                      <div className="chart-wrapper">
                      </div>
                    </div>
                  </Col>

                  <Col sm="4">
                    <div className="callout callout-success">
                      <small className="text-muted">Most active friend</small>
                      <br />
                      <strong className="h4">RichardoM Lu</strong>
                      <div className="chart-wrapper">
                      </div>
                    </div>
                  </Col>

                </Row>
                <hr className="mt-0" />
                <ul className='ml-0 pl-1'>
                  <div className="progress-group">
                    <div className="progress-group-header">
                      <i className="icon-people progress-group-icon"></i>
                      <span className="title">Largest Group: <strong>Math Society</strong></span>
                      <span className="ml-auto font-weight-bold">13 members of 20 contacts </span>
                    </div>
                    <div className="progress-group-bars">
                      <Progress className="progress-xs" color="primary" value="43" />
                    </div>
                  </div>
                  <div className="progress-group">
                    <div className="progress-group-header">
                      <i className="icon-graduation progress-group-icon"></i>
                      <span className="title">Largest Department: <strong>School Of Computing</strong></span>
                      <span className="ml-auto font-weight-bold">13 of 20 contacts </span>
                    </div>
                    <div className="progress-group-bars">
                      <Progress className="progress-xs" color="info" value="37" />
                    </div>
                  </div>
                  <div className="progress-group">
                    <div className="progress-group-header">
                      <i className="icon-paper-clip progress-group-icon"></i>
                      <span className="title">Largest Major: <strong>Applied Mathematics</strong></span>
                      <span className="ml-auto font-weight-bold">10 of 20 contacts </span>
                    </div>
                    <div className="progress-group-bars">
                      <Progress className="progress-xs" color="info" value="37" />
                    </div>
                  </div>
                  <div className="progress-group mb-5">
                    <div className="progress-group-header">
                      <i className="icon-globe progress-group-icon"></i>
                      <span className="title">Largest Event: <strong>Alumni Outing to Shanghai</strong></span>
                      <span className="ml-auto font-weight-bold">32 <span className="text-muted small">(56% friends involved)</span></span>
                    </div>
                    <div className="progress-group-bars">
                      <Progress className="progress-xs" color="success" value="56" />
                    </div>
                  </div>
                  </ul>
                  <Row className='mb-4'>
                    <Col xs='12' sm='5' lg='5'>
                      <div className="chart-wrapper">
                        <Doughnut data={doughnut} 
                                  options={{
                                    title:{
                                      display:true,
                                      text:'Senior - Junior Distribution',
                                      fontSize:15,
                                    },
                                    legend:{
                                      display:true,
                                      position:'bottom'
                                    }
                                  }}/>
                      </div>
                    </Col>
                    <Col xs='0' sm='2' lg='2'>
                    <div className="outer">
                      <div className="inner"></div>
                    </div>
                    </Col>
                    <Col xs='12' sm='5' lg='5'>
                      <div className="chart-wrapper">
                        <Doughnut data={doughnut2} 
                                  options={{
                                    title:{
                                      display:true,
                                      text:'Department Distribution',
                                      fontSize:15,
                                    },
                                    legend:{
                                      display:true,
                                      position:'bottom'
                                    }
                                  }}/>
                      </div>
                    </Col>
                  </Row>
                  
                  <ul className='ml-0 pl-1'>
                  

                  </ul>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
    </Col>
    </Row>
    </div>
    )
  }}

export default Analysis
