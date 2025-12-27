import { useState } from 'react';
import { Button, Card, Input, Modal, Badge } from '../components/ui';

function DesignSystemDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Design System</h1>
        
        {/* Buttons */}
        <Card title="Buttons" subtitle="Diferentes variantes y tamaños" className="mb-8">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Variantes</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Tamaños</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Estados</h4>
              <div className="flex flex-wrap gap-3">
                <Button disabled>Disabled</Button>
                <Button fullWidth>Full Width</Button>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Cards */}
        <Card title="Cards" subtitle="Tarjetas con diferentes configuraciones" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card padding="sm" hoverable>
              <h4 className="font-semibold mb-2">Card Simple</h4>
              <p className="text-sm text-gray-600">Contenido básico con hover</p>
            </Card>
            
            <Card 
              title="Card con título"
              padding="sm"
            >
              <p className="text-sm text-gray-600">Card con header</p>
            </Card>
            
            <Card 
              title="Card completa"
              subtitle="Con footer"
              padding="sm"
              footer={<Button size="sm" fullWidth>Acción</Button>}
            >
              <p className="text-sm text-gray-600">Card con todas las partes</p>
            </Card>
          </div>
        </Card>
        
        {/* Inputs */}
        <Card title="Inputs" subtitle="Campos de formulario" className="mb-8">
          <div className="space-y-4">
            <Input 
              label="Input básico"
              placeholder="Escribe algo..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            
            <Input 
              label="Input requerido"
              placeholder="Campo obligatorio"
              required
              helperText="Este campo es obligatorio"
            />
            
            <Input 
              label="Input con error"
              placeholder="Email"
              type="email"
              error="Email inválido"
            />
            
            <Input 
              label="Input con icono"
              placeholder="Buscar..."
              icon="🔍"
            />
            
            <Input 
              label="Input deshabilitado"
              placeholder="No editable"
              disabled
              value="Valor fijo"
            />
          </div>
        </Card>
        
        {/* Badges */}
        <Card title="Badges" subtitle="Etiquetas y tags" className="mb-8">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Variantes</h4>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="discount">-50% OFF</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Tamaños</h4>
              <div className="flex flex-wrap items-center gap-2">
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Redondeadas</h4>
              <div className="flex flex-wrap gap-2">
                <Badge rounded variant="primary">Nuevo</Badge>
                <Badge rounded variant="success">Activo</Badge>
                <Badge rounded variant="discount">-30%</Badge>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Modal */}
        <Card title="Modal" subtitle="Ventanas emergentes" className="mb-8">
          <div className="space-y-4">
            <Button onClick={() => setIsModalOpen(true)}>
              Abrir Modal
            </Button>
            
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Ejemplo de Modal"
              footer={
                <>
                  <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsModalOpen(false)}>
                    Confirmar
                  </Button>
                </>
              }
            >
              <p className="text-gray-600 mb-4">
                Este es un ejemplo de modal con título, contenido y footer con acciones.
              </p>
              <Input 
                label="Campo dentro del modal"
                placeholder="Escribe algo..."
              />
            </Modal>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default DesignSystemDemo;
