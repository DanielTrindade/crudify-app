"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const App = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, []);

  return null; 
};

export default App;