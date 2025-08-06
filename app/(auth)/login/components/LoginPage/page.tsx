import LoginPage from "./components/LoginPage";

export default function Login() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
      <LoginPage />
      <div>
        <img alt="Hero Image" />
      </div>
    </div>
  );
}
