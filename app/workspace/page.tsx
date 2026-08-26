import { AppNews } from "./components/AppNews";
import { ActivitySummary } from "./components/ActivitySummary";
import { WorkspaceCarousel } from "./components/WorkspaceCarousel";

export default function WorkspaceHome() {
  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <WorkspaceCarousel>
        <AppNews />
        <ActivitySummary />
        {/* A futuro podés sumar más componentes acá */}
      </WorkspaceCarousel>
    </div>
  );
}
