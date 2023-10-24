import React, { useState } from 'react'
import { Checkbox, Button, Divider, Form, Input, message } from 'antd'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthContext } from '../../Context/AuthContext';
import { auth } from '../../config/firebase';
import { Link } from 'react-router-dom';



const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const initialState = {email:"" , Password:""}

export default function Login() {

  const { readUserProfile } = useAuthContext()
  const [state ,setState] = useState(initialState)
  const [isProcessing ,setIsProcessing] = useState(false)

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }));

  const handleLogin = (e)=>{
    e.preventDefault()

    let { email, password } = state

    setIsProcessing(true)
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        readUserProfile(user)
      })
      .catch(err => {
        message.error("Something went wrong while signing user")
        console.error(err)
      })
      .finally(() => {
        setIsProcessing(false)
      })
  }
  return (

    <>
      <main className='auth-login'>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="card p-3 p-md-4">
                <h2 className='text-center'>Login</h2>

                <Divider />

                <Form layout='vertical' name="basic"
                  
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item label="Email"  name="email" className='fw-bold' hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Please input your Email!',
                      },
                    ]}
                  >
                    <Input placeholder='Please Enter Your Email' name='email' className='d-flex align-items-center' onChange={handleChange}/>
                  </Form.Item>

                  <Form.Item
                    label="Password" name="password" className='fw-bold' hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                    ]}
                  >
                    <Input.Password placeholder='Please Enter Your Password' name='password' onChange={handleChange} />
                  </Form.Item>

                  <Form.Item
                    name="remember"
                    valuePropName="checked"
                  >
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" className='w-100'  loading={isProcessing} onClick={handleLogin}>
                      Submit
                    </Button>
                  </Form.Item>
                  <p className='text-center'><Link to="/auth/register" >You Don't Have Account ? Register</Link></p>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </main>

    </>
  )
}
