import LoginForm from "@/components/auth/LoginForm";
import PrivateRoute from "@/components/common/PrivateRoute";
import React from "react";
import { Helmet } from "react-helmet-async";

const Login: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Accedi - Mr app</title>
        <meta
          name="description"
          content="Accedi al tuo account MR app in modo sicuro"
        />
      </Helmet>

      <PrivateRoute requireAuth={false}>
        <LoginForm />
      </PrivateRoute>
    </>
  );
};

export default Login;
