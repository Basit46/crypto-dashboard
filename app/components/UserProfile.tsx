import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserProfile = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative size-[40px] border border-grey-200 bg-grey-25 rounded-full overflow-hidden">
          <Image
            src="/avatar.jpg"
            fill
            priority
            alt="avatar"
            className="object-cover"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="flex flex-col items-start gap-0 hover:bg-transparent">
          <p>Hassan Basit</p>
          <p>hassanbasitope@gmail.com</p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-red-600">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
