export const EmpStats = () => {
  return (
    <div className="flex items-center gap-2 rounded-md border px-2 py-1">
      <div className="flex items-center gap-1">
        <div className="bg-primary size-2.5 rounded-full"></div>
        <p className="text-sm font-medium">
          On time <span className="text-muted-foreground">80%</span>
        </p>
      </div>
      <div className="flex items-center gap-1">
        <div className="bg-secondary size-2.5 rounded-full"></div>
        <p className="text-sm font-medium">
          Late <span className="text-muted-foreground">20%</span>
        </p>
      </div>
      <div className="flex items-center gap-1">
        <div className="bg-input size-2.5 rounded-full"></div>
        <p className="text-sm font-medium">
          On leave <span className="text-muted-foreground">0%</span>
        </p>
      </div>
    </div>
  );
};
