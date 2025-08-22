import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";

export default function SignIn({ providers }: any) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-purple-900">
      <div className="flex flex-col items-center space-y-6 rounded-xl bg-black/70 px-10 py-12 shadow-2xl">
        <div className="flex items-center space-x-3 mb-2">
          <Image src="/logo.png" alt="QuantumDrive Logo" width={48} height={48} />
          <span className="text-2xl font-bold text-white tracking-wide">QuantumDrive</span>
        </div>
        <h2 className="text-xl font-semibold text-white mb-4">Sign in to your account</h2>
        {Object.values(providers).map((provider: any) => (
          <div key={provider.name} className="w-full mb-2">
            <button
              className="w-full rounded bg-indigo-500 py-2 px-4 font-semibold text-white shadow hover:bg-indigo-600 transition-colors"
              onClick={() => signIn(provider.id, { callbackUrl: "/drive/my-drive" })}
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

SignIn.getInitialProps = async () => {
  const providers = await getProviders();
  return { providers };
};