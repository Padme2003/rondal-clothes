import { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Package,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

// Mock data para reportes - DATOS COMPLETOS DEL AÑO
const allYearData = [
  { month: 'Ene', ventas: 4500, ordenes: 45, clientes: 32 },
  { month: 'Feb', ventas: 5200, ordenes: 52, clientes: 38 },
  { month: 'Mar', ventas: 4800, ordenes: 48, clientes: 35 },
  { month: 'Abr', ventas: 6100, ordenes: 61, clientes: 42 },
  { month: 'May', ventas: 7300, ordenes: 73, clientes: 51 },
  { month: 'Jun', ventas: 6800, ordenes: 68, clientes: 47 },
  { month: 'Jul', ventas: 8200, ordenes: 82, clientes: 58 },
  { month: 'Ago', ventas: 7900, ordenes: 79, clientes: 55 },
  { month: 'Sep', ventas: 8500, ordenes: 85, clientes: 61 },
  { month: 'Oct', ventas: 9200, ordenes: 92, clientes: 67 },
  { month: 'Nov', ventas: 10100, ordenes: 101, clientes: 73 },
  { month: 'Dic', ventas: 12400, ordenes: 124, clientes: 89 },
];

// Datos por períodos diferentes
const generateDataByPeriod = (period: string) => {
  switch (period) {
    case 'week':
      return [
        { month: 'Lun', ventas: 1250, ordenes: 12, clientes: 9 },
        { month: 'Mar', ventas: 1580, ordenes: 16, clientes: 11 },
        { month: 'Mié', ventas: 1420, ordenes: 14, clientes: 10 },
        { month: 'Jue', ventas: 1890, ordenes: 19, clientes: 13 },
        { month: 'Vie', ventas: 2340, ordenes: 23, clientes: 16 },
        { month: 'Sáb', ventas: 2680, ordenes: 27, clientes: 19 },
        { month: 'Dom', ventas: 1920, ordenes: 19, clientes: 14 },
      ];
    case 'month':
      return [
        { month: 'Sem 1', ventas: 2300, ordenes: 23, clientes: 18 },
        { month: 'Sem 2', ventas: 2650, ordenes: 27, clientes: 21 },
        { month: 'Sem 3', ventas: 2890, ordenes: 29, clientes: 23 },
        { month: 'Sem 4', ventas: 3260, ordenes: 33, clientes: 26 },
      ];
    case 'quarter':
      return allYearData.slice(-3);
    case 'year':
    default:
      return allYearData;
  }
};

const topProductsByPeriod = {
  week: [
    { name: 'Polo Deportivo', sold: 28, revenue: 840, percentage: 25 },
    { name: 'Camisa Clásica', sold: 22, revenue: 1056, percentage: 20 },
    { name: 'Jeans Slim Fit', sold: 20, revenue: 1200, percentage: 18 },
    { name: 'Pantalón Casual', sold: 18, revenue: 864, percentage: 16 },
    { name: 'Chaqueta Premium', sold: 12, revenue: 1440, percentage: 11 },
    { name: 'Blazer Elegante', sold: 8, revenue: 960, percentage: 7 },
    { name: 'Suéter Tejido', sold: 4, revenue: 240, percentage: 3 },
  ],
  month: [
    { name: 'Polo Deportivo', sold: 47, revenue: 1410, percentage: 24 },
    { name: 'Camisa Clásica', sold: 39, revenue: 1872, percentage: 20 },
    { name: 'Jeans Slim Fit', sold: 36, revenue: 2160, percentage: 18 },
    { name: 'Pantalón Casual', sold: 34, revenue: 1632, percentage: 17 },
    { name: 'Chaqueta Premium', sold: 25, revenue: 3000, percentage: 13 },
    { name: 'Blazer Elegante', sold: 12, revenue: 1440, percentage: 6 },
    { name: 'Suéter Tejido', sold: 7, revenue: 420, percentage: 2 },
  ],
  quarter: [
    { name: 'Polo Deportivo', sold: 142, revenue: 4260, percentage: 23 },
    { name: 'Camisa Clásica', sold: 118, revenue: 5664, percentage: 19 },
    { name: 'Jeans Slim Fit', sold: 110, revenue: 6600, percentage: 18 },
    { name: 'Chaqueta Premium', sold: 74, revenue: 8880, percentage: 12 },
    { name: 'Pantalón Casual', sold: 101, revenue: 4848, percentage: 16 },
    { name: 'Blazer Elegante', sold: 51, revenue: 6120, percentage: 8 },
    { name: 'Suéter Tejido', sold: 24, revenue: 1440, percentage: 4 },
  ],
  year: [
    { name: 'Camisa Clásica', sold: 156, revenue: 7488, percentage: 18 },
    { name: 'Pantalón Casual', sold: 134, revenue: 6432, percentage: 16 },
    { name: 'Chaqueta Premium', sold: 98, revenue: 11760, percentage: 14 },
    { name: 'Polo Deportivo', sold: 187, revenue: 5610, percentage: 22 },
    { name: 'Jeans Slim Fit', sold: 145, revenue: 8700, percentage: 17 },
    { name: 'Blazer Elegante', sold: 67, revenue: 8040, percentage: 8 },
    { name: 'Suéter Tejido', sold: 34, revenue: 2040, percentage: 4 },
  ],
};

const categoryData = [
  { name: 'Camisas', value: 35, color: '#b8860b' },
  { name: 'Pantalones', value: 28, color: '#c9a227' },
  { name: 'Chaquetas', value: 18, color: '#daa520' },
  { name: 'Accesorios', value: 12, color: '#d4af37' },
  { name: 'Calzado', value: 7, color: '#cfb53b' },
];

const revenueByDay = [
  { day: 'Lun', revenue: 1250 },
  { day: 'Mar', revenue: 1580 },
  { day: 'Mié', revenue: 1420 },
  { day: 'Jue', revenue: 1890 },
  { day: 'Vie', revenue: 2340 },
  { day: 'Sáb', revenue: 2680 },
  { day: 'Dom', revenue: 1920 },
];

export default function ReportsView() {
  const [period, setPeriod] = useState('year');
  const [reportType, setReportType] = useState('ventas');

  // Datos dinámicos basados en el período seleccionado
  const monthlySalesData = useMemo(() => generateDataByPeriod(period), [period]);
  const topProducts = useMemo(() => topProductsByPeriod[period as keyof typeof topProductsByPeriod], [period]);

  // Calcular estadísticas dinámicamente
  const stats = useMemo(() => {
    const totalRevenue = monthlySalesData.reduce((sum, item) => sum + item.ventas, 0);
    const totalOrders = monthlySalesData.reduce((sum, item) => sum + item.ordenes, 0);
    const totalCustomers = monthlySalesData.reduce((sum, item) => sum + item.clientes, 0);
    
    // Encontrar el mejor período
    const bestPeriod = monthlySalesData.reduce((max, item) => 
      item.ventas > max.ventas ? item : max, monthlySalesData[0]
    );
    
    // Encontrar el producto más vendido
    const topProduct = topProducts.reduce((max, item) => 
      item.sold > max.sold ? item : max, topProducts[0]
    );

    // Calcular crecimiento según período
    let growth = 23.5;
    if (period === 'week') growth = 8.3;
    if (period === 'month') growth = 12.7;
    if (period === 'quarter') growth = 18.9;

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      avgOrderValue: totalRevenue / totalOrders,
      growth,
      bestMonth: bestPeriod.month,
      topProduct: topProduct.name,
    };
  }, [monthlySalesData, topProducts, period]);

  const handleExportReport = (type: string) => {
    // Simular exportación de reporte
    let content = '';
    let filename = '';

    if (type === 'ventas') {
      content = 'Mes,Ventas,Órdenes,Clientes\n' +
        monthlySalesData.map(d => `${d.month},${d.ventas},${d.ordenes},${d.clientes}`).join('\n');
      filename = 'reporte_ventas.csv';
    } else if (type === 'productos') {
      content = 'Producto,Vendidos,Ingresos,Porcentaje\n' +
        topProducts.map(p => `${p.name},${p.sold},$${p.revenue},${p.percentage}%`).join('\n');
      filename = 'reporte_productos.csv';
    }

    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl mb-2 bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
            Reportes y Análisis
          </h2>
          <p className="text-gray-600">
            Análisis detallado del rendimiento de tu tienda
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mes</SelectItem>
              <SelectItem value="quarter">Último Trimestre</SelectItem>
              <SelectItem value="year">Último Año</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => handleExportReport(reportType)}
            className="bg-gradient-to-r from-[#b8860b] to-[#daa520] hover:from-[#c9a227] hover:to-[#daa520]"
          >
            <Download size={16} className="mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center">
              <DollarSign size={16} className="mr-1" />
              Ingresos Totales
            </CardDescription>
            <CardTitle className="text-3xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
              ${stats.totalRevenue.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp size={14} className="mr-1" />
              +{stats.growth}% vs. año anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center">
              <ShoppingBag size={16} className="mr-1" />
              Total Órdenes
            </CardDescription>
            <CardTitle className="text-3xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
              {stats.totalOrders}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Mejor período: {stats.bestMonth}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center">
              <Users size={16} className="mr-1" />
              Clientes Únicos
            </CardDescription>
            <CardTitle className="text-3xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
              {stats.totalCustomers}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Clientes recurrentes: 68%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center">
              <Activity size={16} className="mr-1" />
              Ticket Promedio
            </CardDescription>
            <CardTitle className="text-3xl bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
              ${stats.avgOrderValue.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Por orden completada
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="ventas" onValueChange={setReportType}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ventas">
            <BarChart3 size={16} className="mr-2" />
            Ventas
          </TabsTrigger>
          <TabsTrigger value="productos">
            <Package size={16} className="mr-2" />
            Productos
          </TabsTrigger>
          <TabsTrigger value="categorias">
            <PieChart size={16} className="mr-2" />
            Categorías
          </TabsTrigger>
          <TabsTrigger value="tendencias">
            <TrendingUp size={16} className="mr-2" />
            Tendencias
          </TabsTrigger>
        </TabsList>

        {/* Ventas Tab */}
        <TabsContent value="ventas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ventas Mensuales</CardTitle>
              <CardDescription>
                Evolución de ventas, órdenes y clientes - {
                  period === 'week' ? 'Última Semana' :
                  period === 'month' ? 'Último Mes' :
                  period === 'quarter' ? 'Último Trimestre' :
                  'Último Año'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlySalesData}>
                  <defs>
                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b8860b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#b8860b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="ventas" 
                    stroke="#b8860b" 
                    fillOpacity={1} 
                    fill="url(#colorVentas)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos por Día de la Semana</CardTitle>
                <CardDescription>
                  Promedio de ingresos por día
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#daa520" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen de Ventas</CardTitle>
                <CardDescription>
                  Métricas clave del período seleccionado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-500 p-2 rounded-full">
                        <TrendingUp className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Crecimiento</p>
                        <p className="text-2xl text-green-700">+{stats.growth}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500 p-2 rounded-full">
                        <ShoppingBag className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Mejor Mes</p>
                        <p className="text-2xl text-blue-700">{stats.bestMonth}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-500 p-2 rounded-full">
                        <Package className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Producto Top</p>
                        <p className="text-xl text-purple-700">{stats.topProduct}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Productos Tab */}
        <TabsContent value="productos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Productos Más Vendidos</CardTitle>
              <CardDescription>
                Top 7 productos - {
                  period === 'week' ? 'Última Semana' :
                  period === 'month' ? 'Último Mes' :
                  period === 'quarter' ? 'Último Trimestre' :
                  'Último Año'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sold" fill="#b8860b" name="Unidades Vendidas" />
                  <Bar dataKey="revenue" fill="#daa520" name="Ingresos ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topProducts.slice(0, 3).map((product, index) => (
              <Card key={product.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <div className="bg-gradient-to-r from-[#b8860b] to-[#daa520] text-white px-3 py-1 rounded-full text-sm">
                      #{index + 1}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vendidos:</span>
                      <span>{product.sold} unidades</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                        ${product.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="pt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#b8860b] to-[#daa520] h-2 rounded-full"
                          style={{ width: `${product.percentage}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-1 text-center">
                        {product.percentage}% de las ventas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Categorías Tab */}
        <TabsContent value="categorias" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Categoría</CardTitle>
                <CardDescription>
                  Porcentaje de ventas por categoría de producto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalles por Categoría</CardTitle>
                <CardDescription>
                  Análisis detallado de cada categoría
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.name}</span>
                        </span>
                        <span className="bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
                          {category.value}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${category.value}%`,
                            backgroundColor: category.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tendencias Tab */}
        <TabsContent value="tendencias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Crecimiento</CardTitle>
              <CardDescription>
                Comparación de ventas, órdenes y clientes - {
                  period === 'week' ? 'Última Semana' :
                  period === 'month' ? 'Último Mes' :
                  period === 'quarter' ? 'Último Trimestre' :
                  'Último Año'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="ventas" 
                    stroke="#b8860b" 
                    strokeWidth={2}
                    name="Ventas ($)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ordenes" 
                    stroke="#c9a227" 
                    strokeWidth={2}
                    name="Órdenes"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clientes" 
                    stroke="#daa520" 
                    strokeWidth={2}
                    name="Clientes"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <TrendingUp className="mr-2" size={20} />
                  Mejor Tendencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl text-green-800 mb-2">Clientes Nuevos</p>
                <p className="text-sm text-green-600">
                  +{period === 'week' ? '12' : period === 'month' ? '18' : period === 'quarter' ? '35' : '45'}% de incremento
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <Activity className="mr-2" size={20} />
                  Estabilidad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl text-blue-800 mb-2">Ticket Promedio</p>
                <p className="text-sm text-blue-600">
                  ${stats.avgOrderValue.toFixed(2)} por orden
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-700">
                  <ShoppingBag className="mr-2" size={20} />
                  {period === 'week' ? 'Esta Semana' : period === 'month' ? 'Este Mes' : 'Proyección'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl text-purple-800 mb-2">
                  {period === 'week' ? 'Progreso' : period === 'month' ? 'Alcanzado' : 'Q1 2025'}
                </p>
                <p className="text-sm text-purple-600">
                  {period === 'week' ? `${stats.totalOrders} órdenes completadas` :
                   period === 'month' ? `${stats.totalCustomers} clientes atendidos` :
                   'Estimado: $38,500 en ventas'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}