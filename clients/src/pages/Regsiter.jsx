import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { googleAuth, registerUser, validUser } from '../apis/auth'
import { BsEmojiLaughing, BsEmojiExpressionless } from "react-icons/bs"
import { toast } from 'react-toastify'
import { GoogleLogin } from '@react-oauth/google'
import jwt_decode from "jwt-decode"

const defaultData = {
  firstname: "",
  lastname: "",
  email: "",
  password: ""
}

function Register() {
  const [formData, setFormData] = useState(defaultData)
  const [isLoading, setIsLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const pageRoute = useNavigate()

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      if (formData.email.includes("@") && formData.password.length > 6) {
        const response = await registerUser(formData);
  
        if (response?.data?.token) {
          localStorage.setItem("userToken", response.data.token);
          toast.success("Successfully Registered 😍");
          setIsLoading(false);
          pageRoute("/chats");
        } else {
          setIsLoading(false);
          toast.error(response?.error?.message || "Invalid Credentials!");
        }
      } else {
        setIsLoading(false);
        toast.warning("Provide valid Credentials!");
        setFormData({ ...formData, password: "" });
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("An unexpected error occurred!");
    }
  };
  

  const googleSuccess = async (response) => {
    try {
      const decoded = jwt_decode(response.credential)
      const res = await googleAuth({ tokenId: response.credential })

      if (res.data.token) {
        localStorage.setItem("userToken", res.data.token)
        pageRoute("/chats")
      }
    } catch (error) {
      toast.error("Google Sign-In Failed!")
    }
  }

  const googleFailure = () => {
    toast.error("Something went wrong. Try again!")
  }

  useEffect(() => {
    const checkUserValidity = async () => {
      const data = await validUser()
      if (data?.user) {
        window.location.href = "/chats"
      }
    }
    checkUserValidity()
  }, [])

  return (
    <div className='bg-[#121418] w-[100vw] h-[100vh] flex justify-center items-center'>
      <div className='w-[90%] sm:w-[400px] h-[400px] mt-10 relative'>
        <div className='absolute -top-7 left-0'>
          <h3 className='text-[25px] font-bold tracking-wider text-[#fff]'>Register</h3>
          <p className='text-[#fff] text-[12px] tracking-wider font-medium'>
            Have an Account? <Link className='text-[rgba(0,195,154,1)] underline' to="/login">Sign in</Link>
          </p>
        </div>
        <form className='flex flex-col gap-y-3 mt-[12%]' onSubmit={handleOnSubmit}>
          <div className='flex gap-x-2 w-[100%]'>
            <input onChange={handleOnChange} className='bg-[#222222] h-[50px] pl-3 text-[#fff] w-[49%]' type="text" name="firstname" placeholder='First Name' value={formData.firstname} required />
            <input onChange={handleOnChange} className='bg-[#222222] h-[50px] pl-3 text-[#fff] w-[49%]' type="text" name="lastname" placeholder='Last Name' value={formData.lastname} required />
          </div>
          <input onChange={handleOnChange} className='bg-[#222222] h-[50px] pl-3 text-[#fff] w-[100%]' type="email" name="email" placeholder="Email" value={formData.email} required />
          <div className='relative'>
            <input onChange={handleOnChange} className='bg-[#222222] h-[50px] pl-3 text-[#fff] w-[100%]' type={showPass ? "text" : "password"} name="password" placeholder="Password" value={formData.password} required />
            <button type='button' onClick={() => setShowPass(!showPass)} className='absolute top-3 right-4'>
              {showPass ? <BsEmojiExpressionless className='text-[#fff] w-[30px] h-[25px]' /> : <BsEmojiLaughing className='text-[#fff] w-[30px] h-[25px]' />}
            </button>
          </div>
          <button style={{ background: "linear-gradient(90deg, rgba(0,195,154,1) 0%, rgba(224,205,115,1) 100%)" }} className='w-[100%] h-[50px] font-bold text-[#121418] tracking-wide text-[17px] relative' type='submit'>
            {isLoading ? (
              <lottie-player src="https://assets2.lottiefiles.com/packages/lf20_h9kds1my.json" background="transparent" speed="1" style={{ width: "200px", height: "160px" }} loop autoplay></lottie-player>
            ) : (
              <p>Register</p>
            )}
          </button>
          <GoogleLogin onSuccess={googleSuccess} onError={googleFailure} />
        </form>
      </div>
    </div>
  )
}

export default Register
