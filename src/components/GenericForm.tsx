import React, { useEffect } from 'react';
import { Button, Checkbox, DatePicker, Form, Input, InputNumber, Select, Space } from 'antd';
import { FormInstance } from 'antd/es/form';
import { Field } from '@/types/ui';
import { transformFormDataByFieldTypes } from '@/utils/date';

interface GenericFormProps {
  fields: Field[];
  onSubmit: (values: unknown) => void;
  submitText?: string;
  formRef?: React.RefObject<FormInstance>;
  initialData?: unknown;  // Initial values for the form
  children?: React.ReactNode;
}

export const GenericForm: React.FC<GenericFormProps> = ({
  fields,
  onSubmit,
  submitText = 'Submit',
  formRef,
  initialData,
  children,
}) => {
  const [form] = Form.useForm(); // 创建本地form实例

  // 绑定外部ref,支持黏贴的时候的数据传入
  useEffect(() => {
    if (formRef && formRef.current !== form) {
      formRef.current = form;
    }
  }, [formRef, form]);

  // 支持初始化的时候数据传入
  useEffect(() => {
    if (initialData) {
      const instance = formRef?.current || form;
      const fieldsData = transformFormDataByFieldTypes(fields, initialData);
      instance.setFieldsValue(fieldsData);
    }
  }, [initialData, formRef, form, fields]);

  const handleFinish = (values: unknown) => {
    const fieldsData = transformFormDataByFieldTypes(fields, values);
    onSubmit(fieldsData);
  };

  return (
    <Form
      form={formRef?.current || form}
      onFinish={handleFinish}
      layout="vertical"
    >
      {fields.map((field) => {
        let fieldElement = null;

        switch (field.type) {
          case 'text':
            fieldElement = <Input placeholder={field.placeholder} />;
            break;
          case 'textarea':
            fieldElement = <Input.TextArea placeholder={field.placeholder} />;
            break;
          case 'select':
            fieldElement = (
              <Select placeholder={field.placeholder}>
                {field.options?.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            );
            break;
          case 'date':
            fieldElement = <DatePicker showTime style={{ width: '100%' }} />;
            break;
          case 'number':
            fieldElement = <InputNumber style={{ width: '100%' }} />;
            break;
          case 'checkbox':
            fieldElement = <Checkbox>{field.label}</Checkbox>;
            break;
          default:
            fieldElement = <Input />;
        }

        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.type !== 'checkbox' ? field.label : undefined}
            valuePropName={field.type === 'checkbox' ? 'checked' : 'value'}
            rules={[{ required: field.required, message: `${field.label} is required!` }]}
          >
            {fieldElement}
          </Form.Item>
        );
      })}

      {children && (
        <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 24 }}>
          {children}
        </Space>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {submitText}
        </Button>
      </Form.Item>
    </Form>
  );
};