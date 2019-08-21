import React, { Component } from 'react';
import {
    Badge,Card,CardBody, CardHeader, Spinner} from 'reactstrap';
import Fill from './InfoSheet2';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

const newInfo = {
    firstName: 'Your',
    lastName: 'Name',
    nickname:'',
    sex: 'Female',
    birthday: '',
    Department: '',
    Major: '',
    YOS: '',
    Phone: '',
    Email: '',
    Residence: '',
    Recent_Event: '',
    Event_Date:'',
    img:'',
    note:'',
    SocialAccount:[{Channel:'', Account:''},],
    Tags:[],
  }

export class InfoCard extends Component {
    constructor(props) {
        super(props);
        this.showTags = this.showTags.bind(this);
        this.checkdown = this.checkdown.bind(this);
        this.state = {
          fadeIn: true,
          contactUpdated: false,
          timeout: 200,
          selfInfo:newInfo,
          selfInfoId:'',
          flag: false,
          check: false
        };
      }
    // Initialize data
    componentWillMount () {
        const token = localStorage.usertoken
        const decoded = jwt_decode(token)
        const infoId = localStorage.selfInfoId
        if (decoded.infoId !== ''){ 
            this.setState({
              selfInfoId: decoded.infoId
            })
            axios.get(`personals/getPersonal/${decoded.infoId}`)
                .then(res => {
                  this.setState({
                    selfInfo:res.data,
                    flag: true,
                    check: true
                })
            })
          }
        else 
        { 
          if (infoId !== ''){
            axios.get(`personals/getPersonal/${infoId}`)
                .then(res => {
                  this.setState({
                    selfInfo:res.data,
                    flag: true,
                    check: true
                })
              })
          } else {
            axios.post(`personals/new`, newInfo)
            .then(res => {
              const newInfoId = {infoId:res.data._id};
              localStorage.setItem('selfInfoId', res.data._id)
              this.setState({
                selfInfoId:res.data._id,
                selfInfo:res.data,
                flag: true,
                check: true
              });
              axios.put(`users/update/${decoded._id}`,newInfoId)
                .then(
                  console.log("infoId Updated")
                )
            })
            
        }}
    }

    // Info Addition updated
    componentDidUpdate(){
        const infoId = localStorage.selfInfoId
        if(this.state.contactUpdated !== this.props.contactUpdated){
            axios.get(`personals/getPersonal/${infoId}`)
                .then(res => {
                    this.setState({
                        selfInfo:res.data
                    })
                });
            this.props.updateInfo(false);
        }
    }

    //Display tags on info card
    showTags(){
        let {Tags} = this.state.selfInfo;
        if (Tags.length !== 0){
          console.log(Tags)
            return Tags.map((tag, index) =>{
                return (
                    <Badge key={index} className="user-tag" color="primary">{tag}</Badge>
        )
        })} else { return <div className="animated fadeIn text-center">Tag For Yourself Here</div>} 
    }
    checkdown(){
      this.setState({
        check: false
      })
    }
    loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
    
    render() {
        const infoId = localStorage.selfInfoId
        let { firstName, lastName, nickname, Department, YOS, Major, Tags, sex,
            Recent_Event, Event_Date, Phone, Email, img, Residence, birthday, note}  = this.state.selfInfo;
          return (
                  <Card className='dash-card card-accent-info shadow-sm'>
                    <CardHeader>
                      <span>Your Info Card</span>
                      <div className="card-header-actions">
                        <Fill   id = {infoId}
                                firstName={firstName}
                                lastName={lastName}
                                nickName={nickname}
                                sex={sex}
                                birthday={birthday}
                                Department={Department}
                                Major={Major}
                                YOS={YOS}
                                Tags={Tags}
                                Phone={Phone}
                                Email={Email}
                                Residence={Residence}
                                Social_Contact_type= {"Facebook"}//SocialAccount[0].Channel}
                                Social_Contact_account={"Twitter"}//SocialAccount[0].Account}
                                BM_date={Event_Date}
                                BM_name={Recent_Event}
                                note={note}
                                img={img}
                                updateInfo = {this.props.updateInfo}
                                updateSelfInfo = {this.props.updateSelfInfo}
                                check = {this.state.check}
                                checkdown = {this.checkdown}
                               /> 
                      </div>
                    </CardHeader> 
                    <CardBody className='text-center'>
                    {(this.state.flag)?
                      <div>
                        <img src={(img!== '')?img:'../../assets/img/defaultUser.png'}  className="rounded-circle pb-2" id='user-icon' alt="admin@bootstrapmaster.com" />
                        <h4 className='pb-0 mb-0'>
                            <strong className='Username'>{(nickname === '')?`${firstName} ${lastName}`:`${firstName} ${lastName}, ${nickname}`} </strong>
                            {(sex === "Male")?<i className='fa fa-mars male'></i>:<i className='fa fa-venus female'></i>}
                        </h4>
                        <p className='pt-0 mt-0 pb-0 mb-0'>{Major}</p>
                        <p className='pt-0 mt-0 pb-0 mb-0'>{YOS} </p>
                        <hr/>
                        <div className="text-center">
                          {this.showTags()}
                        </div>
                      </div>
                      :
                      <div className='text-center'>
                        <Spinner style={{width: '1.2rem',height: '1.2rem'}} color = "primary"/>
                      </div>}
                    </CardBody>
                  </Card>
        )
      }
}    

export default InfoCard
