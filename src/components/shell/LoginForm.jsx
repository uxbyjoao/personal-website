import axios from "axios";
import clsx from "clsx";
import { useState } from "react";
import { useFormik } from "formik";

export default function LoginForm() {
  const [response, setResponse] = useState(null);

  const validate = (values) => {
    const errors = {};
    if (!values.password || values.password.length === 0) {
      errors.password = "Password is required.";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "/login/do",
          { password: values.password },
          { withCredentials: true }
        );

        if (response.status === 200) {
          setResponse({
            status: "success",
            message: "Login successful. Redirecting...",
          });
          const url = new URL(window.location.href);
          const redirect = url.searchParams.get("redirect");
          console.log(redirect);
          if (redirect) {
            location.replace(`${url.origin}/projects/${redirect}`);
          }
        } else {
          setResponse({
            status: "error",
            message: "Login failed. Please check credentials.",
          });
        }
      } catch (err) {
        setResponse({
          status: "error",
          message: "Login failed. Please check credentials.",
        });
      }
    },
  });

  return (
    <div className="m-auto flex max-w-[450px]">
      <form
        className="flex flex-col gap-4 rounded-md border border-neutral-100 bg-white p-9 dark:border-neutral-700 dark:bg-neutral-800"
        id="login-form"
        onSubmit={formik.handleSubmit}
      >
        <p>Please enter the password to access this project.</p>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-sm text-neutral-600 dark:text-neutral-300"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className={clsx([
              "rounded focus:ring-2 focus:ring-blue-500",
              formik.errors.password &&
                "ring-2 ring-red-500 focus:ring-red-500",
            ])}
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.errors.password && (
            <div className="text-sm text-red-500">{formik.errors.password}</div>
          )}
        </div>
        <button
          type="submit"
          className={clsx([
            "w-full rounded py-3 font-medium text-white transition-colors",
            formik.values.password.length > 0 &&
              "cursor-pointer bg-blue-500 hover:bg-blue-400",
            formik.values.password.length === 0 &&
              "cursor-not-allowed bg-neutral-300 text-neutral-400 dark:bg-neutral-700 dark:text-neutral-800",
          ])}
        >
          See project
        </button>
        {response !== null && response.status === "error" && (
          <span className="text-sm font-medium text-red-500">
            Error, please check password.
          </span>
        )}
        {response !== null && response.status === "success" && (
          <span
            className="text-sm font-medium text-green-500
          "
          >
            Correct password, redirecting...
          </span>
        )}
      </form>
    </div>
  );
}
