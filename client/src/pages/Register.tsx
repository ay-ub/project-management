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
import useUser from "@/store/userStore";
import { Eye, EyeClosed, Loader } from "lucide-react";
function Register() {
  const [userData, setUserData] = useState({
    name: "Mohamed",
    familyName: "ben ali",
    email: "mohamedBenAli@gmail.com",
    password: "password123",
  });

  const { register, registerLoading } = useUser();
  const handleRegister = () => {
    register(userData);
  };
  const [togglePassword, setTogglePassword] = useState(false);

  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="mx-auto ">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Get started by signing up and unleashing your projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex gap-2 items-center">
              <div className="grid gap-2">
                <Label htmlFor="firsName">First Name:</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  defaultValue={userData.name}
                  onChange={(e) => {
                    setUserData({
                      ...userData,
                      name: e.target.value,
                    });
                  }}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">last Name:</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="last Name"
                  onChange={(e) => {
                    setUserData({
                      ...userData,
                      familyName: e.target.value,
                    });
                  }}
                  defaultValue={userData.familyName}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                onChange={(e) => {
                  setUserData({
                    ...userData,
                    email: e.target.value,
                  });
                }}
                defaultValue={userData.email}
                required
              />
            </div>
            <div className="grid gap-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={togglePassword ? "text" : "password"}
                defaultValue={userData.password}
                onChange={(e) => {
                  setUserData({
                    ...userData,
                    password: e.target.value,
                  });
                }}
                required
                placeholder="create a passwoord"
              />
              <span
                className={`absolute right-3 bottom-2 text-xs cursor-pointer duration-200 ${
                  !togglePassword ? "opacity-0" : "opacity-100"
                }`}
                onClick={() => {
                  setTogglePassword(!togglePassword);
                }}
              >
                <EyeClosed size={20} />
              </span>
              <span
                className={`absolute right-3 bottom-2 text-xs cursor-pointer duration-200 ${
                  togglePassword ? "opacity-0" : "opacity-100"
                }`}
                onClick={() => {
                  setTogglePassword(!togglePassword);
                }}
              >
                <Eye size={20} />
              </span>
            </div>
            <div className="grid gap-2 relative">
              <Label htmlFor="ConfirmPassword">Password confirmation</Label>
              <Input
                id="ConfirmPassword"
                type={togglePassword ? "text" : "password"}
                onChange={(e) => {
                  setUserData({
                    ...userData,
                    password: e.target.value,
                  });
                }}
                defaultValue={userData.password}
                required
                placeholder="Re-enter password"
              />
              <span
                className={`absolute right-3 bottom-2 text-xs cursor-pointer duration-200 ${
                  !togglePassword ? "opacity-0" : "opacity-100"
                }`}
                onClick={() => {
                  setTogglePassword(!togglePassword);
                }}
              >
                <EyeClosed size={20} />
              </span>
              <span
                className={`absolute right-3 bottom-2 text-xs cursor-pointer duration-200 ${
                  togglePassword ? "opacity-0" : "opacity-100"
                }`}
                onClick={() => {
                  setTogglePassword(!togglePassword);
                }}
              >
                <Eye size={20} />
              </span>
            </div>
            <Button type="submit" className="w-full" onClick={handleRegister}>
              {registerLoading && <Loader className="animate-spin mx-2" />}{" "}
              Register
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Do you have a current account?
            <Link to="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
