import React from 'react'
import { Checkbox, Button, Divider, Form, Input, message } from 'antd'
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../../config/firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuthContext } from '../../Context/AuthContext';



const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const initialState = { firstName: "", lastName: "", email: "", Password: "" };

export default function Register() {

  const { dispatch } = useAuthContext()
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  const handleRegister = () => {
    let { email, password } = state

    setIsProcessing(true)
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        createUserProfile(user)
      })
      .catch(err => {
        message.error("Something went wrong while creating user")
        console.error(err)
      })
      .finally(() => {
        setIsProcessing(false)
      })
  }

  const createUserProfile = async (user) => {
    let { firstName, lastName, } = state
    const { email, uid } = user
    const fullName = firstName + " " + lastName
    const userData = {
      fullName,
      email, uid,
      dateCreated: serverTimestamp(),
      status: "active",
      roles: ["superAdmin"]
    }

    try {
      await setDoc(doc(firestore, "users", uid), userData);
      message.success("A new user has been created successfully")
      dispatch({ type: "SET_LOGGED_OUT", payload: { user: userData } })
    } catch (e) {
      message.error("Something went wrong while creating user profile")
      console.error("Error adding document: ", e);
    }
  }
  return (
    <>
      <main className='auth-register'>
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="card p-3 p-md-4">
                <h2 className='text-center'>Register</h2>

                <Divider />

                <Form layout='vertical' name="basic"
                  initialValues={{
                    remember: true,
                  }}

                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >

                  <div className="row">
                    <div className="col">
                      <Form.Item label="First Name" name="firstName" className='fw-bold' hasFeedback
                        rules={[
                          {
                            required: true,
                            message: 'Please input your First Name!',
                          },
                        ]}
                      >
                        <Input placeholder='Enter Your First Name' name='firstName' onChange={handleChange} />
                      </Form.Item>

                    </div>
                    <div className="col">
                      <Form.Item label="Last Name" className='fw-bold' name='lastName' hasFeedback >
                        <Input placeholder='Enter Your Last Name' name='lastName' onChange={handleChange} />
                      </Form.Item>

                    </div>
                  </div>

                  <Form.Item label="Email" name="email" className='fw-bold' hasFeedback
                    rules={[
                      {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                      },
                      {
                        required: true,
                        message: 'Please input your Email!',
                      },
                    ]}
                  >
                    <Input placeholder='Please Enter Your Email' name='email' onChange={handleChange} />
                  </Form.Item>

                  <Form.Item
                    label="password" name="password" className='fw-bold' hasFeedback
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
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Please confirm your password!',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('The new password that you entered do not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    name="remember"
                    valuePropName="checked"
                  >
                    <Checkbox>I agree to the terms and conditions</Checkbox>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" className='w-100' loading={isProcessing} onClick={handleRegister}>
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </main>

    </>
  )
}
