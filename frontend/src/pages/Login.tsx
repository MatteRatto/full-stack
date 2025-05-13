import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import PrivateRoute from "@/components/common/PrivateRoute";

const Login: React.FC = () => {
  return (
    <PrivateRoute requireAuth={false}>
      <LoginForm />
    </PrivateRoute>
  );
};

export default Login;
