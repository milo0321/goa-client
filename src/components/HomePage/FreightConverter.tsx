import { Input, Select, Button, notification } from 'antd';
import { IconRefresh, IconRuler, IconScale } from '@tabler/icons-react';
import { useState } from 'react';


const FreightConverter = () => {
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: '',
    weight: ''
  });
  const [unit, setUnit] = useState<'cm' | 'inch'>('cm');
  const [result, setResult] = useState('');

  const calculate = () => {
    // 示例计算逻辑：体积重量 vs 实际重量
    const { length, width, height, weight } = dimensions;
    if (!length || !width || !height || !weight) {
      notification.error({ message: '请填写完整尺寸和重量' });
      return;
    }

    const volWeight = (Number(length) * Number(width) * Number(height)) / 5000; // 体积重量公式
    const actualWeight = Number(weight);
    setResult(`体积重量: ${volWeight.toFixed(2)}kg | 实际重量: ${actualWeight}kg`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          addonBefore="长"
          suffix={unit}
          value={dimensions.length}
          onChange={(e) => setDimensions({...dimensions, length: e.target.value})}
        />
        <Input
          addonBefore="宽"
          suffix={unit}
          value={dimensions.width}
          onChange={(e) => setDimensions({...dimensions, width: e.target.value})}
        />
        <Input
          addonBefore="高"
          suffix={unit}
          value={dimensions.height}
          onChange={(e) => setDimensions({...dimensions, height: e.target.value})}
        />
        <Input
          addonBefore={<IconScale size={16} />}
          suffix="kg"
          value={dimensions.weight}
          onChange={(e) => setDimensions({...dimensions, weight: e.target.value})}
        />
      </div>

      <div className="flex items-center space-x-4">
        <Select
          value={unit}
          onChange={setUnit}
          options={[
            { value: 'cm', label: '厘米(cm)' },
            { value: 'inch', label: '英寸(inch)' }
          ]}
        />
        <Button 
          type="primary" 
          onClick={calculate}
          icon={<IconRuler size={16} />}
        >
          计算
        </Button>
        <Button 
          onClick={() => {
            setDimensions({ length: '', width: '', height: '', weight: '' });
            setResult('');
          }}
          icon={<IconRefresh size={16} />}
        >
          重置
        </Button>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
          <h4 className="font-bold text-blue-800">计算结果</h4>
          <p>{result}</p>
          <p className="text-sm text-gray-500 mt-2">
            * 航空货运通常取体积重量与实际重量中的较大值计费
          </p>
        </div>
      )}
    </div>
  );
};