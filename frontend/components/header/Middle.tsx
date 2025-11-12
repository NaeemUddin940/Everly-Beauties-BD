import Logo from "@/assets/img/logo.webp";
import Image from "next/image";
import Link from "next/link";
import Container from "../common/Container";
import UserLogin from "../UserLogin/UserLogin";
import CartWishlish from "./CartWishlish";
import SearchInput from "./SearchInput";

const Middle = () => {
  return (
    <div className="bg-white py-2">
      <Container className="flex items-center justify-between gap-5">
        {/* Logo */}
        <Link href="/" className="max-w-[90px] md:max-w-[150px]">
          <Image
            src={Logo}
            alt="Site Logo"
            width={150}
            height={50}
            className="w-full h-auto"
          />
        </Link>

        {/* Search Input (visible on md and up) */}
        <div className="hidden md:flex flex-1">
          <SearchInput />
        </div>

        {/* User Login */}
        <UserLogin />

        {/* Cart & Wishlist */}
        <CartWishlish />
      </Container>
    </div>
  );
};

export default Middle;
