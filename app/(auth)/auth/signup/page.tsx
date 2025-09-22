import SignupForm from "@/app/components/Signup-form";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex gap-[8px] items-center">
          <Image src="/logo.png" width={30} height={30} priority alt="Logo" />
          <p className="text-[24px] font-semibold text-grey-900">CoinVista</p>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[50%]">
            <SignupForm />
          </div>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <div className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale">
          <Image
            src="/auth-img2.jpg"
            alt="Image"
            fill
            priority
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
