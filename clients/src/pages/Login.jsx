import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { googleAuth, loginUser, validUser } from '../apis/auth';
import { Link, useNavigate } from 'react-router-dom';
import { BsEmojiLaughing, BsEmojiExpressionless } from "react-icons/bs";
import { toast } from 'react-toastify';

const defaultData = {
  email: "",
  password: ""
};

function Login() {
  const [formData, setFormData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const pageRoute = useNavigate();

  const googleSuccess = async (credentialResponse) => {
    if (credentialResponse) {
      console.log(credentialResponse);
      setIsLoading(true);
      const response = await googleAuth({ tokenId: credentialResponse.credential });
      setIsLoading(false);

      if (response.data.token) {
        localStorage.setItem("userToken", response.data.token);
        pageRoute("/chats");
      } else {
        toast.error("Google login failed!");
      }
    }
  };

  const googleFailure = (error) => {
    console.error("Google login failed: ", error);
    toast.error("Something went wrong. Try again!");
  };

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    if (formData.email.includes("@") && formData.password.length > 6) {
      setIsLoading(true);
      const { data } = await loginUser(formData);
      if (data?.token) {
        localStorage.setItem("userToken", data.token);
        toast.success("Successfully Logged In!");
        setIsLoading(false);
        pageRoute("/chats");
      } else {
        setIsLoading(false);
        toast.error("Invalid Credentials!");
        setFormData({ ...formData, password: "" });
      }
    } else {
      setIsLoading(false);
      toast.warning("Provide valid Credentials!");
      setFormData(defaultData);
    }
  };

  useEffect(() => {
    const isValid = async () => {
      const data = await validUser();
      if (data?.user) {
        window.location.href = "/chats";
      }
    };
    isValid();
  }, []);

  return (
    <>
      <div className='bg-[#121418] w-[100vw] h-[100vh] flex justify-center items-center'>
        <div className='w-[90%] sm:w-[400px] h-[400px] relative'>
          <div className='absolute -top-5 left-0'>
            <h3 className='text-[25px] font-bold tracking-wider text-[#fff]'>Login</h3>
            <p className='text-[#fff] text-[12px] tracking-wider font-medium'>
              No Account? <Link className='text-[rgba(0,195,154,1)] underline' to="/register">Sign up</Link>
            </p>
          </div>

          <form className='flex flex-col gap-y-3 mt-[12%]' onSubmit={formSubmit}>
            <div>
              <input className="w-[100%] sm:w-[80%] bg-[#222222] h-[50px] pl-3 text-[#ffff]" onChange={handleOnChange} name="email" type="text" placeholder='Email' value={formData.email} required />
            </div>
            <div className='relative'>
              <input className='w-[100%] sm:w-[80%] bg-[#222222] h-[50px] pl-3 text-[#ffff]' onChange={handleOnChange} type={showPass ? "text" : "password"} name="password" placeholder='Password' value={formData.password} required />
              <button type='button' onClick={() => setShowPass(!showPass)} className='absolute top-3 right-5 sm:right-24'>
                {showPass ? <BsEmojiExpressionless className='text-[#fff] w-[30px] h-[25px]' /> : <BsEmojiLaughing className='text-[#fff] w-[30px] h-[25px]' />}
              </button>
            </div>

            <button style={{ background: "linear-gradient(90deg, rgba(0,195,154,1) 0%, rgba(224,205,115,1) 100%)" }} className='w-[100%] sm:w-[80%] h-[50px] font-bold text-[#121418] tracking-wide text-[17px] relative' type='submit'>
              {isLoading ? (
                <lottie-player src="https://assets2.lottiefiles.com/packages/lf20_h9kds1my.json" background="transparent" speed="1" style={{ width: "200px", height: "160px" }} loop autoplay></lottie-player>
              ) : (
                "Login"
              )}
            </button>

            <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
              <GoogleLogin
                onSuccess={googleSuccess}
                onError={googleFailure}
                useOneTap
                shape="pill"
              />
            </GoogleOAuthProvider>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
