"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { Plus } from "@/components/animate-ui/icons/plus";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("link"),
    content: z
      .string()
      .min(1, { message: "Please enter at least one link" })
      .refine(
        (val) => {
          const lines = val
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l !== "");
          return (
            lines.length > 0 &&
            lines.every((line) => z.url().safeParse(line).success)
          );
        },
        {
          message:
            "One or more lines are not valid URLs. Please ensure every line is a valid URL.",
        }
      ),
  }),
  z.object({
    type: z.literal("text"),
    content: z.string().min(1, { message: "Please enter some text" }),
  }),
]);

type TDocumentFormValues = z.infer<typeof formSchema>;

interface IDocumentInputFormProps {
  inputType: "link" | "text";
  onAddLinks: (links: string[]) => void;
  onAddText: (text: string) => void;
}

export function DocumentInputForm({
  inputType,
  onAddLinks,
  onAddText,
}: IDocumentInputFormProps) {
  const form = useForm<TDocumentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: inputType,
      content: "",
    },
  });

  const onSubmit = (data: TDocumentFormValues) => {
    if (data.type === "link") {
      const links = data.content
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l !== "");
      onAddLinks(links);
    } else {
      onAddText(data.content);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
      <Field>
        <Textarea
          id="content"
          placeholder={
            inputType === "link"
              ? "https://example.com/doc1\nhttps://example.com/doc2"
              : "Paste your text here..."
          }
          className="min-h-[100px]"
          {...form.register("content")}
          autoFocus
        />
        <FieldDescription>
          {inputType === "link"
            ? "Enter one URL per line."
            : "Paste the text content directly."}
        </FieldDescription>
        <FieldError
          errors={
            form.formState.errors.content
              ? [{ message: form.formState.errors.content.message || "" }]
              : undefined
          }
        />
      </Field>

      <div className="flex justify-center items-center">
        <Button type="submit" variant="outline">
          <Plus />
          Add {inputType === "link" ? "links" : "text"} to sources
        </Button>
      </div>
    </form>
  );
}
