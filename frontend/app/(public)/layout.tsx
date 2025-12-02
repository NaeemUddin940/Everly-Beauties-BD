import { CartProvider } from "@/components/context/cart-context";
import { LoadingProvider } from "@/components/context/LoadingContext";
import Header from "@/components/header/Header";
import StoreProvider from "@/components/providers/providers";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import FooterSpinner from "@/components/Spinner/FooterSpinner";
import { Toaster } from "react-hot-toast";
import "../globals.css";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white">
      <ReactQueryProvider>
        <StoreProvider>
          <LoadingProvider>
            <CartProvider>
              <Header />
              {children}
              <footer />
            </CartProvider>
            <FooterSpinner />
          </LoadingProvider>
          <Toaster position="top-right" />
        </StoreProvider>
      </ReactQueryProvider>
    </div>
  );
}
