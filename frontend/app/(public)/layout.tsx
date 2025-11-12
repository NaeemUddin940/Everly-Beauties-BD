import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import "../globals.css";
import StoreProvider from "@/components/providers/providers";
import { AuthProvider } from "@/components/context/AuthContext";
import { LoadingProvider } from "@/components/context/LoadingContext";
import { CartProvider } from "@/components/context/cart-context";
import Header from "@/components/header/Header";
import FooterSpinner from "@/components/Spinner/FooterSpinner";
import { Toaster } from "react-hot-toast";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <StoreProvider>
        <AuthProvider>
          <LoadingProvider>
            <CartProvider>
              <Header />
              {children}
              <footer />
            </CartProvider>
            <FooterSpinner />
          </LoadingProvider>
          <Toaster position="bottom-right" />
        </AuthProvider>
      </StoreProvider>
    </ReactQueryProvider>
  );
}
