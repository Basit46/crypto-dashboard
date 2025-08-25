import Image from "next/image";
import React from "react";

const UserProfile = () => {
  return (
    <div className="relative size-[40px] border border-grey-200 bg-grey-25 rounded-full overflow-hidden">
      <Image
        src="/avatar.jpg"
        fill
        priority
        alt="avatar"
        className="object-cover"
      />
    </div>
  );
};

export default UserProfile;
