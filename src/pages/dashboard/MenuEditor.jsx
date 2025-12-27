import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useMenu } from '../../contexts/MenuContext';
import { Button, Badge, Card, Modal } from '../../components/ui';
import DashboardLayout from '../../layouts/DashboardLayout';
import { MenuPreview, PDFGenerator, QRGenerator, MobilePreview } from '../../components/dashboard';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Componente para Sección Sortable
function SortableSection({ section, menuId, onDeleteSection, onToggleSection, onDeleteDish }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} padding="none">
      {/* Section Header */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 text-xl"
            >
              ⋮⋮
            </button>
            {section.icon && <span className="text-2xl">{section.icon}</span>}
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{section.name}</h3>
              {section.description && (
                <p className="text-sm text-gray-600">{section.description}</p>
              )}
            </div>
            <Badge variant={section.isActive ? 'success' : 'default'} size="sm">
              {section.isActive ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Link to={`/dashboard/menus/${menuId}/sections/${section.id}/dishes/new`}>
              <Button variant="primary" size="sm">
                ➕ Plato
              </Button>
            </Link>
            <Button
              variant={section.isActive ? 'warning' : 'success'}
              size="sm"
              onClick={() => onToggleSection(section.id)}
            >
              {section.isActive ? '⏸️' : '▶️'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDeleteSection(section.id, section.name)}
            >
              🗑️
            </Button>
          </div>
        </div>
      </div>

      {/* Dishes */}
      <div className="p-6">
        {section.items && section.items.length > 0 ? (
          <DishList
            dishes={section.items}
            menuId={menuId}
            sectionId={section.id}
            onDeleteDish={onDeleteDish}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-3">No hay platos en esta sección</p>
            <Link to={`/dashboard/menus/${menuId}/sections/${section.id}/dishes/new`}>
              <Button variant="outline" size="sm">Agregar Primer Plato</Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}

// Componente para Lista de Platos con Drag & Drop
function DishList({ dishes, menuId, sectionId, onDeleteDish }) {
  const { reorderDishes } = useMenu();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = dishes.findIndex((d) => d.id === active.id);
      const newIndex = dishes.findIndex((d) => d.id === over.id);
      const reordered = arrayMove(dishes, oldIndex, newIndex);
      reorderDishes(menuId, sectionId, reordered);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={dishes.map(d => d.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {dishes.map((dish) => (
            <SortableDish
              key={dish.id}
              dish={dish}
              menuId={menuId}
              sectionId={sectionId}
              onDelete={onDeleteDish}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

// Componente para Plato Sortable
function SortableDish({ dish, menuId, sectionId, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: dish.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 text-xl"
      >
        ⋮⋮
      </button>
      {dish.image && (
        <img
          src={dish.image}
          alt={dish.name}
          className="w-16 h-16 object-cover rounded"
        />
      )}
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-gray-800">{dish.name}</h4>
          {dish.discount > 0 && (
            <Badge variant="discount" size="sm">-{dish.discount}%</Badge>
          )}
          <Badge variant={dish.isActive ? 'success' : 'default'} size="sm">
            {dish.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 line-clamp-1">{dish.description}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-green-600">${dish.price.toFixed(2)}</p>
      </div>
      <div className="flex gap-2">
        <Link to={`/dashboard/menus/${menuId}/sections/${sectionId}/dishes/${dish.id}`}>
          <Button variant="ghost" size="sm">✏️</Button>
        </Link>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(sectionId, dish.id, dish.name)}
        >
          🗑️
        </Button>
      </div>
    </div>
  );
}

function MenuEditor() {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const { menus, deleteSection, deleteDish, toggleSectionStatus, reorderSections } = useMenu();
  const [showPreview, setShowPreview] = useState(false);

  const menu = menus.find(m => m.id === menuId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!menu) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">❌</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Carta no encontrada
            </h3>
            <Link to="/dashboard/menus">
              <Button variant="primary">Volver a Cartas</Button>
            </Link>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = menu.sections.findIndex((s) => s.id === active.id);
      const newIndex = menu.sections.findIndex((s) => s.id === over.id);
      const reordered = arrayMove(menu.sections, oldIndex, newIndex);
      reorderSections(menuId, reordered);
    }
  };

  const handleDeleteSection = (sectionId, sectionName) => {
    if (window.confirm(`¿Eliminar sección "${sectionName}"?`)) {
      deleteSection(menuId, sectionId);
    }
  };

  const handleDeleteDish = (sectionId, dishId, dishName) => {
    if (window.confirm(`¿Eliminar plato "${dishName}"?`)) {
      deleteDish(menuId, sectionId, dishId);
    }
  };

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link to="/dashboard/menus" className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
              ← Volver a Cartas
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{menu.icon}</span>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{menu.name}</h2>
                {menu.description && (
                  <p className="text-gray-600">{menu.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link to={`/dashboard/menus/${menuId}/sections/new`}>
            <Button variant="primary">➕ Nueva Sección</Button>
          </Link>
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            👁️ Vista Previa
          </Button>
          <MobilePreview menuId={menuId} />
          <PDFGenerator menu={menu} />
          <QRGenerator menuId={menuId} menuName={menu.name} />
          <Link to={`/dashboard/menus/${menuId}/edit`}>
            <Button variant="outline">✏️ Editar Carta</Button>
          </Link>
        </div>

        {/* Sections List with Drag & Drop */}
        <div className="space-y-4">
          {menu.sections && menu.sections.length > 0 ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={menu.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                {menu.sections.map((section) => (
                  <SortableSection
                    key={section.id}
                    section={section}
                    menuId={menuId}
                    onDeleteSection={handleDeleteSection}
                    onToggleSection={(sectionId) => toggleSectionStatus(menuId, sectionId)}
                    onDeleteDish={handleDeleteDish}
                  />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            <Card>
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📁</span>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No hay secciones
                </h3>
                <p className="text-gray-600 mb-6">
                  Crea tu primera sección para organizar tu menú
                </p>
                <Link to={`/dashboard/menus/${menuId}/sections/new`}>
                  <Button variant="primary">Crear Primera Sección</Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Add Section Button */}
          {menu.sections && menu.sections.length > 0 && (
            <Link to={`/dashboard/menus/${menuId}/sections/new`}>
              <Button variant="outline" fullWidth>
                ➕ Agregar Nueva Sección
              </Button>
            </Link>
          )}
        </div>

        {/* Preview Modal */}
        <Modal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title="Vista Previa del Menú"
          size="xl"
        >
          <MenuPreview menu={menu} />
        </Modal>
      </div>
    </DashboardLayout>
  );
}

export default MenuEditor;
