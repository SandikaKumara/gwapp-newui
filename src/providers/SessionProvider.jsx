import { getSessionTenant } from "@/lib/sessionActions";

import { createContext, useContext, useState, useEffect } from "react";

const SessionContext = createContext();

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }) {
  const [sessionTenant, setSessionTenant] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function fetchSession() {
      const sessionData = await getSessionTenant();
      setSessionTenant(sessionData);
      setRefresh(false);
    }

    fetchSession();
  }, [refresh]);

  return (
    <SessionContext.Provider
      value={{
        sessionTenant,
        setSessionTenant,
        setRefresh,
        refresh,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
