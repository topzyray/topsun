"use client";
import { ZodType } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type DynamicFormTableProps<T extends object> = {
  title: string;
  schema: ZodType<T>;
  columns: { key: keyof T; label: string }[];
  formRenderer: (
    data: T,
    onChange: (updates: Partial<T>) => void,
    errors: Partial<Record<keyof T, string>>,
  ) => React.ReactNode;
  value: T[];
  onChange: (value: T[]) => void;
};

export function DynamicFormTable<T extends object>({
  title,
  schema,
  columns,
  formRenderer,
  value,
  onChange,
}: DynamicFormTableProps<T>) {
  const [formData, setFormData] = useState<T>(() => {
    const obj: any = {};
    columns.forEach(({ key }) => (obj[key] = ""));
    return obj;
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleSubmit = () => {
    const parsed = schema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const formattedErrors: Partial<Record<keyof T, string>> = {};
      Object.entries(fieldErrors).forEach(([key, value]) => {
        // if (value && value[0]) formattedErrors[key as keyof T] = value[0];
      });
      setFormErrors(formattedErrors);
      return;
    }

    setFormErrors({});
    if (editIndex !== null) {
      const updated = [...value];
      updated[editIndex] = formData;
      onChange(updated);
      setEditIndex(null);
    } else {
      onChange([...value, formData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData(() => {
      const obj: any = {};
      columns.forEach(({ key }) => (obj[key] = ""));
      return obj;
    });
    setFormErrors({});
    setEditIndex(null);
  };

  const handleRemove = (index: number) => {
    const updated = [...value];
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleEdit = (index: number) => {
    setFormData(value[index]);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted rounded border p-4">
        <h2 className="mb-4 text-lg font-semibold">{title}</h2>
        {formRenderer(formData, (updates) => setFormData({ ...formData, ...updates }), formErrors)}

        <div className="mt-4 flex gap-2">
          <Button type="button" onClick={handleSubmit}>
            {editIndex !== null ? "Update" : "Add"}
          </Button>
          {editIndex !== null && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      {value.length > 0 && (
        <div className="overflow-auto rounded border">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-muted">
              <tr>
                {columns.map((col) => (
                  <th key={String(col.key)} className="px-4 py-2 text-left">
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {value.map((item, index) => (
                <tr key={index} className="border-muted-foreground border-t">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-2">
                      {item[col.key] as string}
                    </td>
                  ))}
                  <td className="space-x-2 px-4 py-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(index)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleRemove(index)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
