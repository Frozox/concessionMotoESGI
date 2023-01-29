import { useRouter } from "next/router";
import React from "react";

const AdminRequest = () => {
  const router = useRouter();

  React.useEffect(() => {
    router.push("/messages");
  }, [router]);
};
export default AdminRequest;
