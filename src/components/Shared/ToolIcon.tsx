import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';

type ToolboxProps = {
  tools: Tool[];
  onToolsChange: (tools: Tool[]) => void;
};

const Toolbox = ({ tools, onToolsChange }: ToolboxProps) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tools.findIndex(t => t.id === active.id);
      const newIndex = tools.findIndex(t => t.id === over.id);
      onToolsChange(arrayMove(tools, oldIndex, newIndex));
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold mb-4 flex items-center">
          <IconToolbox size={20} className="mr-2" />
          常用工具箱
        </h3>
        
        <SortableContext items={tools}>
          <div className="flex flex-wrap gap-3">
            {tools.map(tool => (
              <ToolItem 
                key={tool.id}
                tool={tool}
                onClick={() => {/* 切换工具 */}}
              />
            ))}
            <AddToolButton onAdd={/* 添加新工具逻辑 */} />
          </div>
        </SortableContext>
      </div>
    </DndContext>
  );
};

// 工具项组件
const ToolItem = ({ tool }: { tool: Tool }) => (
  <div className="cursor-move border rounded p-3 hover:bg-gray-50 flex items-center">
    <div className="mr-2">{tool.icon}</div>
    <span>{tool.name}</span>
  </div>
);