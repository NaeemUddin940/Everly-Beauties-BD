"use client";

import Spinner from "../common/Spinner";
import { useLoading } from "../context/LoadingContext";

const FooterSpinner = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-opacity-50">
      <div className="fixed inset-0 bg-black/50"></div>
      <Spinner />
    </div>
  );
};

export default FooterSpinner;
