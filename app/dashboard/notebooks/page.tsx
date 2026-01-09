import { CreateNotebookDialog, NotebookList } from "@/features/notebooks";

const NotebooksPage = () => {
  return (
    <div className="p-4 overflow-hidden flex flex-col gap-4">
      <CreateNotebookDialog />
      <NotebookList />
    </div>
  );
};

export default NotebooksPage;
