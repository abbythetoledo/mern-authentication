import { Container, Card, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import LogInScreen from '../views/LogInScreen'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useLogoutMutation } from '../slices/usersApiSlice'
import { logout } from '../slices/authSlice'

const Hero = () => {

    const { userInfo } = useSelector((state) => state.auth)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [logoutApiCall] = useLogoutMutation()

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout())
            navigate('/')
            
        } catch (err) {
            console.log(err)
        }
    }
    

    return (
        <div className='py-5'>
            <Container className='d-flex justify-content-center'>
                <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>
                    <h1 className='text-center mb-4'>MERN Authentication</h1>
                    <p className='text-center mb-4'>
                        Welcome to the thing
                    </p>
                    <div className='d-flex'>
                    { (userInfo && userInfo.regStatus == 'Active') ? (
                        <>
                            
                            <Button variant='primary' className='me-3' onClick={ logoutHandler }>
                                Log Out
                            </Button>                   
                            
                        </>
                    ) : (
                    <>
                        <LinkContainer to='/login'>
                        <Button variant='primary' className='me-3'>
                            Sign In
                        </Button>
                        </LinkContainer>
                        <LinkContainer to='/register'>
                        <Button variant='secondary' className='me-3'>
                            Register
                        </Button>
                        </LinkContainer>
                    </>
                    ) 
                    }
                    </div>
                    
                </Card>
            </Container>
        </div>
    )
}

export default Hero