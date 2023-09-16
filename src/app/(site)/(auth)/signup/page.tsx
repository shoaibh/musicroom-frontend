import { SignUpForm } from "./signup-form";

export default function SignUp({}) {
  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
      <div className="w-full m-auto bg-white lg:max-w-lg">
        <SignUpForm />
      </div>
    </div>
  );
}
