import { ClipboardTick, Wallet } from "iconsax-react";

export default function NoComingNextTrip() {
  return (
    <div className="flex w-full flex-col tracking-wider">
      <h2 className="font-body text-sm font-medium text-primary">
        COMING NEXT
      </h2>
      <div className="relative flex flex-col">
        <div className="absolute -left-3 top-0 z-50 mt-1 grid h-full w-screen place-content-center bg-background/50 text-center font-display text-2xl backdrop-blur-sm before:absolute before:-top-1 before:h-2 before:w-full before:bg-background/50 before:blur-sm">
          No trips coming up <br /> 😢
        </div>
        <div className="mb-3 mt-2 flex items-center justify-between">
          <div className="h-10 w-full bg-background" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-6 w-full bg-background" />
        </div>
        <div className="mt-2 flex h-[119px] items-center justify-evenly overflow-hidden rounded-lg border border-background bg-background">
          <div className="flex h-full flex-1 flex-col items-center justify-between p-[10px] transition-colors hover:bg-background-paper/50">
            <ClipboardTick variant="Bulk" size={34} className="text-primary" />
            <span className="h-7 w-1/3 bg-background-paper" />
            <span className="font-display font-bold text-primary">
              Checklist
            </span>
          </div>
          <div className="h-[calc(100%-10px)] w-[1px] bg-background-paper-light" />
          <div className="flex h-full flex-1 flex-col items-center justify-between p-[10px] transition-colors hover:bg-background-paper/50">
            <Wallet variant="Bulk" size={34} className="text-tertiary" />
            <span className="h-7 w-1/3 bg-background-paper" />
            <span className="font-display font-bold text-tertiary">
              Add expense
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
