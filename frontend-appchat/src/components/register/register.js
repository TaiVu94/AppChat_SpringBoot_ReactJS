import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput
}
    from 'mdb-react-ui-kit';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    const signup = () => {
        if (password === rePassword) {
            register();
        } else {
            alert("Nhập lại mật khẩu không khớp!!");
        }
    }

    const register = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "email": username,
            "password": password
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:8081/register", requestOptions)
            .then(response => {
                if (response.status === 200) {
                    console.log("Sign Up succesfull");
                    alert("Đăng ký thành công. Đăng nhập để chat");
                    <Link to="/"></Link>
                }
                if(response.status === 400){
                    alert("Username đã tồn tại");
                }
            })
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }
    return (
        <MDBContainer fluid>
            <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                <MDBCol col='12'>
                    <MDBCard className='bg-dark text-white my-5 mx-auto'
                        style={{ borderRadius: '1rem', maxWidth: '400px' }}>
                        <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>

                            <h2 className="fw-bold mb-2 text-uppercase">SignUp</h2>
                            <p className="text-white-50 mb-5">Please enter your name and password!</p>

                            <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white'
                                label='Enter your name'
                                id='user-name'
                                size="lg"
                                name="username"
                                onChange={(e) => setUsername(e.target.value)}
                                margin="normal" />
                            <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white'
                                label='Enter your password'
                                name='password'
                                onChange={(e) => setPassword(e.target.value)}
                                id='formControlLg' type='password' size="lg" />
                            <MDBInput wrapperClass='mb-4 mx-5 w-100' labelClass='text-white'
                                label='Re-enter the password'
                                name='rePassword'
                                onChange={(e) => setRePassword(e.target.value)}
                                id='formControlLg' type='password' size="lg" />

                            <p className="small mb-3 pb-lg-2"><a className="text-white-50" href="#!">Forgot
                                password?</a></p>
                            <button className='mx-2 px-5 btn btn btn-success' onClick={signup}>Đăng Ký</button>
                            <br />
                            <div>
                                <p className="mb-0">Do you already have an account? <Link to="/">Sign In</Link></p>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    )
}