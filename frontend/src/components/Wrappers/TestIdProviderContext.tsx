import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface TestIdProviderContextType {
  isAutomationEnabled: boolean;
}

const TestIdProviderContext = createContext<TestIdProviderContextType>({
  isAutomationEnabled: false,
});

export const TestIdProvider = (props: { children: ReactNode }) => {
  const [isAutomationEnabled, setIsAutomationEnabled] = useState(false);

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("automation-tests"))
      ?.split("=")[1];
    setIsAutomationEnabled(cookie === "true");
  }, []);

  return (
    <TestIdProviderContext.Provider value={{ isAutomationEnabled }}>
      {props.children}
    </TestIdProviderContext.Provider>
  );
};

export const useTestAutomation = (): TestIdProviderContextType =>
  useContext(TestIdProviderContext);
