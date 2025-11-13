import { Shield, Lock, Clock, AlertTriangle, CheckCircle, Key } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

export default function SecurityInfo() {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'Autenticación Segura',
      description: 'Sistema de login con validación de credenciales',
      status: 'Activo',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Clock,
      title: 'Sesión Temporizada',
      description: 'Sesiones de 1 hora con expiración automática',
      status: 'Activo',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: AlertTriangle,
      title: 'Límite de Intentos',
      description: 'Máximo 5 intentos fallidos con bloqueo temporal',
      status: 'Activo',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    {
      icon: Shield,
      title: 'Rutas Protegidas',
      description: 'Protección de acceso no autorizado',
      status: 'Activo',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Key,
      title: 'Validación de Entrada',
      description: 'Sanitización y validación de formularios',
      status: 'Activo',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      icon: CheckCircle,
      title: 'Persistencia Segura',
      description: 'Gestión de sesiones con localStorage',
      status: 'Activo',
      color: 'text-teal-600',
      bgColor: 'bg-teal-100'
    }
  ];

  return (
    <Card className="border-2 border-[#daa520]/20">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="text-[#daa520]" size={24} />
          <CardTitle className="bg-gradient-to-r from-[#b8860b] to-[#daa520] bg-clip-text text-transparent">
            Seguridad del Sistema
          </CardTitle>
        </div>
        <CardDescription>
          Características de seguridad implementadas en el panel de administración
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className={`${feature.bgColor} p-2 rounded-lg`}>
                    <Icon className={feature.color} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-gray-900">{feature.title}</h4>
                      <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                        {feature.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Shield className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
            <div className="text-sm text-blue-800">
              <p className="mb-1">
                <strong>Proyecto Académico:</strong> Este sistema de seguridad está diseñado para 
                proteger el acceso al panel administrativo de forma segura usando tecnologías frontend.
              </p>
              <p>
                Para producción, se recomienda implementar autenticación JWT, HTTPS, y gestión 
                de sesiones del lado del servidor con el backend del próximo semestre.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
