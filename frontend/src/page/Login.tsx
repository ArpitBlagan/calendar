import google from "@/google.jpg";
const Login = () => {
  return (
    <div className="flex min-h-[80dvh] items-center justify-center gap-3">
      <div className="flex flex-col w-1/2 justify-center items-center">
        <h1>Login to Calendarr using Google</h1>
        <a
          href="http://localhost:8000/auth/google"
          className="py-2 px-3 rounded-xl border border-gray-300"
        >
          <img src={google} width={70} height={50} className="rounded-md" />
        </a>
      </div>
    </div>
  );
};

export default Login;
