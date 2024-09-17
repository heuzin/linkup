import React from "react";
import TextInput from "./TextInput";
import { useMutation } from "@apollo/client";
import { GraphQLErrorExtensions } from "graphql";
import { LoginUserMutation } from "../gql/graphql";
import { useUserStore } from "../store/userStore";
import { useGeneralStore } from "../store/generalStore";
import { LOGIN_USER } from "../graphql/mutations/Login";

function Login() {
  const [loginUser, { loading, error, data }] =
    useMutation<LoginUserMutation>(LOGIN_USER);
  const setUser = useUserStore((state) => state.setUser);
  const setLoginOpen = useGeneralStore((state) => state.setLoginIsOpen);
  const [errors, setErrors] = React.useState<GraphQLErrorExtensions>({});
  const [invalidCredentials, setInvalidCredentials] = React.useState("");

  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    setErrors({});
    try {
      const response = await loginUser({
        variables: {
          email: loginData.email,
          password: loginData.password,
        },
      });
      if (response && response.data) {
        setUser(response.data.login.user);
      }
      setLoginOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      if (error && error.graphQLErrors[0].extensions?.invalidCredentials) {
        setInvalidCredentials(
          error.graphQLErrors[0].extensions.invalidCredentials as string
        );
      } else {
        if (error) {
          setErrors(
            error.graphQLErrors[0].extensions as GraphQLErrorExtensions
          );
        }
      }
    }
  };

  return (
    <>
      <div className="text-center text-[28px] mb-4 font-bold">Login</div>
      <div className="px-6 pb-2">
        <TextInput
          autoFocus={false}
          max={64}
          onChange={(e) =>
            setLoginData({ ...loginData, email: e.target.value })
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
            setLoginData({ ...loginData, password: e.target.value })
          }
          placeHolder="Password"
          inputType="password"
          error={errors?.password as string}
        />
      </div>
      <div className="px-6 text-[12px] text-gray-600">Forgot password?</div>
      <div className="px-6">
        <span className="text-red-500 text-[14px] font-semibold">
          {invalidCredentials}
        </span>
        <button
          onClick={handleLogin}
          disabled={!loginData.email || !loginData.password}
          className={[
            "mt-6 w-full text-[17px] font-semibold text-white py-3 rounded-sm",
            !loginData.email || !loginData.password
              ? "bg-gray-200"
              : "bg-[#F02C56]",
          ].join(" ")}
        >
          Login
        </button>
      </div>
    </>
  );
}

export default Login;
