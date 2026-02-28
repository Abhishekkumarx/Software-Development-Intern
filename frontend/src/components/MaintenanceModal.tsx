import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { fetchMaintenanceLogs, createMaintenanceLog } from "@/lib/api"
import type { EquipmentResponse, MaintenanceLogResponse } from "@/lib/api"
import { toast } from "sonner"

const logSchema = z.object({
  notes: z.string().min(1, "Notes are required."),
  performedBy: z.string().min(2, "Performed by is required."),
})

interface MaintenanceModalProps {
  equipment: EquipmentResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogAdded: () => void;
}

export function MaintenanceModal({ equipment, open, onOpenChange, onLogAdded }: MaintenanceModalProps) {
  const [logs, setLogs] = useState<MaintenanceLogResponse[]>([])
  
  const form = useForm<z.infer<typeof logSchema>>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      notes: "",
      performedBy: "",
    },
  })

  useEffect(() => {
    if (equipment && open) {
      loadLogs()
      form.reset()
    }
  }, [equipment, open])

  async function loadLogs() {
    if (!equipment) return
    try {
      const data = await fetchMaintenanceLogs(equipment.id)
      setLogs(data)
    } catch (err) {
      toast.error("Failed to load history")
    }
  }

  async function onSubmit(values: z.infer<typeof logSchema>) {
    if (!equipment) return
    try {
      await createMaintenanceLog({
        equipmentId: equipment.id,
        maintenanceDate: new Date().toISOString(),
        notes: values.notes,
        performedBy: values.performedBy,
      })
      toast.success("Maintenance logged successfully. Status is now Active.")
      onLogAdded()
      onOpenChange(false)
    } catch (e: any) {
      toast.error(e.message || "Failed to log maintenance")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Maintenance: {equipment?.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Add Form */}
          <div>
            <h3 className="font-semibold mb-4">Log New Maintenance</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input placeholder="Replaced filter..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="performedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Performed By</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Submit Log</Button>
              </form>
            </Form>
          </div>

          {/* History */}
          <div className="border-l pl-8 h-[300px] overflow-y-auto">
            <h3 className="font-semibold mb-4">Maintenance History</h3>
            <div className="space-y-4">
              {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No history found.</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="text-sm bg-muted p-3 rounded-md">
                    <div className="flex justify-between font-medium">
                      <span>{log.performedBy}</span>
                      <span>{format(new Date(log.maintenanceDate), "PP")}</span>
                    </div>
                    <p className="text-muted-foreground mt-1">{log.notes}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
