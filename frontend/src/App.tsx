import { useState } from "react";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { PatientsPage } from "./pages/PatientsPage";
import { AgendaPage } from "./pages/AgendaPage";
import { LoginPage } from "./pages/LoginPage";
import { useAuth } from "./hooks/useAuth";

const tabs = [
  { key: "dashboard", label: "Dashboard" },
  { key: "patients", label: "Pacientes" },
  { key: "agenda", label: "Agenda" }
];

function App() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!token) {
    return <LoginPage />;
  }

  return (
    <Layout tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && <DashboardPage />}
      {activeTab === "patients" && <PatientsPage />}
      {activeTab === "agenda" && <AgendaPage />}
    </Layout>
  );
}

export default App;
