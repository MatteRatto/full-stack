import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import PrivateRoute from "@/components/common/PrivateRoute";

const Register: React.FC = () => {
  return (
    <PrivateRoute requireAuth={false}>
      <RegisterForm />
    </PrivateRoute>
  );
};

export default Register;
