export default function NewVerificationPage() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="mb-4 text-2xl font-bold">Email Verification Sent</h1>
      <p className="text-center text-gray-600">
        A verification email has been sent to your email address. Please check
        your inbox and click on the verification link to verify your email.
      </p>
    </div>
  );
}
