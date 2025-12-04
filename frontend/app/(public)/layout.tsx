import { LoadingProvider } from "@/components/context/LoadingContext";
import Header from "@/components/header/Header";
import StoreProvider from "@/components/providers/providers";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import FooterSpinner from "@/components/Spinner/FooterSpinner";
import { Toaster } from "react-hot-toast";
import "../globals.css";
import { ThemeProvider } from "@/components/ui/theme-providet";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ThemeProvider
        attribute="class"
        defaultTheme="white"
        enableSystem
        disableTransitionOnChange
      >
        <ReactQueryProvider>
          <StoreProvider>
            <LoadingProvider>
              {/* <CartProvider> */}
              <Header />
              {children}
              <footer />
              {/* </CartProvider> */}
              <FooterSpinner />
            </LoadingProvider>
            <Toaster position="top-right" />
          </StoreProvider>
        </ReactQueryProvider>
      </ThemeProvider>
    </div>
  );
}
