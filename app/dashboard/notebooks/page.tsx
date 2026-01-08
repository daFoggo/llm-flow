import { CreateNotebookDialog } from "@/features/notebooks";

const NotebooksPage = () => {
  return (
    <div className="p-4 h-[calc(100dvh-var(--dashboard-header-height-with-margin))] overflow-hidden">
      <CreateNotebookDialog />
    </div>
  );
};

export default NotebooksPage;
