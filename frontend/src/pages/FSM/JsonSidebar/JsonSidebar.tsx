interface JsonSidebarProps {
  type: string;
  jsonData: string;
}

const JsonSidebar = ({ type, jsonData }: JsonSidebarProps) => {
  return (
    <div className="right-0 w-[300px] bg-secondary/95 border-l border-border">
      {/* Content Container */}
      <div className="h-full overflow-y-auto pr-2 pl-4 py-4 scrollbar-hide">
        <h2 className="text-lg font-semibold mb-4 text-txt">
          {type} FSM Configuration
        </h2>
        <pre
          className="text-sm font-mono text-txt/80 whitespace-pre-wrap"
          style={{
            overscrollBehavior: "contain",
          }}
        >
          {jsonData}
        </pre>
      </div>
    </div>
  );
};

export default JsonSidebar;
