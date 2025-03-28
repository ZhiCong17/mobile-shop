import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import { showToast } from "@/utils/toastUtils";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useReturnPathStore from "@/store/useReturnPathStore";
import useUserStore from "@/store/useUserStore";

function LoginForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { returnPath } = useReturnPathStore();
  const { login } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast({
        toast,
        variant: "destructive",
        description: "Email and password are required.",
      });
      return;
    }

    const result = await login({ email, password });

    if (!result.token) {
      showToast({
        toast,
        variant: "destructive",
        description: result.message,
      });
      return;
    }

    showToast({
      toast,
      description: "You have logged in successfully.",
      timeout: 2000,
    });
    navigate(returnPath);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="font-bold mb-1" htmlFor="email">
        Email
      </label>
      <input
        className="mb-5 pl-3 h-10 border border-neutral-500 rounded w-full"
        type="email"
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
        name="password"
        id="password"
        placeholder="********"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button className="w-full" type="submit">
        Login
      </Button>
    </form>
  );
}

export default LoginForm;
