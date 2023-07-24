import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from "../components/FormContainer";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import Loader from "../components/Loader";
import { setCredentials } from "../slices/authSlice";
import { useUpdateUserMutation } from "../slices/usersApiSlice";

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [changePassword, setChangePassword] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth)
    const [updateProfile, {isLoading}] = useUpdateUserMutation()

    useEffect(() =>{

        setName(userInfo.name);
        setEmail(userInfo.email)
        
    }, [userInfo.setName, userInfo.setEmail])

    const submitHandler = async (e) => {
        e.preventDefault();

        if(changePassword && newPassword !== confirmPassword) {
            toast.error('Passwords do not match!')
        } else {
            try {
                const res = await updateProfile({
                    _id: userInfo._id,
                    name,
                    email,
                    password,
                    changePassword,
                    newPassword
                }).unwrap()
                dispatch(setCredentials({ ...res }))
                toast.success('Profile Updated!')
            } catch (err) {

                toast.error(err?.data?.message || err.error)
                
            }
        }
    }

    return (
        <FormContainer>
            <h1>Update your Profile</h1>
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
                        onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Check
                type="switch"
                id="updatePassword"
                label="Update password?"
                onChange={(e) => setChangePassword(e.target.checked)}/>

                { changePassword ? (<>
                    <Form.Group className="my-2" controlId="newPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter your new password'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Form.Group className="my-2" controlId="confirmPassword">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Confirm your new password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
                    </Form.Group>
                </>) : (<></>)}


                { isLoading && <Loader /> }

            <Button type='submit' variant='primary' className="mt-3">
                Update your Profile
            </Button>
            </Form>
        </FormContainer>
    )
}

export default ProfileScreen