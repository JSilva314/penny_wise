import { Navigation } from "./navigation";

export function Sidebar() {
  return (
    <aside className="hidden w-64 border-r bg-background lg:block">
      <div className="flex h-full flex-col py-6">
        <Navigation />
      </div>
    </aside>
  );
}
