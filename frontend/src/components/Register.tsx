import React from "react";
import TextInput from "./TextInput";
import { REGISTER_USER } from "../graphql/mutations/Register";
import { useMutation } from "@apollo/client";
import { GraphQLErrorExtensions } from "graphql";
import { RegisterUserMutation } from "../gql/graphql";
import { useUserStore } from "../store/userStore";
import { useGeneralStore } from "../store/generalStore";
function Register() {
  const [registerUser, { loading, error, data }] =
    useMutation<RegisterUserMutation>(REGISTER_USER);
  const setUser = useUserStore((state) => state.setUser);
  const setLoginOpen = useGeneralStore((state) => state.setLoginIsOpen);
  const [errors, setErrors] = React.useState<GraphQLErrorExtensions>({});

  const [registerData, setRegisterData] = React.useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
  });

  const handleRegister = async () => {
    setErrors({});

    await registerUser({
      variables: {
        email: registerData.email,
        password: registerData.password,
        fullname: registerData.fullName,
        confirmPassword: registerData.confirmPassword,
      },
    }).catch((err) => {
      console.log(err.graphQLErrors);
      setErrors(err.graphQLErrors[0].extensions);
    });
    if (data?.register.user) {
      setUser(data.register.user);
      setLoginOpen(false);
    }
  };

  return (
    <>
      <div className="text-center text-[28px] mb-4 font-bold">Sign up</div>

      <div className="px-6 pb-2">
        <TextInput
          max={64}
          placeHolder="Enter your full name"
          onChange={(e) =>
            setRegisterData({ ...registerData, fullName: e.target.value })
          }
          inputType="email"
          autoFocus={true}
          error={errors?.fullname as string}
        />
      </div>
      <div className="px-6 pb-2">
        <TextInput
          autoFocus={false}
          max={64}
          onChange={(e) =>
            setRegisterData({ ...registerData, email: e.target.value })
          }
          placeHolder="Email"
          inputType="text"
          error={errors?.email as string}
        />
      </div>
      <div className="px-6 pb-2">
        <TextInput
          autoFocus={false}
          max={64}
          onChange={(e) =>
            setRegisterData({ ...registerData, password: e.target.value })
          }
          placeHolder="Password"
          inputType="password"
          error={errors?.password as string}
        />
      </div>
      <div className="px-6 pb-2">
        <TextInput
          autoFocus={false}
          max={64}
          onChange={(e) =>
            setRegisterData({
              ...registerData,
              confirmPassword: e.target.value,
            })
          }
          placeHolder="Confirm Password"
          inputType="password"
          error={errors?.confirmPassword as string}
        />
      </div>
      <div className="px-6 text-[12px] text-gray-600">Forgot password?</div>
      <div className="px-6 mt-6">
        <button
          onClick={handleRegister}
          disabled={
            !registerData.email ||
            !registerData.password ||
            !registerData.fullName ||
            !registerData.confirmPassword
          }
          className={[
            "w-full text-[17px] font-semibold text-white py-3 rounded-sm",
            !registerData.email ||
            !registerData.password ||
            !registerData.fullName ||
            !registerData.confirmPassword
              ? "bg-gray-200"
              : "bg-[#F02C56]",
          ].join(" ")}
        >
          Register
        </button>
      </div>
    </>
  );
}

export default Register;
