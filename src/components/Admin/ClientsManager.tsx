import { useState, useMemo } from 'react';
import { 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  DollarSign, 
  Calendar,
  UserCheck,
  Filter,
  Download,
  Eye,
  TrendingUp
} from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

// Mock data de clientes
const mockClients = [
  {
    id: 'CLI-001',
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '+593 99 123 4567',
    location: 'Quito, Pichincha',
    totalOrders: 12,
    totalSpent: 856.40,
    lastOrder: '2024-11-10',
    status: 'active',
    registeredDate: '2024-01-15',
    orders: [
      { id: 'ORD-101', date: '2024-11-10', amount: 89.90, status: 'completed' },
      { id: 'ORD-092', date: '2024-10-28', amount: 145.50, status: 'completed' },
      { id: 'ORD-078', date: '2024-10-05', amount: 67.20, status: 'completed' },
    ]
  },
  {
    id: 'CLI-002',
    name: 'Carlos Ramírez',
    email: 'carlos.ramirez@email.com',
    phone: '+593 98 765 4321',
    location: 'Guayaquil, Guayas',
    totalOrders: 8,
    totalSpent: 623.80,
    lastOrder: '2024-11-08',
    status: 'active',
    registeredDate: '2024-02-20',
    orders: [
      { id: 'ORD-098', date: '2024-11-08', amount: 123.40, status: 'completed' },
      { id: 'ORD-085', date: '2024-10-15', amount: 98.60, status: 'completed' },
    ]
  },
  {
    id: 'CLI-003',
    name: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    phone: '+593 99 888 7777',
    location: 'Cuenca, Azuay',
    totalOrders: 15,
    totalSpent: 1245.90,
    lastOrder: '2024-11-12',
    status: 'active',
    registeredDate: '2023-11-10',
    orders: [
      { id: 'ORD-105', date: '2024-11-12', amount: 178.30, status: 'completed' },
      { id: 'ORD-103', date: '2024-11-09', amount: 234.50, status: 'completed' },
      { id: 'ORD-099', date: '2024-11-02', amount: 89.90, status: 'completed' },
    ]
  },
  {
    id: 'CLI-004',
    name: 'Luis Pérez',
    email: 'luis.perez@email.com',
    phone: '+593 97 555 6666',
    location: 'Ambato, Tungurahua',
    totalOrders: 5,
    totalSpent: 345.20,
    lastOrder: '2024-11-05',
    status: 'active',
    registeredDate: '2024-03-12',
    orders: [
      { id: 'ORD-095', date: '2024-11-05', amount: 87.40, status: 'completed' },
      { id: 'ORD-082', date: '2024-10-18', amount: 125.80, status: 'completed' },
    ]
  },
  {
    id: 'CLI-005',
    name: 'Isabel Torres',
    email: 'isabel.torres@email.com',
    phone: '+593 96 444 3333',
    location: 'Quito, Pichincha',
    totalOrders: 3,
    totalSpent: 187.50,
    lastOrder: '2024-09-20',
    status: 'inactive',
    registeredDate: '2024-05-08',
    orders: [
      { id: 'ORD-067', date: '2024-09-20', amount: 67.50, status: 'completed' },
      { id: 'ORD-054', date: '2024-08-15', amount: 120.00, status: 'completed' },
    ]
  },
  {
    id: 'CLI-006',
    name: 'Roberto Díaz',
    email: 'roberto.diaz@email.com',
    phone: '+593 99 222 1111',
    location: 'Loja, Loja',
    totalOrders: 10,
    totalSpent: 789.30,
    lastOrder: '2024-11-11',
    status: 'active',
    registeredDate: '2024-01-25',
    orders: [
      { id: 'ORD-104', date: '2024-11-11', amount: 156.80, status: 'completed' },
      { id: 'ORD-097', date: '2024-11-01', amount: 98.50, status: 'completed' },
    ]
  },
  {
    id: 'CLI-007',
    name: 'Patricia Vargas',
    email: 'patricia.vargas@email.com',
    phone: '+593 98 111 2222',
    location: 'Manta, Manabí',
    totalOrders: 18,
    totalSpent: 1567.80,
    lastOrder: '2024-11-13',
    status: 'active',
    registeredDate: '2023-09-14',
    orders: [
      { id: 'ORD-107', date: '2024-11-13', amount: 245.90, status: 'completed' },
      { id: 'ORD-106', date: '2024-11-12', amount: 189.40, status: 'completed' },
      { id: 'ORD-102', date: '2024-11-08', amount: 156.30, status: 'completed' },
    ]
  },
  {
    id: 'CLI-008',
    name: 'Fernando Morales',
    email: 'fernando.morales@email.com',
    phone: '+593 97 999 8888',
    location: 'Riobamba, Chimborazo',
    totalOrders: 6,
    totalSpent: 456.70,
    lastOrder: '2024-11-07',
    status: 'active',
    registeredDate: '2024-04-03',
    orders: [
      { id: 'ORD-100', date: '2024-11-07', amount: 134.20, status: 'completed' },
      { id: 'ORD-089', date: '2024-10-22', amount: 98.50, status: 'completed' },
    ]
  },
];

type StatusFilter = 'all' | 'active' | 'inactive';

