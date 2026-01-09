import { CreateNotebookDialog, NotebookList } from "@/features/notebooks";

const NotebooksPage = () => {
  return (
    <div className="p-4 h-[calc(100dvh-var(--dashboard-header-height-with-margin))] overflow-hidden flex flex-col gap-4">
      <CreateNotebookDialog />
      <NotebookList />
    </div>
  );
};

export default NotebooksPage;
