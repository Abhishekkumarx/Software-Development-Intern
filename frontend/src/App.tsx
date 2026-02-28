import { useEffect, useState } from "react"
import { Toaster, toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EquipmentTable } from "@/components/EquipmentTable"
import { EquipmentForm } from "@/components/EquipmentForm"
import { MaintenanceModal } from "@/components/MaintenanceModal"
import { 
  fetchEquipment, 
  fetchEquipmentTypes, 
  fetchMetrics,
  createEquipment, 
  updateEquipment, 
  deleteEquipment 
} from "@/lib/api"
import type { 
  EquipmentResponse, 
  EquipmentTypeResponse, 
  EquipmentRequest
} from "@/lib/api"
import { Plus, LayoutDashboard, Activity, CheckCircle, AlertTriangle, Monitor, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

function App() {
  const [equipmentList, setEquipmentList] = useState<EquipmentResponse[]>([])
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentTypeResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [metrics, setMetrics] = useState({ total: 0, active: 0, inactive: 0, maintenance: 0 })

  // Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<EquipmentResponse | null>(null)
  
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false)
  const [maintenanceEquipment, setMaintenanceEquipment] = useState<EquipmentResponse | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [eqPage, types, mets] = await Promise.all([
        fetchEquipment(statusFilter, searchQuery, currentPage, 10),
        fetchEquipmentTypes(),
        fetchMetrics()
      ])
      setEquipmentList(eqPage.content)
      setTotalPages(eqPage.totalPages || 1)
      setEquipmentTypes(types)
      setMetrics(mets)
    } catch (error: any) {
      toast.error(error.message || "Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  // Effect to reload when filter, search, or page changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadData()
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery, statusFilter, currentPage])

  const handleAddClick = () => {
    setEditingEquipment(null)
    setIsFormOpen(true)
  }

  const handleEditClick = (eq: EquipmentResponse) => {
    setEditingEquipment(eq)
    setIsFormOpen(true)
  }

  const handleMaintenanceClick = (eq: EquipmentResponse) => {
    setMaintenanceEquipment(eq)
    setIsMaintenanceOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteEquipment(id)
      toast.success("Equipment deleted")
      loadData()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete equipment")
    }
  }

  const handleFormSubmit = async (data: EquipmentRequest) => {
    try {
      if (editingEquipment) {
        await updateEquipment(editingEquipment.id, data)
        toast.success("Equipment updated")
      } else {
        await createEquipment(data)
        toast.success("Equipment added")
      }
      setIsFormOpen(false)
      loadData()
    } catch (error: any) {
      toast.error(error.message || "Failed to save equipment")
    }
  }


  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-primary/20">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl">
              <Monitor className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
              LabEquip Pro
            </h1>
          </div>
          <Button onClick={handleAddClick} className="shadow-lg shadow-primary/20 rounded-full px-6 transition-transform active:scale-95">
            <Plus className="mr-2 h-4 w-4" /> Add Equipment
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Assets</p>
                <h3 className="text-2xl font-bold">{metrics.total}</h3>
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active</p>
                <h3 className="text-2xl font-bold">{metrics.active}</h3>
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Needs Maintenance</p>
                <h3 className="text-2xl font-bold">{metrics.maintenance}</h3>
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Inactive</p>
                <h3 className="text-2xl font-bold">{metrics.inactive}</h3>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Form Dialog */}
        <AnimatePresence>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{editingEquipment ? "⚙️ Edit Equipment" : "📦 Add Equipment"}</DialogTitle>
              </DialogHeader>
              <EquipmentForm
                initialData={editingEquipment}
                equipmentTypes={equipmentTypes}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </AnimatePresence>

        {/* Maintenance Modal */}
        <MaintenanceModal
          equipment={maintenanceEquipment}
          open={isMaintenanceOpen}
          onOpenChange={setIsMaintenanceOpen}
          onLogAdded={loadData}
        />

        {/* Table Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200 dark:border-slate-800 p-2 overflow-hidden"
        >
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4 mt-2 px-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search equipment by name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(0); // reset page on search
                }}
                className="pl-9 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
              />
            </div>
            <Select value={statusFilter} onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(0); // reset page on filter
            }}>
              <SelectTrigger className="w-full sm:w-[200px] bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              Loading systems...
            </div>
          ) : (
            <>
              <EquipmentTable 
                equipment={equipmentList} 
                onEdit={handleEditClick} 
                onDelete={handleDelete}
                onMaintenance={handleMaintenanceClick}
              />
              
              {/* Pagination Footer */}
              <div className="flex items-center justify-between px-4 py-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-sm text-slate-500">
                  Page {currentPage + 1} of {Math.max(1, totalPages)}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0 || isLoading}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage >= totalPages - 1 || isLoading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </main>
      
      <Toaster position="top-center" richColors />
    </div>
  )
}

export default App
