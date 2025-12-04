import { UserMenu } from "./user-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">PennyWise</h1>
        </div>
        <UserMenu />
      </div>
    </header>
  );
}