export default function ClientsManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedClient, setSelectedClient] = useState<typeof mockClients[0] | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const statusChips: { label: string; value: StatusFilter }[] = [
    { label: 'Todos los clientes', value: 'all' },
    { label: 'Activos', value: 'active' },
    { label: 'Inactivos', value: 'inactive' },
  ];

  const handleFilterSelect = (value: StatusFilter) => {
    setStatusFilter(value);
    if (value === 'all') {
      setSearchTerm('');
    }
  };

  // Filtrar clientes
  const filteredClients = useMemo(() => {
    return mockClients.filter(client => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  // Estadísticas generales
  const stats = {
    total: mockClients.length,
    active: mockClients.filter(c => c.status === 'active').length,
    inactive: mockClients.filter(c => c.status === 'inactive').length,
    totalRevenue: mockClients.reduce((sum, c) => sum + c.totalSpent, 0),
    avgOrderValue: mockClients.reduce((sum, c) => sum + c.totalSpent, 0) / 
                   mockClients.reduce((sum, c) => sum + c.totalOrders, 0),
  };

  const handleViewDetails = (client: typeof mockClients[0]) => {
    setSelectedClient(client);
    setShowDetails(true);
  };

  const handleExportData = () => {
    // Simular exportación de datos
    const csvContent = 'ID,Nombre,Email,Órdenes,Total Gastado,Estado\n' +
      filteredClients.map(c => 
        `${c.id},${c.name},${c.email},${c.totalOrders},$${c.totalSpent},${c.status}`
      ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientes_rondal_clothes.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl mb-2 bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
          Gestión de Clientes
        </h2>
        <p className="text-gray-600">
          Administra y monitorea la información de tus clientes
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {statusChips.map((chip) => (
            <Button
              key={chip.value}
              variant={statusFilter === chip.value ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => handleFilterSelect(chip.value)}
              className={statusFilter === chip.value ? 'border-[#daa520] text-white bg-gradient-to-r from-[#b8860b] to-[#daa520]' : ''}
            >
              {chip.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Clientes</CardDescription>
            <CardTitle className="text-3xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
              {stats.total}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp size={16} className="mr-1" />
              Activos: {stats.active}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ingresos Totales</CardDescription>
            <CardTitle className="text-3xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
              ${stats.totalRevenue.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign size={16} className="mr-1" />
              De todos los clientes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Valor Promedio</CardDescription>
            <CardTitle className="text-3xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
              ${stats.avgOrderValue.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-600">
              <ShoppingBag size={16} className="mr-1" />
              Por orden
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Clientes Activos</CardDescription>
            <CardTitle className="text-3xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
              {stats.active}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-600">
              <UserCheck size={16} className="mr-1" />
              {((stats.active / stats.total) * 100).toFixed(1)}% del total
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Buscar por nombre, email o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-[180px]">
                  <Filter size={16} className="mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los clientes</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleExportData}
                variant="outline"
                className="border-[#daa520] text-[#daa520] hover:bg-[#daa520] hover:text-white"
              >
                <Download size={16} className="mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead className="text-center">Órdenes</TableHead>
                  <TableHead className="text-right">Total Gastado</TableHead>
                  <TableHead>Última Compra</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No se encontraron clientes
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-sm">{client.id}</TableCell>
                      <TableCell>
                        <div>
                          <div>{client.name}</div>
                          <div className="text-sm text-gray-500">{client.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone size={14} className="mr-1" />
                          {client.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin size={14} className="mr-1" />
                          {client.location}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{client.totalOrders}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ${client.totalSpent.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={14} className="mr-1" />
                          {new Date(client.lastOrder).toLocaleDateString('es-ES')}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={client.status === 'active' ? 'default' : 'secondary'}
                          className={
                            client.status === 'active'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {client.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(client)}
                          className="text-[#daa520] hover:text-[#daa520] hover:bg-[#daa520]/10"
                        >
                          <Eye size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Client Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
              Detalles del Cliente
            </DialogTitle>
            <DialogDescription>
              Información completa y historial de compras
            </DialogDescription>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-6 mt-4">
              {/* Client Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nombre Completo</p>
                  <p>{selectedClient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">ID de Cliente</p>
                  <p className="font-mono">{selectedClient.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <div className="flex items-center">
                    <Mail size={14} className="mr-2 text-gray-400" />
                    <p className="text-sm">{selectedClient.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                  <div className="flex items-center">
                    <Phone size={14} className="mr-2 text-gray-400" />
                    <p className="text-sm">{selectedClient.phone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ubicación</p>
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-2 text-gray-400" />
                    <p className="text-sm">{selectedClient.location}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Fecha de Registro</p>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-2 text-gray-400" />
                    <p className="text-sm">
                      {new Date(selectedClient.registeredDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <ShoppingBag className="mx-auto mb-2 text-blue-600" size={24} />
                  <p className="text-2xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                    {selectedClient.totalOrders}
                  </p>
                  <p className="text-sm text-gray-600">Órdenes Totales</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <DollarSign className="mx-auto mb-2 text-green-600" size={24} />
                  <p className="text-2xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                    ${selectedClient.totalSpent.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Total Gastado</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <TrendingUp className="mx-auto mb-2 text-purple-600" size={24} />
                  <p className="text-2xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                    ${(selectedClient.totalSpent / selectedClient.totalOrders).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Ticket Promedio</p>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h3 className="text-lg mb-3">Historial de Compras</h3>
                <div className="space-y-2">
                  {selectedClient.orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-[#b8860b] to-[#daa520] p-2 rounded">
                          <ShoppingBag size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="font-mono text-sm">{order.id}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.date).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                          ${order.amount.toFixed(2)}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {order.status === 'completed' ? 'Completado' : order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
