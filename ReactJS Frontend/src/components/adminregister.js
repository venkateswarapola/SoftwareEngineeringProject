import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class AdminRegister extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            password: ''
        }
    }

    handleName(text) {
        this.setState({ name: text.target.value });
    }

    handleEmail(text) {
        this.setState({ email: text.target.value });
    }
    handlePassword(text) {
        this.setState({ password: text.target.value });
    }
    register() {
        let obj = {}
        obj.name = this.state.name;
        obj.email = this.state.email;
        obj.password = this.state.password;
        console.log(JSON.stringify(obj))
        fetch('https://seproject123.herokuapp.com/admin/register',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            }
        ).then(response => response.json())
            .then(res => {
                alert(res.message);
            })
    }

    render() {
        return (
            <div
            style={{
                display: "flex",
                marginTop: 100,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
            }}
            >
                <div><h1>Admin Registration</h1></div>
                <input style={{margin:20,borderRadius:10}} type="name" placeholder="Enter Name" onChange={(text) => { this.handleName(text) }} />
                <br />
                <input style={{margin:20,borderRadius:10}} type="email" placeholder="Enter Email" onChange={(text) => { this.handleEmail(text) }} />
                <br />
                <input style={{margin:20,borderRadius:10}} type="password" placeholder="Enter Password" onChange={(text) => { this.handlePassword(text) }} />
                <br />
                <button onClick={() => this.register()}>Register</button>
            </div>
        )
    }
}

export default AdminRegister;