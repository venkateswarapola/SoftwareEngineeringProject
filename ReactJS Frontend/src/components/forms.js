import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class UserRegister extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            noquestions: '',
            columns: '',
            adminId: '',
            questionName: ''
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
        fetch('https://seproject123.herokuapp.com/user/register',
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
                 <div><h1>Response</h1></div>
                <table
                style={{
                    borderCollapse:'collapse',
                    width:1000
                }}
                >
                    <tr style={{backgroundColor:'#dddddd'}}>
                        <th>Age</th>
                        <th>Favorite Color</th>
                        <th>Gender</th>
                    </tr>
                    <tr>
                        <td>20</td>
                        <td>blue</td>
                        <td>Male</td>
                    </tr>
                    <tr>
                        <td>19</td>
                        <td>red</td>
                        <td>Female</td>
                    </tr>
                    <tr>
                        <td>32</td>
                        <td>green</td>
                        <td>Male</td>
                    </tr>
                    <tr>
                        <td>20</td>
                        <td>red</td>
                        <td>Male</td>
                    </tr>
                    <tr>
                        <td>20</td>
                        <td>green</td>
                        <td>Male</td>
                    </tr>
                </table>
            </div>
        )
    }
}

export default UserRegister;