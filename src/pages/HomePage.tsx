import { useState } from 'react';
import Navbar from '../components/HomePage/Navbar';
import Toolbox from '../components/HomePage/Toolbox';
import FreightConverter from '../components/HomePage/FreightConverter';

// 工具箱工具类型
type Tool = {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ReactNode;
};

export default function HomePage() {
  // 用户自定义的工具箱配置（可持久化存储）
  const [tools, setTools] = useState<Tool[]>([
    {
      id: 'freight-converter',
      name: '货运转换',
      icon: <IconBox size={20} />,
      component: <FreightConverter />
    },
    // 可添加更多工具...
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* 自定义工具箱 */}
        <Toolbox tools={tools} onToolsChange={setTools} />
        
        {/* 当前激活的工具展示区 */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          {tools[0]?.component || '请选择工具'}
        </div>
      </main>
    </div>
  );
}