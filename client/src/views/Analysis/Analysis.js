import React, { Component } from 'react'
import { Col, Row, Card, CardHeader, CardBody, Progress, Fade, CardTitle} from 'reactstrap';
import Widget from './widgets';
import { Doughnut, Line} from 'react-chartjs-2';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { CircularProgressbar, buildStyles  } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';

var d = new Date();
var m = d.getMonth();
var monthToInt = {'Jan':0, 'Feb':1, 'Mar':2,'Apr':3, 'May':4, 'Jun':5, 'Jul':6, 'Aug':7, 'Sep':8, 'Oct':9, 'Nov':10, 'Dec':11}
var month = ['Jan', 'Feb', 'Mar','Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
var colorset = [
  '#f86c6b',
  '#ffc107',
  '#63c2de',
  '#20a8d8',
  '#E7E9ED',
];

var best = Obj => {
  var output = ['', 0]
  Object.entries(Obj).forEach(entry => {
    if (entry[0] !== 'Others'){
    if (entry[1] >= output[1]){
      output = entry
    }}
  })
  return output
};

var best5 = Obj => {
  var output = Object.entries(Obj)
  output.sort(function(a, b){
    return b[1] - a[1]
  })
  if (output.length >= 5) {
    var temp = [["Others",0],];
    output.slice(4, output.length).forEach(ele => {
      temp[0][1] += ele[1]
    })
    output = output.slice(0,4).concat(temp)
  }
  return output
}

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
            stepSize: Math.ceil(20 / 5),
            max: 20,
          },
        }],
  }
}

export class Analysis extends Component {

