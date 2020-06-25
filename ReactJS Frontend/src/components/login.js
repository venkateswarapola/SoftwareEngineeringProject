import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class AdminLogin extends React.Component {
    constructor(props){
      super(props)
      this.state={
        email:'',
        password:''
      }
    }

    handleEmail(text){
      this.setState({email: text.target.value});
      console.log(this.state.email);
    }
    handlePassword(text){
      this.setState({password: text.target.value});
      console.log(this.state.password)
    }
    login(){
      let obj={}
      obj.email = this.state.email;
      obj.password = this.state.password;
      console.log(JSON.stringify(obj))
      fetch('https://seproject123.herokuapp.com/admin/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' 
          },
          body:JSON.stringify(obj)
        }
        ).then(response => response.json())
        .then(res=>{
          console.log(res.ok);
        })
    }

    render(){
      return(
        <div
        style={{
          display: "flex",
          marginTop: 100,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column"
        }} >
          <div><h1>Admin Login</h1></div>
          <input style={{margin:20,borderRadius:10}} type="email" placeholder="Enter Email" onChange={(text) => {this.handleEmail(text)}}/>
          <br/>
          <input style={{margin:20,borderRadius:10 }} type="text" placeholder="Enter Password" onChange={(text) => {this.handlePassword(text)}}/>
          <br/>
          <button style={{backgroundColor:'#0099ff',borderRadius:10}} onClick={()=>this.login()}>Login</button>
        </div>
      )
    }
}

export default AdminLogin;