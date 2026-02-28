import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { EquipmentTypeResponse, EquipmentRequest, EquipmentResponse } from "@/lib/api"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  typeId: z.string().min(1, "Equipment type is required."),
  status: z.string().min(1, "Status is required."),
})

interface EquipmentFormProps {
  initialData?: EquipmentResponse | null;
  equipmentTypes: EquipmentTypeResponse[];
  onSubmit: (data: EquipmentRequest) => Promise<void>;
  onCancel: () => void;
}

export function EquipmentForm({ initialData, equipmentTypes, onSubmit, onCancel }: EquipmentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      typeId: initialData?.type.id.toString() || "",
      status: initialData?.status || "Active",
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        typeId: initialData.type.id.toString(),
        status: initialData.status,
      })
    }
  }, [initialData, form])

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    await onSubmit({
      name: values.name,
      typeId: parseInt(values.typeId),
      status: values.status,
      lastCleanedDate: initialData?.lastCleanedDate || null,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipment Name</FormLabel>
              <FormControl>
                <Input placeholder="Microscope A..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="typeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipment Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {equipmentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Save Changes" : "Add Equipment"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
