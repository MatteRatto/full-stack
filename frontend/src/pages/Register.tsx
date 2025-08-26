import RegisterForm from "@/components/auth/RegisterForm";
import PrivateRoute from "@/components/common/PrivateRoute";
import React from "react";
import { Helmet } from "react-helmet-async";

const Register: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Registrati - MR-app</title>
        <meta
          name="description"
          content="Crea il tuo account MR-App e inizia a utilizzare la nostra piattaforma"
        />
      </Helmet>

      <PrivateRoute requireAuth={false}>
        <RegisterForm />
      </PrivateRoute>
    </>
  );
};

export default Register;
