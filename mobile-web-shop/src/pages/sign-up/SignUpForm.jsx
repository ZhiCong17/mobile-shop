import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";

import useUserStore from "@/store/useUserStore";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword || !username) {
      const toastId = toast({
        variant: "destructive",
        description: "Please fill in all fields.",
      });

      setTimeout(() => toastId.dismiss(), 3000);
      return;
    }

    if (password !== confirmPassword) {
      const toastId = toast({
        variant: "destructive",
        description: "Passwords do not match.",
      });

      setTimeout(() => toastId.dismiss(), 3000);
      return;
    }

    const signUpData = { name: username, email, password };

    const response = await signUp(signUpData);

    if (response.user) {
      const toastId = toast({
        description: response.message,
      });

      setTimeout(() => toastId.dismiss(), 3000);
      navigate("/login");
    } else {
      const toastId = toast({
        variant: "destructive",
        description: response.message,
      });

      setTimeout(() => toastId.dismiss(), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="font-bold mb-1" htmlFor="username">
        Username
      </label>
      <input
        className="mb-5 pl-3 h-10 border border-neutral-500 rounded w-full"
        type="text"
        value={username}
        name="username"
        id="username"
        placeholder="me"
        onChange={(e) => setUsername(e.target.value)}
      />
      <label className="font-bold mb-1" htmlFor="email">
        Email
      </label>
      <input
        className="mb-5 pl-3 h-10 border border-neutral-500 rounded w-full"
        type="email"
        value={email}
        name="email"
        id="email"
        autoComplete="email"
        placeholder="me@example.com"
        onChange={(e) => setEmail(e.target.value)}
      />
      <label className="font-bold mb-1" htmlFor="password">
        Password
      </label>
      <input
        className="mb-5 pl-3 h-10 border border-neutral-500 rounded w-full"
        type="password"
        value={password}
        name="password"
        id="password"
        placeholder="********"
        onChange={(e) => setPassword(e.target.value)}
      />
      <label className="font-bold mb-1" htmlFor="confirmPassword">
        Confirm Password
      </label>
      <input
        className="mb-5 pl-3 h-10 border border-neutral-500 rounded w-full"
        type="password"
        value={confirmPassword}
        name="confirmPassword"
        id="confirmPassword"
        placeholder="********"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button className="w-full" type="submit">
        Sign Up
      </Button>
    </form>
  );
}

export default SignUpForm;
