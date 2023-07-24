import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from "../components/FormContainer";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import Loader from "../components/Loader";
import { useRegisterMutation, useLogoutMutation } from "../slices/usersApiSlice";
import { setCredentials, logout } from "../slices/authSlice";

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth)

    const [register, { isLoading }] = useRegisterMutation()

    useEffect(() =>{
        if (userInfo && userInfo.regStatus == 'Active') {
            navigate('/')
        } 
    }, [navigate, userInfo])

    const submitHandler = async (e) => {
        e.preventDefault();
        if(password !== confirmPassword) {
            toast.error('Passwords do not match!')
        } else {
            try {
                console.log(`name: ${name}, email: ${email} pw: ${password}`)
                const res = await register({ name, email, password }).unwrap();
                dispatch(setCredentials({ ...res }));
                toast.success('Registration sent. Please verify your e-mail!')
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }

    return (
        <FormContainer>
            <h1>Sign Up</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="my-2" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='name'
                        placeholder='Enter your name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className="my-2" controlId="email">
                    <Form.Label>E-mail Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter your Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter your password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} required></Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Confirm your password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} required></Form.Control>
                </Form.Group>

                {isLoading && <Loader />}

            
            <Button type='submit' variant='primary' className="mt-3">
                Register
            </Button>
            </Form>
            <Row className="py-3">
                <Col>
                    Already registered? <Link to='/login'>Sign In</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default RegisterScreen