import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader } from "lucide-react";
import useUser from "@/store/userStore";
export default function Login() {
  // const navigate = useNavigate();
  const { login, loading } = useUser();
  const [userData, setUserData] = useState({
    email: "johndoe@example.com",
    password: "password123",
  });
  return (
    <div className='h-screen  flex justify-center items-center'>
      <Card className='mx-auto max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl'>Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='m@example.com'
                required
                value={userData.email}
                onChange={(e) => {
                  setUserData({
                    ...userData,
                    email: e.target.value,
                  });
                }}
              />
            </div>
            <div className='grid gap-2'>
              <div className='flex items-center'>
                <Label htmlFor='password'>Password</Label>
                <Link to='#' className='ml-auto inline-block text-sm underline'>
                  Forgot your password?
                </Link>
              </div>

              <Input
                value={userData.password}
                onChange={(e) => {
                  setUserData({
                    ...userData,
                    password: e.target.value,
                  });
                }}
                id='password'
                type='password'
                required
              />
            </div>
            <Button
              type='submit'
              className='w-full'
              onClick={(e) => {
                e.preventDefault();
                login(userData);
              }}
            >
              {loading && <Loader className='animate-spin' />}
              Login
            </Button>
            <Button variant='outline' className='w-full'>
              Login with Google
            </Button>
          </div>
          <div className='mt-4 text-center text-sm'>
            Don&apos;t have an account?{" "}
            <Link to='/register' className='underline'>
              Register Now
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