  constructor(props) {
    super(props);
    this.state = {
      line : {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Contacts Number',
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
            data: [ , , , , , ],
          },
          {
            label: 'Group Number',
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
            data: [ , , , , , ],
          },
        ],
      },
      doughnut : {
        labels: ['Major1','Major2','Major3','Major4','Major5'],
        datasets: [
          {
            label:"Major Distribution",
            data: [1,1,1,1,1],
            backgroundColor: [...colorset],
            hoverBackgroundColor: [...colorset],
          }], 
      },
      doughnut2 : {
        labels: ['Dept1','Dept2','Dept3','Dept4','Dept5'],
        datasets: [
          {
            label:"Department Distribution",
            data: [1,1,1,1,1],
            backgroundColor: [...colorset],
            hoverBackgroundColor: [...colorset],
          }], 
      },
      ContactAdded:0,
      EventAdded:0,
      GroupAdded:0,
      TagAdded:0,
      ContactDiff: 0,
      EventDiff:0,
      GroupDiff:0,
      GroupedContact: 0,
      TaggedContact: 0,
      MostTag:'',
      MostAGroup: '',
      MostAPerson:'',
      LgGroup:['', 0],
      LgMajor:['', 0],
      LgDept:['', 0],
      NwEvent: ['', '', 0],
      
    };
  }

  componentWillMount(){
    var countTags = 0;
    var countEvent = 0;
    var countEventThisMon = 0;
    var haveGroup = 0;
    var haveTag = 0;
    var PersonActive = {};
    var TagCounts = {};
    var GroupACount = {};
    var GroupSize = {};
    var MajorSize = {"Others": 0};
    var DeptSize = {"Others": 0};
    var NewEvent = ['','', 0];
    var Lg5Major = [[],[]];
    var Lg5Dept = [[],[]];
    var monthRange = [];
    var contactLog = {};
    var data1 = [ , , , , , ];

    axios.get('contacts/getcontact')
    .then(res => {
        res.data.forEach(contact => {
          var ContactDate = new Date(contact.date) // For Month Check
          var name = `${contact.firstName} ${contact.lastName}` // For Contact Person name Check
          // Compute Most Active Friend
          if (!(Object.keys(PersonActive).includes(name))){ PersonActive[name] = 0} 
          if (contact.Recent_Event !== ''){
            countEvent += 1
            PersonActive[name] += 10
            PersonActive[name] += contact.Tags.length
            var ContactEventDate = new Date(contact.Event_Date)
            if (ContactEventDate.getMonth() === m){countEventThisMon += 1}
          }
          // Compute Montly Increase
          if (m === ContactDate.getMonth()) {}
          // Compute Montly Number
          var new_m = m + 7;
          var new_m_down = m - 5;
          var contact_m = ContactDate.getMonth()
          if (m <5) {
            if (contact_m <= m || contact_m >= new_m){
              if (!(Object.keys(contactLog).includes(contact_m.toString()))){ contactLog[contact_m] = 0}
              contactLog[contact_m] += 1
            } else {
              if (!(Object.keys(contactLog).includes(new_m.toString()))){ contactLog[new_m] = 0}
              contactLog[new_m] += 1
            }
          } else {
            if (contact_m >= new_m_down || contact_m <= m){
              if (!(Object.keys(contactLog).includes(contact_m.toString()))){ contactLog[contact_m] = 0}
              contactLog[contact_m] += 1
            } else {
              if (!(Object.keys(contactLog).includes(new_m_down.toString()))){ contactLog[new_m_down] = 0}
              contactLog[new_m_down] += 1
            }
          }
          
          // Compute Percentage of People having groups
          if (contact.Group.length !== 0){haveGroup += 1}
          // Compute the Most Applied tag
          if (contact.Tags.length !== 0){
            countTags += contact.Tags.length; 
            haveTag += 1
            contact.Tags.forEach(tag => {
              if (!(Object.keys(TagCounts).includes(tag))){
                TagCounts[tag] = 0
              } 
              TagCounts[tag] += 1
            })
          }
          // Compute the Major pie chart
          if (contact.Major !== ''){
            if (!(Object.keys(MajorSize).includes(contact.Major))){
              MajorSize[contact.Major] = 0
            } 
            MajorSize[contact.Major] += 1
          } else {
            MajorSize["Others"] += 1
          }
          // Compute the Department pie chart
          if (contact.Department !== ''){
            if (!(Object.keys(DeptSize).includes(contact.Department))){
              DeptSize[contact.Department] = 0
            } 
            DeptSize[contact.Department] += 1
          } else {
            DeptSize["Others"] += 1
          }
        });

        if (m < 5){
          monthRange = [...month].slice(0, m + 1).concat([...month].slice(m + 7, 12));
        } else {
          monthRange = [...month].slice(m - 5, m + 1);
        }
        monthRange.forEach(month => {
          data1[monthRange.indexOf(month)] = contactLog[monthToInt[month].toString()]  
        })

        best5(MajorSize).forEach(major => {
          Lg5Major[0].push(major[0]);
          Lg5Major[1].push(major[1])
        })
        best5(DeptSize).forEach(dept => {
          Lg5Dept[0].push(dept[0]);
          Lg5Dept[1].push(dept[1])
        })
        
        this.setState({
          ContactAdded: res.data.length,
          TagAdded:countTags,
          EventAdded:countEvent,
          EventDiff: countEventThisMon,
          GroupedContact:haveGroup,
          TaggedContact: haveTag,
          MostTag: best(TagCounts)[0],
          MostAPerson: best(PersonActive)[0],
          LgMajor:best(MajorSize),
          LgDept:best(DeptSize),
          doughnut : {
            labels: Lg5Major[0],
            datasets: [
              {
                label:"Major Distribution",
                data: Lg5Major[1],
                backgroundColor: [...colorset].slice(0,Lg5Major[0].length),
                hoverBackgroundColor: [...colorset].slice(0,Lg5Major[0].length),
              }], 
          },
          doughnut2 : {
            labels: Lg5Dept[0],
            datasets: [
              {
                label:"Department Distribution",
                data: Lg5Dept[1],
                backgroundColor: [...colorset].slice(0,Lg5Dept[0].length),
                hoverBackgroundColor: [...colorset].slice(0,Lg5Dept[0].length),
              }], 
          },
          ContactDiff: data1[4]? data1[5]-data1[4]:data1[5],
        })
        this.setState(prevState => ({
          line: {
            labels: monthRange,          
            datasets: prevState.line.datasets.map(
              el => el.label === 'Contacts Number'? { ...el, data: data1 }: el
            )
          }
        }))
        contactLog = {};
        data1 = [ , , , , , ];
    });
    axios.get('groups/getgroup')
    .then(res => {
        res.data.forEach(group => {
          // Compute Montly Number
          var GroupDate = new Date(group.date)
          var new_m = m + 7;
          var new_m_down = m - 5;
          var group_m = GroupDate.getMonth()
          if (m <5) {
            if (group_m <= m || group_m >= new_m){
              if (!(Object.keys(contactLog).includes(group_m.toString()))){ contactLog[group_m] = 0}
              contactLog[group_m] += 1
            } else {
              if (!(Object.keys(contactLog).includes(new_m.toString()))){ contactLog[new_m] = 0}
              contactLog[new_m] += 1
            }
          } else {
            if (group_m >= new_m_down || group_m <= m){
              if (!(Object.keys(contactLog).includes(group_m.toString()))){ contactLog[group_m] = 0}
              contactLog[group_m] += 1
            } else {
              if (!(Object.keys(contactLog).includes(new_m_down.toString()))){ contactLog[new_m_down] = 0}
              contactLog[new_m_down] += 1
            }
          }

          // Compute Group Events 
          if (group.Events !== []){
            // Compute Total Events
            countEvent += group.Events.length
            if (!(Object.keys(GroupACount).includes(group.GroupName))){
              GroupACount[group.GroupName] = 0
            }
            GroupACount[group.GroupName] += 1000*group.Events.length
            GroupACount[group.GroupName] += group.name.length

            // Evaluate Most Active Person
            group.name.forEach(name => {
              if (!(Object.keys(PersonActive).includes(name))){
                PersonActive[name] = 0
              }
              PersonActive[name] += group.Events.length * group.name.length
            })
            // Find Latest Event
            group.Events.forEach(event => {
              var CheckEventDate = new Date(event.EventDate)
              if (CheckEventDate.getMonth() === m){ countEventThisMon += 1}
              if (event.EventDate > NewEvent[1]){
                NewEvent = [event.EventName, event.EventDate, group.name.length]
              }
            })
          }
          // Compute Gropu Size for each group
          GroupSize[group.GroupName] = group.name.length
        });

        if (m < 5){
          monthRange = [...month].slice(0, m + 1).concat([...month].slice(m + 7, 12));
        } else {
          monthRange = [...month].slice(m - 5, m + 1);
        }
        monthRange.forEach(month => {
          data1[monthRange.indexOf(month)] = contactLog[monthToInt[month].toString()]  
        })
        this.setState({
          GroupAdded:res.data.length,
          EventAdded:countEvent,
          MostAGroup: best(GroupACount)[0],
          MostAPerson: best(PersonActive)[0],
          LgGroup: best(GroupSize),
          NwEvent: NewEvent,
          GroupDiff: data1[4]? data1[5]-data1[4]:data1[5],
          EventDiff: countEventThisMon,
        })
        this.setState(prevState => ({
          line: {
            labels: monthRange,          
            datasets: prevState.line.datasets.map(
              el => el.label === 'Group Number'? { ...el, data: data1 }: el
            )
          }
        }))
        contactLog = {};
        data1 = [ , , , , , ];
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
            <Widget header={`${this.state.ContactAdded}`} val={`${this.state.ContactDiff}`} mainText="Contacts Added" icon="fa fa-user" color="primary" variant="1" />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Widget header={`${this.state.EventAdded}`} val={`${this.state.EventDiff}`} mainText="Events Shared" icon="fa fa-gamepad" color="info" variant="1" />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Widget header={`${this.state.GroupAdded}`} val={`${this.state.GroupDiff}`} mainText="Groups Created" icon="fa fa-users" color="warning" variant="1" />
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Widget header={`${this.state.TagAdded}`} val="0" mainText="Tags Shared" icon="fa fa-tags" color="danger" variant="1" />
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
                <Line data={this.state.line} options={options}/>
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
                    value={(this.state.ContactAdded!==0)?parseInt(this.state.GroupedContact/this.state.ContactAdded * 100):0}
                    text={`${(this.state.ContactAdded!==0)?parseInt(this.state.GroupedContact/this.state.ContactAdded * 100):0}%`}
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
                    value={(this.state.ContactAdded!==0)?parseInt(this.state.TaggedContact/this.state.ContactAdded * 100):0}
                    text={`${(this.state.ContactAdded!==0)?parseInt(this.state.TaggedContact/this.state.ContactAdded * 100):0}%`}
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
              Monthly Record Summary
            </CardHeader>
            <CardBody>
            <Row>
              <Col xs="12">
                <Row>
                  <Col sm="4">
                    <div className="callout callout-primary">
                      <small className="text-muted">Most active group</small>
                      <br />
                      <strong className="h4">{this.state.MostAGroup}</strong>
                      <div className="chart-wrapper">
                      </div>
                    </div>
                  </Col>

                  <Col sm="4">
                    <div className="callout callout-warning">
                      <small className="text-muted">Most shared tag</small>
                      <br />
                      <strong className="h4">{this.state.MostTag}</strong>
                      <div className="chart-wrapper">
                      </div>
                    </div>
                  </Col>

                  <Col sm="4">
                    <div className="callout callout-success">
                      <small className="text-muted">Most active friend</small>
                      <br />
                      <strong className="h4">{this.state.MostAPerson}</strong>
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
                      <span className="title">Largest Group: <strong>{this.state.LgGroup[0]}</strong></span>
                      <span className="ml-auto font-weight-bold">{`${this.state.LgGroup[1]} members of ${this.state.ContactAdded} contacts`} </span>
                    </div>
                    <div className="progress-group-bars">
                      <Progress className="progress-xs" color="primary" value= {((this.state.ContactAdded!==0)?parseInt(this.state.LgGroup[1]/this.state.ContactAdded * 100):0).toString()} />
                    </div>
                  </div>
                  <div className="progress-group">
                    <div className="progress-group-header">
                      <i className="icon-graduation progress-group-icon"></i>
                      <span className="title">Largest Department: <strong>{this.state.LgDept[0]}</strong></span>
                      <span className="ml-auto font-weight-bold">{`${this.state.LgDept[1]} members of ${this.state.ContactAdded} contacts`} </span>
                    </div>
                    <div className="progress-group-bars">
                      <Progress className="progress-xs" color="info" value={((this.state.ContactAdded!==0)?parseInt(this.state.LgDept[1]/this.state.ContactAdded * 100):0).toString()} />
                    </div>
                  </div>
                  <div className="progress-group">
                    <div className="progress-group-header">
                      <i className="icon-paper-clip progress-group-icon"></i>
                      <span className="title">Largest Major: <strong>{this.state.LgMajor[0]}</strong></span>
                      <span className="ml-auto font-weight-bold">{`${this.state.LgMajor[1]} members of ${this.state.ContactAdded} contacts`} </span>
                    </div>
                    <div className="progress-group-bars">
                      <Progress className="progress-xs" color="info" value={((this.state.ContactAdded!==0)?parseInt(this.state.LgMajor[1]/this.state.ContactAdded * 100):0).toString()} />
                    </div>
                  </div>
                  <div className="progress-group mb-5">
                    <div className="progress-group-header">
                      <i className="icon-globe progress-group-icon"></i>
                      <span className="title">Latest Event: <strong>{this.state.NwEvent[0]}</strong></span>
                      <span className="ml-auto font-weight-bold">{this.state.NwEvent[2]}
                        <span className="text-muted small ml-1">
                          {`(${((this.state.ContactAdded!==0)?parseInt(this.state.NwEvent[2]/this.state.ContactAdded * 100):0)}% friends involved)`}
                        </span>
                      </span>
                    </div>
                    <div className="progress-group-bars">
                      <Progress className="progress-xs" color="success" value={((this.state.ContactAdded!==0)?parseInt(this.state.NwEvent[2]/this.state.ContactAdded * 100):0).toString()} />
                    </div>
                  </div>
                  </ul>
                  <Row className='mb-4'>
                    <Col xs='12' sm='5' lg='5'>
                      <div className="chart-wrapper">
                        <Doughnut data={this.state.doughnut} 
                                  options={{
                                    title:{
                                      display:true,
                                      text:'Major Distribution',
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
                        <Doughnut data={this.state.doughnut2} 
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
