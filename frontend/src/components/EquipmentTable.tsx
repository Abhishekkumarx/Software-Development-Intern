import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { type EquipmentResponse } from "@/lib/api";
import { format } from "date-fns";
import { Settings, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface EquipmentTableProps {
  equipment: EquipmentResponse[];
  onEdit: (eq: EquipmentResponse) => void;
  onDelete: (id: number) => void;
  onMaintenance: (eq: EquipmentResponse) => void;
}

export function EquipmentTable({
  equipment,
  onEdit,
  onDelete,
  onMaintenance,
}: EquipmentTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  return (
    <>
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Name</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Type</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
              <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Last Cleaned</TableHead>
              <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground h-32"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <span className="text-lg font-medium text-slate-400">No equipment found</span>
                    <span className="text-sm text-slate-500">Click Add Equipment to get started.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              equipment.map((eq, i) => (
                <motion.tr
                  key={eq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group border-b border-slate-100 dark:border-slate-800/60 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  <TableCell className="font-semibold text-slate-800 dark:text-slate-200">
                    {eq.name}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
                      {eq.type.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    {eq.status === 'Active' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                        Active
                      </span>
                    ) : eq.status === 'Inactive' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5"></span>
                        Inactive
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                        Needs Maintenance
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400 font-medium">
                    {eq.lastCleanedDate
                      ? format(new Date(eq.lastCleanedDate), "MMM d, yyyy")
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30"
                      title="Maintenance"
                      onClick={() => onMaintenance(eq)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/30"
                      title="Edit"
                      onClick={() => onEdit(eq)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/40 dark:hover:border-red-800"
                      title="Delete"
                      onClick={() => setDeleteId(eq.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              This action cannot be undone. This will permanently delete the
              equipment record and its maintenance history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) onDelete(deleteId);
                setDeleteId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              Delete Equipment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
