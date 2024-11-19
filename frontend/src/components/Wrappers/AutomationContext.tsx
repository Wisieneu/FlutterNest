import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AutomationContextType {
  isAutomationEnabled: boolean;
}

const AutomationContext = createContext<AutomationContextType>({
  isAutomationEnabled: false,
});

export const AutomationProvider = (props: { children: ReactNode }) => {
  const [isAutomationEnabled, setIsAutomationEnabled] = useState(false);

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("automation-tests"))
      ?.split("=")[1];
    setIsAutomationEnabled(cookie === "true");
  }, []);

  return (
    <AutomationContext.Provider value={{ isAutomationEnabled }}>
      {props.children}
    </AutomationContext.Provider>
  );
};

export const useAutomation = (): AutomationContextType =>
  useContext(AutomationContext);
