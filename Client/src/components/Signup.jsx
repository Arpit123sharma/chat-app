import React, { useState } from 'react'
import axios from "axios"
import {useNavigate,Link} from "react-router-dom"
import {useForm} from "react-hook-form"
import {Button} from "@nextui-org/react";
import {Input} from "@nextui-org/react";

const apiUrl = import.meta.env.VITE_API_URL_HEADER

function SignupComponent() {
  const navigate = useNavigate();
  const { handleSubmit, register } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const create = async (data) => {
      try {
          setError("");
          setLoading(true);
          const response = await axios.post(`${apiUrl}/user/register`, data);
          setLoading(false);
          console.log(response); // log-1 for response 
          navigate("/login");
      } catch (error) {
          setError(error?.response?.data?.data);
          console.log("error occurred during registering user :: ", error);
          setLoading(false);
      }
  }

  return (
      <div className='w-9/12 h-4/5 rounded-3xl flex text-white '>
          <div className='m-4 w-full h-full '>
              <div className='flex w-full justify-center items-center h-32 text-zinc-900 font-semibold'>
                  <p>Have an account? </p>
                  <Link to={`/login`} className='text-black font-bold text-xl underline'>Sign in</Link>
              </div>
              <div className='w-full'>
                  <h1 className='font-bold text-4xl text-center'>Sign Up</h1>
              </div>
              <div className='mt-3'>
                  {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                  <form className='flex justify-center items-center mt-10' onSubmit={handleSubmit(create)}>
                      <div className='w-1/5'>
                          <Input
                              isRequired
                              type="text"
                              label="username"
                              className="max-w-xs pt-3"
                              {...register("userName", { required: true })}
                          />

                          <Input
                              isRequired
                              type="email"
                              label="Email"
                              className="max-w-xs pt-3"
                              {...register("email", {
                                  required: true,
                                  validate: {
                                      matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'email address must be a valid address'
                                  }
                              })}
                          />

                          <Input
                              isRequired
                              type="text"
                              label="phone number"
                              className="max-w-xs pt-3"
                              description="phone number must be of 10 digits"
                              {...register("phone", {
                                  required: true,
                                  validate: {
                                      isTenDigits: (value) => value.length === 10 || 'Phone number must be exactly 10 digits'
                                  },
                              })}
                          />

                          <div className="max-w-xs pt-3">
                              <label className="text-white">Gender</label>
                              <div className="flex">
                                  <label className="flex items-center mr-4">
                                      <input
                                          type="radio"
                                          value="Male"
                                          {...register("gender", { required: true })}
                                          className="mr-2"
                                      />
                                      Male
                                  </label>
                                  <label className="flex items-center">
                                      <input
                                          type="radio"
                                          value="Female"
                                          {...register("gender", { required: true })}
                                          className="mr-2"
                                      />
                                      Female
                                  </label>
                              </div>
                          </div>

                          <Input
                              isRequired
                              type="password"
                              label="password"
                              className="max-w-xs pt-3"
                              {...register("password", {
                                  required: true,
                                  validate: {
                                      minLength: (value) => value.length >= 4 || 'Password must be at least 4 characters long'
                                  },
                              })}
                          />

                          <div className='pt-5 flex justify-center'>
                              {loading ? (
                                  <Button color="danger" isLoading>
                                      Loading
                                  </Button>
                              ) : (
                                  <Button color="primary" variant="shadow" type='submit'>
                                      Submit
                                  </Button>
                              )}
                          </div>
                      </div>
                  </form>
              </div>
          </div>
      </div>
  );
}


export default SignupComponent