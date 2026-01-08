import { Field, FieldDescription } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

type DocumentInputFormProps = {
  inputType: "link" | "text";
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
};

export function DocumentInputForm({
  inputType,
  value,
  onChange,
  error,
}: DocumentInputFormProps) {
  return (
    <div className="space-y-4 w-full">
      <Field data-invalid={!!error}>
        <Textarea
          id="content"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            inputType === "link"
              ? "https://example.com/doc1\nhttps://example.com/doc2"
              : "Paste your text here..."
          }
          className="min-h-[100px] focus-visible:ring-0"
          autoFocus
        />
        <FieldDescription>
          {inputType === "link"
            ? "Enter one URL per line."
            : "Paste the text content directly."}
        </FieldDescription>
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
      </Field>
    </div>
  );
}
